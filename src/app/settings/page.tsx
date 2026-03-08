"use client"

import { useState, useEffect, useRef } from "react"
import {
    Save, Building2, Laptop, Users2, ImagePlus,
    Stamp, Mail, UserPlus, Trash2, Info, Check, Loader2
} from "lucide-react"
import { AppLayout } from "@/components/AppLayout"
import { getSettings, updateSettings } from "./actions"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("company")
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState<any>({
        companyName: "",
        representative: "",
        accreditationNumber: "",
        zipCode: "",
        address: "",
        tel: "",
        fax: "",
        logoUrl: "",
        stampUrl: "",
        bankAccount1: "",
        bankAccount2: "",
        prMessage: "",
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPass: "",
        emailFrom: "",
        quoteEmailTemplate: "",
        invoiceEmailTemplate: "",
    })

    const logoInputRef = useRef<HTMLInputElement>(null)
    const stampInputRef = useRef<HTMLInputElement>(null)
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingStamp, setUploadingStamp] = useState(false)

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getSettings()
                if (data) {
                    setFormData(data)
                }
            } catch (error) {
                console.error("Failed to load settings:", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'stamp') => {
        const file = e.target.files?.[0]
        if (!file) return

        if (type === 'logo') setUploadingLogo(true)
        else setUploadingStamp(true)

        try {
            const formDataUpload = new FormData()
            formDataUpload.append('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload
            })

            const result = await res.json()
            if (result.success) {
                setFormData((prev: any) => ({
                    ...prev,
                    [type === 'logo' ? 'logoUrl' : 'stampUrl']: result.url
                }))
            }
        } catch (error) {
            console.error("Upload failed", error)
        } finally {
            if (type === 'logo') setUploadingLogo(false)
            else setUploadingStamp(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateSettings(formData)
            setTimeout(() => setIsSaving(false), 2000)
        } catch (error) {
            console.error("Failed to save settings:", error)
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center p-8 h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600 font-medium">設定を読み込んでいます...</span>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto space-y-6 pb-24">

                    {/* ヘッダー */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">システム設定</h2>
                            <p className="text-sm text-gray-500 mt-1">自社情報やシステムの基本設定を行います。</p>
                        </div>
                        <div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`inline-flex items-center justify-center rounded-lg font-bold h-11 py-2 px-8 shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto ${isSaving ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                                    }`}
                            >
                                {isSaving ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2" /> 保存完了
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" /> 設定を保存する
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* メインカード */}
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">

                        {/* タブナビゲーション */}
                        <div className="border-b border-gray-100 bg-gray-50/50 px-6 flex space-x-2 overflow-x-auto scrollbar-hide">
                            {[
                                { id: "company", icon: Building2, label: "自社情報・基本設定" },
                                { id: "system", icon: Laptop, label: "システム・メール設定" },
                                { id: "users", icon: Users2, label: "ログインユーザー管理" }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 py-5 text-sm font-bold transition-all whitespace-nowrap group ${activeTab === tab.id
                                        ? "text-blue-600"
                                        : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    <tab.icon className={`w-4 h-4 inline-block mr-2 mb-0.5 transition-transform group-hover:-translate-y-0.5 ${activeTab === tab.id ? "scale-110 text-blue-500" : ""}`} />
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 md:p-10 bg-gradient-to-b from-white to-gray-50/30">

                            {/* タブ1: 自社情報・基本設定 */}
                            {activeTab === "company" && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <div className="w-2 h-6 bg-blue-600 rounded-full" />
                                            会社情報 <span className="text-xs font-normal text-gray-500 ml-2">(見積書・請求書に印字されます)</span>
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">自社名 <span className="text-red-500">*</span></label>
                                                <input type="text" name="companyName" value={formData.companyName || ""} onChange={handleInputChange}
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-lg font-bold shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">代表者名</label>
                                                <input type="text" name="representative" value={formData.representative || ""} onChange={handleInputChange}
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">認定番号など (保証書項目)</label>
                                                <input type="text" name="accreditationNumber" value={formData.accreditationNumber || ""} onChange={handleInputChange}
                                                    placeholder="(社)日本しろあり対策協会認定 第〇〇号"
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:w-3/4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">郵便番号</label>
                                                <input type="text" name="zipCode" value={formData.zipCode || ""} onChange={handleInputChange}
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                            </div>
                                            <div className="hidden md:block"></div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">住所</label>
                                                <input type="text" name="address" value={formData.address || ""} onChange={handleInputChange}
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">電話番号</label>
                                                <input type="tel" name="tel" value={formData.tel || ""} onChange={handleInputChange}
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">FAX番号</label>
                                                <input type="tel" name="fax" value={formData.fax || ""} onChange={handleInputChange}
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                                            ロゴ・印影画像
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">会社ロゴ</label>
                                                <input type="file" className="hidden" ref={logoInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                                                <div
                                                    onClick={() => logoInputRef.current?.click()}
                                                    className="group relative border-2 border-dashed border-gray-100 rounded-2xl h-[160px] bg-white flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/30 hover:border-blue-300 shadow-sm overflow-hidden"
                                                >
                                                    {formData.logoUrl ? (
                                                        <div className="relative w-full h-full p-4 flex items-center justify-center">
                                                            <img src={formData.logoUrl} alt="logo" className="max-w-full max-h-full object-contain" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <p className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">変更する</p>
                                                            </div>
                                                        </div>
                                                    ) : uploadingLogo ? (
                                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <ImagePlus className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                                            <p className="text-xs font-bold text-gray-500">クリックしてアップロード</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">社印（印影画像）</label>
                                                <input type="file" className="hidden" ref={stampInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'stamp')} />
                                                <div
                                                    onClick={() => stampInputRef.current?.click()}
                                                    className="group relative border-2 border-dashed border-gray-100 rounded-2xl h-[160px] bg-white flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-red-50/30 hover:border-red-300 shadow-sm overflow-hidden"
                                                >
                                                    {formData.stampUrl ? (
                                                        <div className="relative w-full h-full p-4 flex items-center justify-center">
                                                            <img src={formData.stampUrl} alt="stamp" className="max-w-full max-h-full object-contain" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <p className="text-white text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">変更する</p>
                                                            </div>
                                                        </div>
                                                    ) : uploadingStamp ? (
                                                        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Stamp className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                                                            <p className="text-xs font-bold text-gray-500">クリックしてアップロード</p>
                                                            <p className="text-[10px] text-gray-400 mt-1">※背景が透明なPNG推奨</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <div className="w-2 h-6 bg-emerald-600 rounded-full" />
                                            振込先・PR情報
                                        </h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">振込先銀行 1</label>
                                                <input type="text" name="bankAccount1" value={formData.bankAccount1 || ""} onChange={handleInputChange}
                                                    placeholder="例：〇〇銀行 △△支店 普通 1234567 総合衛研工業"
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">振込先銀行 2</label>
                                                <input type="text" name="bankAccount2" value={formData.bankAccount2 || ""} onChange={handleInputChange}
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">PR欄 (見積書下部の案内文)</label>
                                                <textarea
                                                    name="prMessage"
                                                    value={formData.prMessage || ""}
                                                    onChange={handleInputChange}
                                                    className="flex min-h-[160px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base font-medium shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all leading-relaxed resize-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* タブ2: システム・メール設定 */}
                            {activeTab === "system" && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <div className="w-2 h-6 bg-slate-800 rounded-full" />
                                            メール送信設定 (SMTP)
                                        </h3>
                                        <p className="text-sm text-gray-500">システムから直接見積書や請求書をメール送信するための設定です。</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <Mail size={120} />
                                            </div>
                                            <div className="space-y-2 md:col-span-2 relative z-10">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">送信元メールアドレス</label>
                                                <input type="email" name="emailFrom" value={formData.emailFrom || ""} onChange={handleInputChange}
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2 relative z-10">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">送信SMTPサーバー</label>
                                                <input type="text" name="smtpHost" value={formData.smtpHost || ""} onChange={handleInputChange}
                                                    placeholder="smtp.gmail.com"
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2 relative z-10">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">サーバーポート</label>
                                                <input type="number" name="smtpPort" value={formData.smtpPort || 587} onChange={handleInputChange}
                                                    className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2 relative z-10">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider">SMTP ユーザー (ID) / パスワード</label>
                                                <div className="flex gap-4">
                                                    <input type="text" name="smtpUser" value={formData.smtpUser || ""} onChange={handleInputChange} placeholder="ユーザーID"
                                                        className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 outline-none transition-all" />
                                                    <input type="password" name="smtpPass" value={formData.smtpPass || ""} onChange={handleInputChange} placeholder="••••••••••••"
                                                        className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium shadow-sm focus:border-blue-500 outline-none transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <div className="w-2 h-6 bg-slate-800 rounded-full" />
                                            メール定型文
                                        </h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider tracking-widest px-1">見積書送付時</label>
                                                <textarea
                                                    name="quoteEmailTemplate"
                                                    value={formData.quoteEmailTemplate || ""}
                                                    onChange={handleInputChange}
                                                    className="flex min-h-[140px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium shadow-sm focus:border-blue-500 outline-none transition-all leading-relaxed resize-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider tracking-widest px-1">請求書送付時</label>
                                                <textarea
                                                    name="invoiceEmailTemplate"
                                                    value={formData.invoiceEmailTemplate || ""}
                                                    onChange={handleInputChange}
                                                    className="flex min-h-[140px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium shadow-sm focus:border-blue-500 outline-none transition-all leading-relaxed resize-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* タブ3: ログインユーザー管理 */}
                            {activeTab === "users" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <div className="w-2 h-6 bg-purple-800 rounded-full" />
                                            システム利用者
                                        </h3>
                                        <button className="inline-flex items-center justify-center rounded-xl font-bold border-2 border-indigo-50 bg-white text-indigo-600 hover:bg-indigo-50 h-10 px-4 text-sm transition-all shadow-sm">
                                            <UserPlus className="w-4 h-4 mr-2" /> 新規追加
                                        </button>
                                    </div>

                                    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xl shadow-gray-200/20">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 font-black text-gray-500 uppercase tracking-[0.1em] text-[10px]">利用者名</th>
                                                    <th className="px-6 py-4 font-black text-gray-500 uppercase tracking-[0.1em] text-[10px]">Google メールアドレス</th>
                                                    <th className="px-6 py-4 font-black text-gray-500 uppercase tracking-[0.1em] text-[10px]">ロール</th>
                                                    <th className="px-6 py-4 text-center font-black text-gray-500 uppercase tracking-[0.1em] text-[10px]">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                <tr className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-5 font-bold text-gray-900 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">AD</div>
                                                        管理者 (あなた)
                                                    </td>
                                                    <td className="px-6 py-5 text-gray-600 font-medium font-outfit">admin@example.com</td>
                                                    <td className="px-6 py-5">
                                                        <span className="bg-purple-100/50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase whitespace-nowrap">Admin</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center text-gray-300">-</td>
                                                </tr>
                                                <tr className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-5 font-bold text-gray-900 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">野口</div>
                                                        野口 広満
                                                    </td>
                                                    <td className="px-6 py-5 text-gray-600 font-medium font-outfit">soken.noguchi@gmail.com</td>
                                                    <td className="px-6 py-5">
                                                        <span className="bg-blue-100/50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase whitespace-nowrap">User</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <button className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all scale-100 active:scale-95">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex gap-4 text-sm text-blue-900 shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-blue-100 text-blue-600">
                                            <Info className="w-5 h-5" />
                                        </div>
                                        <div className="pt-1">
                                            <p className="font-bold mb-1">セキュリティに関するお知らせ</p>
                                            <p className="text-blue-700/80 leading-relaxed font-medium">ログインにはGoogleアカウントを使用します。ここに追加されたメールアドレスを持つユーザーのみがシステムにアクセス可能です。</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
