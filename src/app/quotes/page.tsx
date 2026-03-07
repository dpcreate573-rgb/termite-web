import { Metadata } from "next"
import Link from "next/link"
import { Plus, FileBox, ChevronRight } from "lucide-react"
import { AppLayout } from "@/components/AppLayout"
import { Button } from "@/components/ui/button"
import { QuotesSearch } from "@/components/quotes/QuotesSearch"
import { QuotesTableRow } from "@/components/quotes/QuotesTableRow"

import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { projects, quotes, quoteDetails, customers } from "@/db/schema"
import { desc, eq, sql, like, and } from "drizzle-orm"

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const db = drizzle(turso)

export const metadata: Metadata = {
  title: "見積一覧 | Termit",
}

export const revalidate = 0; // Disable cache for fresh DB data

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q, status } = await searchParams;

  // Build the where clause for searching
  const conditions = [];
  if (q) {
    conditions.push(like(customers.name, `%${q}%`));
  }
  if (status && status !== 'all') {
    conditions.push(eq(projects.status, status));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Fetch quotes with their corresponding projects, customers, and a total price calculation
  const allQuotes = await db
    .select({
      id: quotes.id,
      subject: quotes.subject,
      createdAt: quotes.createdAt,
      projectTypes: projects.projectTypes,
      status: projects.status,
      customerName: customers.name,
      totalPrice: sql<number>`COALESCE((SELECT SUM(total_price) FROM quote_details WHERE quote_details.quote_id = quotes.id), 0)`,
    })
    .from(quotes)
    .innerJoin(projects, eq(quotes.projectId, projects.id))
    .innerJoin(customers, eq(projects.customerId, customers.id))
    .where(whereClause)
    .orderBy(desc(quotes.createdAt));

  const formatProjectTypes = (jsonStr: string) => {
    try {
      const types = JSON.parse(jsonStr) as string[];
      return types.map(t => {
        if (t === "A") return "シロアリ"
        if (t === "B") return "害虫・害獣"
        if (t === "C") return "物販"
        return t
      }).join(" + ");
    } catch {
      return jsonStr;
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">進行中</span>
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">完了</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">{status}</span>
    }
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                  <FileBox className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">見積書管理</h1>
                  <p className="text-sm text-neutral-500 mt-1">作成した見積書の一覧とステータスを管理します。</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all" asChild>
                <Link href="/quotes/new">
                  <Plus className="w-4 h-4 mr-2" />
                  見積書を新規作成
                </Link>
              </Button>
            </div>
          </div>

          {/* Filters/Search bar */}
          <QuotesSearch />

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-sm font-semibold text-neutral-600">
                    <th className="px-6 py-4 w-[12%]">見積日</th>
                    <th className="px-6 py-4 w-[28%]">件名 / 顧客名</th>
                    <th className="px-6 py-4 w-[20%]">案件種別</th>
                    <th className="px-6 py-4 w-[15%] text-right">見積金額（合計）</th>
                    <th className="px-6 py-4 w-[10%] text-center">ステータス</th>
                    <th className="px-6 py-4 w-[10%] text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {allQuotes.map((quote) => (
                    <QuotesTableRow
                      key={quote.id}
                      quote={quote}
                      subject={quote.subject}
                      formattedTypes={formatProjectTypes(quote.projectTypes)}
                      badge={getStatusBadge(quote.status)}
                    />
                  ))}
                  {allQuotes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-sm">
                        見積データがありません。右上のボタンから作成してください。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  )
}
