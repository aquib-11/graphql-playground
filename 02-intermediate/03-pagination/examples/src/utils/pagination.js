/**
 * utils/pagination.js — Shared pagination helpers
 *
 * offsetPaginate  — runs a paginated query with skip/limit
 * cursorPaginate  — runs a paginated query using cursor (_id based)
 *
 * Both return a consistent shape that maps cleanly to GraphQL types.
 */

import { encodeCursor, decodeCursor } from './cursor.js'

/**
 * offsetPaginate
 *
 * @param {mongoose.Model} Model
 * @param {object}  filter  — MongoDB filter (e.g. { category: 'TECH' })
 * @param {object}  options — { limit, offset, sort }
 * @returns { nodes, total, hasMore, hasPrev }
 */
export async function offsetPaginate(Model, filter = {}, options = {}) {
  const limit  = Math.min(options.limit  || 10, 100) // cap at 100 for safety
  const offset = Math.max(options.offset || 0,  0)   // never negative
  const sort   = options.sort || { createdAt: -1 }

  const [nodes, total] = await Promise.all([
    Model.find(filter).sort(sort).skip(offset).limit(limit).lean(),
    Model.countDocuments(filter),
  ])

  return {
    nodes,
    total,
    hasMore: offset + nodes.length < total,
    hasPrev: offset > 0,
  }
}

/**
 * cursorPaginate
 *
 * @param {mongoose.Model} Model
 * @param {object}  filter  — MongoDB filter
 * @param {object}  options — { first, after }
 *   first: how many items to return
 *   after: base64 cursor of the last item seen
 * @returns { edges, pageInfo, totalCount }
 */
export async function cursorPaginate(Model, filter = {}, options = {}) {
  const first = Math.min(options.first || 10, 100)

  // Build the cursor filter
  // If `after` cursor provided → only return items AFTER that document
  const cursorFilter = { ...filter }
  if (options.after) {
    const afterId = decodeCursor(options.after)
    // _id less than the cursor's _id (since we sort newest first)
    cursorFilter._id = { $lt: afterId }
  }

  // Fetch one extra item to know if there's a next page
  const items = await Model
    .find(cursorFilter)
    .sort({ _id: -1 })        // newest first — consistent with _id ordering
    .limit(first + 1)         // +1 to check hasNextPage
    .lean()

  const hasNextPage = items.length > first
  const nodes       = hasNextPage ? items.slice(0, first) : items

  // Total count ignores cursor — always the full filtered set
  const totalCount = await Model.countDocuments(filter)

  // Build edges — each item gets its cursor
  const edges = nodes.map(node => ({
    node,
    cursor: encodeCursor(node._id),
  }))

  return {
    edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage: !!options.after, // if we used a cursor, there's a previous page
      startCursor: edges[0]?.cursor     || null,
      endCursor:   edges.at(-1)?.cursor || null,
    },
    totalCount,
  }
}
