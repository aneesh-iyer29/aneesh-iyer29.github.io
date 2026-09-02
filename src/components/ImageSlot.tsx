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
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {address && (
          <div className="flex items-center gap-1.5 border-b border-border bg-secondary px-3.5 py-2">
            <span aria-hidden="true" className="size-2 rounded-full border border-border bg-card" />
            <span aria-hidden="true" className="size-2 rounded-full border border-border bg-card" />
            <span aria-hidden="true" className="size-2 rounded-full border border-border bg-card" />
            <span className="ml-3 flex-1 truncate rounded-sm border border-border bg-card px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
              {address}
            </span>
          </div>
        )}
        {src ? (
          <img src={src} alt={alt ?? caption} className="block w-full" loading="lazy" />
        ) : (
          <div
            className="dot-grid grid place-items-center bg-card px-6 text-center"
            style={{ aspectRatio: ratio }}
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
      <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-foreground">{label}</span>
        <span aria-hidden="true" className="mx-2 text-border">
          |
        </span>
        {caption}
      </figcaption>
    </figure>
  );
};

export default ImageSlot;
