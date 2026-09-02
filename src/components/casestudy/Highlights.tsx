/* Contribution bullets set as a hairline list with accent markers. */
export function Highlights({ items, eyebrow = "Key contributions" }: { items: string[]; eyebrow?: string }) {
  return (
    <div>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item} className="flex gap-4 py-3.5 text-sm leading-relaxed text-muted-foreground">
            <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 flex-none rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
