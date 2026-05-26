/**
 * utils/cursor.js — Cursor encode/decode
 *
 * A cursor is an opaque string the client uses to fetch the next page.
 * We base64-encode the MongoDB _id so it's URL-safe and not exposed directly.
 *
 * Why base64?
 *   - Opaque to the client (they shouldn't parse it)
 *   - URL safe
 *   - Easy to encode/decode on both sides
 */

/**
 * encodeCursor — turn a MongoDB _id into a base64 cursor string
 *
 * Example:
 *   encodeCursor('64abc123def456') → 'NjRhYmMxMjNkZWY0NTY='
 */
export function encodeCursor(id) {
  return Buffer.from(String(id)).toString('base64')
}

/**
 * decodeCursor — turn a base64 cursor back into a MongoDB _id string
 *
 * Example:
 *   decodeCursor('NjRhYmMxMjNkZWY0NTY=') → '64abc123def456'
 */
export function decodeCursor(cursor) {
  return Buffer.from(cursor, 'base64').toString('utf8')
}
