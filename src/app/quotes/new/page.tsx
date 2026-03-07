"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { getCustomers } from "@/app/customers/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AppLayout } from "@/components/AppLayout"

import { QuoteFormA } from "@/components/quotes/QuoteFormA"
import { QuoteFormB } from "@/components/quotes/QuoteFormB"
import { QuoteFormC } from "@/components/quotes/QuoteFormC"
import { QuotePreviewContent, type LineItem } from "@/components/quotes/QuotePreviewContent"
import { Suspense } from "react"
import { createQuoteAction } from "../actions"

// type definition for local customer data
type CustomerMin = {
  id: string;
  type: string;
  name: string;
  furigana?: string | null;
  tel?: string | null;
  address?: string | null;
  contactPerson?: string | null;
  contactPersonTel?: string | null;
};

function NewQuoteForm() {
  const searchParams = useSearchParams()
  const [types, setTypes] = useState<string[]>([])

  // 顧客情報
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [customerName, setCustomerName] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [quoteId, setQuoteId] = useState<string>("")

  // オートコンプリート用
  const [allCustomers, setAllCustomers] = useState<CustomerMin[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerMin[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerMin | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [totalA, setTotalA] = useState(0)
  const [totalB, setTotalB] = useState(0)
  const [totalC, setTotalC] = useState(0)
  const [itemsA, setItemsA] = useState<LineItem[]>([])
  const [itemsB, setItemsB] = useState<LineItem[]>([])
  const [itemsC, setItemsC] = useState<LineItem[]>([])

  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam === 'ABC') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTypes(['A', 'B', 'C'])
    } else if (typeParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTypes([typeParam])
    }

    const cid = searchParams.get('customerId')
    const cname = searchParams.get('customerName')
    if (cid) setCustomerId(cid)
    if (cname) setCustomerName(cname)

    // 見積番号の自動生成 (例: Q-YYYYMMDD-XXXX)
    const now = new Date()
    const datePart = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
    setQuoteId(`Q-${datePart}-${randomPart}`)

    // 顧客リストの取得
    getCustomers().then(data => {
      setAllCustomers(data)
    }).catch(console.error)
  }, [searchParams])

  // 画面外クリックでドロップダウンを閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setCustomerName(val)
    setSelectedCustomer(null)
    setCustomerId(null)

    if (val.trim() === '') {
      setFilteredCustomers([])
      setIsDropdownOpen(false)
    } else {
      const filtered = allCustomers.filter(c =>
        c.name.toLowerCase().includes(val.toLowerCase()) ||
        (c.furigana && c.furigana.toLowerCase().includes(val.toLowerCase()))
      )
      setFilteredCustomers(filtered)
      setIsDropdownOpen(true)
    }
  }

  const handleSelectCustomer = (customer: CustomerMin) => {
    setCustomerName(customer.name)
    setCustomerId(customer.id)
    setSelectedCustomer(customer)
    setIsDropdownOpen(false)
  }

  // 件名に応じた自動カテゴリチェック
  useEffect(() => {
    if (!subject.trim()) return;

    const keywordsA = ["シロアリ", "白蟻", "しろあり", "防除", "予防"];
    const keywordsB = ["ハチ", "蜂", "ゴキブリ", "ネズミ", "鼠", "ダニ", "ノミ", "害虫", "コウモリ", "ハクビシン"];
    const keywordsC = ["点検", "床下", "換気扇", "調湿", "物販", "販売"];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTypes(current => {
      const newTypes = [...current];
      let changed = false;

      if (!current.includes('A') && keywordsA.some(k => subject.includes(k))) {
        newTypes.push('A');
        changed = true;
      }
      if (!current.includes('B') && keywordsB.some(k => subject.includes(k))) {
        newTypes.push('B');
        changed = true;
      }
      if (!current.includes('C') && keywordsC.some(k => subject.includes(k))) {
        newTypes.push('C');
        changed = true;
      }

      return changed ? newTypes : current;
    });
  }, [subject]);

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

  const handleUpdateA = (data: { total: number; items?: LineItem[] }) => { setTotalA(data.total); if (data.items) setItemsA(data.items) }
  const handleUpdateB = (data: { total: number; items?: LineItem[] }) => { setTotalB(data.total); if (data.items) setItemsB(data.items) }
  const handleUpdateC = (data: { total: number; items?: LineItem[] }) => { setTotalC(data.total); if (data.items) setItemsC(data.items) }

  const grandTotal = useMemo(() => {
    let t = 0;
    if (types.includes('A')) t += totalA;
    if (types.includes('B')) t += totalB;
    if (types.includes('C')) t += totalC;
    return t;
  }, [types, totalA, totalB, totalC]);

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveAndUpload = async () => {
    if (!customerName || !subject) {
      alert("宛名と件名を入力してください");
      return;
    }

    setIsSaving(true);
    try {
      const result = await createQuoteAction({
        quoteId,
        customerId,
        customerName,
        subject,
        projectTypes: types,
        itemsA,
        itemsB,
        itemsC
      });

      if (result.success) {
        // 保存成功
        const previewData = {
          types, totalA, totalB, totalC, grandTotal,
          customerId, customerName, subject, quoteId,
          itemsA, itemsB, itemsC
        };
        localStorage.setItem('quotePreviewData', JSON.stringify(previewData));

        alert("見積書を保存しました");
        // 見積一覧へ戻る
        window.location.href = '/quotes';
      }
    } catch (error) {
      console.error("Failed to save quote:", error);
      alert("保存に失敗しました。もう一度お試しください。");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-5xl">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">新規見積作成</h1>
          <p className="text-sm text-gray-500 mt-1 font-mono">見積番号: {quoteId}</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>戻る</Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold">基本情報</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2 relative" ref={dropdownRef}>
              <Label htmlFor="customerName">宛名（お客様名・貴社名）</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={handleCustomerNameChange}
                onFocus={() => { if (customerName) setIsDropdownOpen(true) }}
                placeholder="例: 株式会社サンプル"
                className="w-full"
                autoComplete="off"
              />
              {isDropdownOpen && filteredCustomers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCustomers.map(c => (
                    <div
                      key={c.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSelectCustomer(c)}
                    >
                      <div className="font-medium text-gray-900">{c.name}</div>
                      <div className="text-xs text-gray-500 flex gap-2 mt-0.5">
                        <span className="font-mono">{c.id}</span>
                        <span>{c.type}</span>
                        {c.tel && <span>{c.tel}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isDropdownOpen && filteredCustomers.length === 0 && customerName.trim() !== '' && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-sm text-gray-500 text-center">
                  該当する顧客が見つかりません。新しい顧客として登録・表示されます。
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">件名</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="例: シロアリ駆除工事"
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-4 border border-gray-100 h-full flex flex-col justify-center">
            {selectedCustomer ? (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-2">顧客詳細情報</h3>
                <div className="grid grid-cols-[80px_1fr] gap-2 text-sm text-gray-600">
                  <span className="text-gray-400">住所:</span>
                  <span>{selectedCustomer.address || "未登録"}</span>
                  <span className="text-gray-400">電話番号:</span>
                  <span>{selectedCustomer.tel || "未登録"}</span>
                  <span className="text-gray-400">担当者:</span>
                  <span>{selectedCustomer.contactPerson || "未登録"} {selectedCustomer.contactPersonTel ? `(${selectedCustomer.contactPersonTel})` : ''}</span>
                  <span className="text-gray-400">顧客区分:</span>
                  <span>{selectedCustomer.type}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400 text-center flex flex-col items-center justify-center h-full">
                <p>宛名を選択すると、</p>
                <p>ここに顧客の詳細情報が表示されます</p>
              </div>
            )}
          </div>
        </div>
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
          <Card className="border-blue-200 shadow-sm">
            <CardHeader className="bg-blue-50 border-b py-3 rounded-t-lg">
              <CardTitle className="text-blue-800 text-lg">A. シロアリ駆除入力項目</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pb-2">
              <QuoteFormA onUpdate={handleUpdateA} subject={subject} />
            </CardContent>
          </Card>
        )}

        {types.includes('B') && (
          <Card className="border-green-200 shadow-sm">
            <CardHeader className="bg-green-50 border-b py-3 rounded-t-lg">
              <CardTitle className="text-green-800 text-lg">B. 害虫・害獣駆除入力項目</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pb-2">
              <QuoteFormB onUpdate={handleUpdateB} subject={subject} />
            </CardContent>
          </Card>
        )}

        {types.includes('C') && (
          <Card className="border-orange-200 shadow-sm">
            <CardHeader className="bg-orange-50 border-b py-3 rounded-t-lg">
              <CardTitle className="text-orange-800 text-lg">C. 商品・物販・その他入力項目</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pb-2">
              <QuoteFormC onUpdate={handleUpdateC} subject={subject} />
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
                <p className="text-sm text-gray-500 mb-1">小計 (税抜)</p>
                <p className="text-3xl font-bold text-gray-700 tracking-tight">
                  <span className="text-xl mr-1">¥</span>
                  {grandTotal.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  消費税 (10%): ¥{Math.floor(grandTotal * 0.1).toLocaleString()}
                </p>
                <p className="text-sm text-gray-900 font-bold mt-2 pt-2 border-t border-gray-200">
                  税込合計: <span className="text-4xl ml-2 tracking-tight">¥{Math.floor(grandTotal * 1.1).toLocaleString()}</span>
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
              <Button variant="outline" size="lg" className="w-full md:w-auto" onClick={() => setShowPreview(true)}>プレビュー (PDF)</Button>
              <Button size="lg" className="w-full md:w-48 text-md font-semibold shadow-sm" onClick={handleSaveAndUpload} disabled={isSaving}>
                {isSaving ? "保存中..." : "見積を保存して完了"}
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

      {/* 見積プレビューモーダル */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[900px] sm:max-w-[900px] w-[95vw] h-[95vh] p-0 overflow-hidden bg-gray-200 flex flex-col">
          <div className="flex justify-between items-center px-6 pt-4 pb-2">
            <DialogTitle className="text-lg font-semibold">見積書プレビュー</DialogTitle>
            <DialogDescription className="sr-only">見積書のA4プレビュー表示</DialogDescription>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                localStorage.setItem('quotePreviewData', JSON.stringify({
                  types, totalA, totalB, totalC, grandTotal,
                  customerId, customerName, subject, quoteId
                }))
                window.open('/quotes/preview', '_blank')
              }}>印刷用に開く</Button>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>閉じる</Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-gray-400 py-6">
            <div className="shadow-2xl border border-gray-300 rounded overflow-hidden mx-auto w-fit">
              <QuotePreviewContent
                quoteId={quoteId}
                customerName={customerName}
                subject={subject}
                totalA={totalA}
                totalB={totalB}
                totalC={totalC}
                grandTotal={grandTotal}
                itemsA={itemsA}
                itemsB={itemsB}
                itemsC={itemsC}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function NewQuotePage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-10 text-center text-gray-500">読み込み中...</div>}>
        <NewQuoteForm />
      </Suspense>
    </AppLayout>
  )
}
