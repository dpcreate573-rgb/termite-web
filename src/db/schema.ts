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
  subject: text("subject"), // 件名
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

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
  unitPrice: integer("unit_price"), // '-' の場合は null にするため undefined を許可する
  unit: text("unit").notNull(),
  remarks: text("remarks"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(), // 常に "system_settings" とする
  companyName: text("company_name").notNull(),
  representative: text("representative"),
  accreditationNumber: text("accreditation_number"), // 認定番号
  zipCode: text("zip_code"),
  address: text("address"),
  tel: text("tel"),
  fax: text("fax"),
  logoUrl: text("logo_url"),
  stampUrl: text("stamp_url"), // 印影URL
  bankAccount1: text("bank_account1"),
  bankAccount2: text("bank_account2"),
  prMessage: text("pr_message"),
  // メール送信設定 (暗号化などは別途考慮)
  smtpHost: text("smtp_host"),
  smtpPort: integer("smtp_port"),
  smtpUser: text("smtp_user"),
  smtpPass: text("smtp_pass"),
  emailFrom: text("email_from"),
  // メールテンプレート
  quoteEmailTemplate: text("quote_email_template"),
  invoiceEmailTemplate: text("invoice_email_template"),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull(),
});

// ログイン許可ユーザーを管理するテーブル (Google Auth用)
export const allowedUsers = sqliteTable("allowed_users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: text("role").notNull(), // "admin" | "user"
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull(),
});
