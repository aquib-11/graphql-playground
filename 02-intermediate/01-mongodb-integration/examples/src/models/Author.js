/**
 * models/Author.js — Mongoose Author model
 *
 * Defines the shape of an Author document in MongoDB.
 * MongoDB will create an "authors" collection automatically.
 */

import mongoose from 'mongoose'

const AuthorSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Author name is required'],
      trim:     true,
      unique:   true,   // no two authors with the same name
    },
    bio: {
      type:    String,
      trim:    true,
      default: null,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,

    // Creates a virtual `id` field (string) that mirrors `_id` (ObjectId)
    // This lets GraphQL resolvers return `author.id` instead of `author._id`
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
)

export const Author = mongoose.model('Author', AuthorSchema)
