import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Loader2,
  Send,
  AlertCircle,
  ArrowDown,
  Paperclip,
  X,
  Check,
  CheckCheck,
  FileIcon,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminAuthStore as useAuthStore,
  getAdminAccessToken as getAccessToken,
  decodeAdminJwt,
} from "@/stores/adminAuthStore";
import {
  findOrCreateGroupConversation,
  getGroupMessages,
  sendGroupMessage,
  markGroupConversationAsRead,
  getChatUploadUrl,
  uploadChatFile,
} from "@/services/graphql/messaging";
import type {
  Message,
  MessageAttachment,
  MessageAttachmentInput,
  MessageType,
} from "@/services/graphql/messaging/types";
import {
  messageSocket,
  type RealtimeMessage,
} from "@/services/websocket/messageSocket";
import type { GroupMember } from "@/services/graphql/groups/types";

interface Props {
  groupId: string;
  members: GroupMember[];
}

type ConnectionState = "connecting" | "connected" | "disconnected";
type DeliveryStatus = "pending" | "sent" | "delivered" | "read";

type DisplayAttachment = MessageAttachment & { publicUrl?: string };

interface DisplayMessage extends Omit<Message, "attachments"> {
  attachments?: DisplayAttachment[];
  pending?: boolean;
  failed?: boolean;
  clientMessageId?: string;
  deliveryStatus?: DeliveryStatus;
}

const HISTORY_LIMIT = 50;
const SAME_SENDER_WINDOW_MS = 2 * 60 * 1000;
const SCROLL_BOTTOM_THRESHOLD_PX = 80;
const TYPING_STOP_DEBOUNCE_MS = 2500;
const TYPING_USER_IDLE_MS = 5000;
const PRESENCE_PING_INTERVAL_MS = 60_000;

function initials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

function memberDisplayName(
  members: GroupMember[],
  senderId: string,
  selfId: string | null,
): string {
  if (selfId && senderId === selfId) return "You";
  const m = members.find((mem) => mem.userId === senderId);
  if (m) {
    const name = `${m.profile?.firstName ?? ""} ${m.profile?.lastName ?? ""}`.trim();
    if (name) return name;
  }
  return senderId ? senderId.slice(0, 8) : "Unknown";
}

function memberAvatarUrl(
  members: GroupMember[],
  senderId: string,
): string | undefined {
  return members.find((m) => m.userId === senderId)?.profile?.avatarUrl;
}

function formatRelative(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diffMs = Date.now() - t;
  if (diffMs < 60_000) return "just now";
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sortAscending(list: DisplayMessage[]): DisplayMessage[] {
  return [...list].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

function AttachmentItem({
  att,
  idx,
  isMine,
}: {
  att: DisplayAttachment;
  idx: number;
  isMine: boolean;
}) {
  const url = attachmentUrl(att);
  const mime = att.mimeType ?? "";
  const fname = attachmentFileName(att, `attachment-${idx + 1}`);
  const cardClass = `flex items-center gap-2 rounded px-2 py-1.5 ${
    isMine ? "bg-primary-foreground/10" : "bg-background/60"
  }`;

  if (mime.startsWith("image/") && url) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block">
        <img src={url} alt={fname} className="max-h-64 max-w-full rounded" />
      </a>
    );
  }
  if (mime.startsWith("video/") && url) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className={cardClass}>
        <Play className="h-4 w-4 shrink-0" />
        <span className="text-xs truncate">{fname}</span>
      </a>
    );
  }
  if (mime.startsWith("audio/") && url) {
    return (
      <audio controls src={url} className="max-w-full">
        {fname}
      </audio>
    );
  }
  return (
    <a href={url ?? "#"} target="_blank" rel="noreferrer" className={cardClass}>
      <FileIcon className="h-4 w-4 shrink-0" />
      <span className="text-xs truncate">{fname}</span>
    </a>
  );
}

function StatusIcon({ status, pending }: { status?: DeliveryStatus; pending?: boolean }) {
  if (status === "pending" || pending) return <Loader2 className="h-3 w-3 animate-spin" />;
  if (status === "read") return <CheckCheck className="h-3 w-3 text-primary" />;
  if (status === "delivered") return <CheckCheck className="h-3 w-3" />;
  return <Check className="h-3 w-3" />;
}

