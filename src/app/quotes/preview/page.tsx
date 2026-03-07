"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { QuotePreviewContent } from "@/components/quotes/QuotePreviewContent"
import { ArrowLeft, Printer } from "lucide-react"
import { Suspense } from "react"

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

function PreviewContent() {
  const [data, setData] = useState<QuoteData | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const quoteId = searchParams.get("id")

  useEffect(() => {
    const stored = localStorage.getItem('quotePreviewData')
    if (stored) {
      setData(JSON.parse(stored))
    }
  }, [])

  const handleBack = () => {
    if (quoteId) {
      router.push(`/quotes/${quoteId}`)
    } else {
      router.push("/quotes")
    }
  }

  if (!data) {
    return <div className="p-12 text-center text-gray-500">読み込み中...</div>
  }

  return (
    <div className="min-h-screen bg-gray-400 py-6 px-4 font-sans print:bg-white print:p-0 print:m-0">
      <div className="flex justify-between items-center max-w-[210mm] mx-auto mb-4 print:hidden">
        <Button variant="outline" className="bg-white hover:bg-neutral-100" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {quoteId ? "詳細に戻る" : "一覧に戻る"}
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="w-4 h-4 mr-2" />
          印刷する / PDF保存
        </Button>
      </div>

      <div className="page-wrapper shadow-[0_8px_40px_rgba(0,0,0,0.4)] mx-auto w-fit print:shadow-none print:m-0">
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

export default function QuotePreviewPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">読み込み中...</div>}>
      <PreviewContent />
    </Suspense>
  )
}
