import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { Post } from "@/types/posts";
import { useT } from "@/hooks/useT";

interface DeletePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onConfirm: () => void;
}

export function DeletePostModal({
  open,
  onOpenChange,
  post,
  onConfirm,
}: DeletePostModalProps) {
  const t = useT();

  if (!post) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle>{t.deletePost}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {t.deletePostConfirm} <strong>"{post.title}"</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          <p>• {t.commentsReactionsRemoved}</p>
          <p>• {t.auditRecordKept}</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t.deletePost}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
