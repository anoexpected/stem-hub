import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check if requester is admin
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        console.log('[Invite API] Auth check:', {
            hasUser: !!user,
            userId: user?.id,
            email: user?.email,
            authError: authError?.message
        });

        if (authError || !user) {
            console.error('[Invite API] Unauthorized - No user session:', authError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

        console.log('[Invite API] User data check:', {
            userData,
            userError: userError?.message,
            userRole: userData?.role
        });

        if (userError) {
            console.error('[Invite API] Error fetching user role:', userError);
            return NextResponse.json({ error: `Database error: ${userError.message}` }, { status: 500 });
        }

        if (userData?.role !== 'admin') {
            console.error('[Invite API] Forbidden - User is not admin:', userData?.role);
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        console.log('[Invite API] ✓ Admin verified, proceeding with invitation');

        // Get request data
        const { email, full_name, role } = await request.json();

        // Validate input
        if (!email || !full_name || !role) {
            return NextResponse.json({ error: 'Email, full name, and role are required' }, { status: 400 });
        }

        if (!['admin', 'contributor'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role. Must be admin or contributor' }, { status: 400 });
        }

        // Create the user using Supabase Admin API with service role key
        // This bypasses RLS policies
        const supabaseAdmin = createServiceRoleClient();

        // Check if user already exists in our database
        const { data: existingUserData } = await supabaseAdmin
            .from('users')
            .select('id, role, full_name, email')
            .eq('email', email)
            .single();

        let authUserId: string;
        let password: string;
        let isExistingUser = false;
        let previousRole: string | undefined;

        if (existingUserData) {
            // User already exists - this is a role change scenario
            // IMPORTANT: One email = one auth user = one password
            // We update the role, but the user keeps their current password

            if (!existingUserData.id) {
                return NextResponse.json({
                    error: 'User data is incomplete. Please contact support.'
                }, { status: 500 });
            }

            // Check if this is a valid role change
            if (existingUserData.role === role) {
                return NextResponse.json({
                    error: `This email is already registered as ${role}. No changes needed.`
                }, { status: 400 });
            }

            // Inform admin that this is a role change, not a new account
            return NextResponse.json({
                error: `This email is already registered as ${existingUserData.role}. 
                
IMPORTANT: One email address can only have one account in the system.

Options:
1. Use the existing ${existingUserData.role} account - they can access both roles if needed
2. Use a different email address (e.g., ${email.split('@')[0]}+${role}@${email.split('@')[1]})
3. Contact support to change the existing account's role from ${existingUserData.role} to ${role}

Note: Supabase Auth uses one password per email. You cannot have separate passwords for different roles with the same email.`
            }, { status: 400 });

            // ALTERNATIVE: If you want to allow role changes, uncomment below
            // and comment out the return above

            /*
            // Allow role upgrades/changes
            authUserId = existingUserData.id;
            isExistingUser = true;
            previousRole = existingUserData.role;

            // Generate new password for role change
            password = generateSecurePassword();

            // Update the auth user's password
            const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
                authUserId,
                { password }
            );

            if (passwordError) {
                console.error('Error updating password:', passwordError);
                return NextResponse.json({
                    error: `Failed to update password: ${passwordError.message}`
                }, { status: 500 });
            }

            // Update user record with new role
            const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({
                    role,
                    full_name, // Update name in case it changed
                    must_change_password: true,
                    onboarding_completed: true,
                    onboarding_step: 5,
                    updated_at: new Date().toISOString()
                })
                .eq('id', authUserId);

            if (updateError) {
                console.error('Error updating user record:', updateError);
                return NextResponse.json({
                    error: `Failed to update user: ${updateError.message}`
                }, { status: 500 });
            }

            // Handle profile changes based on role change
            if (existingUserData.role === 'contributor' && role === 'admin') {
                // Keep contributor profile, no admin profile needed
                // Admin is just a role, not a separate profile
            } else if (existingUserData.role === 'admin' && role === 'contributor') {
                // Need to create contributor profile if it doesn't exist
                const { data: existingProfile } = await supabaseAdmin
                    .from('contributor_profiles')
                    .select('user_id')
                    .eq('user_id', authUserId)
                    .single();

                if (!existingProfile) {
                    const { error: profileError } = await supabaseAdmin
                        .from('contributor_profiles')
                        .insert({
                            user_id: authUserId,
                            application_status: 'approved'
                        });

                    if (profileError) {
                        console.error('Error creating contributor profile:', profileError);
                    }
                }
            }
            */

        } else {
            // New user - create from scratch
            password = generateSecurePassword();

            // Create auth user
            const { data: newAuthUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    full_name,
                    invited_by: user.id,
                    invited_at: new Date().toISOString()
                }
            });

            if (createError) {
                console.error('Error creating auth user:', createError);
                return NextResponse.json({ error: `Failed to create user: ${createError.message}` }, { status: 500 });
            }

            if (!newAuthUser.user) {
                return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
            }

            authUserId = newAuthUser.user.id;

            // Create user record in users table using service role client (bypasses RLS)
            const { error: insertError } = await supabaseAdmin
                .from('users')
                .insert({
                    id: authUserId,
                    email,
                    full_name,
                    role,
                    onboarding_completed: true, // Invited users skip onboarding
                    onboarding_step: 5,
                    must_change_password: true // Force password change on first login
                });

            if (insertError) {
                console.error('Error creating user record:', insertError);
                // Try to delete the auth user if we failed to create the record
                await supabaseAdmin.auth.admin.deleteUser(authUserId);
                return NextResponse.json({ error: `Failed to create user record: ${insertError.message}` }, { status: 500 });
            }

            // Create appropriate profile based on role using service role client
            if (role === 'contributor') {
                const { error: profileError } = await supabaseAdmin
                    .from('contributor_profiles')
                    .insert({
                        user_id: authUserId,
                        application_status: 'approved' // Auto-approve invited contributors
                    });

                if (profileError) {
                    console.error('Error creating contributor profile:', profileError);
                    // Clean up if profile creation fails
                    await supabaseAdmin.from('users').delete().eq('id', authUserId);
                    await supabaseAdmin.auth.admin.deleteUser(authUserId);
                    return NextResponse.json({ error: `Failed to create contributor profile: ${profileError.message}` }, { status: 500 });
                }
            }
        }

        // Note: Email sending via Supabase is rate-limited on free tier
        // The admin will see credentials on screen and can share them manually
        // This is actually more secure as it ensures proper verification before sharing

        const actionMessage = isExistingUser
            ? `Role updated successfully from ${previousRole || 'unknown'} to ${role}. Share the new credentials securely with ${email}`
            : `User created successfully. Share the credentials securely with ${email}`;

        return NextResponse.json({
            success: true,
            message: actionMessage,
            isRoleChange: isExistingUser,
            user: {
                id: authUserId,
                email,
                full_name,
                role,
                temporary_password: password, // Display this so admin can share manually
                login_url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?intended_role=${role}`
            }
        });

    } catch (error: any) {
        console.error('Error in invite-user API:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

// Generate a secure random password
function generateSecurePassword(): string {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        password += charset[array[i] % charset.length];
    }

    return password;
}
