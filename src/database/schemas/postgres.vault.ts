import { sql } from 'drizzle-orm';
import { pgTable, serial, text, integer, uuid } from 'drizzle-orm/pg-core';

export const vaultEntry = pgTable('vault_entry', {
  id: uuid().primaryKey(),
  title: text(),
  username: text(),
  password: text(),
  tags: text(),
  note: text(),
  url: text(),
  urlAliases: text('url_aliases'),
  icon: text(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updateAt: integer('updated_at'),
});
