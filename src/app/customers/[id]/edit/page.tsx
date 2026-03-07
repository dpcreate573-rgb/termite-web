"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/AppLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Save, ArrowLeft, User, Loader2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { getCustomerById, updateCustomer, type CustomerInput, type CustomerType } from "../../actions"
import { use } from "react"

export default function CustomerEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [notFound, setNotFound] = useState(false)

    // Form state
    const [type, setType] = useState<CustomerType>("法人")
    const [name, setName] = useState("")
    const [furigana, setFurigana] = useState("")
    const [tel, setTel] = useState("")
    const [address, setAddress] = useState("")
    const [contactPerson, setContactPerson] = useState("")
    const [contactPersonTel, setContactPersonTel] = useState("")
    const [referee, setReferee] = useState("")
    const [refereeTel, setRefereeTel] = useState("")
    const [memo, setMemo] = useState("")

    useEffect(() => {
        getCustomerById(id).then(customer => {
            if (!customer) {
                setNotFound(true)
                setIsLoading(false)
                return
            }
            setType(customer.type)
            setName(customer.name)
            setFurigana(customer.furigana || "")
            setTel(customer.tel || "")
            setAddress(customer.address || "")
            setContactPerson(customer.contactPerson || "")
            setContactPersonTel(customer.contactPersonTel || "")
            setReferee(customer.referee || "")
            setRefereeTel(customer.refereeTel || "")
            setMemo(customer.memo || "")
            setIsLoading(false)
        }).catch(() => {
            setNotFound(true)
            setIsLoading(false)
        })
    }, [id])

    const handleSave = async () => {
        if (!name || !tel) {
            alert("顧客名と電話番号は必須です。")
            return
        }
        setIsSaving(true)
        try {
            const input: CustomerInput = {
                id,
                type,
                name,
                furigana,
                tel,
                address,
                contactPerson,
                contactPersonTel,
                referee,
                refereeTel,
                memo,
            }
            await updateCustomer(input)
            router.push(`/customers/${id}`)
        } catch {
            alert("保存に失敗しました。")
        } finally {
            setIsSaving(false)
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
                <div className="flex h-full items-center justify-center p-8 text-gray-500">
                    顧客が見つかりませんでした。
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="p-4 md:p-8">
                <div className="max-w-4xl mx-auto space-y-6 pb-6">

                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Link href="/customers" className="hover:text-gray-900 transition-colors">顧客マスター</Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href={`/customers/${id}`} className="hover:text-gray-900 transition-colors">{name}</Link>
                            <ChevronRight className="w-4 h-4" />
                            <span>編集</span>
                        </div>
                        <h2 className="text-2xl font-bold">顧客情報の編集</h2>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-xl flex items-center gap-3">
                            <User className="w-6 h-6 text-blue-600" />
                            <h3 className="text-xl font-semibold">顧客の基本情報</h3>
                        </div>
                        <div className="p-6 md:p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">顧客区分 <span className="text-red-500">*</span></Label>
                                    <div className="flex gap-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="type" value="法人" checked={type === "法人"} onChange={() => setType("法人")} className="w-4 h-4 text-blue-600" />
                                            <span>法人</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="type" value="個人" checked={type === "個人"} onChange={() => setType("個人")} className="w-4 h-4 text-blue-600" />
                                            <span>個人</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">顧客コード</Label>
                                    <Input value={id} readOnly className="h-11 bg-gray-100 text-gray-500 cursor-not-allowed" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-semibold text-gray-700">顧客名 <span className="text-red-500">*</span></Label>
                                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="例：株式会社Termite / 山田 太郎" className="h-11 text-lg" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">ふりがな</Label>
                                    <Input value={furigana} onChange={e => setFurigana(e.target.value)} placeholder="例：カブシキガイシャターマイト" className="h-11" />
                                </div>
                            </div>

                            <hr className="border-gray-200" />
                            <h4 className="text-base font-bold text-gray-900 border-l-4 border-blue-600 pl-3">連絡先・住所</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">電話番号 <span className="text-red-500">*</span></Label>
                                    <Input type="tel" value={tel} onChange={e => setTel(e.target.value)} placeholder="例：090-1234-5678" className="h-11" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-semibold text-gray-700">住所</Label>
                                    <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="福岡県福岡市博多区..." className="h-11" />
                                </div>
                            </div>

                            <hr className="border-gray-200" />
                            <h4 className="text-base font-bold text-gray-900 border-l-4 border-indigo-500 pl-3">担当者情報</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">担当者名</Label>
                                    <Input value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="例：田中 一郎" className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">担当者電話番号</Label>
                                    <Input type="tel" value={contactPersonTel} onChange={e => setContactPersonTel(e.target.value)} placeholder="例：080-0000-0000" className="h-11" />
                                </div>
                            </div>

                            <hr className="border-gray-200" />
                            <h4 className="text-base font-bold text-gray-900 border-l-4 border-emerald-500 pl-3">紹介者情報</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">紹介者名</Label>
                                    <Input value={referee} onChange={e => setReferee(e.target.value)} placeholder="例：佐藤 花子" className="h-11" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700">紹介者電話番号</Label>
                                    <Input type="tel" value={refereeTel} onChange={e => setRefereeTel(e.target.value)} placeholder="例：090-1111-2222" className="h-11" />
                                </div>
                            </div>

                            <hr className="border-gray-200" />
                            <h4 className="text-base font-bold text-gray-900 border-l-4 border-amber-500 pl-3">メモ</h4>

                            <div className="space-y-2">
                                <textarea
                                    value={memo}
                                    onChange={e => setMemo(e.target.value)}
                                    placeholder="備考・特記事項など自由に入力してください..."
                                    rows={4}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <Button variant="outline" size="lg" onClick={() => router.push(`/customers/${id}`)} className="w-full md:w-auto">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                キャンセルして戻る
                            </Button>
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                                顧客情報を保存する
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    )
}
