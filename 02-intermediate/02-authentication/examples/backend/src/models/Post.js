/**
 * models/Post.js — A protected resource tied to a user
 */

import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    content: {
      type:      String,
      required:  [true, 'Content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    authorId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
)

export const Post = mongoose.model('Post', PostSchema)
