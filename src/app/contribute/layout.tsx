import { redirect } from 'next/navigation';
import { requireRole } from '@/middleware/requireRole';
import ContributorNav from './components/ContributorNav';
import ContributorHeader from './components/ContributorHeader';

export default async function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireRole('contributor');
  } catch {
    redirect('/auth/login?redirect=/contribute');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contributor Header */}
      <ContributorHeader />
      
      <div className="flex">
        {/* Navigation */}
        <ContributorNav />
        
        {/* Main Content */}
        <main className="flex-1 p-8 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
