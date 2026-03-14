import { Shield, LogOut } from 'lucide-react';

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-red-500" />
          <h1 className="text-xl font-bold">AGNICORE Zero Trust Platform</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">admin@agnicore.io</span>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
