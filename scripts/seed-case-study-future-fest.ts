/**
 * Idempotent seed script for the "Future Fest Connect x Bingo Bard" case study
 * and its "In Their Words" testimonial. Runs against the LOCAL dev D1 (via the
 * Cloudflare wrangler proxy), same as any other `payload` CLI invocation in
 * this project — it does not touch production data.
 *
 * Safe to re-run: finds-or-creates the testimonial by player name, and
 * finds-or-creates the case study by title.
 *
 * Usage: pnpm tsx scripts/seed-case-study-future-fest.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      children: [{ type: 'text', text, version: 1 }],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    })),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

async function seed() {
  const payload = await getPayload({ config })

  const title = 'Future Fest Connect x Bingo Bard: Gamifying a Conference and a City'

  const existing = await payload.find({
    collection: 'case-studies',
    where: { title: { equals: title } },
    limit: 1,
  })
  if (existing.docs.length) {
    console.log('Case study already exists:', existing.docs[0].id, existing.docs[0].title)
    process.exit(0)
  }

  let testimonial = (
    await payload.find({
      collection: 'testimonials',
      where: { playerName: { equals: 'Karen Stritzinger' } },
      limit: 1,
    })
  ).docs[0]

  if (!testimonial) {
    testimonial = await payload.create({
      collection: 'testimonials',
      data: {
        playerName: 'Karen Stritzinger',
        playerTitle: 'Attendee',
        testimonial: richText([
          "I love how versatile the concept of Bingo Bard is and how it helps remind me to engage with parts of a conference I might have otherwise missed. Seeing it at local events, it's become something I look forward to each time. It's like a little scavenger hunt, combined with a to-do list that gives me little bursts of dopamine, and it was a fun surprise seeing the rewards people won at the end of the event! If I were an event organizer, I think I would really appreciate being able to use BB to direct the attendees toward lesser known booths or talks, and to be able to see metrics on the most popular areas.",
        ]),
      },
    })
  }

  const doc = await payload.create({
    collection: 'case-studies',
    data: {
      title,
      client: 'Future Fest Connect',
      eventType: 'Conference (inaugural year)',
      audienceSize: 136,
      useCase: 'Attendee activation and sponsor engagement',
      headlineResult: '74% engagement rate across two connected games',
      challenge: richText([
        'As a brand new event, Future Fest Connect wanted a fun way to gamify the experience for attendees right out of the gate, something that would make the very first year feel memorable and give people a reason to engage beyond just attending sessions.',
      ]),
      solution: richText([
        'Bingo Bard built two 24 square games for the event. The first was a conference game with 14 sponsored squares covering sessions, booths, and general conference activities. The second sent players out into Downtown Durham, built in partnership with Downtown Durham Inc, who provided the list of local businesses to feature. Every square in the Downtown Durham game was sponsored, and Coastal Credit Union sponsored the free space in both games.',
        'Both games were distributed through QR code signage at the registration table and introduced on a slide at the start of the event.',
      ]),
      howItPlayedOut: richText([
        'The Downtown Durham game sent players out to explore the area around the venue, with a couple of players specifically mentioning they visited the Durham Food Hall because of the card. Inside the conference, one of the most popular squares was "Love the Venue," which linked out to information on other events at the space. When the venue owner saw that square, he was excited to see his venue getting that extra visibility.',
      ]),
      whyItWorked: richText([
        'Splitting the experience into two games let Future Fest Connect engage attendees inside the venue and out in the surrounding city at the same time. Sponsors and downtown businesses both got real visibility, attendees got a reason to wander further than the conference floor, and a 74% engagement rate is a strong result for a very first year event.',
      ]),
      results: [
        { metric: 'Games', result: '2' },
        { metric: 'Attendees', result: '136' },
        { metric: 'Players', result: '42' },
        { metric: 'Reach', result: '31%' },
        { metric: 'Sponsored squares', result: '38' },
        { metric: 'Squares completed', result: '313' },
        { metric: 'Squares per player', result: '7.45' },
        { metric: 'Bingos', result: '18' },
        { metric: 'Bingo ratio', result: '43%' },
        { metric: 'Total shares', result: '15' },
        { metric: 'Players who shared', result: '13 (31%)' },
        { metric: 'Engagement rate', result: '74%' },
        { metric: 'Avg. engagement time per user', result: '11m 33s' },
      ],
      testimonials: [testimonial.id],
      ctaHeading: 'Ready to Make Your Next Event Unforgettable?',
      ctaDescription:
        'Book a 15-minute demo. See what a custom Bingo Bard game could look like for you.',
    },
  })

  console.log('Created case study:', doc.id, doc.title)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
