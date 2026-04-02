import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { and, eq, gt, sql } from 'drizzle-orm'

import { replicate } from '@/lib/replicate'
import { verifyAuth } from '@hono/auth-js'
import { db } from '@/db/drizzle'
import { subscriptions, users } from '@/db/schema'
import { chechIsActive } from '@/features/subscriptions/lib'

const NO_CREDITS_ERROR =
  'Your free AI credit is used. Upgrade to continue using AI features.'

const hasActiveSubscription = async (userId: string) => {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))

  return chechIsActive(subscription)
}

const consumeTrialCredit = async (userId: string) => {
  const [updatedUser] = await db
    .update(users)
    .set({
      aiCredits: sql`${users.aiCredits} - 1`,
    })
    .where(and(eq(users.id, userId), gt(users.aiCredits, 0)))
    .returning({ id: users.id })

  return Boolean(updatedUser)
}

const ensureAiAccess = async (userId: string) => {
  const active = await hasActiveSubscription(userId)

  if (active) {
    return true
  }

  return consumeTrialCredit(userId)
}

const app = new Hono()
  .get('/usage', verifyAuth(), async (c) => {
    const auth = c.get('authUser')

    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const [user] = await db
      .select({ aiCredits: users.aiCredits })
      .from(users)
      .where(eq(users.id, auth.token.id))

    const active = await hasActiveSubscription(auth.token.id)
    const credits = user?.aiCredits ?? 0

    return c.json({
      data: {
        active,
        credits,
        hasAccess: active || credits > 0,
      },
    })
  })
  .post(
    '/remove-bg',
    verifyAuth(),
    zValidator('json', z.object({ image: z.string() })),
    async (c) => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const hasAccess = await ensureAiAccess(auth.token.id)

      if (!hasAccess) {
        return c.json({ error: NO_CREDITS_ERROR }, 402)
      }

      const { image } = c.req.valid('json')

      const input = {
        image: image,
      }

      const output: unknown = await replicate.run(
        'cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
        { input }
      )

      const response = output as string

      return c.json({ data: response })
    }
  )
  .post(
    '/generate-image',
    verifyAuth(),
    zValidator('json', z.object({ prompt: z.string() })),
    async (c) => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const hasAccess = await ensureAiAccess(auth.token.id)

      if (!hasAccess) {
        return c.json({ error: NO_CREDITS_ERROR }, 402)
      }

      const { prompt } = c.req.valid('json')

      const input = {
        cfg: 3.5,
        steps: 28,
        prompt: prompt,
        aspect_ratio: '3:2',
        output_format: 'webp',
        output_quality: 90,
        negative_prompt: '',
        prompt_strength: 0.85,
      }

      const output = await replicate.run('stability-ai/stable-diffusion-3', {
        input,
      })
      console.log(output)
      const res = output as Array<string>

      return c.json({ data: res[0] })
    }
  )

export default app
