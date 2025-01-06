import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const result = await db
      .select({ dailyCalorieGoal: users.dailyCalorieGoal })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!result.length) {
      return new NextResponse('Not found', { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error fetching calorie goal:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { dailyCalorieGoal } = body

    await db.update(users).set({ dailyCalorieGoal }).where(eq(users.id, userId))

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Error updating settings:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
