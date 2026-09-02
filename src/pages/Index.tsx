import { useEffect } from "react";
import PageShell from "@/components/layout/PageShell";

const Index = () => {
  // Anchor targets don't exist until React mounts, so honor an incoming
  // #section hash (e.g. arriving from another page) after first render.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <PageShell>
      <div className="mx-auto max-w-page px-6 pt-32">
        <h1 className="display text-5xl">Aneesh Iyer</h1>
      </div>
    </PageShell>
  );
};

export default Index;
