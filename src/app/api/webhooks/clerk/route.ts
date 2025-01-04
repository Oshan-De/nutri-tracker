import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

async function validateRequest(request: Request) {
  const CLERK_SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET

  if (!CLERK_SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local',
    )
  }

  const wh = new Webhook(CLERK_SIGNING_SECRET)

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const payload = await request.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  return evt
}

export async function POST(req: Request) {
  const evt = await validateRequest(req)

  if (!evt || typeof evt !== 'object' || !('type' in evt)) {
    return evt
  }

  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, email_addresses, created_at } = evt.data

    const primaryEmail = email_addresses?.find(
      (email) => email.id === evt.data.primary_email_address_id,
    )?.email_address

    if (eventType === 'user.created') {
      await db.insert(users).values({
        id,
        firstName: first_name || null,
        lastName: last_name || null,
        email: primaryEmail || null,
        createdAt: created_at ? new Date(created_at) : new Date(),
      })
    } else {
      await db
        .update(users)
        .set({
          firstName: first_name || null,
          lastName: last_name || null,
          email: primaryEmail || null,
        })
        .where(eq(users.id, id))
    }
  }

  return new Response('', { status: 200 })
}
