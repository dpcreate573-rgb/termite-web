"use client"

import { useState, useEffect, memo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Search } from "lucide-react"

export const QuoteFormC = memo(function QuoteFormC({ onUpdate }: { onUpdate: (data: any) => void }) {
  const [items, setItems] = useState([{ id: 1, name: "市販忌避剤", price: 2500, qty: 2 }])
  
  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", price: 0, qty: 1 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0)

  useEffect(() => {
    onUpdate({ total })
  }, [total]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-orange-900">明細入力</h3>
        <div className="space-x-2">
          <Button type="button" variant="secondary" size="sm">
            <Search className="w-4 h-4 mr-2" />
            商品マスタ検索
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            行を追加
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-2 items-center">
            <div className="flex-1">
              {index === 0 && <Label className="text-xs text-gray-400 mb-1 block">品名（または業務名）</Label>}
              <Input 
                value={item.name} 
                placeholder="例: 防虫ネット張替え" 
                onChange={(e) => updateItem(item.id, 'name', e.target.value)} 
              />
            </div>
            <div className="w-28">
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
            <div className="w-28 text-right pt-2 md:pt-6 font-medium text-gray-700">
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
            明細行がありません
          </p>
        )}
      </div>

      <div className="pt-4 border-t flex justify-end">
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">小計 (C)</p>
          <p className="text-2xl font-bold text-orange-800">¥{total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
})
