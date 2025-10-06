import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Clear invalid auth session and cookies
 * Call this when you get refresh_token_not_found errors
 */
export async function clearInvalidSession() {
    const supabase = createClientComponentClient();

    try {
        // Sign out to clear invalid tokens
        await supabase.auth.signOut();
    } catch (error) {
        // Ignore errors during signout
        console.log('Cleared invalid session');
    }
}

/**
 * Get user with error handling
 * Returns null if session is invalid instead of throwing
 */
export async function getSafeUser() {
    const supabase = createClientComponentClient();

    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        // If refresh token error, clear session
        if (error && error.message.includes('refresh_token_not_found')) {
            await clearInvalidSession();
            return null;
        }

        return user;
    } catch (error) {
        console.error('Auth error:', error);
        await clearInvalidSession();
        return null;
    }
}

/**
 * Get session with error handling
 * Returns null if session is invalid instead of throwing
 */
export async function getSafeSession() {
    const supabase = createClientComponentClient();

    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        // If refresh token error, clear session
        if (error && error.message.includes('refresh_token_not_found')) {
            await clearInvalidSession();
            return null;
        }

        return session;
    } catch (error) {
        console.error('Auth error:', error);
        await clearInvalidSession();
        return null;
    }
}

/**
 * Check if user is authenticated
 * Safe version that handles errors
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getSafeUser();
    return user !== null;
}
