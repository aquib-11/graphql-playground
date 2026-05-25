/**
 * config/db.js — MongoDB connection
 */

import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(` MongoDB → ${conn.connection.host}`)
  } catch (err) {
    console.error('MongoDB failed:', err.message)
    process.exit(1)
  }
}
