/**
 * models/Post.js
 *
 * We index createdAt because both pagination strategies sort by it.
 * Indexes make queries fast even on large collections.
 */

import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true, trim: true },
    content:  { type: String, required: true },
    author:   { type: String, required: true },
    category: {
      type: String,
      enum: ['TECH', 'SCIENCE', 'HISTORY', 'FICTION', 'BUSINESS'],
      default: 'TECH',
    },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Index for fast sorting and cursor-based queries
PostSchema.index({ createdAt: -1 })

export const Post = mongoose.model('Post', PostSchema)
