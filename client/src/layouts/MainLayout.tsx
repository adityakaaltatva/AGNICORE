import { ReactNode, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  readonly children: ReactNode;
  readonly currentPage: string;
  readonly onNavigate: (page: string) => void;
  readonly onLogout: () => void;
}

export default function MainLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="ambient-orb left-10 top-24 h-40 w-40 bg-sky-400/10" />
      <div className="ambient-orb right-10 top-80 h-48 w-48 bg-rose-500/10" />

      <Navbar
        currentPage={currentPage}
        onLogout={onLogout}
        onOpenMenu={() => setIsSidebarOpen(true)}
      />

      <div className="page-grid pt-5">
        <div className="flex gap-6">
          <div className="hidden xl:block xl:w-[280px] xl:shrink-0">
            <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
          </div>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close navigation"
          />
          <div className="relative h-full p-4">
            <Sidebar
              currentPage={currentPage}
              onNavigate={onNavigate}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
