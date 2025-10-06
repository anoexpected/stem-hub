import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if group exists and has space
        const { data: group, error: groupError } = await supabase
            .from('study_groups')
            .select(`
                *,
                study_group_members (count)
            `)
            .eq('id', params.id)
            .single();

        if (groupError || !group) {
            return NextResponse.json(
                { error: 'Study group not found' },
                { status: 404 }
            );
        }

        if (!group.is_active) {
            return NextResponse.json(
                { error: 'This study group is no longer active' },
                { status: 400 }
            );
        }

        const memberCount = group.study_group_members?.[0]?.count || 0;
        if (memberCount >= group.max_members) {
            return NextResponse.json(
                { error: 'Study group is full' },
                { status: 400 }
            );
        }

        // Check if already a member
        const { data: existingMember } = await supabase
            .from('study_group_members')
            .select('id')
            .eq('group_id', params.id)
            .eq('user_id', user.id)
            .single();

        if (existingMember) {
            return NextResponse.json(
                { error: 'Already a member of this group' },
                { status: 400 }
            );
        }

        // Join group
        const { data, error } = await supabase
            .from('study_group_members')
            .insert({
                group_id: params.id,
                user_id: user.id,
                role: 'member'
            })
            .select()
            .single();

        if (error) {
            console.error('Error joining study group:', error);
            return NextResponse.json(
                { error: 'Failed to join study group' },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { error } = await supabase
            .from('study_group_members')
            .delete()
            .eq('group_id', params.id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error leaving study group:', error);
            return NextResponse.json(
                { error: 'Failed to leave study group' },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: 'Left study group successfully' });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
