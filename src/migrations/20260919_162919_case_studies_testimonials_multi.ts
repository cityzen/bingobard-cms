import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`case_studies_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`testimonials_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_rels_order_idx\` ON \`case_studies_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_rels_parent_idx\` ON \`case_studies_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_rels_path_idx\` ON \`case_studies_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_rels_testimonials_id_idx\` ON \`case_studies_rels\` (\`testimonials_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_case_studies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`client\` text NOT NULL,
  	\`event_type\` text NOT NULL,
  	\`audience_size\` numeric NOT NULL,
  	\`use_case\` text NOT NULL,
  	\`headline_result\` text NOT NULL,
  	\`challenge\` text NOT NULL,
  	\`solution\` text NOT NULL,
  	\`how_it_played_out\` text,
  	\`why_it_worked\` text,
  	\`cta_heading\` text,
  	\`cta_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_case_studies\`("id", "title", "client", "event_type", "audience_size", "use_case", "headline_result", "challenge", "solution", "how_it_played_out", "why_it_worked", "cta_heading", "cta_description", "updated_at", "created_at") SELECT "id", "title", "client", "event_type", "audience_size", "use_case", "headline_result", "challenge", "solution", "how_it_played_out", "why_it_worked", "cta_heading", "cta_description", "updated_at", "created_at" FROM \`case_studies\`;`)
  await db.run(sql`DROP TABLE \`case_studies\`;`)
  await db.run(sql`ALTER TABLE \`__new_case_studies\` RENAME TO \`case_studies\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`case_studies_updated_at_idx\` ON \`case_studies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_created_at_idx\` ON \`case_studies\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`case_studies_rels\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`quote_id\` integer REFERENCES testimonials(id);`)
  await db.run(sql`CREATE INDEX \`case_studies_quote_idx\` ON \`case_studies\` (\`quote_id\`);`)
}
