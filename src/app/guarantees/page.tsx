import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "保証書管理 | Termit",
}

export default function GuaranteesPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">保証書管理</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">発行済みの保証書</CardTitle>
            <CardDescription>シロアリ駆除（A案件）に対する5年保証</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 bg-white shadow-sm">
                <div>
                  <p className="font-semibold text-sm">G-2023-001</p>
                  <p className="text-sm text-gray-500">顧客: 山田 太郎 様</p>
                  <p className="text-xs text-gray-400 mt-1">保証期間: 2023/10/01 〜 2028/09/30</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">プレビュー (PDF)</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">保証書の内容と条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 text-blue-900 rounded-lg text-sm leading-relaxed border border-blue-100">
              <p className="font-bold mb-2">保証発行のシステム条件:</p>
              <ul className="list-disc leading-loose pl-5 space-y-1">
                <li>案件種別に <strong>[A] シロアリ駆除</strong> が含まれていること</li>
                <li>対象案件の請求ステータスが <strong>「入金済」</strong> になっていること</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg text-sm text-gray-600">
              <p className="font-bold mb-2">保証書印字用 カスタマイズ項目</p>
              <p>・再処理保証 (施工保証): 期間内再発時の無償対応</p>
              <p>・修復保証 (賠償保証): 上限500万円 / 1,000万円など</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
