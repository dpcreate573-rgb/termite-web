CREATE TABLE `allowed_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`role` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `allowed_users_email_unique` ON `allowed_users` (`email`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`representative` text,
	`accreditation_number` text,
	`zip_code` text,
	`address` text,
	`tel` text,
	`fax` text,
	`logo_url` text,
	`stamp_url` text,
	`bank_account1` text,
	`bank_account2` text,
	`pr_message` text,
	`smtp_host` text,
	`smtp_port` integer,
	`smtp_user` text,
	`smtp_pass` text,
	`email_from` text,
	`quote_email_template` text,
	`invoice_email_template` text,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `quotes` ADD `subject` text;