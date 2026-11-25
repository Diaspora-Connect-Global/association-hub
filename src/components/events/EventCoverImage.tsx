import { useEffect, useState, type ReactNode } from "react";
import { ImageOff } from "lucide-react";
import { usableCoverImageUrl } from "@/lib/eventCoverImage";
import { useT } from "@/hooks/useT";

interface EventCoverImageProps {
  src: string | null | undefined;
  title: string;
  className?: string;
  /** Shown when there is no cover at all (the card's emoji). A cover that cannot load shows the placeholder. */
  fallback?: ReactNode;
}

/**
 * Event cover. A missing, unusable (e.g. an old `blob:` value) or broken cover shows
 * a quiet placeholder instead of a broken-image icon; the error handler flips state
 * once, so a dead URL is requested once and never loops.
 */
export function EventCoverImage({ src, title, className = "h-full w-full object-cover", fallback }: EventCoverImageProps) {
  const t = useT();
  const url = usableCoverImageUrl(src);
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);

  if (!src && fallback) return <>{fallback}</>;
  if (!url || failed) {
    return (
      <div role="img" aria-label={`${t.coverNoImage}: ${title}`} className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
        <ImageOff className="h-8 w-8" aria-hidden="true" />
        <span className="text-xs">{t.coverNoImage}</span>
      </div>
    );
  }
  return <img src={url} alt={title} className={className} onError={() => setFailed(true)} />;
}
