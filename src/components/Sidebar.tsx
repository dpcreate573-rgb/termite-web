"use client"

import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import {
  Home, FileBox, Receipt, ShieldCheck, Users, Package,
  Settings, LogOut, ChevronDown, ChevronRight, Bug, ShoppingBag, Layers
} from "lucide-react"

const navItems = [
  { label: "ダッシュボード", href: "/", icon: Home },
  {
    label: "見積書管理",
    icon: FileBox,
    href: "/quotes",
    subItems: [
      { label: "シロアリ駆除見積", href: "/quotes/new?type=A", icon: ShieldCheck },
      { label: "害虫・害獣駆除見積", href: "/quotes/new?type=B", icon: Bug },
      { label: "商品・物販見積", href: "/quotes/new?type=C", icon: ShoppingBag },
      { label: "複合見積作成", href: "/quotes/new?type=ABC", icon: Layers },
    ]
  },
  { label: "請求書管理", href: "/invoices", icon: Receipt },
  { label: "保証書管理", href: "/guarantees", icon: ShieldCheck },
]

const masterItems = [
  { label: "顧客マスター", href: "/customers", icon: Users },
  { label: "商品・施工マスター", href: "/products", icon: Package },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [openSections, setOpenSections] = useState<string[]>(["見積書管理"])

  const toggleSection = (label: string) => {
    setOpenSections(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    )
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href.split("?")[0])
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="bg-blue-600 text-white p-1.5 rounded-md flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </span>
          Termite Web
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon
          const hasSubItems = item.subItems && item.subItems.length > 0
          const isOpen = openSections.includes(item.label)
          const active = !hasSubItems && isActive(item.href!)

          if (hasSubItems) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleSection(item.label)}
                  className={`flex items-center justify-between w-full gap-3 px-3 py-2.5 rounded-md transition-colors text-left ${
                    isActive(item.href!) ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </span>
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {isOpen && (
                  <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {item.subItems!.map(sub => {
                      const SubIcon = sub.icon
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                            pathname === sub.href.split("?")[0] && pathname.includes(sub.href.split("=")[1] || "")
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          }`}
                        >
                          <SubIcon className="w-4 h-4" />
                          {sub.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}

        <div className="my-4 border-t border-gray-200" />

        {masterItems.map(item => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive(item.href) ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 shrink-0 space-y-1">
        {session?.user?.email && (
          <div className="px-3 py-2 text-xs text-gray-400 truncate">{session.user.email}</div>
        )}
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          <Settings className="w-5 h-5" /> 設定
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5" /> ログアウト
        </button>
      </div>
    </aside>
  )
}
