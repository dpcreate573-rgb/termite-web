"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

import { QuoteFormA } from "@/components/quotes/QuoteFormA"
import { QuoteFormB } from "@/components/quotes/QuoteFormB"
import { QuoteFormC } from "@/components/quotes/QuoteFormC"
import { Suspense } from "react"

function NewQuoteForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [types, setTypes] = useState<string[]>([])
  
  const [totalA, setTotalA] = useState(0)
  const [totalB, setTotalB] = useState(0)
  const [totalC, setTotalC] = useState(0)
  
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam === 'ABC') {
      setTypes(['A', 'B', 'C'])
    } else if (typeParam) {
      setTypes([typeParam])
    }
  }, [searchParams])

  const toggleType = (typeValue: string) => {
    setTypes(current => 
      current.includes(typeValue) 
        ? current.filter(t => t !== typeValue)
        : [...current, typeValue]
    )
    if (typeValue === 'A' && types.includes('A')) setTotalA(0)
    if (typeValue === 'B' && types.includes('B')) setTotalB(0)
    if (typeValue === 'C' && types.includes('C')) setTotalC(0)
  }

  const handleUpdateA = (data: { total: number }) => setTotalA(data.total);
  const handleUpdateB = (data: { total: number }) => setTotalB(data.total);
  const handleUpdateC = (data: { total: number }) => setTotalC(data.total);

  const grandTotal = useMemo(() => {
    let t = 0;
    if (types.includes('A')) t += totalA;
    if (types.includes('B')) t += totalB;
    if (types.includes('C')) t += totalC;
    return t;
  }, [types, totalA, totalB, totalC]);

  const generatePdfBlob = async () => {
    // keeping this for the backend save function
    const { QuotePDF } = await import('@/components/pdf/QuotePDF')
    const { pdf, Document } = await import('@react-pdf/renderer')
    
    const doc = <QuotePDF data={{ types, totalA, totalB, totalC, grandTotal }} />
    const asPdf = pdf(<Document />) // Workaround to initialize
    asPdf.updateContainer(doc)
    const blob = await asPdf.toBlob()
    return blob
  }

  const handlePreview = () => {
    // Store full quote data in localStorage for the preview page
    const previewData = {
      types,
      totalA,
      totalB, 
      totalC,
      grandTotal,
    }
    localStorage.setItem('quotePreviewData', JSON.stringify(previewData))
    
    // Open preview in new tab
    window.open('/quotes/preview', '_blank')
  }

  const handleSaveAndUpload = async () => {
    setIsUploading(true)
    try {
      const blob = await generatePdfBlob()
      const file = new File([blob], 'quote.pdf', { type: 'application/pdf' })
      
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const result = await res.json()
      if (res.ok) {
        alert("見積データの保存およびPDFアップロードに成功しました！\nURL: " + result.url)
        // Here, normally we would save the DB record (Drizzle/Turso) then redirect
      } else {
        alert("アップロード失敗: " + result.error)
      }
    } catch (e) {
      console.error("Upload Error:", e)
      alert("保存処理中にエラーが発生しました")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-5xl">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold">新規見積作成</h1>
        <Button variant="outline" onClick={() => window.history.back()}>戻る</Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold">1. 案件種別の選択</h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="flex items-center space-x-2">
            <Checkbox id="type-A" checked={types.includes('A')} onCheckedChange={() => toggleType('A')} />
            <Label htmlFor="type-A" className="text-base font-medium leading-none cursor-pointer">A. シロアリ駆除</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-B" checked={types.includes('B')} onCheckedChange={() => toggleType('B')} />
            <Label htmlFor="type-B" className="text-base font-medium leading-none cursor-pointer">B. 害虫・害獣駆除</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="type-C" checked={types.includes('C')} onCheckedChange={() => toggleType('C')} />
            <Label htmlFor="type-C" className="text-base font-medium leading-none cursor-pointer">C. 商品・物販・その他</Label>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {types.includes('A') && (
          <Card className="border-blue-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-blue-50 border-b py-3">
              <CardTitle className="text-blue-800 text-lg">A. シロアリ駆除入力項目</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pb-2">
              <QuoteFormA onUpdate={handleUpdateA} />
            </CardContent>
          </Card>
        )}

        {types.includes('B') && (
          <Card className="border-green-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-green-50 border-b py-3">
              <CardTitle className="text-green-800 text-lg">B. 害虫・害獣駆除入力項目</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pb-2">
              <QuoteFormB onUpdate={handleUpdateB} />
            </CardContent>
          </Card>
        )}

        {types.includes('C') && (
          <Card className="border-orange-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-orange-50 border-b py-3">
              <CardTitle className="text-orange-800 text-lg">C. 商品・物販・その他入力項目</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pb-2">
              <QuoteFormC onUpdate={handleUpdateC} />
            </CardContent>
          </Card>
        )}
      </div>

      {types.length > 0 && (
        <Card className="border-gray-300 shadow-md ring-1 ring-gray-900/5 bg-slate-50">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="w-full md:w-1/2 space-y-2">
                <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">見積金額合計</h3>
                {types.includes('A') && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>A. シロアリ駆除</span>
                    <span>¥{totalA.toLocaleString()}</span>
                  </div>
                )}
                {types.includes('B') && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>B. 害虫・害獣駆除</span>
                    <span>¥{totalB.toLocaleString()}</span>
                  </div>
                )}
                {types.includes('C') && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>C. 商品・物販・その他</span>
                    <span>¥{totalC.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2 text-right border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-gray-200">
                <p className="text-sm text-gray-500 mb-1">総合計 (税抜)</p>
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  <span className="text-2xl mr-1">¥</span>
                  {grandTotal.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  税込: ¥{Math.floor(grandTotal * 1.1).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
              <Button variant="outline" size="lg" className="w-full md:w-auto" onClick={handlePreview}>プレビュー (PDF)</Button>
              <Button size="lg" className="w-full md:w-48 text-md font-semibold shadow-sm" onClick={handleSaveAndUpload} disabled={isUploading}>
                {isUploading ? "保存中..." : "見積を保存して進む"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {types.length === 0 && (
        <div className="text-center p-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed">
          見積を作成するには、案件種別（A/B/C）のいずれかを選択してください。
        </div>
      )}
    </div>
  )
}

export default function NewQuotePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">読み込み中...</div>}>
      <NewQuoteForm />
    </Suspense>
  )
}
