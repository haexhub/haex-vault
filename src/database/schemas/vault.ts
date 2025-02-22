import {
  integer,
  sqliteTable,
  primaryKey,
  text,
  type AnySQLiteColumn,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

export const vaultEntry = sqliteTable(
  'vault_entry',
  {
    id: text()
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    title: text(),
    username: text(),
    password: text(),
    tags: text(),
    note: text(),
    url: text(),
    urlAliases: text('url_aliases'),
    icon: text(),
    createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
    updateAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
      () => new Date()
    ),
  } /* ,
  (
    table //[index('pk_vault_item').on(table.id, table.version)] // supposed to be the new API, but not working at the moment
  ) => ({
    pk: primaryKey({ columns: [table.id, table.version] }),
  }) */
);

export const vaultEntryKeyValue = sqliteTable('vaultEntryKeyValue', {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  entryId: text('entry_id').references((): AnySQLiteColumn => vaultEntry.id),
  key: text(),
  value: text(),
});

export const vaultEntryHistory = sqliteTable('vaultEntyHistory', {
  id: text()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  entryId: text('entry_id').references((): AnySQLiteColumn => vaultEntry.id),
  changedProperty: text('changed_property').$type<keyof typeof vaultEntry>(),
  oldValue: text('old_value'),
  newValue: text('new_value'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const vaultGroup = sqliteTable('vault_group', {
  id: text().primaryKey(),
  parentId: text('parent_id').references((): AnySQLiteColumn => vaultGroup.id),
  name: text(),
  description: text(),
  icon: text(),
  order: integer(),
  color: text(),
});

export const vaultGroupEntry = sqliteTable(
  'vaultGroupEntries',
  {
    groupId: text('group_id').references((): AnySQLiteColumn => vaultGroup.id),
    entryId: text('entry_id').references((): AnySQLiteColumn => vaultEntry.id),
  },
  (
    table //[index('pk_vault_item').on(table.id, table.version)] // supposed to be the new API, but not working at the moment
  ) => ({
    pk: primaryKey({ columns: [table.entryId, table.groupId] }),
  })
);

export const vaultGroupSchema = {
  id: z.string().optional(),
  parentId: z.string().optional(),
  name: z.string().max(256).optional(),
  description: z.string().max(10000).optional(),
  icon: z.string().max(100).optional(),
  color: z.string().max(20).optional(),
  order: z.number().int().nonnegative().lt(Number.MAX_SAFE_INTEGER).optional(),
};

export const vaultDatabaseSchema = {
  password: z.string().min(6).max(255),
  name: z.string().min(1),
  path: z.string().min(4).endsWith('.db'),
};

export const vaultEntrySchema = {
  groupId: z.string().optional(),
  id: z.string().optional(),
  note: z.string().optional(),
  password: z.string().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
  urlAliases: z.string().optional(),
  username: z.string().optional(),
  version: z.number().optional(),
};

export type InsertVaultEntry = typeof vaultEntry.$inferInsert;
export type SelectVaultEntry = typeof vaultEntry.$inferSelect;

export type InsertVaultGroup = typeof vaultGroup.$inferInsert;
export type SelectVaultGroup = typeof vaultGroup.$inferSelect;

export type InsertVaultEntryHistory = typeof vaultEntryHistory.$inferInsert;
export type SelectVaultEntryHistory = typeof vaultEntryHistory.$inferSelect;

export type InsertVaultGroupEntries = typeof vaultGroupEntry.$inferInsert;
export type SelectVaultGroupEntries = typeof vaultGroupEntry.$inferSelect;
