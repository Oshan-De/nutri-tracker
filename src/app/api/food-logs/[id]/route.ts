import { getAuth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from 'next/server'
import { db } from '@/db'
import { foodLogs } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { userId } = getAuth(req)
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await context.params

    if (!id) {
      return new NextResponse('ID parameter is missing', { status: 400 })
    }

    await db
      .delete(foodLogs)
      .where(and(eq(foodLogs.id, parseInt(id)), eq(foodLogs.userId, userId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/food-logs:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
