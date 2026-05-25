/**
 * models/User.js
 *
 * Industry practices applied:
 *  - Password hashed automatically via pre-save hook (never stored plain)
 *  - comparePassword instance method for clean login verification
 *  - email always lowercased and trimmed before saving
 *  - password field excluded from lean queries by default via select: false
 *  - timestamps added automatically
 */

import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false, // never returned in queries unless explicitly requested
    },
    role: {
      type:    String,
      enum:    ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
)

// ── Pre-save hook ─────────────────────────────────────────────────────────────
// Only runs when password is new or changed — not on every save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt    = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ── Instance method ───────────────────────────────────────────────────────────
// Called in login resolver: const isMatch = await user.comparePassword(plain)
UserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password)
}

export const User = mongoose.model('User', UserSchema)
