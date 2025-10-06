import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Count all pending items
        const [
            { count: notesCount },
            { count: quizzesCount },
            { count: papersCount },
        ] = await Promise.all([
            supabase.from('notes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('quizzes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('past_papers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);

        const totalCount = (notesCount || 0) + (quizzesCount || 0) + (papersCount || 0);

        return NextResponse.json({ count: totalCount });
    } catch (error) {
        console.error('Error fetching pending count:', error);
        return NextResponse.json({ count: 0 });
    }
}
