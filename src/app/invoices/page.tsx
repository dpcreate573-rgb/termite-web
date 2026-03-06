import { Metadata } from "next"

export const metadata: Metadata = {
  title: "請求・保証書管理 | Termit",
}

export default function InvoicesPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">請求一覧</h2>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-medium mb-4">請求データ（モック）</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">案件ID</th>
                <th className="px-6 py-3">顧客名</th>
                <th className="px-6 py-3">案件種別</th>
                <th className="px-6 py-3">請求額</th>
                <th className="px-6 py-3">ステータス</th>
                <th className="px-6 py-3">アクション</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock Data Row 1 (A-Type, Unpaid) */}
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">PRJ-001</td>
                <td className="px-6 py-4">株式会社 〇〇</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">シロアリ駆除 (A)</span>
                </td>
                <td className="px-6 py-4">¥150,000</td>
                <td className="px-6 py-4">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">未入金</span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button className="text-blue-600 hover:underline">入金済にする</button>
                  <button className="text-gray-400 cursor-not-allowed" disabled title="入金済のみ発行可能">保証書発行</button>
                </td>
              </tr>
              
              {/* Mock Data Row 2 (A-Type, Paid) */}
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">PRJ-002</td>
                <td className="px-6 py-4">山田 太郎 様</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">シロアリ駆除 (A)</span>
                </td>
                <td className="px-6 py-4">¥220,000</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">入金済</span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button className="text-indigo-600 hover:underline font-bold">5年保証書を発行</button>
                </td>
              </tr>

              {/* Mock Data Row 3 (B-Type, Paid) */}
              <tr className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">PRJ-003</td>
                <td className="px-6 py-4">ABCビル</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">害虫防除 (B)</span>
                </td>
                <td className="px-6 py-4">¥45,000</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">入金済</span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <span className="text-gray-400 text-xs">※A案件以外は保証書対象外</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
