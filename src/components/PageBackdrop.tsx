/* A fixed daylight field behind the whole page: porcelain base with a faint
   cobalt sky glow at the top and a cooler drift near the foot. Static by
   design; the content, not the backdrop, carries the page. */
const PageBackdrop = () => {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 55% at 50% -12%, hsl(var(--accent) / 0.09), transparent 62%)," +
            "radial-gradient(85% 45% at 85% 112%, hsl(200 60% 55% / 0.07), transparent 58%)",
        }}
      />
    </div>
  );
};

export default PageBackdrop;
