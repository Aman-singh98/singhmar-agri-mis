import { useState, useCallback, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DESKTOP_BREAKPOINT_PX = 1024;
const SIDEBAR_COLLAPSED_KEY = "sidebar_collapsed";

function FullPageSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-stone-50" role="status">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 bg-yellow-500 rotate-45 animate-ping opacity-30" />
          <div className="absolute inset-0 bg-yellow-500 rotate-45 opacity-90" />
        </div>
        <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">Loading…</p>
      </div>
    </div>
  );
}

const readSidebarCollapsed = () => {
  try { return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"; }
  catch { return false; }
};

const writeSidebarCollapsed = (collapsed) => {
  try { localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed)); }
  catch { /* silent */ }
};

function Layout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(readSidebarCollapsed);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => { writeSidebarCollapsed(isSidebarCollapsed); }, [isSidebarCollapsed]);

  useEffect(() => { setIsMobileDrawerOpen(false); }, [location.pathname]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT_PX}px)`);
    const handler = (e) => { if (e.matches) setIsMobileDrawerOpen(false); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleToggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleOpenMobileDrawer  = useCallback(() => setIsMobileDrawerOpen(true),  []);
  const handleCloseMobileDrawer = useCallback(() => setIsMobileDrawerOpen(false), []);

  if (loading) return <FullPageSpinner />;

  if (!user) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      {isMobileDrawerOpen && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={handleCloseMobileDrawer}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
        />
      )}

      <div className="hidden lg:flex flex-none h-full z-40">
        <Sidebar collapsed={isSidebarCollapsed} setCollapsed={handleToggleSidebarCollapse} />
      </div>

      <div className={`fixed inset-y-0 left-0 z-40 flex h-full lg:hidden transition-transform duration-300 ease-in-out
          ${isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar collapsed={false} setCollapsed={() => {}} onClose={handleCloseMobileDrawer} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Navbar onMenuClick={handleOpenMobileDrawer} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;