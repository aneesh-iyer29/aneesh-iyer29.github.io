interface CodeBlockProps {
  code: string;
  /** Shown in the header, e.g. a file path. */
  title: string;
  /** Language label shown on the right of the header. */
  lang?: string;
  className?: string;
}

/* Mono source excerpt on a paper-grey block with a small header. */
export function CodeBlock({ code, title, lang, className = "" }: CodeBlockProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-border bg-secondary ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="truncate font-mono text-[0.68rem] text-foreground">{title}</span>
        {lang ? (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{lang}</span>
        ) : null}
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.78rem] leading-[1.6] text-foreground/85">
        <code>{code}</code>
      </pre>
    </div>
  );
}
