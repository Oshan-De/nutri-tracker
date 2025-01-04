import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { foodLogs } from '@/db/schema'
import { eq } from 'drizzle-orm'

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
    const { foodName, mealType, calories, notes } = body

    const { id } = await params

    if (!id) {
      return new NextResponse('ID parameter is missing', { status: 400 })
    }

    await db
      .update(foodLogs)
      .set({ foodName, mealType, calories, notes })
      .where(eq(foodLogs.id, Number(id)))

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Error updating food log:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
