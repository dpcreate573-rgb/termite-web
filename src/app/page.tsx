"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

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
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4 bg-white">
        <h1 className="text-xl font-bold">Termit (シロアリ・害虫駆除業務管理)</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{session.user?.email}</span>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            ログアウト
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 bg-slate-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick links or dashboard stats here */}
          <div className="col-span-1 border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">機能メニュー</h2>
            <div className="space-y-2">
              <Button className="w-full justify-start" onClick={() => router.push('/quotes/new?type=A')}>シロアリ駆除見積</Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/quotes/new?type=B')}>害虫・害獣駆除見積</Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/quotes/new?type=C')}>商品・物販見積</Button>
              <Button className="w-full justify-start" variant="secondary" onClick={() => router.push('/quotes/new?type=ABC')}>複合見積作成</Button>
            </div>
            
            <h2 className="text-lg font-semibold mt-8 mb-4 border-t pt-4">管理メニュー</h2>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/invoices')}>
                請求一覧・入金管理
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/guarantees')}>
                保証書(5年保証) 管理
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/quotes')}>
                見積履歴
              </Button>
            </div>
          </div>
          <div className="col-span-2 border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">最近の案件・見積</h2>
            <p className="text-sm text-gray-500">データがありません</p>
          </div>
        </div>
      </main>
    </div>
  )
}
