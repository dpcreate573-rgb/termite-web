import { Metadata } from "next"

export const metadata: Metadata = {
  title: "見積一覧 | Termit",
}

export default function QuotesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">見積管理</h2>
      </div>
      <div>
        <p>見積データがありません。</p>
      </div>
    </div>
  )
}
