import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function MainLayout({ children, currentPage, onNavigate, onLogout }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={onLogout} />
      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
