/**
 * resolvers/index.js
 *
 * Both pagination strategies live here.
 * The actual pagination logic is in utils/pagination.js — resolvers stay clean.
 */

import { GraphQLError }                       from 'graphql'
import { Post }                               from '../models/Post.js'
import { offsetPaginate, cursorPaginate }     from '../utils/pagination.js'

export const resolvers = {
  Query: {

    // ── Strategy 1: Offset Pagination ─────────────────────────────────────────
    posts: async (_, args) => {
      const { limit = 10, offset = 0, category } = args
      const filter = category ? { category } : {}

      const result = await offsetPaginate(Post, filter, { limit, offset })

      return {
        nodes: result.nodes,
        page: {
          total:   result.total,
          hasMore: result.hasMore,
          hasPrev: result.hasPrev,
          limit:   Math.min(limit, 100),
          offset,
        },
      }
    },

    // ── Strategy 2: Cursor Pagination ─────────────────────────────────────────
    postsFeed: async (_, args) => {
      const { first = 10, after, category } = args
      const filter = category ? { category } : {}

      return await cursorPaginate(Post, filter, { first, after })
    },

    // ── Single post ────────────────────────────────────────────────────────────
    post: async (_, { id }) => {
      const post = await Post.findById(id).lean()
      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }
      return post
    },
  },
}
