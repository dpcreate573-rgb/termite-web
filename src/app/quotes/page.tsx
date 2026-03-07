import { Metadata } from "next"
import Link from "next/link"
import { Plus } from "lucide-react"
import { AppLayout } from "@/components/AppLayout"
import { Button } from "@/components/ui/button"
import { QuotesSearch } from "@/components/quotes/QuotesSearch"
import { QuotesTableRow } from "@/components/quotes/QuotesTableRow"

import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { projects, quotes, customers } from "@/db/schema"
import { desc, eq, sql, like, and } from "drizzle-orm"

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})
const db = drizzle(turso)

export const metadata: Metadata = {
  title: "見積書一覧 | Termit",
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
    const term = `%${q}%`;
    conditions.push(sql`(${customers.name} LIKE ${term} OR ${quotes.id} LIKE ${term} OR ${quotes.subject} LIKE ${term})`);
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
      customerType: customers.type,
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
        return <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap border border-blue-200"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>進行中</span>
      case 'completed':
        return <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>受注済</span>
      case 'none':
        return <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap border border-gray-200"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>未受注</span>
      default:
        return <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-2.5 py-0.5 text-xs font-semibold border border-gray-200">{status}</span>
    }
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6 pb-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">見積書管理 / 一覧</p>
              <h2 className="text-2xl font-bold text-gray-900">見積書一覧</h2>
            </div>
            <div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all w-full md:w-auto">
                <Link href="/quotes/new">
                  <Plus className="w-4 h-4 mr-2" /> 新規見積を作成する
                </Link>
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col">
            <QuotesSearch />
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold w-36">見積番号 / 日付</th>
                    <th scope="col" className="px-6 py-3 font-semibold">宛名 / 件名</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-right w-48">合計金額 (税込)</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-center w-32">ステータス</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-center w-40">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allQuotes.map((quote) => (
                    <QuotesTableRow
                      key={quote.id}
                      quote={quote}
                      customerType={quote.customerType as "法人" | "個人"}
                      subject={quote.subject}
                      formattedTypes={formatProjectTypes(quote.projectTypes)}
                      badge={getStatusBadge(quote.status)}
                    />
                  ))}
                  {allQuotes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">
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
