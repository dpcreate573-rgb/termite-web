"use client"

import { memo } from "react"

export interface LineItem {
  name: string
  qty: number
  unit: string
  price: number
  amount: number
}

interface QuotePreviewContentProps {
  customerName?: string
  subject?: string
  totalA: number
  totalB: number
  totalC: number
  grandTotal: number
  itemsA: any[]
  itemsB: any[]
  itemsC: any[]
}

export const QuotePreviewContent = memo(function QuotePreviewContent({
  customerName = "御中",
  subject,
  totalA, totalB, totalC, grandTotal, itemsA, itemsB, itemsC
}: QuotePreviewContentProps) {
  const tax = Math.floor(grandTotal * 0.10)
  const totalWithTax = grandTotal + tax

  const today = new Date()
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`

  // Combine all line items into a single flat list
  const allItems: LineItem[] = [...itemsA, ...itemsB, ...itemsC]

  // Determine how many empty filler rows to show (min 0, aim for ~10 total rows)
  const fillerCount = Math.max(0, 10 - allItems.length)

  return (
    <div className="w-[210mm] h-[297mm] mx-auto bg-white px-[15mm] pt-[12mm] pb-[10mm] flex flex-col text-[12px] text-gray-800 overflow-hidden origin-top">

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
        <section className="w-[58%]">
          <h2 className="text-xl font-normal leading-tight mb-4">
            <small className="text-[0.7em] block mb-1">&nbsp;</small>
            {customerName}<span className="text-lg ml-1">様</span>
          </h2>
          <div className="mb-2 w-full border-b border-gray-300 pb-1">
            <p className="text-sm">件名：<span className="text-[1.1em]">{subject || <>&nbsp;</>}</span></p>
          </div>
          <p className="my-1">有効期限：<span>&nbsp;</span></p>
          <p className="my-1">下記の通り御見積り申し上げます。</p>

          <div className="flex items-center bg-[#F3F8F0] border-y border-gray-300 px-5 py-1.5 mt-3 w-full">
            <p>御見積金額</p>
            <h3 className="ml-4 text-2xl font-normal tracking-wide">¥{totalWithTax.toLocaleString()} -</h3>
          </div>
        </section>

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
            {/* Render actual detail line items */}
            {allItems.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-[#F3F8F0]" : ""}>
                <td className="py-1.5 px-2 border-r border-[#eee] text-left pl-3">{item.name}</td>
                <td className="py-1.5 px-2 border-r border-[#eee] text-right">{item.qty}<span> {item.unit}</span></td>
                <td className="py-1.5 px-2 border-r border-[#eee] text-right">{item.price.toLocaleString()}</td>
                <td className="py-1.5 px-2 text-right">{item.amount.toLocaleString()}</td>
              </tr>
            ))}
            {/* Fill remaining rows to keep table height consistent */}
            {Array.from({ length: fillerCount }).map((_, i) => (
              <tr key={`filler-${i}`} className={(allItems.length + i) % 2 === 0 ? "bg-[#F3F8F0]" : ""}>
                <td className="py-1.5 px-2 border-r border-[#eee]">&nbsp;</td>
                <td className="py-1.5 px-2 border-r border-[#eee]"></td>
                <td className="py-1.5 px-2 border-r border-[#eee]"></td>
                <td className="py-1.5 px-2"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-start mt-auto pt-3">
          <div className="w-[55%] border border-gray-300 rounded p-2 text-[11px] leading-relaxed">
            ※5年間の工事保証書を発行いたします。<br />
            ※シロアリ損害賠償保険付（限度額1000万まで）
          </div>
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

      <footer className="mt-2 text-[9px] leading-relaxed border-t border-gray-400 pt-1.5">
        総合衛研工業は、住みよい環境と安全な暮らし作りをお手伝いする害虫駆除の専門業者です。各所に発生した、シロアリ、ダニ、ゴキブリ、ハチ等を防除・消毒いたします。また、床下換気システムなど住宅設備の工事も承っております。詳しくは、0120-251-625 までお電話下さい。ホームページから、E-Mailでのお問い合わせができます。https://sogoeiken.com/
      </footer>
    </div>
  )
})
