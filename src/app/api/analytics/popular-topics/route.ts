import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const subjectId = searchParams.get('subject_id');

        // Get topics with most practice sessions in last 30 days
        let query = supabase
            .from('practice_sessions')
            .select(`
                topic_id,
                topics (
                    id,
                    name,
                    description,
                    difficulty_level,
                    subjects (
                        id,
                        name
                    )
                )
            `)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (subjectId) {
            // We'll filter after getting the data since we can't join filter easily
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching popular topics:', error);
            return NextResponse.json(
                { error: 'Failed to fetch popular topics' },
                { status: 500 }
            );
        }

        // Count practice sessions per topic
        const topicCounts = new Map<string, { topic: any; count: number }>();

        data?.forEach((session: any) => {
            if (session.topics) {
                const topicId = session.topic_id;
                if (!topicCounts.has(topicId)) {
                    topicCounts.set(topicId, {
                        topic: session.topics,
                        count: 0
                    });
                }
                topicCounts.get(topicId)!.count++;
            }
        });

        // Convert to array and sort by count
        let popularTopics = Array.from(topicCounts.values())
            .sort((a, b) => b.count - a.count);

        // Filter by subject if provided
        if (subjectId) {
            popularTopics = popularTopics.filter(
                item => item.topic.subjects?.id === subjectId
            );
        }

        // Take top N
        popularTopics = popularTopics.slice(0, limit);

        return NextResponse.json({
            topics: popularTopics.map(item => ({
                ...item.topic,
                practice_count: item.count
            }))
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
