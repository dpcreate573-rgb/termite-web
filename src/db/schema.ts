import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // "法人" | "個人"
  name: text("name").notNull(),
  furigana: text("furigana"),
  tel: text("tel"),
  address: text("address"),
  contactPerson: text("contact_person"),     // 担当者
  contactPersonTel: text("contact_person_tel"), // 担当者電話
  referee: text("referee"),                 // 紹介者
  refereeTel: text("referee_tel"),          // 紹介者電話
  memo: text("memo"),                       // メモ
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  projectTypes: text("project_types").notNull(), // JSON array object e.g. ["A", "C"]
  status: text("status").notNull(), // "in_progress", "completed"
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const quotes = sqliteTable("quotes", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id),
  termiteCalcData: text("termite_calc_data"), // JSON
  pestCalcData: text("pest_calc_data"), // JSON
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const quoteDetails = sqliteTable("quote_details", {
  id: text("id").primaryKey(),
  quoteId: text("quote_id").notNull().references(() => quotes.id),
  itemName: text("item_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  totalPrice: integer("total_price").notNull(),
});

export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(),
  quoteId: text("quote_id").notNull().references(() => quotes.id),
  billingType: text("billing_type").notNull(), // "one_time" | "recurring"
  amount: integer("amount").notNull(),
  status: text("status").notNull(), // e.g. "paid", "unpaid"
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const guarantees = sqliteTable("guarantees", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id),
  issueDate: integer("issue_date", { mode: 'timestamp' }).notNull(),
  expireDate: integer("expire_date", { mode: 'timestamp' }).notNull(), // 5 years
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});
