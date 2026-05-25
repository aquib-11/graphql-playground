/**
 * middleware/auth.middleware.js
 *
 * Responsible for one thing only:
 * Extract the JWT from the request → verify it → attach the user to context.
 *
 * This keeps server.js clean and makes the auth logic testable in isolation.
 *
 * Industry pattern:
 *   server.js  →  calls buildContext(req)
 *   buildContext  →  decodes token, fetches user, returns { user }
 *   resolvers  →  read context.user (never touch headers directly)
 */

import { verifyToken } from '../utils/jwt.js'
import { User }        from '../models/User.js'

/**
 * buildContext — called on every incoming GraphQL request.
 *
 * Returns { user: UserDocument | null }
 *
 * user is null when:
 *   - No Authorization header sent
 *   - Token is malformed
 *   - Token is expired
 *   - User no longer exists in DB (deleted after token was issued)
 */
export async function buildContext(req) {
  try {
    const authHeader = req.headers.authorization || ''

    // Expect format: "Bearer <token>"
    if (!authHeader.startsWith('Bearer ')) {
      return { user: null }
    }

    const token = authHeader.slice(7).trim() // remove "Bearer "
    if (!token) return { user: null }

    // Verify signature and expiry
    const decoded = verifyToken(token)
    if (!decoded?.id) return { user: null }

    // Fetch fresh user from DB on every request
    // This ensures:
    //   - Role changes take effect immediately
    //   - Deleted users can no longer access the API
    //   - Password changes can invalidate sessions (add iat check for this)
    const user = await User.findById(decoded.id).select('-password').lean()
    if (!user) return { user: null }

    return { user }
  } catch {
    // Never crash the server due to a bad token
    return { user: null }
  }
}
