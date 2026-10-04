/**
 * Creates a user in the LOCAL dev D1 (via the wrangler platform proxy).
 *
 * Usage: pnpm tsx scripts/create-admin.ts <email> <password> [name]
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config'

async function main() {
  const [email, password, name] = process.argv.slice(2)
  if (!email || !password) {
    console.error('Usage: pnpm tsx scripts/create-admin.ts <email> <password> [name]')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length) {
    console.log(`User already exists: ${existing.docs[0].id} ${email}`)
    process.exit(0)
  }

  const doc = await payload.create({
    collection: 'users',
    data: { email, password, name: name || email },
  })

  console.log(`Created user: ${doc.id} ${doc.email}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})