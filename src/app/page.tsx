"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppLayout } from "@/components/AppLayout"
import { FileBox, Receipt, ShieldCheck, TrendingUp, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="flex items-center justify-center p-8 h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6 pb-6">

          {/* Header */}
          <div>
            <p className="text-sm text-gray-500 mb-1">ホーム</p>
            <h2 className="text-2xl font-bold">ダッシュボード</h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">今月の見積</span>
                <FileBox className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-400 mt-1">件数</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">未請求</span>
                <Receipt className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-400 mt-1">件数</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">保証書発行済</span>
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-400 mt-1">件数</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">今月の売上</span>
                <TrendingUp className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-400 mt-1">円</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  最近の案件・見積
                </h3>
              </div>
              <div className="p-8 text-center text-gray-400">
                <p className="text-sm">データがありません</p>
                <p className="text-xs mt-1">見積を作成すると、ここに表示されます</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                  お知らせ
                </h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                  左メニューの「見積書管理」から見積を作成できます。
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-600">
                  顧客マスター・商品マスターは今後実装予定です。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
