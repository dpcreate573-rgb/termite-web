"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Download } from "lucide-react"

export function QuotesSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            executeSearch()
        }
    }

    return (
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 rounded-t-xl flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="顧客名、件名、見積番号で検索..."
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="flex h-10 w-full md:w-48 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
                >
                    <option value="all">すべてのステータス</option>
                    <option value="in_progress">進行中 (作成中)</option>
                    <option value="completed">受注済</option>
                    <option value="none">未受注</option>
                </select>
                <button className="inline-flex items-center justify-center rounded-md font-medium border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 text-sm whitespace-nowrap text-gray-600 transition-colors hidden md:flex">
                    <Download className="w-4 h-4 mr-2" /> CSV出力
                </button>
            </div>
        </div>
    )
}
