"use client"

import { useState, useEffect, memo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const QuoteFormA = memo(function QuoteFormA({ onUpdate }: { onUpdate: (data: any) => void }) {
  const [area, setArea] = useState<number>(0)
  const [unit, setUnit] = useState<"tsubo" | "sqm">("tsubo")
  const [method, setMethod] = useState<"barrier" | "bait">("barrier")
  
  // Additionals
  const [hasDoor, setHasDoor] = useState(false)
  const [hasConcrete, setHasConcrete] = useState(false)
  const [hasSlab, setHasSlab] = useState(false)
  
  // Example calculation logic (simplified)
  const getSqm = () => unit === "tsubo" ? area * 3.3 : area;
  const basePrice = getSqm() * (method === "barrier" ? 2000 : 3500); // Mock prices
  const additionalPrice = (hasDoor ? 15000 : 0) + (hasConcrete ? 25000 : 0) + (hasSlab ? 10000 : 0);
  const total = basePrice + additionalPrice;

  // Use useEffect to notify parent ONLY when total changes, avoiding focus loss
  // from immediate parent re-renders on every single keystroke.
  useEffect(() => {
    onUpdate({ total })
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
