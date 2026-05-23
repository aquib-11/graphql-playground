/**
 * models/Book.js — Mongoose Book model
 *
 * authorId stores a MongoDB ObjectId that references the Author collection.
 * This is how relationships work in MongoDB — store the ID, look up when needed.
 */

import mongoose from 'mongoose'

const BookSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Book title is required'],
      trim:     true,
    },
    isbn: {
      type:     String,
      required: [true, 'ISBN is required'],
      unique:   true,
      trim:     true,
    },
    genre: {
      type:     String,
      required: [true, 'Genre is required'],
      // Mongoose validates this — only these values are allowed
      enum:     ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'TECHNOLOGY'],
    },
    year: {
      type:     Number,
      required: [true, 'Year is required'],
      min:      1000,
      max:      2099,
    },
    authorId: {
      // ObjectId tells Mongoose this field is a reference to another document
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'Author',   // refers to the Author model
      required: [true, 'Author is required'],
    },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
)

export const Book = mongoose.model('Book', BookSchema)
