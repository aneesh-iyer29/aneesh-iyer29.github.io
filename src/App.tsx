import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, useLocation, useNavigate, type Location } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import SciOlyTests from "./pages/SciOlyTests.tsx";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location } | null;
  const background = state?.background;

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<Index />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/scioly-tests" element={<SciOlyTests />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {background ? (
        <div
          className="fixed inset-0 z-[60]"
          role="dialog"
          aria-modal="true"
          aria-label="Project details"
        >
          <button
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            aria-label="Close project details"
            onClick={() => navigate(-1)}
          />
          <div className="relative h-full w-full overflow-auto">
            <div className="min-h-full">
              <Routes>
                <Route path="/projects/:slug" element={<ProjectDetail />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
