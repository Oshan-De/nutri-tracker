import { getAuth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/db'
import { meals } from '@/db/schema'
import { eq, inArray, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const logs = await db
      .select()
      .from(meals)
      .where(eq(meals.userId, userId))
      .orderBy(meals.logDate)

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error in GET /api/meal:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const [insertedMeal] = await db
      .insert(meals)
      .values({
        ...body,
        userId,
      })
      .returning()

    return NextResponse.json(insertedMeal)
  } catch (error) {
    console.error('Error in POST /api/meal:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req)

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const mealIds: string[] = body.ids

    if (!mealIds || mealIds.length === 0) {
      return new NextResponse('No meal IDs provided', { status: 400 })
    }

    await db
      .delete(meals)
      .where(and(eq(meals.userId, userId), inArray(meals.id, mealIds)))

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/meal:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
