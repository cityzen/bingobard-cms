import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`verticals_benefits_benefit_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`benefit\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`verticals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`verticals_benefits_benefit_cards_order_idx\` ON \`verticals_benefits_benefit_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`verticals_benefits_benefit_cards_parent_id_idx\` ON \`verticals_benefits_benefit_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`verticals_types_use_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`use\` text NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`verticals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`verticals_types_use_cards_order_idx\` ON \`verticals_types_use_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`verticals_types_use_cards_parent_id_idx\` ON \`verticals_types_use_cards\` (\`_parent_id\`);`)
  await db.run(sql`DROP TABLE \`feature_cards\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_verticals\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`hero_title\` text NOT NULL,
  	\`hero_description\` text NOT NULL,
  	\`benefits_title\` text NOT NULL,
  	\`types_title\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_verticals\`("id", "title", "hero_title", "hero_description", "benefits_title", "types_title", "updated_at", "created_at") SELECT "id", "title", "hero_title", "hero_description", "benefits_title", "types_title", "updated_at", "created_at" FROM \`verticals\`;`)
  await db.run(sql`DROP TABLE \`verticals\`;`)
  await db.run(sql`ALTER TABLE \`__new_verticals\` RENAME TO \`verticals\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`verticals_updated_at_idx\` ON \`verticals\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`verticals_created_at_idx\` ON \`verticals\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`events_id\` integer,
  	\`testimonials_id\` integer,
  	\`verticals_id\` integer,
  	\`case_studies_id\` integer,
  	\`clients_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`events_id\`) REFERENCES \`events\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`verticals_id\`) REFERENCES \`verticals\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`case_studies_id\`) REFERENCES \`case_studies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clients_id\`) REFERENCES \`clients\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "events_id", "testimonials_id", "verticals_id", "case_studies_id", "clients_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "events_id", "testimonials_id", "verticals_id", "case_studies_id", "clients_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_events_id_idx\` ON \`payload_locked_documents_rels\` (\`events_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_verticals_id_idx\` ON \`payload_locked_documents_rels\` (\`verticals_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_case_studies_id_idx\` ON \`payload_locked_documents_rels\` (\`case_studies_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_clients_id_idx\` ON \`payload_locked_documents_rels\` (\`clients_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`feature_cards\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon_name\` text,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`feature_cards_updated_at_idx\` ON \`feature_cards\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`feature_cards_created_at_idx\` ON \`feature_cards\` (\`created_at\`);`)
  await db.run(sql`DROP TABLE \`verticals_benefits_benefit_cards\`;`)
  await db.run(sql`DROP TABLE \`verticals_types_use_cards\`;`)
  await db.run(sql`ALTER TABLE \`verticals\` ADD \`benefits_benefits_id\` integer REFERENCES feature_cards(id);`)
  await db.run(sql`ALTER TABLE \`verticals\` ADD \`types_type_features_id\` integer REFERENCES feature_cards(id);`)
  await db.run(sql`CREATE INDEX \`verticals_benefits_benefits_benefits_idx\` ON \`verticals\` (\`benefits_benefits_id\`);`)
  await db.run(sql`CREATE INDEX \`verticals_types_types_type_features_idx\` ON \`verticals\` (\`types_type_features_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`feature_cards_id\` integer REFERENCES feature_cards(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_feature_cards_id_idx\` ON \`payload_locked_documents_rels\` (\`feature_cards_id\`);`)
}
