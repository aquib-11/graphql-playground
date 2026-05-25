/**
 * resolvers/index.js
 *
 * Clean resolver pattern — every resolver:
 *   1. Calls the appropriate middleware guard first
 *   2. Performs the DB operation
 *   3. Returns the result
 *
 * No auth logic lives in resolvers — all of that is in middleware.
 */

import { GraphQLError }                              from 'graphql'
import { User }                                      from '../models/User.js'
import { Post }                                      from '../models/Post.js'
import { signToken }                                 from '../utils/jwt.js'
import { requireAuth, requireRole, requireOwnerOrAdmin } from '../middleware/role.middleware.js'

export const resolvers = {

  // ── Query ────────────────────────────────────────────────────────────────────
  Query: {
    // Public
    hello: () => 'GraphQL Auth API is running 🔐',

    // Protected — any authenticated user
    me: async (_, __, context) => {
      const user = requireAuth(context)
      return User.findById(user._id).lean()
    },

    // Protected — any authenticated user
    posts: async (_, __, context) => {
      requireAuth(context)
      return Post.find().sort({ createdAt: -1 }).lean()
    },

    post: async (_, { id }, context) => {
      requireAuth(context)
      const post = await Post.findById(id).lean()
      if (!post) {
        throw new GraphQLError('Post not found', {
          extensions: { code: 'NOT_FOUND' },
        })
      }
      return post
    },

    // Admin only
    users: async (_, __, context) => {
      requireRole('ADMIN', context)
      return User.find().sort({ createdAt: -1 }).lean()
    },
  },

  // ── Mutation ─────────────────────────────────────────────────────────────────
  Mutation: {

    // ── Public mutations ───────────────────────────────────────────────────────
    register: async (_, { input }) => {
      const { name, email, password } = input

      const exists = await User.findOne({ email })
      if (exists) {
        throw new GraphQLError('An account with this email already exists', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      // Password hashed automatically by pre-save hook in User model
      const user  = await User.create({ name, email, password })
      const token = signToken(user._id)

      return { token, user }
    },

    login: async (_, { email, password }) => {
      // select('+password') because password has select: false in schema
      const user = await User.findOne({ email }).select('+password')

      // Generic message — never reveal whether email exists
      const invalid = new GraphQLError('Invalid email or password', {
        extensions: { code: 'UNAUTHENTICATED' },
      })

      if (!user) throw invalid

      const isMatch = await user.comparePassword(password)
      if (!isMatch) throw invalid

      const token = signToken(user._id)

      // Return user without password
      const safeUser = await User.findById(user._id).lean()
      return { token, user: safeUser }
    },

    // ── Protected mutations ────────────────────────────────────────────────────
    createPost: async (_, { input }, context) => {
      const user = requireAuth(context)
      return Post.create({ ...input, authorId: user._id })
    },

    updatePost: async (_, { id, input }, context) => {
      requireAuth(context)

      const post = await Post.findById(id)
      if (!post) {
        throw new GraphQLError('Post not found', { extensions: { code: 'NOT_FOUND' } })
      }

      // Only owner or admin can update
      requireOwnerOrAdmin(post.authorId, context)

      return Post.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      ).lean()
    },

    deletePost: async (_, { id }, context) => {
      requireAuth(context)

      const post = await Post.findById(id)
      if (!post) {
        throw new GraphQLError('Post not found', { extensions: { code: 'NOT_FOUND' } })
      }

      requireOwnerOrAdmin(post.authorId, context)

      await Post.findByIdAndDelete(id)
      return true
    },

    // ── Admin only mutations ───────────────────────────────────────────────────
    deleteUser: async (_, { id }, context) => {
      requireRole('ADMIN', context)

      const user = await User.findByIdAndDelete(id)
      if (!user) {
        throw new GraphQLError('User not found', { extensions: { code: 'NOT_FOUND' } })
      }

      // Cascade — delete all posts by this user
      await Post.deleteMany({ authorId: id })
      return true
    },
  },

  // ── Field resolvers ───────────────────────────────────────────────────────────
  Post: {
    author: async (parent) => User.findById(parent.authorId).lean(),
  },
}
