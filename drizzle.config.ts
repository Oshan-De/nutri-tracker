import type { Config } from 'drizzle-kit'
import dotenv from 'dotenv'

dotenv.config({
  path: '.env.local',
})

export default {
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config
