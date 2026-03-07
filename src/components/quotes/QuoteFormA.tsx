"use client"

import { useState, useEffect, memo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"

export const QuoteFormA = memo(function QuoteFormA({ onUpdate }: { onUpdate: (data: any) => void }) {
  const [area, setArea] = useState<number>(0)
  const [unit, setUnit] = useState<"tsubo" | "sqm">("tsubo")
  const [method, setMethod] = useState<"barrier" | "bait">("barrier")
  
  // Checkbox options
  const [hasDoor, setHasDoor] = useState(false)
  const [hasConcrete, setHasConcrete] = useState(false)
  const [hasSlab, setHasSlab] = useState(false)

  // Dynamic extra items
  const [extraItems, setExtraItems] = useState<{ id: number; name: string; price: number; qty: number }[]>([])

  const addItem = () => {
    setExtraItems([...extraItems, { id: Date.now(), name: "", price: 0, qty: 1 }])
  }

  const removeItem = (id: number) => {
    setExtraItems(extraItems.filter(item => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: string | number) => {
    setExtraItems(extraItems.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const getSqm = () => unit === "tsubo" ? area * 3.3 : area;
  const basePrice = getSqm() * (method === "barrier" ? 2000 : 3500);
  const additionalPrice = (hasDoor ? 15000 : 0) + (hasConcrete ? 25000 : 0) + (hasSlab ? 10000 : 0);
  const extraItemsTotal = extraItems.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const total = basePrice + additionalPrice + extraItemsTotal;

  const buildItems = () => {
    const lineItems: { name: string; qty: number; unit: string; price: number; amount: number }[] = []
    if (area > 0) {
      const unitPrice = method === "barrier" ? 2000 : 3500
      const unitLabel = unit === "tsubo" ? "坪" : "㎡"
      const methodLabel = method === "barrier" ? "バリア工法" : "ベイト工法"
      lineItems.push({
        name: `シロアリ駆除工事（${methodLabel}）`,
        qty: parseFloat(area.toFixed(1)),
        unit: unitLabel,
        price: unitPrice,
        amount: Math.round(basePrice),
      })
    }
    if (hasDoor) lineItems.push({ name: "床下点検口の新規設置", qty: 1, unit: "式", price: 15000, amount: 15000 })
    if (hasConcrete) lineItems.push({ name: "コンクリート斫り（はつり）工事", qty: 1, unit: "式", price: 25000, amount: 25000 })
    if (hasSlab) lineItems.push({ name: "玄関・浴室等への土間処理", qty: 1, unit: "式", price: 10000, amount: 10000 })
    extraItems.forEach(item => {
      if (item.name && item.price > 0) {
        lineItems.push({ name: item.name, qty: item.qty, unit: "式", price: item.price, amount: item.price * item.qty })
      }
    })
    return lineItems
  }

  useEffect(() => {
    onUpdate({ total, items: buildItems() })
  }, [total]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>工法の選択</Label>
          <Select value={method} onValueChange={(v: "barrier" | "bait") => setMethod(v)}>
            <SelectTrigger>
              <SelectValue placeholder="工法を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="barrier">バリア工法 (薬剤散布)</SelectItem>
              <SelectItem value="bait">ベイト工法 (毒餌設置)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>1階床下面積</Label>
          <div className="flex space-x-2">
            <Input 
              type="number" 
              value={area || ''} 
              onChange={(e) => setArea(Number(e.target.value))}
              className="flex-1"
            />
            <Select value={unit} onValueChange={(v: "tsubo" | "sqm") => setUnit(v)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tsubo">坪</SelectItem>
                <SelectItem value="sqm">㎡</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-gray-500 text-right">
            約 {getSqm().toFixed(1)} ㎡
          </p>
        </div>
      </div>

      {/* Dynamic extra items */}
      <div className="space-y-4 pt-4 border-t border-blue-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-blue-900">追加項目</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            項目を追加
          </Button>
        </div>

        <div className="space-y-3">
          {extraItems.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-center">
              <div className="flex-1">
                {index === 0 && <Label className="text-xs text-gray-400 mb-1 block">品目名 / 作業名</Label>}
                <Input 
                  value={item.name} 
                  placeholder="例: 階段壁部シロアリ駆除" 
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
                />
              </div>
              <div className="w-24">
                {index === 0 && <Label className="text-xs text-gray-400 mb-1 block">単価</Label>}
                <Input 
                  type="number" 
                  value={item.price || ''} 
                  onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))} 
                />
              </div>
              <div className="w-20">
                {index === 0 && <Label className="text-xs text-gray-400 mb-1 block">数量</Label>}
                <Input 
                  type="number" 
                  value={item.qty || ''} 
                  onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))} 
                />
              </div>
              <div className="w-24 text-right pt-2 md:pt-6 font-medium text-gray-700">
                ¥{(item.price * item.qty).toLocaleString()}
              </div>
              <div className={index === 0 ? "pt-5" : ""}>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {extraItems.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-3 border rounded-md border-dashed">
              追加項目はありません。「項目を追加」ボタンで自由に追加できます。
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-blue-100">
        <h3 className="font-semibold text-blue-900">追加作業・オプション</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <Label htmlFor="door" className="cursor-pointer">床下点検口の新規設置</Label>
            <Input type="checkbox" className="w-5 h-5" id="door" checked={hasDoor} onChange={(e) => setHasDoor(e.target.checked)} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <Label htmlFor="concrete" className="cursor-pointer">コンクリート斫り（はつり）工事</Label>
            <Input type="checkbox" className="w-5 h-5" id="concrete" checked={hasConcrete} onChange={(e) => setHasConcrete(e.target.checked)} />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <Label htmlFor="slab" className="cursor-pointer">玄関・浴室等への土間処理</Label>
            <Input type="checkbox" className="w-5 h-5" id="slab" checked={hasSlab} onChange={(e) => setHasSlab(e.target.checked)} />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">小計 (A)</p>
          <p className="text-2xl font-bold text-blue-800">¥{total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
})
