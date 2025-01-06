import { getAuth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/db'
import { meals } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return new NextResponse('ID parameter is missing', { status: 400 })
    }

    await db
      .delete(meals)
      .where(and(eq(meals.id, id), eq(meals.userId, userId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/food-logs:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { mealName, mealType, calories, notes } = body

    const { id } = await params

    if (!id) {
      return new NextResponse('ID parameter is missing', { status: 400 })
    }

    await db
      .update(meals)
      .set({ mealName, mealType, calories, notes })
      .where(eq(meals.id, id))

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Error updating food log:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
