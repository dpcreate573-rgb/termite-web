"use client"

import { useRouter } from "next/navigation"
import { Printer } from "lucide-react"

type QuoteProps = {
    id: string;
    createdAt: number | Date;
    customerName: string;
    totalPrice: number;
}

export function QuotesTableRow({
    quote,
    subject,
    formattedTypes,
    badge
}: {
    quote: QuoteProps,
    subject?: string | null,
    formattedTypes: string,
    badge: React.ReactNode
}) {
    const router = useRouter()

    const handleRowClick = () => {
        router.push(`/quotes/${quote.id}`)
    }

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/quotes/preview?id=${quote.id}`)
    }

    return (
        <tr
            onClick={handleRowClick}
            className="group hover:bg-blue-50/20 transition-colors cursor-pointer"
        >
            <td className="px-6 py-4 text-sm text-neutral-600 whitespace-nowrap">
                {new Intl.DateTimeFormat('ja-JP-u-ca-japanese', { era: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(quote.createdAt))}
            </td>
            <td className="px-6 py-4 text-sm truncate">
                <div className="font-medium text-neutral-900 truncate">
                    {subject || <span className="text-neutral-400 italic">（件名なし）</span>}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5 truncate">{quote.customerName}</div>
            </td>
            <td className="px-6 py-4 text-sm">
                <span className="inline-flex items-center px-2 py-1 rounded bg-neutral-100 text-neutral-600 text-xs shadow-sm">
                    {formattedTypes}
                </span>
            </td>
            <td className="px-6 py-4 text-sm font-medium text-neutral-900 text-right">
                ¥{(Number(quote.totalPrice) || 0).toLocaleString()}
            </td>
            <td className="px-6 py-4 text-center whitespace-nowrap">
                {badge}
            </td>
            <td className="px-6 py-4 text-right whitespace-nowrap">
                <button
                    onClick={handleActionClick}
                    title="印刷"
                    className="inline-flex items-center justify-center rounded-md h-8 w-8 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                    <Printer className="w-4 h-4" />
                </button>
            </td>
        </tr>
    )
}
