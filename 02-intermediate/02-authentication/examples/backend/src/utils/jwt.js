/**
 * utils/jwt.js
 *
 * Single responsibility: sign and verify JWT tokens.
 * Nothing else lives here.
 */

import jwt from 'jsonwebtoken'

/**
 * signToken — creates a signed JWT containing the user's ID.
 *
 * We only put the ID in the payload — nothing sensitive.
 * The server fetches fresh user data from DB on every request.
 */
export function signToken(userId) {
  return jwt.sign(
    { id: String(userId) },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

/**
 * verifyToken — verifies the signature and expiry of a token.
 *
 * Returns the decoded payload { id, iat, exp } on success.
 * Returns null on any failure (expired, tampered, invalid).
 * Never throws — caller decides what to do with null.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}