function MessageRow({
  m,
  isMine,
  showHeader,
  name,
  avatar,
  isOnline,
  onRetry,
}: {
  m: DisplayMessage;
  isMine: boolean;
  showHeader: boolean;
  name: string;
  avatar?: string;
  isOnline: boolean;
  onRetry: (m: DisplayMessage) => void;
}) {
  return (
    <div
      className={`flex gap-2 ${isMine ? "justify-end" : "justify-start"} ${
        showHeader ? "mt-3" : "mt-0.5"
      }`}
    >
      {!isMine && (
        <div className="w-7 shrink-0">
          {showHeader ? (
            <div className="relative">
              <Avatar className="h-7 w-7">
                {avatar ? <AvatarImage src={avatar} alt={name} /> : null}
                <AvatarFallback className="text-[10px]">{initials(name)}</AvatarFallback>
              </Avatar>
              {isOnline && (
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />
              )}
            </div>
          ) : null}
        </div>
      )}
      <div className={`flex flex-col max-w-[75%] ${isMine ? "items-end" : "items-start"}`}>
        {showHeader && (
          <div className="flex items-center gap-2 px-1 mb-0.5 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground/80">{name}</span>
            <span>·</span>
            <span>{formatRelative(m.createdAt)}</span>
          </div>
        )}
        <div
          className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
            isMine
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted text-foreground rounded-bl-md"
          } ${m.pending ? "opacity-60" : ""} ${m.failed ? "ring-1 ring-destructive" : ""}`}
        >
          {m.attachments && m.attachments.length > 0 && (
            <div className="flex flex-col gap-2 mb-1">
              {m.attachments.map((att, ai) => (
                <AttachmentItem key={ai} att={att} idx={ai} isMine={isMine} />
              ))}
            </div>
          )}
          {m.content && <span className="whitespace-pre-wrap break-words">{m.content}</span>}
        </div>
        {isMine && !m.failed && (
          <div className="mt-0.5 px-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>{formatRelative(m.createdAt)}</span>
            <StatusIcon status={m.deliveryStatus} pending={m.pending} />
          </div>
        )}
        {m.failed && (
          <button
            type="button"
            onClick={() => onRetry(m)}
            className="mt-1 text-[11px] text-destructive hover:underline"
          >
            Failed — retry
          </button>
        )}
      </div>
    </div>
  );
}

function pickMessageType(files: File[]): MessageType {
  if (files.length === 0) return "TEXT";
  const m = files[0].type;
  if (m.startsWith("image/")) return "IMAGE";
  if (m.startsWith("video/")) return "VIDEO";
  if (m.startsWith("audio/")) return "AUDIO";
  return "FILE";
}

function attachmentUrl(att: DisplayAttachment): string | undefined {
  return att.publicUrl ?? att.gcsPath ?? undefined;
}

function attachmentFileName(att: DisplayAttachment, fallback: string): string {
  if (att.fileName) return att.fileName;
  const url = attachmentUrl(att);
  if (!url) return fallback;
  try {
    const parsed = new URL(url);
    const last = parsed.pathname.split("/").pop();
    return last && last.length > 0 ? decodeURIComponent(last) : fallback;
  } catch {
    return fallback;
  }
}

function mergeMessages(
  existing: DisplayMessage[],
  incoming: Message[],
): DisplayMessage[] {
  const byId = new Map<string, DisplayMessage>();
  for (const msg of existing) byId.set(msg.id, msg);

  for (const fresh of incoming) {
    const prior = byId.get(fresh.id);
    if (prior) {
      byId.set(fresh.id, {
        ...prior,
        ...fresh,
        pending: false,
        failed: false,
        deliveryStatus: prior.deliveryStatus ?? "sent",
      });
    } else {
      byId.set(fresh.id, { ...fresh, deliveryStatus: "sent" });
    }
  }

  const pendingToKeep = existing.filter((m) => {
    if (!m.pending && !m.failed) return false;
    const matched = incoming.find(
      (inc) =>
        inc.senderId === m.senderId &&
        inc.content === m.content &&
        Math.abs(
          new Date(inc.createdAt).getTime() - new Date(m.createdAt).getTime(),
        ) < 30_000,
    );
    return !matched;
  });

  return sortAscending([...byId.values(), ...pendingToKeep]);
}

function rankStatus(s: DeliveryStatus | undefined): number {
  switch (s) {
    case "read":
      return 3;
    case "delivered":
      return 2;
    case "sent":
      return 1;
    default:
      return 0;
  }
}

export default function ChatTab({ groupId, members }: Props) {
  const { toast } = useToast();
  const admin = useAuthStore((s) => s.admin);

  const myUserId = useMemo<string | null>(() => {
    const t = getAccessToken();
    const claims = t ? decodeAdminJwt(t) : null;
    return claims?.userId ?? claims?.sub ?? admin?.userId ?? null;
  }, [admin]);

  const [token] = useState<string | null>(() => getAccessToken());
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    messageSocket.isConnected ? "connected" : "connecting",
  );
  const [showNewPill, setShowNewPill] = useState(false);
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const atBottomRef = useRef(true);
  const conversationIdRef = useRef<string | null>(null);
  const typingTimersRef = useRef<Map<string, number>>(new Map());
  const typingStopTimerRef = useRef<number | null>(null);
  const conversationReadByRef = useRef<Map<string, string>>(new Map());

  const memberIds = useMemo(
    () => members.map((m) => m.userId).filter((id): id is string => Boolean(id)),
    [members],
  );

  const isAtBottom = useCallback((): boolean => {
    const el = scrollRef.current;
    if (!el) return true;
    return (
      el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_BOTTOM_THRESHOLD_PX
    );
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior });
      setShowNewPill(false);
      atBottomRef.current = true;
    });
  }, []);

  const handleScroll = useCallback(() => {
    const bottom = isAtBottom();
    atBottomRef.current = bottom;
    if (bottom) setShowNewPill(false);
  }, [isAtBottom]);

  const refreshLatest = useCallback(async () => {
    const cid = conversationIdRef.current;
    if (!cid) return;
    try {
      const res = await getGroupMessages(cid, HISTORY_LIMIT, 0);
      setMessages((prev) => mergeMessages(prev, res.messages));
    } catch (err) {
      console.error("[ChatTab] refresh failed", err);
    }
  }, []);

  const emitBulkRead = useCallback(() => {
    const cid = conversationIdRef.current;
    if (!cid || !myUserId) return;
    messageSocket.emitConversationRead(cid, myUserId);
  }, [myUserId]);

  const initialize = useCallback(async () => {
    if (!token) return;
    setInitLoading(true);
    setInitError(null);
    try {
      const cid = await findOrCreateGroupConversation(groupId);
      conversationIdRef.current = cid;
      setConversationId(cid);
      messageSocket.connect(token);
      const res = await getGroupMessages(cid, HISTORY_LIMIT, 0);
      setMessages(sortAscending(res.messages.map((m) => ({ ...m, deliveryStatus: "sent" }))));
      try {
        await markGroupConversationAsRead(cid);
      } catch {
        /* non-fatal */
      }
      emitBulkRead();
      if (memberIds.length > 0) {
        messageSocket.emitQueryOnlineUsers(memberIds);
      }
      requestAnimationFrame(() => scrollToBottom("auto"));
    } catch (err) {
      setInitError(err instanceof Error ? err.message : String(err));
    } finally {
      setInitLoading(false);
    }
  }, [groupId, token, scrollToBottom, emitBulkRead, memberIds]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    const offConnect = messageSocket.onConnect(() => {
      setConnectionState("connected");
      if (memberIds.length > 0) {
        messageSocket.emitQueryOnlineUsers(memberIds);
      }
      emitBulkRead();
    });
    const offDisconnect = messageSocket.onDisconnect(() =>
      setConnectionState("disconnected"),
    );
    const offMessage = messageSocket.onMessage((m: RealtimeMessage) => {
      const cid = conversationIdRef.current;
      if (!cid || m.conversationId !== cid) return;
      const wasAtBottom = atBottomRef.current;
      void refreshLatest().then(() => {
        if (wasAtBottom) {
          scrollToBottom("smooth");
          emitBulkRead();
        } else {
          setShowNewPill(true);
        }
      });
    });

    const offTypingStart = messageSocket.onTypingStart(({ conversationId: cid, userId }) => {
      if (cid !== conversationIdRef.current) return;
      if (userId === myUserId) return;
      const existing = typingTimersRef.current.get(userId);
      if (typeof existing === "number") window.clearTimeout(existing);
      const timer = window.setTimeout(() => {
        typingTimersRef.current.delete(userId);
        setTypingUserIds((prev) => prev.filter((u) => u !== userId));
      }, TYPING_USER_IDLE_MS);
      typingTimersRef.current.set(userId, timer);
      setTypingUserIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    });

    const offTypingStop = messageSocket.onTypingStop(({ conversationId: cid, userId }) => {
      if (cid !== conversationIdRef.current) return;
      const existing = typingTimersRef.current.get(userId);
      if (typeof existing === "number") window.clearTimeout(existing);
      typingTimersRef.current.delete(userId);
      setTypingUserIds((prev) => prev.filter((u) => u !== userId));
    });

    const bumpStatus = (messageId: string, cid: string | undefined, next: DeliveryStatus) => {
      if (cid && cid !== conversationIdRef.current) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId && rankStatus(m.deliveryStatus) < rankStatus(next)
            ? { ...m, deliveryStatus: next }
            : m,
        ),
      );
    };
    const offMessageSent = messageSocket.onMessageSent(({ messageId, conversationId: cid }) =>
      bumpStatus(messageId, cid, "sent"),
    );
    const offMessageDelivery = messageSocket.onMessageDelivery(({ messageId, conversationId: cid }) =>
      bumpStatus(messageId, cid, "delivered"),
    );
    const offMessageRead = messageSocket.onMessageRead(({ messageId, conversationId: cid }) =>
      bumpStatus(messageId, cid, "read"),
    );

    const offConversationRead = messageSocket.onConversationRead(({ conversationId: cid, userId }) => {
      if (cid !== conversationIdRef.current) return;
      if (userId === myUserId) return;
      conversationReadByRef.current.set(userId, new Date().toISOString());
    });

    const offConversationReadAck = messageSocket.onConversationReadAck(() => undefined);

    const togglePresence = (userId: string, isOnline: boolean) =>
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (isOnline) next.add(userId);
        else next.delete(userId);
        return next;
      });
    const offPresenceUpdate = messageSocket.onPresenceUpdate(({ userId, isOnline }) =>
      togglePresence(userId, isOnline),
    );
    const offOnlineUsers = messageSocket.onOnlineUsersResponse(({ onlineUsers }) =>
      setOnlineUserIds(new Set(onlineUsers)),
    );
    const offPresenceResponse = messageSocket.onPresenceResponse(({ userId, isOnline }) =>
      togglePresence(userId, isOnline),
    );
    const offPong = messageSocket.onPong(() => undefined);

    if (messageSocket.isConnected) setConnectionState("connected");

    const unsubs = [
      offConnect, offDisconnect, offMessage, offTypingStart, offTypingStop,
      offMessageSent, offMessageDelivery, offMessageRead, offConversationRead,
      offConversationReadAck, offPresenceUpdate, offOnlineUsers,
      offPresenceResponse, offPong,
    ];
    return () => unsubs.forEach((u) => u());
  }, [refreshLatest, scrollToBottom, emitBulkRead, memberIds, myUserId]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (messageSocket.isConnected) messageSocket.emitPing();
    }, PRESENCE_PING_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    return () => {
      typingTimersRef.current.forEach((t) => window.clearTimeout(t));
      typingTimersRef.current.clear();
      if (typingStopTimerRef.current !== null) {
        window.clearTimeout(typingStopTimerRef.current);
        typingStopTimerRef.current = null;
      }
    };
  }, []);

  const sendTypingStop = useCallback(() => {
    const cid = conversationIdRef.current;
    if (!cid) return;
    if (typingStopTimerRef.current !== null) {
      window.clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = null;
    }
    messageSocket.emitTypingStop(cid);
  }, []);

  const handleDraftChange = useCallback((value: string) => {
    setDraft(value);
    const cid = conversationIdRef.current;
    if (!cid) return;
    if (value.length === 0) {
      sendTypingStop();
      return;
    }
    messageSocket.emitTypingStart(cid);
    if (typingStopTimerRef.current !== null) {
      window.clearTimeout(typingStopTimerRef.current);
    }
    typingStopTimerRef.current = window.setTimeout(() => {
      messageSocket.emitTypingStop(cid);
      typingStopTimerRef.current = null;
    }, TYPING_STOP_DEBOUNCE_MS);
  }, [sendTypingStop]);

  const onPickFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setPendingFiles((prev) => [...prev, ...files]);
    }
    e.target.value = "";
  }, []);

  const removePendingFile = useCallback((idx: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const send = useCallback(async () => {
    const content = draft.trim();
    const hasFiles = pendingFiles.length > 0;
    if (!conversationId || sending) return;
    if (!content && !hasFiles) return;

    const clientMessageId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const messageType: MessageType = pickMessageType(pendingFiles);

    const optimisticAttachments: DisplayAttachment[] = pendingFiles.map((f) => ({
      fileName: f.name,
      fileSize: f.size,
      mimeType: f.type || "application/octet-stream",
    }));

    const optimistic: DisplayMessage = {
      id: `pending-${clientMessageId}`,
      conversationId,
      senderId: myUserId ?? "self",
      type: messageType,
      content,
      attachments: optimisticAttachments,
      createdAt: new Date().toISOString(),
      pending: true,
      clientMessageId,
      deliveryStatus: "pending",
    };

    setMessages((prev) => sortAscending([...prev, optimistic]));
    const filesToUpload = pendingFiles;
    setPendingFiles([]);
    setDraft("");
    setSending(true);
    sendTypingStop();
    requestAnimationFrame(() => scrollToBottom("smooth"));

    try {
      let attachments: MessageAttachmentInput[] | undefined;
      if (filesToUpload.length > 0) {
        setUploading(true);
        const uploaded: MessageAttachmentInput[] = [];
        for (const file of filesToUpload) {
          const mime = file.type || "application/octet-stream";
          const signed = await getChatUploadUrl(mime, "chat");
          await uploadChatFile(signed.uploadUrl, file);
          uploaded.push({ publicUrl: signed.publicUrl, mimeType: mime });
        }
        attachments = uploaded;
        setUploading(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimistic.id
              ? {
                  ...m,
                  attachments: optimisticAttachments.map((att, i) => ({
                    ...att,
                    publicUrl: uploaded[i]?.publicUrl,
                    gcsPath: uploaded[i]?.publicUrl,
                  })),
                }
              : m,
          ),
        );
      }

      await sendGroupMessage({
        conversationId,
        messageType,
        content,
        attachments,
        clientMessageId,
        idempotencyKey: clientMessageId,
      });
      void refreshLatest();
    } catch (err) {
      setUploading(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === optimistic.id ? { ...m, pending: false, failed: true, deliveryStatus: undefined } : m,
        ),
      );
      toast({
        title: "Send failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  }, [
    draft,
    pendingFiles,
    conversationId,
    sending,
    myUserId,
    scrollToBottom,
    refreshLatest,
    sendTypingStop,
    toast,
  ]);

  const retrySend = useCallback(
    async (failed: DisplayMessage) => {
      if (!conversationId) return;
      const clientMessageId = failed.clientMessageId ?? failed.id;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === failed.id ? { ...m, pending: true, failed: false, deliveryStatus: "pending" } : m,
        ),
      );
      try {
        const reattachments: MessageAttachmentInput[] | undefined = failed.attachments
          ?.map((a) => {
            const url = a.publicUrl ?? a.gcsPath;
            if (!url) return null;
            return { publicUrl: url, mimeType: a.mimeType ?? "application/octet-stream" };
          })
          .filter((a): a is MessageAttachmentInput => a !== null);
        await sendGroupMessage({
          conversationId,
          messageType: failed.type,
          content: failed.content,
          attachments: reattachments && reattachments.length > 0 ? reattachments : undefined,
          clientMessageId,
          idempotencyKey: clientMessageId,
        });
        void refreshLatest();
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === failed.id ? { ...m, pending: false, failed: true, deliveryStatus: undefined } : m,
          ),
        );
        toast({
          title: "Retry failed",
          description: err instanceof Error ? err.message : String(err),
          variant: "destructive",
        });
      }
    },
    [conversationId, refreshLatest, toast],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col h-[60vh] rounded-xl border border-border bg-card items-center justify-center text-muted-foreground">
        Please sign in to view chat.
      </div>
    );
  }

  const dotClass =
    connectionState === "connected"
      ? "bg-emerald-500"
      : connectionState === "connecting"
        ? "bg-amber-500 animate-pulse"
        : "bg-red-500";
  const stateLabel =
    connectionState === "connected"
      ? "Connected"
      : connectionState === "connecting"
        ? "Connecting…"
        : "Disconnected";

  const typingNames = typingUserIds
    .filter((u) => u !== myUserId)
    .map((u) => memberDisplayName(members, u, myUserId));
  const typingLabel =
    typingNames.length === 0
      ? ""
      : typingNames.length === 1
        ? `${typingNames[0]} is typing…`
        : typingNames.length === 2
          ? `${typingNames[0]} and ${typingNames[1]} are typing…`
          : "Several people are typing…";

  const canSend =
    !!conversationId && !sending && !uploading && (draft.trim().length > 0 || pendingFiles.length > 0);

  return (
    <div className="flex flex-col h-[60vh] rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          <span>{stateLabel}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {messages.length > 0 && `${messages.length} message${messages.length === 1 ? "" : "s"}`}
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto px-4 py-3 space-y-1"
        >
          {initLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading messages…
            </div>
          ) : initError ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Couldn't load chat: {initError}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => void initialize()}>
                Retry
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              No messages yet. Be the first to say hi.
            </div>
          ) : (
            messages.map((m, idx) => {
              const prev = messages[idx - 1];
              const isMine = !!myUserId && m.senderId === myUserId;
              const showHeader =
                !prev ||
                prev.senderId !== m.senderId ||
                new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() >=
                  SAME_SENDER_WINDOW_MS;
              return (
                <MessageRow
                  key={m.id}
                  m={m}
                  isMine={isMine}
                  showHeader={showHeader}
                  name={memberDisplayName(members, m.senderId, myUserId)}
                  avatar={memberAvatarUrl(members, m.senderId)}
                  isOnline={!isMine && onlineUserIds.has(m.senderId)}
                  onRetry={(msg) => void retrySend(msg)}
                />
              );
            })
          )}
          <div ref={bottomAnchorRef} />
        </div>

        {showNewPill && (
          <button
            type="button"
            onClick={() => scrollToBottom("smooth")}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-xs px-3 py-1.5 shadow-md hover:opacity-90"
          >
            <ArrowDown className="h-3 w-3" />
            New messages
          </button>
        )}
      </div>

      {typingLabel && (
        <div className="px-4 py-1 text-[11px] text-muted-foreground border-t border-border bg-muted/20">
          {typingLabel}
        </div>
      )}

      <div className="border-t border-border p-3 bg-background">
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {pendingFiles.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                className="flex items-center gap-1.5 rounded-full bg-muted px-2 py-1 text-xs"
              >
                <FileIcon className="h-3 w-3" />
                <span className="max-w-[180px] truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removePendingFile(i)}
                  className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                  aria-label={`Remove ${f.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={onFilesChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onPickFiles}
            disabled={!conversationId || sending || uploading}
            className="shrink-0"
            aria-label="Attach files"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            value={draft}
            onInput={(e) =>
              handleDraftChange((e.target as HTMLTextAreaElement).value)
            }
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={
              conversationId ? "Write a message…" : "Connecting to chat…"
            }
            disabled={!conversationId || initLoading}
            rows={1}
            className="min-h-[40px] max-h-32 resize-none flex-1"
          />
          <Button
            type="button"
            onClick={() => void send()}
            disabled={!canSend}
            className="shrink-0"
          >
            {sending || uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="mt-1 text-[11px] text-muted-foreground">
          Enter to send · Shift+Enter for newline
        </div>
      </div>
    </div>
  );
}
