import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`case_studies_snapshot\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`case_studies_snapshot_order_idx\` ON \`case_studies_snapshot\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_snapshot_parent_id_idx\` ON \`case_studies_snapshot\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`clients\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`location\` text,
  	\`logo_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`clients_logo_idx\` ON \`clients\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`clients_updated_at_idx\` ON \`clients\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`clients_created_at_idx\` ON \`clients\` (\`created_at\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_verticals\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_description\` text NOT NULL,
  	\`benefits_title\` text NOT NULL,
  	\`benefits_benefits_id\` integer,
  	\`types_title\` text NOT NULL,
  	\`types_type_features_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`benefits_benefits_id\`) REFERENCES \`feature_cards\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`types_type_features_id\`) REFERENCES \`feature_cards\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_verticals\`("id", "title", "hero_title", "hero_description", "benefits_title", "benefits_benefits_id", "types_title", "types_type_features_id", "updated_at", "created_at") SELECT "id", "title", "hero_title", "hero_description", "benefits_title", "benefits_benefits_id", "types_title", "types_type_features_id", "updated_at", "created_at" FROM \`verticals\`;`)
  await db.run(sql`DROP TABLE \`verticals\`;`)
  await db.run(sql`ALTER TABLE \`__new_verticals\` RENAME TO \`verticals\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`verticals_benefits_benefits_benefits_idx\` ON \`verticals\` (\`benefits_benefits_id\`);`)
  await db.run(sql`CREATE INDEX \`verticals_types_types_type_features_idx\` ON \`verticals\` (\`types_type_features_id\`);`)
  await db.run(sql`CREATE INDEX \`verticals_updated_at_idx\` ON \`verticals\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`verticals_created_at_idx\` ON \`verticals\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`events\` ADD \`client_id\` integer REFERENCES clients(id);`)
  await db.run(sql`CREATE INDEX \`events_client_idx\` ON \`events\` (\`client_id\`);`)
  await db.run(sql`ALTER TABLE \`feature_cards\` ADD \`icon_provider\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`feature_cards\` ADD \`icon_name\` text;`)
  await db.run(sql`ALTER TABLE \`feature_cards\` DROP COLUMN \`type\`;`)
  await db.run(sql`ALTER TABLE \`feature_cards\` DROP COLUMN \`icon\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`client_id\` integer NOT NULL REFERENCES clients(id);`)
  await db.run(sql`ALTER TABLE \`case_studies\` ADD \`event_id\` integer NOT NULL REFERENCES events(id);`)
  await db.run(sql`CREATE INDEX \`case_studies_client_idx\` ON \`case_studies\` (\`client_id\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_event_idx\` ON \`case_studies\` (\`event_id\`);`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`client\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`event_type\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`audience_size\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`use_case\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`headline_result\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`how_it_played_out\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`why_it_worked\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`cta_heading\`;`)
  await db.run(sql`ALTER TABLE \`case_studies\` DROP COLUMN \`cta_description\`;`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`clients_id\` integer REFERENCES clients(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`case_studies_snapshot\`;`)
  await db.run(sql`DROP TABLE \`clients\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_events\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`location\` text NOT NULL,
  	\`start_date\` text NOT NULL,
  	\`end_date\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_events\`("id", "title", "location", "start_date", "end_date", "updated_at", "created_at") SELECT "id", "title", "location", "start_date", "end_date", "updated_at", "created_at" FROM \`events\`;`)
  await db.run(sql`DROP TABLE \`events\`;`)
  await db.run(sql`ALTER TABLE \`__new_events\` RENAME TO \`events\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`events_updated_at_idx\` ON \`events\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`events_created_at_idx\` ON \`events\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_verticals\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_description\` text NOT NULL,
  	\`feature_cards_benefit_id\` integer,
  	\`feature_cards_type_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`feature_cards_benefit_id\`) REFERENCES \`feature_cards\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`feature_cards_type_id\`) REFERENCES \`feature_cards\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_verticals\`("id", "title", "hero_title", "hero_description", "feature_cards_benefit_id", "feature_cards_type_id", "updated_at", "created_at") SELECT "id", "title", "hero_title", "hero_description", "feature_cards_benefit_id", "feature_cards_type_id", "updated_at", "created_at" FROM \`verticals\`;`)
  await db.run(sql`DROP TABLE \`verticals\`;`)
  await db.run(sql`ALTER TABLE \`__new_verticals\` RENAME TO \`verticals\`;`)
  await db.run(sql`CREATE INDEX \`verticals_feature_cards_benefit_idx\` ON \`verticals\` (\`feature_cards_benefit_id\`);`)
  await db.run(sql`CREATE INDEX \`verticals_feature_cards_type_idx\` ON \`verticals\` (\`feature_cards_type_id\`);`)
  await db.run(sql`CREATE INDEX \`verticals_updated_at_idx\` ON \`verticals\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`verticals_created_at_idx\` ON \`verticals\` (\`created_at\`);`)
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
  await db.run(sql`CREATE INDEX \`case_studies_updated_at_idx\` ON \`case_studies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`case_studies_created_at_idx\` ON \`case_studies\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`events_id\` integer,
  	\`testimonials_id\` integer,
  	\`feature_cards_id\` integer,
  	\`verticals_id\` integer,
  	\`case_studies_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`feature_cards_id\`) REFERENCES \`feature_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`verticals_id\`) REFERENCES \`verticals\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`case_studies_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "events_id", "testimonials_id", "feature_cards_id", "verticals_id", "case_studies_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "events_id", "testimonials_id", "feature_cards_id", "verticals_id", "case_studies_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_feature_cards_id_idx\` ON \`payload_locked_documents_rels\` (\`feature_cards_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_verticals_id_idx\` ON \`payload_locked_documents_rels\` (\`verticals_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_case_studies_id_idx\` ON \`payload_locked_documents_rels\` (\`case_studies_id\`);`)
  await db.run(sql`ALTER TABLE \`feature_cards\` ADD \`type\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`feature_cards\` ADD \`icon\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`feature_cards\` DROP COLUMN \`icon_provider\`;`)
  await db.run(sql`ALTER TABLE \`feature_cards\` DROP COLUMN \`icon_name\`;`)
}
