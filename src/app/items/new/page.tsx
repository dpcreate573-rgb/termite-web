"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/AppLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Save, ArrowLeft, Package, Loader2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { createItem, type ItemInput } from "../actions"

export default function ItemNewPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    // Form state
    const [category, setCategory] = useState("シロアリ駆除")
    const [name, setName] = useState("")
    const [unitPrice, setUnitPrice] = useState("")
    const [unit, setUnit] = useState("㎡")
    const [remarks, setRemarks] = useState("")

    const handleSave = async () => {
        if (!name || !category || !unit) {
            alert("カテゴリー、品目名、単位は必須です。")
            return
        }

        setIsSaving(true)
        try {
            const parsedPrice = unitPrice ? parseInt(unitPrice.replace(/,/g, ""), 10) : null;
            const finalPrice = isNaN(parsedPrice as number) ? null : parsedPrice;

            const input: ItemInput = {
                category,
                name,
                unitPrice: finalPrice,
                unit,
                remarks: remarks || null,
            }
            await createItem(input)
            router.push(`/items`)
        } catch {
            alert("保存に失敗しました。")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <AppLayout>
            <div className="p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6 pb-6">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Link href="/items" className="hover:text-gray-900 transition-colors">施工品目マスター</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span>新規追加</span>
                        </div>
                        <h2 className="text-2xl font-bold">新規品目の登録</h2>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-xl flex items-center gap-3">
                            <Package className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-semibold">品目の基本情報</h3>
                        </div>
                        <div className="p-6 md:p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">カテゴリー <span className="text-red-500">*</span></Label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="flex h-11 w-full rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="シロアリ駆除">シロアリ駆除</option>
                                        <option value="害虫・害獣駆除">害虫・害獣駆除</option>
                                        <option value="商品・物販・その他業務">商品・物販・その他業務</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">品目名（施工・商品名） <span className="text-red-500">*</span></Label>
                                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="例：シロアリ駆除工事（ヤマトシロアリ）" className="h-11 text-lg" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">単価</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">¥</span>
                                        </div>
                                        <Input type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="0" className="h-11 pl-7" />
                                    </div>
                                    <p className="text-xs text-gray-500">※単位「式」などで都度見積もりの場合は空欄にしてください</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">単位 <span className="text-red-500">*</span></Label>
                                    <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="例：㎡, 坪, 式, 箇所" className="h-11" />
                                </div>
                            </div>

                            <hr className="border-gray-200" />
                            <h4 className="text-base font-bold text-gray-900 border-l-4 border-amber-500 pl-3">備考・仕様</h4>

                            <div className="space-y-2">
                                <textarea
                                    value={remarks}
                                    onChange={e => setRemarks(e.target.value)}
                                    placeholder="備考・特記事項など自由に入力してください..."
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <Button variant="outline" size="lg" onClick={() => router.push(`/items`)} className="w-full md:w-auto">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                キャンセルして戻る
                            </Button>
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                                品目を登録する
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    )
}
