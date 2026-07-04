/* Image with a browser-style frame. When `src` is absent, renders a described
   placeholder so the right screenshot can be dropped in later. */
interface ImageSlotProps {
  label: string;
  caption: string;
  src?: string;
  alt?: string;
  ratio?: string;
  address?: string;
}

const ImageSlot = ({ label, caption, src, alt, ratio = "16 / 10", address }: ImageSlotProps) => {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {address && (
          <div className="flex items-center gap-1.5 border-b border-border bg-secondary/60 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-foreground/10" />
            <span className="size-2.5 rounded-full bg-foreground/10" />
            <span className="size-2.5 rounded-full bg-foreground/10" />
            <span className="ml-3 truncate font-mono text-[0.65rem] text-muted-foreground">{address}</span>
          </div>
        )}
        {src ? (
          <img src={src} alt={alt ?? caption} className="block w-full" />
        ) : (
          <div
            className="grid place-items-center bg-secondary px-6 text-center"
            style={{
              aspectRatio: ratio,
              backgroundImage:
                "linear-gradient(hsl(var(--foreground) / 0.04) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.04) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          >
            <div>
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent">{label}</div>
              <div className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
                Image to add: {caption}
              </div>
            </div>
          </div>
        )}
      </div>
      <figcaption className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{caption}</figcaption>
    </figure>
  );
};

export default ImageSlot;
