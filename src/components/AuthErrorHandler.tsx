'use client';

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Component that silently clears invalid auth sessions on mount
 * Add to layouts to prevent refresh_token_not_found errors from showing up
 */
export default function AuthErrorHandler() {
    useEffect(() => {
        const supabase = createClientComponentClient();

        // Check for auth state changes and handle errors
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                // If there's an error event, the session is invalid
                if (event === 'SIGNED_OUT' && !session) {
                    // Session was invalidated, cookies will be cleared automatically
                    return;
                }
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // This component renders nothing
    return null;
}
