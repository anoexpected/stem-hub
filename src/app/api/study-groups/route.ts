import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const subjectId = searchParams.get('subject_id');
        const examBoardId = searchParams.get('exam_board_id');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        let query = supabase
            .from('study_groups')
            .select(`
                *,
                subjects (
                    id,
                    name
                ),
                exam_boards (
                    id,
                    name,
                    code
                ),
                users!study_groups_created_by_fkey (
                    id,
                    full_name,
                    avatar_url
                ),
                study_group_members (count)
            `, { count: 'exact' })
            .eq('is_public', true)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (subjectId) {
            query = query.eq('subject_id', subjectId);
        }

        if (examBoardId) {
            query = query.eq('exam_board_id', examBoardId);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching study groups:', error);
            return NextResponse.json(
                { error: 'Failed to fetch study groups' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            studyGroups: data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            name,
            description,
            subject_id,
            exam_board_id,
            whatsapp_link,
            max_members,
            is_public
        } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Group name is required' },
                { status: 400 }
            );
        }

        // Create study group
        const { data: group, error: groupError } = await supabase
            .from('study_groups')
            .insert({
                name,
                description,
                subject_id,
                exam_board_id,
                whatsapp_link,
                max_members: max_members || 50,
                is_public: is_public !== false,
                created_by: user.id
            })
            .select()
            .single();

        if (groupError) {
            console.error('Error creating study group:', groupError);
            return NextResponse.json(
                { error: 'Failed to create study group' },
                { status: 500 }
            );
        }

        // Auto-join creator as admin
        const { error: memberError } = await supabase
            .from('study_group_members')
            .insert({
                group_id: group.id,
                user_id: user.id,
                role: 'admin'
            });

        if (memberError) {
            console.error('Error adding creator to group:', memberError);
        }

        return NextResponse.json(group, { status: 201 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
