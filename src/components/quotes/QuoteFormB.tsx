"use client"

import { useState, useEffect, memo, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QuotePreviewContent, type LineItem } from "@/components/quotes/QuotePreviewContent"
import { Trash2, Plus, Save } from "lucide-react"
import { getItemsByCategory, createItem } from "@/app/items/actions"

// type definition for local master item data
type MasterItem = {
  name: string;
  unitPrice: number | null;
  unit: string;
}

type PestItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  unit: string;
}

const getMatchScore = (name: string, subject: string) => {
  if (!subject) return 0;

  // 対象物（高スコア: 10点）: グループ内のいずれかの単語が件名・品名両方に含まれれば関連とみなす
  const targetGroups = [
    ["シロアリ", "白蟻", "しろあり"],
    ["ハチ", "蜂", "スズメバチ", "アシナガバチ", "ミツバチ"],
    ["ゴキブリ"],
    ["ネズミ", "鼠"],
    ["ダニ"],
    ["ノミ"],
    ["コウモリ"],
    ["ハクビシン"],
    ["換気扇"],
    ["調湿"]
  ];
  // 動作・状態（低スコア: 1点）
  const actions = ["防除", "予防", "駆除", "点検", "床下", "物販", "販売", "工事", "施工"];

  let score = 0;

  for (const group of targetGroups) {
    const subjectHasGroup = group.some(k => subject.includes(k));
    const nameHasGroup = group.some(k => name.includes(k));
    if (subjectHasGroup && nameHasGroup) {
      score += 10;
    }
  }

  for (const a of actions) {
    if (subject.includes(a) && name.includes(a)) score += 1;
  }

  // 完全一致または部分一致のボーナス
  if (subject.includes(name) || name.includes(subject)) score += 20;

  return score;
}

