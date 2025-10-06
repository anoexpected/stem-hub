/**
 * Database Setup Script
 * Runs the schema.sql file against your Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('Please ensure .env has:');
    console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
    console.log('🚀 Starting database setup...\n');

    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');

    if (!fs.existsSync(schemaPath)) {
        console.error('❌ schema.sql file not found at:', schemaPath);
        process.exit(1);
    }

    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('📄 Executing schema.sql...');

    // Execute the schema (note: this is a simplified version)
    // For complex schemas, you may need to split and execute statements separately
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSql }).single();

    if (error) {
        console.error('❌ Error executing schema:', error.message);
        console.log('\n📋 Please manually run the schema.sql file:');
        console.log('1. Go to https://app.supabase.com');
        console.log('2. Open SQL Editor');
        console.log('3. Copy contents of supabase/schema.sql');
        console.log('4. Run the script\n');
        process.exit(1);
    }

    console.log('✅ Database schema created successfully!\n');

    // Verify tables were created
    console.log('🔍 Verifying tables...');

    const tables = [
        'exam_boards',
        'subjects',
        'topics',
        'users',
        'questions',
        'user_progress',
        'practice_sessions'
    ];

    for (const table of tables) {
        const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`❌ Table ${table}: Not found or error`);
        } else {
            console.log(`✅ Table ${table}: ${count || 0} rows`);
        }
    }

    console.log('\n🎉 Database setup complete!\n');
    console.log('Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000\n');
}

setupDatabase().catch(console.error);
