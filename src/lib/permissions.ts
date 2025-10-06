import { UserRole } from '@/middleware/requireRole';

/**
 * Permission definitions for different roles
 */
export const permissions = {
  // Content Management
  createContent: ['contributor', 'admin'] as UserRole[],
  editOwnContent: ['contributor', 'admin'] as UserRole[],
  editAnyContent: ['admin'] as UserRole[],
  deleteOwnContent: ['contributor', 'admin'] as UserRole[],
  deleteAnyContent: ['admin'] as UserRole[],
  
  // Review System
  reviewContent: ['admin'] as UserRole[],
  approveContent: ['admin'] as UserRole[],
  rejectContent: ['admin'] as UserRole[],
  
  // User Management
  viewUsers: ['admin'] as UserRole[],
  editUsers: ['admin'] as UserRole[],
  deleteUsers: ['admin'] as UserRole[],
  approveContributors: ['admin'] as UserRole[],
  
  // Curriculum Management
  manageCurriculum: ['admin'] as UserRole[],
  manageExamBoards: ['admin'] as UserRole[],
  manageSubjects: ['admin'] as UserRole[],
  manageTopics: ['admin'] as UserRole[],
  
  // Analytics
  viewAnalytics: ['admin'] as UserRole[],
  viewOwnStats: ['student', 'contributor', 'admin'] as UserRole[],
  
  // Study Features
  accessNotes: ['student', 'contributor', 'admin'] as UserRole[],
  accessQuizzes: ['student', 'contributor', 'admin'] as UserRole[],
  accessPastPapers: ['student', 'contributor', 'admin'] as UserRole[],
  joinStudyGroups: ['student', 'contributor', 'admin'] as UserRole[],
} as const;

/**
 * Check if a role has a specific permission
 * 
 * @param role - User role to check
 * @param permission - Permission to check
 * @returns True if role has permission
 */
export function hasPermission(
  role: UserRole,
  permission: keyof typeof permissions
): boolean {
  return permissions[permission].includes(role);
}

/**
 * Check if user can edit content
 * 
 * @param userRole - User's role
 * @param contentOwnerId - ID of content owner
 * @param userId - ID of current user
 * @returns True if user can edit
 */
export function canEditContent(
  userRole: UserRole,
  contentOwnerId: string,
  userId: string
): boolean {
  // Admin can edit any content
  if (userRole === 'admin') {
    return true;
  }
  
  // Contributors can edit their own content
  if (userRole === 'contributor' && contentOwnerId === userId) {
    return true;
  }
  
  return false;
}

/**
 * Check if user can delete content
 * 
 * @param userRole - User's role
 * @param contentOwnerId - ID of content owner
 * @param userId - ID of current user
 * @returns True if user can delete
 */
export function canDeleteContent(
  userRole: UserRole,
  contentOwnerId: string,
  userId: string
): boolean {
  // Admin can delete any content
  if (userRole === 'admin') {
    return true;
  }
  
  // Contributors can delete their own content
  if (userRole === 'contributor' && contentOwnerId === userId) {
    return true;
  }
  
  return false;
}

/**
 * Get allowed actions for a user on specific content
 * 
 * @param userRole - User's role
 * @param contentOwnerId - ID of content owner
 * @param userId - ID of current user
 * @returns Object with allowed actions
 */
export function getContentActions(
  userRole: UserRole,
  contentOwnerId: string,
  userId: string
) {
  return {
    canView: true, // Everyone can view approved content
    canEdit: canEditContent(userRole, contentOwnerId, userId),
    canDelete: canDeleteContent(userRole, contentOwnerId, userId),
    canReview: userRole === 'admin',
    canApprove: userRole === 'admin',
    canReject: userRole === 'admin',
  };
}

/**
 * Role display names
 */
export const roleDisplayNames: Record<UserRole, string> = {
  student: 'Student',
  contributor: 'Contributor',
  admin: 'Administrator',
};

/**
 * Role descriptions
 */
export const roleDescriptions: Record<UserRole, string> = {
  student: 'Access notes, quizzes, and past papers',
  contributor: 'Create and share educational content',
  admin: 'Manage platform, review content, and oversee users',
};

/**
 * Role badges (for UI display)
 */
export const roleBadges: Record<UserRole, { color: string; icon: string }> = {
  student: { color: 'bg-blue-100 text-blue-800', icon: '📚' },
  contributor: { color: 'bg-green-100 text-green-800', icon: '✍️' },
  admin: { color: 'bg-purple-100 text-purple-800', icon: '👑' },
};
