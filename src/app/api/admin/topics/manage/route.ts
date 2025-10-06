import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/middleware/requireRole';
import { createClient } from '@/lib/supabase/server';

// GET: Fetch all topics with contribution statistics (Admin view)
export async function GET(request: NextRequest) {
    try {
        await requireRole('admin');
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const available = searchParams.get('available');
        const examBoardId = searchParams.get('exam_board_id');
        const subjectId = searchParams.get('subject_id');

        // Use the admin view for comprehensive topic data
        let query = supabase
            .from('admin_topic_contribution_overview')
            .select('*');

        // Apply filters
        if (status) {
            query = query.eq('contribution_status', status);
        }
        if (available !== null) {
            query = query.eq('available_for_contribution', available === 'true');
        }
        if (examBoardId) {
            query = query.eq('exam_board_id', examBoardId);
        }
        if (subjectId) {
            query = query.eq('subject_id', subjectId);
        }

        const { data: topics, error } = await query;

        if (error) {
            console.error('Error fetching topics:', error);
            return NextResponse.json(
                { error: 'Failed to fetch topics' },
                { status: 500 }
            );
        }

        return NextResponse.json({ topics });

    } catch (error: any) {
        console.error('Error in admin topics GET:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

// POST: Create a new topic
export async function POST(request: NextRequest) {
    try {
        await requireRole('admin');
        const supabase = await createClient();

        const body = await request.json();
        const {
            subject_id,
            name,
            code,
            description,
            difficulty_level,
            parent_topic_id,
            order_index,
            available_for_contribution,
            priority_level,
            required_notes_count,
            required_quizzes_count,
            admin_notes,
        } = body;

        // Validate required fields
        if (!subject_id || !name) {
            return NextResponse.json(
                { error: 'Subject ID and name are required' },
                { status: 400 }
            );
        }

        const topicData: any = {
            subject_id,
            name,
            code,
            description,
            difficulty_level,
            parent_topic_id,
            order_index,
            is_active: true,
            available_for_contribution: available_for_contribution || false,
            priority_level: priority_level || 'medium',
            required_notes_count: required_notes_count || 1,
            required_quizzes_count: required_quizzes_count || 1,
            admin_notes,
        };

        // If marking as available, set the timestamp
        if (available_for_contribution) {
            topicData.opened_for_contribution_at = new Date().toISOString();
        }

        const { data: topic, error } = await supabase
            .from('topics')
            .insert(topicData)
            .select()
            .single();

        if (error) {
            console.error('Error creating topic:', error);
            return NextResponse.json(
                { error: `Failed to create topic: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            topic,
            message: 'Topic created successfully',
        });

    } catch (error: any) {
        console.error('Error in admin topics POST:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

// PATCH: Update topic contribution settings
export async function PATCH(request: NextRequest) {
    try {
        await requireRole('admin');
        const supabase = await createClient();

        const body = await request.json();
        const {
            topic_id,
            available_for_contribution,
            contribution_status,
            priority_level,
            required_notes_count,
            required_quizzes_count,
            admin_notes,
            is_active,
        } = body;

        if (!topic_id) {
            return NextResponse.json(
                { error: 'Topic ID is required' },
                { status: 400 }
            );
        }

        console.log('Updating topic with ID:', topic_id);

        // First check if topic exists
        const { data: existingTopic, error: checkError } = await supabase
            .from('topics')
            .select('id, name')
            .eq('id', topic_id)
            .single();

        if (checkError || !existingTopic) {
            console.error('Topic not found:', topic_id, checkError);
            return NextResponse.json(
                { error: `Topic not found: ${topic_id}` },
                { status: 404 }
            );
        }

        console.log('Found topic:', existingTopic.name);

        const updateData: any = {};

        // Only include fields that are provided
        if (available_for_contribution !== undefined) {
            updateData.available_for_contribution = available_for_contribution;
            // Set timestamp when opening for contribution
            if (available_for_contribution) {
                updateData.opened_for_contribution_at = new Date().toISOString();
            }
        }

        if (contribution_status) {
            updateData.contribution_status = contribution_status;
            // Set completed timestamp if marking as complete
            if (contribution_status === 'complete') {
                updateData.completed_at = new Date().toISOString();
            }
        }

        if (priority_level) updateData.priority_level = priority_level;
        if (required_notes_count !== undefined) updateData.required_notes_count = required_notes_count;
        if (required_quizzes_count !== undefined) updateData.required_quizzes_count = required_quizzes_count;
        if (admin_notes !== undefined) updateData.admin_notes = admin_notes;
        if (is_active !== undefined) updateData.is_active = is_active;

        updateData.updated_at = new Date().toISOString();

        console.log('Update data:', updateData);

        const { data: topic, error } = await supabase
            .from('topics')
            .update(updateData)
            .eq('id', topic_id)
            .select()
            .single();

        if (error) {
            console.error('Error updating topic:', error);
            console.error('Topic ID:', topic_id);
            console.error('Update data:', updateData);
            return NextResponse.json(
                { error: `Failed to update topic: ${error.message}` },
                { status: 500 }
            );
        }

        console.log('Topic updated successfully:', topic.name);

        return NextResponse.json({
            success: true,
            topic,
            message: 'Topic updated successfully',
        });

    } catch (error: any) {
        console.error('Error in admin topics PATCH:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

// DELETE: Delete a topic (soft delete by setting is_active to false)
export async function DELETE(request: NextRequest) {
    try {
        await requireRole('admin');
        const supabase = await createClient();

        const { searchParams } = new URL(request.url);
        const topicId = searchParams.get('id');

        if (!topicId) {
            return NextResponse.json(
                { error: 'Topic ID is required' },
                { status: 400 }
            );
        }

        // Soft delete - just mark as inactive
        const { error } = await supabase
            .from('topics')
            .update({
                is_active: false,
                available_for_contribution: false,
                updated_at: new Date().toISOString(),
            })
            .eq('id', topicId);

        if (error) {
            console.error('Error deleting topic:', error);
            return NextResponse.json(
                { error: `Failed to delete topic: ${error.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Topic deleted successfully',
        });

    } catch (error: any) {
        console.error('Error in admin topics DELETE:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
