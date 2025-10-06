'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        async function redirectToRolePage() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/auth/login');
                    return;
                }

                const { data: userData } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                const role = userData?.role || 'student';

                switch (role) {
                    case 'admin':
                        router.push('/admin');
                        break;
                    case 'contributor':
                        router.push('/contribute');
                        break;
                    case 'student':
                    default:
                        router.push('/learn/dashboard');
                        break;
                }
            } catch (error) {
                console.error('Error loading user:', error);
                router.push('/auth/login');
            }
        }

        redirectToRolePage();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-whisper">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-charcoal/60">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
