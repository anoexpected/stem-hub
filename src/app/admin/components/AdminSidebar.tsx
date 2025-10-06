'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileCheck,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Review Queue',
    href: '/admin/review',
    icon: FileCheck,
    badge: 'dynamic',
  },
  {
    name: 'Curriculum',
    href: '/admin/curriculum',
    icon: BookOpen,
    children: [
      { name: 'Exam Boards', href: '/admin/curriculum/exam-boards' },
      { name: 'Subjects', href: '/admin/curriculum/subjects' },
      { name: 'Topics', href: '/admin/curriculum/topics' },
    ],
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
    children: [
      { name: 'All Users', href: '/admin/users' },
      { name: 'Contributors', href: '/admin/users/contributors' },
    ],
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    // Fetch pending review count
    async function fetchPendingCount() {
      try {
        const response = await fetch('/api/admin/pending-count');
        if (response.ok) {
          const data = await response.json();
          setPendingCount(data.count || 0);
        }
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    }

    fetchPendingCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          const badgeValue = item.badge === 'dynamic' ? pendingCount : item.badge;

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-[#2ECC71] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {badgeValue && Number(badgeValue) > 0 && (
                  <span className="px-2 py-1 text-xs font-bold bg-[#F1C40F] text-[#1B2A4C] rounded-full">
                    {badgeValue}
                  </span>
                )}
              </Link>

              {/* Sub-navigation */}
              {item.children && isActive && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        'block px-4 py-2 text-sm rounded-lg transition-colors',
                        pathname === child.href
                          ? 'text-[#2ECC71] font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <Link
          href="/admin/settings"
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
