/**
 * config/db.js — MongoDB connection
 *
 * Connects once when the server starts.
 * If connection fails, the process exits — no point running
 * an API server with no database.
 */

import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  }
}
