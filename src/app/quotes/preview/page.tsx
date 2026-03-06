"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface QuoteData {
  types: string[]
  totalA: number
  totalB: number
  totalC: number
  grandTotal: number
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

  const { totalA, totalB, totalC, grandTotal } = data
  const tax = Math.floor(grandTotal * 0.10)
  const totalWithTax = grandTotal + tax

  // Today's date formatted
  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  return (
    <div className="min-h-screen bg-gray-200 py-6 px-4 font-sans print:bg-white print:p-0 print:m-0">
      {/* Toolbar (hidden when printing) */}
      <div className="flex justify-between items-center max-w-[210mm] mx-auto mb-4 print:hidden">
        <Button variant="outline" onClick={() => window.close()}>閉じる</Button>
        <Button onClick={() => window.print()}>印刷する / PDF保存</Button>
      </div>

      {/* A4 Page — exactly 297mm tall, overflow hidden so it never spills */}
      <div className="page-wrapper w-[210mm] h-[297mm] max-w-full mx-auto bg-white px-[15mm] pt-[12mm] pb-[10mm] shadow-lg flex flex-col text-[12px] text-gray-800 overflow-hidden print:shadow-none print:m-0">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-4">
          <p className="w-1/4">No. <span className="text-sm">—</span></p>
          <h1 className="px-6 text-center text-xl font-normal text-white bg-green-700 py-1 tracking-[0.2em] rounded-sm">
            御見積書
          </h1>
          <p className="w-1/4 text-right">{dateStr}</p>
        </header>

        {/* Info Section */}
        <div className="flex justify-between items-end min-h-[180px] pb-2 mb-3">
          {/* Left: Customer Info */}
          <section className="w-[58%]">
            <h2 className="text-xl font-normal leading-tight mb-4">
              <small className="text-[0.7em] block mb-1">&nbsp;</small>
              &nbsp;<span className="text-lg ml-1">様</span>
            </h2>
            <div className="mb-2 w-full border-b border-gray-300 pb-1">
              <p className="text-sm">件名：<span className="text-[1.1em]">&nbsp;</span></p>
            </div>
            <p className="my-1">有効期限：<span>&nbsp;</span></p>
            <p className="my-1">下記の通り御見積り申し上げます。</p>
            
            <div className="flex items-center bg-[#F3F8F0] border-y border-gray-300 px-5 py-1.5 mt-3 w-full">
              <p>御見積金額</p>
              <h3 className="ml-4 text-2xl font-normal tracking-wide">¥{totalWithTax.toLocaleString()} -</h3>
            </div>
          </section>

          {/* Right: Company Info */}
          <section className="w-[38%] relative pl-5">
            <div className="mb-2">
              <img src="/images/soken_logo_full.png" alt="Company Logo" className="w-[200px]" />
            </div>
            <div className="text-right text-[11px] leading-snug space-y-[1px]">
              <p>代表　野口広満</p>
              <p>〒843-0021 佐賀県武雄市武雄町永島14704-14</p>
              <p>TEL 0954-23-7334</p>
              <p>FAX 0954-23-7704</p>
              <p>soken_noguchi@gmail.com</p>
              <p>登録番号　T1234567890123</p>
            </div>
            <div className="absolute top-[70px] right-[10px] opacity-70">
              <img src="/images/sample10.png" alt="Stamp" className="w-[50px] aspect-square object-contain" />
            </div>
          </section>
        </div>

        {/* Main Table */}
        <main className="flex-1 flex flex-col">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="bg-green-700 text-white font-normal py-1.5 px-2 border border-white text-center w-[55%]">工事内容／品名</th>
                <th className="bg-green-700 text-white font-normal py-1.5 px-2 border border-white text-center">数量</th>
                <th className="bg-green-700 text-white font-normal py-1.5 px-2 border border-white text-center">単価</th>
                <th className="bg-green-700 text-white font-normal py-1.5 px-2 border border-white text-center w-[100px]">金額</th>
              </tr>
            </thead>
            <tbody>
              {totalA > 0 && (
                <tr className="bg-[#F3F8F0]">
                  <td className="py-1.5 px-2 border-r border-[#eee] text-left pl-3">シロアリ駆除工事（ヤマトシロアリ等）</td>
                  <td className="py-1.5 px-2 border-r border-[#eee] text-right">1<span> 式</span></td>
                  <td className="py-1.5 px-2 border-r border-[#eee] text-right">{totalA.toLocaleString()}</td>
                  <td className="py-1.5 px-2 text-right">{totalA.toLocaleString()}</td>
                </tr>
              )}
              {totalB > 0 && (
                <tr>
                  <td className="py-1.5 px-2 border-r border-[#eee] text-left pl-3">害虫・害獣防除・駆除作業</td>
                  <td className="py-1.5 px-2 border-r border-[#eee] text-right">1<span> 式</span></td>
                  <td className="py-1.5 px-2 border-r border-[#eee] text-right">{totalB.toLocaleString()}</td>
                  <td className="py-1.5 px-2 text-right">{totalB.toLocaleString()}</td>
                </tr>
              )}
              {totalC > 0 && (
                <tr className="bg-[#F3F8F0]">
                  <td className="py-1.5 px-2 border-r border-[#eee] text-left pl-3">商品・資材等</td>
                  <td className="py-1.5 px-2 border-r border-[#eee] text-right">1<span> 式</span></td>
                  <td className="py-1.5 px-2 border-r border-[#eee] text-right">{totalC.toLocaleString()}</td>
                  <td className="py-1.5 px-2 text-right">{totalC.toLocaleString()}</td>
                </tr>
              )}
              
              {/* Fill remaining rows to keep table height consistent */}
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-[#F3F8F0]"}>
                  <td className="py-1.5 px-2 border-r border-[#eee]">&nbsp;</td>
                  <td className="py-1.5 px-2 border-r border-[#eee]"></td>
                  <td className="py-1.5 px-2 border-r border-[#eee]"></td>
                  <td className="py-1.5 px-2"></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bottom: Memo + Totals */}
          <div className="flex justify-between items-start mt-auto pt-3">
            {/* Memo */}
            <div className="w-[55%] border border-gray-300 rounded p-2 text-[11px] leading-relaxed">
              ※5年間の工事保証書を発行いたします。<br />
              ※シロアリ損害賠償保険付（限度額1000万まで）
            </div>
            
            {/* Totals */}
            <div className="w-[200px]">
              <table className="w-full text-right border border-gray-300 bg-white text-[12px]">
                <tbody>
                  <tr>
                    <td className="text-left py-1 px-2 border-b border-gray-300">小計</td>
                    <td className="py-1 px-2 border-l border-b border-gray-300 w-[90px]">{grandTotal.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="text-left py-1 px-2 border-b border-gray-300">消費税（10%）</td>
                    <td className="py-1 px-2 border-l border-b border-gray-300">{tax.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-[#F3F8F0] font-bold">
                    <td className="text-left py-1.5 px-2 border-t-[3px] border-double border-gray-300">合計金額</td>
                    <td className="py-1.5 px-2 border-l border-t-[3px] border-double border-gray-300">{totalWithTax.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-2 text-[9px] leading-relaxed border-t border-gray-400 pt-1.5">
          総合衛研工業は、住みよい環境と安全な暮らし作りをお手伝いする害虫駆除の専門業者です。各所に発生した、シロアリ、ダニ、ゴキブリ、ハチ等を防除・消毒いたします。また、床下換気システムなど住宅設備の工事も承っております。詳しくは、0120-251-625 までお電話下さい。ホームページから、E-Mailでのお問い合わせができます。https://sogoeiken.com/
        </footer>
      </div>

      {/* Print-only styles */}
      <style dangerouslySetInnerHTML={{__html: `
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
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
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
