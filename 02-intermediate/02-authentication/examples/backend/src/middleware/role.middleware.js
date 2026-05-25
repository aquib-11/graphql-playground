/**
 * middleware/role.middleware.js
 *
 * Reusable guards for protecting resolvers.
 *
 * Industry pattern — guards follow this contract:
 *   - If the check passes  → return the user (so resolvers can use it)
 *   - If the check fails   → throw a GraphQLError with the right code
 *
 * Usage in resolvers:
 *
 *   // Any logged-in user
 *   const user = requireAuth(context)
 *
 *   // Only admins
 *   const user = requireRole('ADMIN', context)
 *
 *   // Check ownership (e.g. can only edit own post)
 *   requireOwnerOrAdmin(post.authorId, context)
 */

import { GraphQLError } from 'graphql'

// ─── requireAuth ──────────────────────────────────────────────────────────────
// Ensures the request has a valid authenticated user.
// Use this on any resolver that requires login.

export function requireAuth(context) {
  if (!context.user) {
    throw new GraphQLError('Authentication required. Please log in.', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    })
  }
  return context.user
}

// ─── requireRole ──────────────────────────────────────────────────────────────
// Ensures the user is authenticated AND has the required role.
// Accepts a single role string or an array of allowed roles.
//
// requireRole('ADMIN', context)
// requireRole(['ADMIN', 'MODERATOR'], context)

export function requireRole(roles, context) {
  const user         = requireAuth(context)
  const allowedRoles = Array.isArray(roles) ? roles : [roles]

  if (!allowedRoles.includes(user.role)) {
    throw new GraphQLError(
      `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
      {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      }
    )
  }

  return user
}

// ─── requireOwnerOrAdmin ──────────────────────────────────────────────────────
// Ensures the current user is either the resource owner OR an admin.
// Use this for operations like "delete your own post" or "edit your own profile".
//
// requireOwnerOrAdmin(post.authorId, context)

export function requireOwnerOrAdmin(ownerId, context) {
  const user = requireAuth(context)

  const isOwner = ownerId.toString() === user._id.toString()
  const isAdmin = user.role === 'ADMIN'

  if (!isOwner && !isAdmin) {
    throw new GraphQLError('Access denied. You can only modify your own resources.', {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 },
      },
    })
  }

  return user
}
