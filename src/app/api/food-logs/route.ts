import { getAuth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/db'
import { foodLogs } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const logs = await db
      .select()
      .from(foodLogs)
      .where(eq(foodLogs.userId, userId))
      .orderBy(foodLogs.logDate)

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error in GET /api/food-logs:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  console.log(req)
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const log = await db.insert(foodLogs).values({
      ...body,
      userId,
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error('Error in POST /api/food-logs:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
