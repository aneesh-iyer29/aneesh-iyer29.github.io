import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-page flex-col items-start justify-center px-6 pb-24 pt-28">
        <p className="readout text-6xl font-medium leading-none text-accent md:text-7xl">404</p>
        <h1 className="display mt-6 text-3xl text-foreground md:text-4xl">This page does not exist.</h1>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
          Nothing lives at <span className="readout text-sm text-foreground">{location.pathname}</span>. The link may
          be old, or the address may have a typo.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back home
        </Link>
      </div>
    </PageShell>
  );
};

export default NotFound;
