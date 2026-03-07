"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { QuotePreviewContent } from "@/components/quotes/QuotePreviewContent"

interface QuoteData {
  customerName?: string
  totalA: number
  totalB: number
  totalC: number
  grandTotal: number
  itemsA: any[]
  itemsB: any[]
  itemsC: any[]
}

export default function QuotePreviewPage() {
  const [data, setData] = useState<QuoteData | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('quotePreviewData')
    if (stored) {
      setData(JSON.parse(stored))
    }
  }, [])

  if (!data) {
    return <div className="p-12 text-center text-gray-500">読み込み中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-200 py-6 px-4 font-sans print:bg-white print:p-0 print:m-0">
      <div className="flex justify-between items-center max-w-[210mm] mx-auto mb-4 print:hidden">
        <Button variant="outline" onClick={() => window.close()}>閉じる</Button>
        <Button onClick={() => window.print()}>印刷する / PDF保存</Button>
      </div>

      <div className="page-wrapper shadow-lg print:shadow-none print:m-0">
        <QuotePreviewContent
          customerName={data.customerName}
          totalA={data.totalA}
          totalB={data.totalB}
          totalC={data.totalC}
          grandTotal={data.grandTotal}
          itemsA={data.itemsA || []}
          itemsB={data.itemsB || []}
          itemsC={data.itemsC || []}
        />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden { display: none !important; }
          .page-wrapper {
            box-shadow: none !important;
            margin: 0 !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}} />
    </div>
  )
}
