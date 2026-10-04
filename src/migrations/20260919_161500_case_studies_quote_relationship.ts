import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`quote_id\` integer REFERENCES testimonials(id);`)
  await db.run(sql`CREATE INDEX \`case_studies_quote_idx\` ON \`case_studies\` (\`quote_id\`);`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`quote\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`quote_author\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`quote_role\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`case_studies_quote_idx\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`quote_id\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`quote\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`quote_author\` text;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`quote_role\` text;`)
}
