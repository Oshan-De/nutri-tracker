import { drizzle } from 'drizzle-orm/vercel-postgres'
import { sql } from '@vercel/postgres'

// Initialize drizzle with Vercel Postgres
export const db = drizzle(sql)

// Export schema
export * from './schema'
