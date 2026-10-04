/**
 * Seeds local dev D1 with real content pulled from the live production
 * database (see scripts/seed-data/*.json — extracted via
 * `wrangler d1 execute D1 --remote`, read-only, production untouched).
 *
 * Idempotent: safe to re-run after a `pnpm run dev:reset-db`.
 *
 * Note: production's `testimonials.event_id` doesn't map to anything in the
 * current schema (Testimonials now links to `collections`, not `events`,
 * and no Collections/Clients existed in production) — that link is dropped.
 * The actual content (names, titles, quotes) carries over; re-link each
 * testimonial to a collection by hand once you've entered your real
 * clients/collections.
 *
 * Also note: production's verticals are still in the pre-`simplify_verticals`
 * shape (relationship columns to a `feature_cards` table that no longer
 * exists). Only the top-level copy is seeded — the `benefits.benefitCards` and
 * `types.useCards` arrays come up empty and get filled in by hand.
 *
 * Usage: pnpm tsx scripts/seed-from-production.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import eventsData from './seed-data/events.json'
import testimonialsData from './seed-data/testimonials.json'
import verticalsData from './seed-data/verticals.json'

async function seed() {
  const payload = await getPayload({ config })

  for (const e of eventsData) {
    const existing = await payload.find({
      collection: 'events',
      where: { title: { equals: e.title } },
      limit: 1,
    })
    if (existing.docs.length) {
      console.log('Event already exists:', existing.docs[0].id, e.title)
      continue
    }
    const doc = await payload.create({
      collection: 'events',
      data: {
        title: e.title,
        location: e.location,
        startDate: e.start_date,
        endDate: e.end_date,
      },
    })
    console.log('Created event:', doc.id, doc.title)
  }

  for (const t of testimonialsData) {
    const testimonialRichText = JSON.parse(t.testimonial)

    const existing = await payload.find({
      collection: 'testimonials',
      where: { playerName: { equals: t.player_name } },
      limit: 10,
    })
    const alreadySeeded = existing.docs.some(
      (d) => JSON.stringify(d.testimonial) === JSON.stringify(testimonialRichText),
    )
    if (alreadySeeded) {
      console.log('Testimonial already exists:', t.player_name)
      continue
    }

    const doc = await payload.create({
      collection: 'testimonials',
      data: {
        playerName: t.player_name,
        playerTitle: t.player_title || undefined,
        testimonial: testimonialRichText,
      },
    })
    console.log('Created testimonial:', doc.id, doc.playerName)
  }

  for (const v of verticalsData) {
    const existing = await payload.find({
      collection: 'verticals',
      where: { title: { equals: v.title } },
      limit: 1,
    })
    if (existing.docs.length) {
      console.log('Vertical already exists:', existing.docs[0].id, v.title)
      continue
    }
    const doc = await payload.create({
      collection: 'verticals',
      data: {
        title: v.title,
        heroTitle: v.hero_title,
        heroDescription: v.hero_description,
        benefits: { title: v.benefits_title },
        types: { title: v.types_title },
      },
    })
    console.log('Created vertical:', doc.id, doc.title)
  }

  console.log('Done.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
