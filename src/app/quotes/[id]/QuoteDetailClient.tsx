"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit3, Save, Lock, FileText, Loader2, Printer } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { QuotePreviewContent } from "@/components/quotes/QuotePreviewContent"
import { formatWareki } from "@/lib/date"

import { updateQuoteDetailAction } from "./actions"

type QuoteDetailItem = {
    id: string;
    quoteId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
};

type QuoteDetailClientProps = {
    quoteId: string;
    status: string;
    subject: string | null;
    customerName: string;
    itemsA: QuoteDetailItem[];
    grandTotal: number;
    createdAt: number | Date;
    projectId?: string;
    projectTypes?: string[];
    totalA?: number;
    defaultEditMode?: boolean;
}

export function QuoteDetailClient({
    quoteId,
    status,
    subject,
    customerName,
    itemsA,
    grandTotal,
    createdAt,
    defaultEditMode = false
}: QuoteDetailClientProps) {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(defaultEditMode && status !== "completed")
    const [isSaving, setIsSaving] = useState(false)

    // Form state (Editing mode mockup)
    const [editedSubject, setEditedSubject] = useState(subject || "")
    const [editedCustomer, setEditedCustomer] = useState(customerName)
    // Detailed items editing state could be more complex, keeping simple for demo
    const [editItems, setEditItems] = useState<QuoteDetailItem[]>([...itemsA])

    const isLocked = status === "completed"

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateQuoteDetailAction(quoteId, editedSubject, editedCustomer, editItems)
            setIsEditing(false)
            // Force refresh to pull fresh from DB via Server Actions
        } catch (error) {
            console.error(error)
            alert("保存に失敗しました。")
        } finally {
            setIsSaving(false)
        }
    }

    const toggleEdit = () => {
        if (isLocked) return;
        setIsEditing(!isEditing)
        setEditedSubject(subject || "")
        setEditedCustomer(customerName)
        setEditItems([...itemsA])
    }

    const handleItemChange = (index: number, field: keyof QuoteDetailItem, value: string | number) => {
        const newItems = [...editItems]
        newItems[index] = { ...newItems[index], [field]: value }
        if (field === "quantity" || field === "unitPrice") {
            const q = Number(newItems[index].quantity) || 0;
            const up = Number(newItems[index].unitPrice) || 0;
            newItems[index].totalPrice = q * up;
        }
        setEditItems(newItems)
    }

    const currentTotal = isEditing
        ? editItems.reduce((acc, curr) => acc + curr.totalPrice, 0)
        : grandTotal;

    const formattedDate = formatWareki(createdAt);

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-8 max-w-5xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                        <Link href="/quotes" className="hover:text-neutral-900 transition-colors">見積書管理</Link>
                        <span className="text-neutral-400">/</span>
                        <span>{customerName} 様 ({formattedDate} 作成)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600">
                            見積詳細
                        </h1>
                        {isLocked ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                                <Lock className="w-3 h-3 mr-1" />
                                完了・出力済
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                                進行中
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" onClick={() => isEditing ? toggleEdit() : router.push('/quotes')} className="w-full md:w-auto">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        戻る
                    </Button>
                    {!isLocked && !isEditing && (
                        <Button onClick={toggleEdit} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Edit3 className="w-4 h-4 mr-2" />
                            見積を編集する
                        </Button>
                    )}
                    {!isEditing && (
                        <Button
                            variant="outline"
                            className="w-full md:w-auto"
                            onClick={() => window.print()}
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            PDF・印刷
                        </Button>
                    )}
                    {isEditing && (
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button variant="outline" onClick={toggleEdit} disabled={isSaving}>キャンセル</Button>
                            <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                保存する
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Read-only Alert */}
            {isLocked && !isEditing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-blue-800">
                    <FileText className="w-5 h-5 flex-shrink-0 text-blue-600" />
                    <p className="text-sm">
                        この見積書はステータスが「完了」となっているため、内容の編集はできません。閲覧および印刷のみ可能です。
                    </p>
                </div>
            )}

            {/* Content Area */}
            {isEditing ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <Card className="border-blue-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-blue-50/50 border-b py-4">
                            <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
                                <Edit3 className="w-5 h-5" />
                                見積内容の編集
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-neutral-700 font-semibold">件名</Label>
                                    <Input
                                        value={editedSubject}
                                        onChange={(e) => setEditedSubject(e.target.value)}
                                        className="h-11"
                                        placeholder="シロアリ駆除工事一式"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-neutral-700 font-semibold">宛名（お客様名・貴社名）</Label>
                                    <Input
                                        value={editedCustomer}
                                        onChange={(e) => setEditedCustomer(e.target.value)}
                                        className="h-11"
                                        placeholder="株式会社サンプル"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-neutral-100">
                                <Label className="text-neutral-700 font-semibold text-base">見積明細</Label>
                                <div className="space-y-3">
                                    {editItems.map((item, index) => (
                                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                                            <div className="md:col-span-5 space-y-1">
                                                <Label className="text-xs text-neutral-500">品目名</Label>
                                                <Input
                                                    value={item.itemName}
                                                    onChange={e => handleItemChange(index, "itemName", e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-1">
                                                <Label className="text-xs text-neutral-500">数量</Label>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={e => handleItemChange(index, "quantity", e.target.value)}
                                                />
                                            </div>
                                            <div className="md:col-span-3 space-y-1">
                                                <Label className="text-xs text-neutral-500">単価</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">¥</span>
                                                    <Input
                                                        type="number"
                                                        className="pl-7"
                                                        value={item.unitPrice}
                                                        onChange={e => handleItemChange(index, "unitPrice", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-1 text-right">
                                                <Label className="text-xs text-neutral-500 block text-right">小計</Label>
                                                <div className="h-10 flex items-center justify-end font-semibold text-neutral-900">
                                                    ¥{(Number(item.totalPrice) || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-neutral-200 shadow-sm bg-neutral-50">
                        <CardContent className="p-6 flex flex-col items-end">
                            <p className="text-sm text-neutral-500 mb-1">見積金額合計 (税抜)</p>
                            <p className="text-4xl font-bold text-neutral-900 tracking-tight">
                                <span className="text-2xl mr-1 text-neutral-500">¥</span>
                                {currentTotal.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="bg-neutral-300 rounded-xl overflow-hidden print:bg-white print:rounded-none">
                    <div className="overflow-x-auto py-8 px-4 sm:px-12 print:p-0">
                        <div className="mx-auto w-fit">
                            <div className="shadow-[0_8px_40px_rgba(0,0,0,0.35)] print:shadow-none">
                                <QuotePreviewContent
                                    quoteId={quoteId}
                                    customerName={customerName}
                                    subject={subject || ""}
                                    totalA={currentTotal}
                                    totalB={0}
                                    totalC={0}
                                    grandTotal={currentTotal}
                                    itemsA={itemsA.map(i => ({
                                        name: i.itemName ?? "",
                                        qty: Number(i.quantity) || 1,
                                        unit: "式",
                                        price: Number(i.unitPrice) || 0,
                                        amount: Number(i.totalPrice) || 0,
                                    }))}
                                    itemsB={[]}
                                    itemsC={[]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
