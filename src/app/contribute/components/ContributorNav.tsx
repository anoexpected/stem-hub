'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  FileCheck,
  FolderOpen,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/contribute',
    icon: LayoutDashboard,
  },
  {
    name: 'Create Content',
    href: '/contribute/create',
    icon: FileText,
    children: [
      { name: 'Write Note', href: '/contribute/create/note' },
      { name: 'Create Quiz', href: '/contribute/create/quiz' },
      { name: 'Upload Past Paper', href: '/contribute/create/past-paper' },
    ],
  },
  {
    name: 'My Content',
    href: '/contribute/my-content',
    icon: FolderOpen,
    children: [
      { name: 'All Content', href: '/contribute/my-content' },
      { name: 'Drafts', href: '/contribute/my-content/drafts' },
      { name: 'Pending Review', href: '/contribute/my-content/pending' },
      { name: 'Published', href: '/contribute/my-content/published' },
    ],
  },
  {
    name: 'My Stats',
    href: '/contribute/stats',
    icon: TrendingUp,
  },
];

export default function ContributorNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

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

      {/* Help Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-bold text-blue-900 mb-2">Need Help?</h4>
          <p className="text-xs text-blue-800 mb-3">
            Check our contributor guidelines
          </p>
          <Link
            href="/contribute/guidelines"
            className="text-xs text-[#2ECC71] font-medium hover:underline"
          >
            View Guidelines →
          </Link>
        </div>
      </div>
    </aside>
  );
}
