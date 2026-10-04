/**
 * Reset a local user's password against the local dev D1.
 *
 * Usage: pnpm tsx scripts/reset-password.ts <email> <newPassword>
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const [email, newPassword] = process.argv.slice(2)
  if (!email || !newPassword) {
    console.error('Usage: pnpm tsx scripts/reset-password.ts <email> <newPassword>')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (!docs.length) {
    console.error(`No user found with email ${email}`)
    process.exit(1)
  }

  await payload.update({
    collection: 'users',
    id: docs[0].id,
    data: { password: newPassword },
  })

  console.log(`Password updated for ${email}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
