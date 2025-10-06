#!/usr/bin/env node

/**
 * STEM Hub Phase 2 Setup Script
 * 
 * This script helps you set up Phase 2 features including:
 * - Database schema verification
 * - Sample data seeding
 * - API endpoint testing
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local file
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join('=').trim();
            }
        }
    });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

async function main() {
    console.log('🚀 STEM Hub Phase 2 Setup\n');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables!');
        console.log('\nPlease ensure you have:');
        console.log('  - NEXT_PUBLIC_SUPABASE_URL');
        console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
        console.log('\nin your .env.local file');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('✅ Supabase connection established\n');

    // Check if Phase 2 tables exist
    console.log('📋 Checking Phase 2 tables...\n');

    const phase2Tables = [
        'notes',
        'past_papers',
        'reviews',
        'quizzes',
        'quiz_questions',
        'quiz_attempts',
        'most_asked_questions',
        'study_groups',
        'study_group_members',
        'user_achievements',
        'flashcards',
        'user_flashcard_progress',
        'forum_discussions',
        'forum_replies',
        'note_likes',
        'note_ratings',
        'user_learning_streaks',
        'topic_mastery'
    ];

    const missingTables: string[] = [];

    for (const table of phase2Tables) {
        const { error } = await supabase.from(table).select('id').limit(1);

        if (error) {
            console.log(`❌ Table '${table}' not found`);
            missingTables.push(table);
        } else {
            console.log(`✅ Table '${table}' exists`);
        }
    }

    if (missingTables.length > 0) {
        console.log('\n⚠️  Missing tables detected!');
        console.log('\nPlease run the Phase 2 schema in your Supabase SQL Editor:');
        console.log('File: supabase/schema_phase2.sql\n');

        const proceed = await question('Do you want to continue anyway? (y/n): ');
        if (proceed.toLowerCase() !== 'y') {
            console.log('\n👋 Setup cancelled. Please create the missing tables first.');
            rl.close();
            return;
        }
    }

    console.log('\n✅ All Phase 2 tables exist!\n');

    // Check if we should seed sample data
    const shouldSeed = await question('Would you like to seed sample Phase 2 data? (y/n): ');

    if (shouldSeed.toLowerCase() === 'y') {
        console.log('\n📝 Seeding sample data...\n');

        try {
            // Get first topic for sample data
            const { data: topics } = await supabase
                .from('topics')
                .select('id, name')
                .limit(1);

            if (!topics || topics.length === 0) {
                console.log('❌ No topics found. Please run Phase 1 setup first.');
                rl.close();
                return;
            }

            const topicId = topics[0].id;
            console.log(`Using topic: ${topics[0].name}`);

            // Get first subject
            const { data: subjects } = await supabase
                .from('subjects')
                .select('id, name')
                .limit(1);

            const subjectId = subjects?.[0]?.id;

            // Create sample quiz
            const { data: quiz, error: quizError } = await supabase
                .from('quizzes')
                .insert({
                    topic_id: topicId,
                    title: 'Sample Quiz - Getting Started',
                    description: 'A sample quiz to test the quiz system',
                    difficulty: 'Foundation',
                    time_limit_minutes: 10,
                    passing_score: 70,
                    is_active: true
                })
                .select()
                .single();

            if (!quizError && quiz) {
                console.log('✅ Created sample quiz');

                // Add sample questions
                await supabase.from('quiz_questions').insert([
                    {
                        quiz_id: quiz.id,
                        question_text: 'What is 2 + 2?',
                        question_type: 'multiple_choice',
                        options: { a: '3', b: '4', c: '5', d: '6' },
                        correct_answer: '4',
                        explanation: '2 + 2 equals 4',
                        marks: 1,
                        order_index: 1
                    },
                    {
                        quiz_id: quiz.id,
                        question_text: 'Is 10 greater than 5?',
                        question_type: 'true_false',
                        options: {},
                        correct_answer: 'true',
                        explanation: '10 is indeed greater than 5',
                        marks: 1,
                        order_index: 2
                    }
                ]);

                console.log('✅ Created sample quiz questions');
            }

            // Create sample study group
            const { error: groupError } = await supabase
                .from('study_groups')
                .insert({
                    name: 'General Study Group',
                    description: 'A sample study group for collaborative learning',
                    subject_id: subjectId,
                    max_members: 50,
                    is_public: true,
                    is_active: true
                });

            if (!groupError) {
                console.log('✅ Created sample study group');
            }

            // Create sample note (will be draft without user)
            const { error: noteError } = await supabase
                .from('notes')
                .insert({
                    topic_id: topicId,
                    title: 'Introduction to the Topic',
                    content: '# Introduction\n\nThis is a sample study note to demonstrate the notes system.\n\n## Key Points\n\n- Point 1\n- Point 2\n- Point 3',
                    content_type: 'markdown',
                    status: 'approved',
                    version: 1
                });

            if (!noteError) {
                console.log('✅ Created sample note');
            }

            console.log('\n✅ Sample data seeded successfully!\n');

        } catch (error) {
            console.error('❌ Error seeding data:', error);
        }
    }

    // Test API endpoints
    const shouldTest = await question('Would you like to test Phase 2 API endpoints? (y/n): ');

    if (shouldTest.toLowerCase() === 'y') {
        console.log('\n🧪 Testing API endpoints...\n');

        const baseUrl = 'http://localhost:3000';

        const endpoints = [
            '/api/notes',
            '/api/quizzes',
            '/api/study-groups',
            '/api/most-asked-questions',
            '/api/forums',
            '/api/past-papers',
            '/api/analytics/popular-topics'
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${baseUrl}${endpoint}`);
                if (response.ok) {
                    console.log(`✅ ${endpoint} - OK`);
                } else {
                    console.log(`⚠️  ${endpoint} - ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ ${endpoint} - Not reachable (is the dev server running?)`);
            }
        }

        console.log('\n📝 Note: Make sure your Next.js dev server is running (npm run dev)');
    }

    console.log('\n✅ Phase 2 setup complete!\n');
    console.log('📖 Next steps:');
    console.log('  1. Start your dev server: npm run dev');
    console.log('  2. Check out the new API endpoints in PHASE2_IMPLEMENTATION.md');
    console.log('  3. Build UI pages to use the new components');
    console.log('  4. Add authentication to enable user-specific features\n');

    rl.close();
}

main().catch(console.error);
