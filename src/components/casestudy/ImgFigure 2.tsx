import type { ReactNode } from "react";

interface ImgFigureProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  /** Optional mono kicker in a header row, e.g. "Fig. 2". */
  label?: string;
  /** Optional right-aligned mono note beside the label. */
  note?: string;
  /** Show the image at its natural size, centred on dot-grid paper, instead of stretching it to the frame. */
  inset?: boolean;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}

/* A static image framed like a figure in a paper: hairline frame, optional kicker, caption. */
export function ImgFigure({
  src,
  alt,
  caption,
  label,
  note,
  inset = false,
  className = "",
  imgClassName = "",
  loading = "lazy",
}: ImgFigureProps) {
  const img = (
    <img
      src={src}
      alt={alt}
      className={inset ? `mx-auto block h-auto w-auto max-w-full rounded-md ${imgClassName}` : `block h-auto w-full ${imgClassName}`}
      loading={loading}
    />
  );
  return (
    <figure className={`figure-frame ${className}`}>
      {label || note ? (
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
          <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground">{label}</span>
          {note ? (
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{note}</span>
          ) : null}
        </div>
      ) : null}
      {inset ? <div className="dot-grid p-6 sm:p-10">{img}</div> : img}
      {caption ? (
        <figcaption className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
