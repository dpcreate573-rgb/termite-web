"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/AppLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Save, ArrowLeft, Package, Loader2, ChevronRight, Trash2 } from "lucide-react"
import Link from "next/link"
import { getItemById, updateItem, deleteItem, type ItemInput } from "../../actions"
import { use } from "react"

export default function ItemEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [notFound, setNotFound] = useState(false)

    // Form state
    const [category, setCategory] = useState("シロアリ駆除")
    const [name, setName] = useState("")
    const [unitPrice, setUnitPrice] = useState("")
    const [unit, setUnit] = useState("㎡")
    const [remarks, setRemarks] = useState("")

    useEffect(() => {
        getItemById(id).then(item => {
            if (!item) {
                setNotFound(true)
                setIsLoading(false)
                return
            }
            setCategory(item.category)
            setName(item.name)
            setUnitPrice(item.unitPrice !== null ? item.unitPrice.toString() : "")
            setUnit(item.unit)
            setRemarks(item.remarks || "")
            setIsLoading(false)
        }).catch(() => {
            setNotFound(true)
            setIsLoading(false)
        })
    }, [id])

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
                id,
                category,
                name,
                unitPrice: finalPrice,
                unit,
                remarks: remarks || null,
            }
            await updateItem(input)
            router.push(`/items`)
        } catch {
            alert("保存に失敗しました。")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("本当にこの品目を削除しますか？この操作は取り消せません。")) {
            return
        }
        setIsDeleting(true)
        try {
            await deleteItem(id)
            router.push(`/items`)
        } catch {
            alert("削除に失敗しました。")
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex h-full items-center justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </AppLayout>
        )
    }

    if (notFound) {
        return (
            <AppLayout>
                <div className="flex h-full items-center justify-center p-8 text-neutral-500">
                    品目が見つかりませんでした。
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6 pb-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                                <Link href="/items" className="hover:text-neutral-900 transition-colors">施工品目マスター</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="truncate max-w-[200px]">{name}</span>
                                <ChevronRight className="w-4 h-4" />
                                <span>編集</span>
                            </div>
                            <h2 className="text-2xl font-bold">品目情報の編集</h2>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
                        <div className="p-6 border-b border-neutral-100 bg-neutral-50/50 rounded-t-xl flex items-center gap-3">
                            <Package className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-semibold">品目の基本情報</h3>
                        </div>
                        <div className="p-6 md:p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-neutral-700">カテゴリー <span className="text-red-500">*</span></Label>
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
                                    <Label className="text-sm font-semibold text-neutral-700">品目名（施工・商品名） <span className="text-red-500">*</span></Label>
                                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="例：シロアリ駆除工事（ヤマトシロアリ）" className="h-11 text-lg" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-neutral-700">単価</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-neutral-500 sm:text-sm">¥</span>
                                        </div>
                                        <Input type="number" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="0" className="h-11 pl-7" />
                                    </div>
                                    <p className="text-xs text-neutral-500">※単位「式」などで都度見積もりの場合は空欄にしてください</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-neutral-700">単位 <span className="text-red-500">*</span></Label>
                                    <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="例：㎡, 坪, 式, 箇所" className="h-11" />
                                </div>
                            </div>

                            <hr className="border-neutral-200" />
                            <h4 className="text-base font-bold text-neutral-900 border-l-4 border-amber-500 pl-3">備考・仕様</h4>

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
                    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full md:w-auto" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                            この品目を削除する
                        </Button>

                        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                            <Button variant="outline" size="lg" onClick={() => router.push(`/items`)} className="w-full md:w-auto">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                キャンセルして戻る
                            </Button>
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                                品目情報を保存する
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    )
}
