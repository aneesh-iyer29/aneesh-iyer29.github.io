import type { PropsWithChildren } from "react";
import Nav from "./Nav";
import Footer from "./Footer";

/* Shared frame for every route: fixed nav, content, footer. */
const PageShell = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen flex-col bg-background">
    <Nav />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default PageShell;
