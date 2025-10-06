import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type UserRole = 'student' | 'contributor' | 'admin';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Role hierarchy for permission checking
 * Higher number = more permissions
 */
const roleHierarchy: Record<UserRole, number> = {
  student: 1,
  contributor: 2,
  admin: 3,
};

/**
 * Require a specific role to access a resource
 * Throws error if user is not authenticated or doesn't have required role
 * 
 * @param role - Minimum role required
 * @returns User data with role information
 * @throws Error if unauthorized or forbidden
 */
export async function requireRole(role: UserRole): Promise<AuthenticatedUser> {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // No-op for server components
        },
        remove(name: string, options: any) {
          // No-op for server components
        },
      },
    }
  );

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Get user role from database
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userError || !userData) {
    throw new Error('User not found');
  }

  // Check if user has required role
  const userRoleLevel = roleHierarchy[userData.role as UserRole];
  const requiredRoleLevel = roleHierarchy[role];

  if (userRoleLevel < requiredRoleLevel) {
    throw new Error('Forbidden');
  }

  return {
    id: user.id,
    email: user.email!,
    role: userData.role as UserRole,
  };
}

/**
 * Check if user has a specific role without throwing error
 * 
 * @param role - Role to check
 * @returns User data if authorized, null otherwise
 */
export async function checkRole(role: UserRole): Promise<AuthenticatedUser | null> {
  try {
    return await requireRole(role);
  } catch {
    return null;
  }
}

/**
 * Get current authenticated user without role check
 * 
 * @returns User data or null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userData) {
    return null;
  }

  return {
    id: user.id,
    email: user.email!,
    role: userData.role as UserRole,
  };
}
