'use client';

import Link from 'next/link';
import { Bell, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminHeader() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-[#1B2A4C] text-white shadow-lg sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/admin" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#2ECC71] rounded-lg flex items-center justify-center font-bold text-xl">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold font-['Poppins']">STEM Hub</h1>
            <p className="text-xs text-gray-300">Admin Dashboard</p>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-white/10 rounded-lg transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#F1C40F] rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-white/20">
            <div className="w-8 h-8 bg-[#2ECC71] rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin</p>
              <p className="text-xs text-gray-300">Administrator</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
