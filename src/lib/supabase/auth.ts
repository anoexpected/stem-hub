import { supabase } from './client';
import type { User } from '@supabase/supabase-js';

// Extended user type with metadata
export type AuthUser = User & {
    user_metadata?: {
        full_name?: string;
        avatar_url?: string;
    };
};

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) throw error;

    // Create user profile in users table
    if (data.user) {
        await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName || null,
        });
    }

    return data;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Get the current user session
 */
export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
}

/**
 * Get user role from database
 */
export async function getUserRole(userId: string): Promise<string | null> {
    console.log('Fetching role for user:', userId);
    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user role:', error);
        return null;
    }

    console.log('User role data:', data);
    return data?.role || 'student';
}

/**
 * Get redirect path based on user role
 */
export async function getRoleBasedRedirect(userId: string): Promise<string> {
    const role = await getUserRole(userId);
    console.log('Role for redirect:', role);

    switch (role) {
        case 'admin':
            return '/admin';
        case 'contributor':
            return '/contribute';
        case 'student':
        default:
            return '/select'; // Updated student home page
    }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<{
    full_name: string;
    avatar_url: string;
}>) {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Reset password request
 */
export async function resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) throw error;
    return data;
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (error) throw error;
    return data;
}
