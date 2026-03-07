"use client"

import { useRouter } from "next/navigation"
import { Edit, FileText, ArrowRightSquare } from "lucide-react"
import { formatWareki } from "@/lib/date"

type QuoteProps = {
    id: string;
    createdAt: number | Date;
    customerName: string;
    totalPrice: number;
}

export function QuotesTableRow({
    quote,
    customerType,
    subject,
    formattedTypes,
    badge
}: {
    quote: QuoteProps,
    customerType: "法人" | "個人",
    subject?: string | null,
    formattedTypes: string,
    badge: React.ReactNode
}) {
    const router = useRouter()

    const handleRowClick = () => {
        router.push(`/quotes/${quote.id}`)
    }

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const formatCurrency = (num: number) => '¥ ' + num.toLocaleString();

    const displayId = quote.id.length > 8
        ? `${quote.id.slice(0, 4).toUpperCase()}-${quote.id.slice(4, 8).toUpperCase()}`
        : quote.id;

    return (
        <tr
            onClick={handleRowClick}
            className="bg-white hover:bg-blue-50/40 transition-colors group cursor-pointer"
        >
            <td className="px-6 py-4">
                <div className="font-mono font-medium text-gray-900">{displayId}</div>
                <div className="text-xs text-gray-500 mt-1">
                    {formatWareki(quote.createdAt)}
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${customerType === '法人'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-emerald-100 text-emerald-800'
                        }`}>
                        {customerType}
                    </span>
                    <span className="font-bold text-base text-gray-900 line-clamp-1">{quote.customerName}</span>
                </div>
                <div className="text-xs text-gray-500 line-clamp-1 flex items-center gap-1">
                    <span className="opacity-50 font-medium">[{formattedTypes}]</span>
                    {subject || <span className="italic opacity-50">（件名なし）</span>}
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="font-bold text-gray-900 text-base">{formatCurrency(quote.totalPrice)}</div>
            </td>
            <td className="px-6 py-4 text-center">
                {badge}
            </td>
            <td className="px-6 py-4" onClick={stopPropagation}>
                <div className="flex items-center justify-center gap-1 opacity-100 md:opacity-40 md:group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/quotes/${quote.id}?edit=true`);
                        }}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="編集する"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => router.push(`/quotes/preview?id=${quote.id}`)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="PDFを出力"
                    >
                        <FileText className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button
                        className="p-1.5 text-gray-300 cursor-not-allowed rounded-md transition-colors"
                        title="受注済のみ変換可能"
                        disabled
                    >
                        <ArrowRightSquare className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    )
}
