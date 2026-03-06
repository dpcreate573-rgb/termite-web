"use client"

import { useState, useEffect, memo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"

export const QuoteFormB = memo(function QuoteFormB({ onUpdate }: { onUpdate: (data: any) => void }) {
  const [pattern, setPattern] = useState<"spot" | "periodic">("spot")
  const [items, setItems] = useState([{ id: 1, name: "トラップ（粘着シート等）", price: 1000, qty: 5 }])
  
  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", price: 0, qty: 1 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const basePrice = pattern === "spot" ? 20000 : 50000;
  const total = basePrice + itemsTotal;

  useEffect(() => {
    onUpdate({ total })
  }, [total]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>業務パターンの選択</Label>
        <Select value={pattern} onValueChange={(v: "spot" | "periodic") => setPattern(v)}>
          <SelectTrigger className="w-full md:w-1/2">
            <SelectValue placeholder="業務パターン" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="spot">スポット駆除 (1回のみ)</SelectItem>
            <SelectItem value="periodic">定期管理 (IPMに基づく調査・防除)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">基本料金: ¥{basePrice.toLocaleString()}</p>
      </div>

      <div className="space-y-4 pt-4 border-t border-green-100">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-green-900">資材・作業費用</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            項目を追加
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-center">
              <div className="flex-1">
                {index === 0 && <Label className="text-xs text-gray-400 mb-1 block">品目名 / 作業名</Label>}
                <Input 
                  value={item.name} 
                  placeholder="例: 殺鼠剤・食毒剤の配置" 
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
          {items.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4 border rounded-md border-dashed">
              項目がありません
            </p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t flex justify-end">
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">小計 (B)</p>
          <p className="text-2xl font-bold text-green-800">¥{total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
})
