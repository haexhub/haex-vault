CREATE TABLE `vault_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`username` text,
	`password` text,
	`note` text,
	`url` text,
	`url_aliases` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `vaultEntyHistory` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_id` text,
	`changed_property` text,
	`old_value` text,
	`new_value` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`entry_id`) REFERENCES `vault_entry`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vaultEntryKeyValue` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_id` text,
	`key` text,
	`value` text,
	FOREIGN KEY (`entry_id`) REFERENCES `vault_entry`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vault_group` (
	`id` text PRIMARY KEY NOT NULL,
	`parent_id` text,
	`name` text,
	`description` text,
	`icon` text,
	`order` integer,
	`color` text,
	FOREIGN KEY (`parent_id`) REFERENCES `vault_group`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `vaultGroupEntries` (
	`group_id` text,
	`entry_id` text,
	PRIMARY KEY(`entry_id`, `group_id`),
	FOREIGN KEY (`group_id`) REFERENCES `vault_group`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entry_id`) REFERENCES `vault_entry`(`id`) ON UPDATE no action ON DELETE no action
);