export const QuoteFormB = memo(function QuoteFormB({ onUpdate, subject = "" }: { onUpdate: (data: { total: number; items?: LineItem[] }) => void, subject?: string }) {
  const [items, setItems] = useState<PestItem[]>([
    { id: 1, name: "", price: 0, qty: 1, unit: "式" }
  ])

  // オートコンプリート用の状態
  const [activeInputId, setActiveInputId] = useState<number | null>(null)
  const [masterSuggestions, setMasterSuggestions] = useState<MasterItem[]>([])
  const [filteredSuggestions, setFilteredSuggestions] = useState<MasterItem[]>([])
  const [isSavingItem, setIsSavingItem] = useState<{ [key: number]: boolean }>({})
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  // 初期化時に害虫駆除カテゴリの品目マスターを取得
  useEffect(() => {
    getItemsByCategory("害虫・害獣駆除").then(data => {
      const formattedItems = data.map(item => ({
        name: item.name,
        unitPrice: item.unitPrice,
        unit: item.unit
      }));
      setMasterSuggestions(formattedItems)
      setFilteredSuggestions(formattedItems)
    }).catch(console.error)
  }, [])

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", price: 0, qty: 1, unit: "式" }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: number, field: keyof PestItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))

    // サジェストの絞り込み
    if (field === 'name') {
      const query = value as string;
      if (query.trim() === '') {
        setFilteredSuggestions(masterSuggestions)
      } else {
        setFilteredSuggestions(masterSuggestions.filter(s => s.name.toLowerCase().includes(query.toLowerCase())))
      }
    }
  }

  const handleSelectSuggestion = (id: number, suggestion: MasterItem) => {
    setItems(items.map(item => item.id === id ? {
      ...item,
      name: suggestion.name,
      price: suggestion.unitPrice || 0,
      unit: suggestion.unit
    } : item))
    setActiveInputId(null)
  }

  const handleRegisterItem = async (item: PestItem) => {
    if (!item.name || item.name.trim() === '') return;

    setIsSavingItem(prev => ({ ...prev, [item.id]: true }));
    try {
      await createItem({
        category: "害虫・害獣駆除",
        name: item.name,
        unitPrice: item.price,
        unit: item.unit,
        remarks: null
      });
      // Add to local state so it suggests immediately
      const newItem: MasterItem = { name: item.name, unitPrice: item.price, unit: item.unit };
      setMasterSuggestions(prev => [...prev, newItem]);

      alert(`「${item.name}」をマスターに登録しました`);
    } catch (error) {
      console.error("Failed to register item:", error);
      alert("マスター登録に失敗しました");
    } finally {
      setIsSavingItem(prev => ({ ...prev, [item.id]: false }));
    }
  }

  // 画面外クリックでサジェストを閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeInputId !== null && dropdownRefs.current[activeInputId]) {
        if (!dropdownRefs.current[activeInputId]?.contains(event.target as Node)) {
          setActiveInputId(null)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [activeInputId])

  const isDiscountItem = (name: string) => name.includes("値引き");

  const total = items.reduce((sum, item) => {
    const isDiscount = isDiscountItem(item.name);
    const price = isDiscount ? -Math.abs(item.price) : item.price;
    return sum + Math.floor(price * item.qty);
  }, 0)

  const buildItems = () => {
    return items
      .filter(item => item.name)
      .map(item => {
        const isDiscount = isDiscountItem(item.name);
        const price = isDiscount ? -Math.abs(item.price) : item.price;
        return {
          name: item.name,
          qty: item.qty,
          unit: item.unit || "式",
          price: price,
          amount: Math.floor(price * item.qty)
        };
      })
  }

  useEffect(() => {
    onUpdate({ total, items: buildItems() })
  }, [total, items]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-green-900">害虫駆除 施工内容</h3>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="w-4 h-4 mr-2" />
          行を追加
        </Button>
      </div>

      <div className="space-y-3">
        {/* ヘッダー */}
        <div className="hidden md:flex gap-2 px-2 text-xs font-semibold text-gray-500 items-center">
          <div className="flex-[2] min-w-0">品目名 / 作業名</div>
          <div className="flex w-full md:w-auto gap-2">
            <div className="flex-1 md:w-24 text-right">単価</div>
            <div className="w-20 text-right">数量</div>
            <div className="w-20 text-center">単位</div>
          </div>
          <div className="flex items-center md:w-auto gap-2">
            <div className="w-24 text-right">金額</div>
            <div className="w-9"></div>
          </div>
        </div>

        {items.map((item) => {
          const isDiscount = isDiscountItem(item.name);
          return (
            <div key={item.id} className={`flex flex-col md:flex-row gap-2 items-start md:items-center bg-gray-50/50 p-3 md:p-2 rounded-md border border-gray-100 relative ${activeInputId === item.id ? 'z-50' : 'z-10'} ${isDiscount ? 'text-red-600 border-red-100 bg-red-50/30' : ''}`}>

              {/* 品目名 */}
              <div className="flex-[2] w-full relative" ref={(el) => { dropdownRefs.current[item.id] = el; }}>
                <div className="md:hidden text-xs text-gray-500 mb-1">品目名 / 作業名</div>
                <div className="flex gap-2 items-center">
                  <Input
                    value={item.name}
                    placeholder="例: トラップ設置"
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    onFocus={() => {
                      setActiveInputId(item.id);
                      const query = item.name.trim();
                      const baseList = [...masterSuggestions];
                      if (subject.trim()) {
                        baseList.sort((a, b) => getMatchScore(b.name, subject) - getMatchScore(a.name, subject));
                      }
                      setFilteredSuggestions(query === '' ? baseList : baseList.filter(s => s.name.toLowerCase().includes(query.toLowerCase())));
                    }}
                    className={`w-full bg-white ${isDiscount ? 'text-red-600 font-medium' : ''}`}
                    autoComplete="off"
                  />

                  {item.name.trim() !== '' && !masterSuggestions.some(m => m.name === item.name) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 shrink-0 h-9 w-9 bg-white shadow-sm"
                      onClick={() => handleRegisterItem(item)}
                      disabled={isSavingItem[item.id]}
                      title="この品目をマスターに登録する"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* サジェストドロップダウン */}
                {activeInputId === item.id && filteredSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredSuggestions.map((s, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                        onClick={() => handleSelectSuggestion(item.id, s)}
                      >
                        <div className="font-medium text-gray-800">{s.name}</div>
                        <div className="text-xs text-gray-500">
                          {s.unitPrice !== null ? `¥${s.unitPrice.toLocaleString()}` : '単価未設定'} / {s.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex w-full md:w-auto gap-2">
                {/* 単価 */}
                <div className="flex-1 md:w-24">
                  <div className="md:hidden text-xs text-gray-500 mb-1">単価</div>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={item.price === 0 && item.name === '' ? '' : (isDiscount ? -Math.abs(item.price) : item.price).toLocaleString()}
                    onChange={(e) => {
                      const val = e.target.value;
                      const isDiscountItemCurrent = isDiscountItem(item.name);

                      const rawValue = val.replace(/[^-0-9]/g, '');

                      if (rawValue === '' || rawValue === '-') {
                        updateItem(item.id, 'price', 0);
                        return;
                      }

                      const numValue = parseInt(rawValue, 10);
                      if (!isNaN(numValue)) {
                        updateItem(item.id, 'price', isDiscountItemCurrent ? Math.abs(numValue) : numValue);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '-') return;
                    }}
                    placeholder="0"
                    className={`w-full text-right bg-white ${isDiscount ? 'text-red-600 font-bold' : ''}`}
                  />
                </div>

                {/* 数量 */}
                <div className="w-20">
                  <div className="md:hidden text-xs text-gray-500 mb-1">数量</div>
                  <Input
                    type="number"
                    step="0.1"
                    value={item.qty === 0 ? '' : item.qty}
                    onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                    className="w-full text-right bg-white"
                  />
                </div>

                {/* 単位 */}
                <div className="w-20">
                  <div className="md:hidden text-xs text-gray-500 mb-1">単位</div>
                  <Input
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                    className="w-full text-center bg-white"
                    placeholder="式"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                {/* 金額 */}
                <div className="w-24 text-right font-medium text-gray-800">
                  <span className="md:hidden text-xs text-gray-500 mr-2">金額:</span>
                  ¥{Math.floor((isDiscount ? -Math.abs(item.price) : item.price) * item.qty).toLocaleString()}
                </div>

                {/* 削除ボタン */}
                <div className="w-10 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 -mr-2 md:-mr-0"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1 && item.name === '' && item.price === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t flex justify-end">
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">害虫駆除 計</p>
          <p className="text-2xl font-bold text-green-800">¥{total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
})
