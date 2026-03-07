"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function QuotesSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "")

    // 検索実行関数
    const executeSearch = useCallback((newStatus?: string) => {
        const params = new URLSearchParams()
        if (searchQuery.trim()) {
            params.set("q", searchQuery.trim())
        }

        const statusToApply = newStatus !== undefined ? newStatus : statusFilter
        if (statusToApply && statusToApply !== "all") {
            params.set("status", statusToApply)
        }

        const queryString = params.toString()
        router.push(`/quotes${queryString ? `?${queryString}` : ""}`)
    }, [searchQuery, statusFilter, router])

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value
        setStatusFilter(newStatus)
        executeSearch(newStatus)
    }

    const clearSearch = () => {
        setSearchQuery("")
        setStatusFilter("all")
        router.push(`/quotes`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            executeSearch()
        }
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="顧客名で検索..."
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>
            <Button variant="ghost" onClick={clearSearch} className="px-3 text-neutral-500 hover:text-neutral-700">
                <X className="w-4 h-4 mr-1" />
                クリア
            </Button>
            <div className="flex gap-2">
                <select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                >
                    <option value="all">すべてのステータス</option>
                    <option value="in_progress">進行中</option>
                    <option value="completed">完了</option>
                </select>
            </div>
        </div>
    )
}
