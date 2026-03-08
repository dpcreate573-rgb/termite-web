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
        companyName: "総合衛研工業 SÖGEN",
        representative: "代表 野口 広満",
        accreditationNumber: "",
        zipCode: "843-0021",
        address: "佐賀県武雄市武雄町永島14704-14",
        tel: "0954-23-7334",
        fax: "0954-23-7704",
        logoUrl: "",
        stampUrl: "",
        bankAccount1: "〇〇銀行 △△支店 普通 1234567 総合衛研工業",
        bankAccount2: "",
        prMessage: "総合衛研工業は、住みよい環境と安全な暮らし作りをお手伝いする害虫駆除の専門業者です。\n各所に発生した、シロアリ、ダニ、ゴキブリ、ハチ等を防除・消毒いたします。\nまた、床下換気システムなど住宅設備の工事も承っております。",
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUser: "soken.noguchi@gmail.com",
        smtpPass: "",
        emailFrom: "soken.noguchi@gmail.com",
        quoteEmailTemplate: "いつもお世話になっております。総合衛研工業です。\nご依頼いただきました見積書をPDFにて添付いたします。\n内容をご確認いただき、ご不明な点がございましたらご連絡ください。",
        invoiceEmailTemplate: "いつもお世話になっております。総合衛研工業です。\n施工が完了いたしましたので、請求書をPDFにて添付いたします。\n記載の期日までにお振込みいただきますようお願い申し上げます。",
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
                    setFormData((prev: any) => ({ ...prev, ...data }))
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
                                className={`inline-flex items-center justify-center rounded-md font-medium h-10 py-2 px-6 shadow-sm transition-colors w-full md:w-auto ${isSaving ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                            >
                                {isSaving ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" /> 保存しました
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> 設定を保存する
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* メインカード */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">

                        {/* タブナビゲーション */}
                        <div className="border-b border-gray-200 bg-gray-50/80 px-4 flex overflow-x-auto hide-scrollbar">
                            <button
                                onClick={() => setActiveTab("company")}
                                className={`tab-btn border-b-2 px-4 py-4 text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === "company"
                                    ? "border-blue-600 text-blue-700 font-semibold active"
                                    : "border-transparent text-gray-500 hover:text-gray-700 font-medium"
                                    }`}
                            >
                                <Building2 className="w-4 h-4" /> 自社情報・基本設定
                            </button>
                            <button
                                onClick={() => setActiveTab("system")}
                                className={`tab-btn border-b-2 px-4 py-4 text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === "system"
                                    ? "border-blue-600 text-blue-700 font-semibold active"
                                    : "border-transparent text-gray-500 hover:text-gray-700 font-medium"
                                    }`}
                            >
                                <Laptop className="w-4 h-4" /> システム・メール設定
                            </button>
                            <button
                                onClick={() => setActiveTab("users")}
                                className={`tab-btn border-b-2 px-4 py-4 text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === "users"
                                    ? "border-blue-600 text-blue-700 font-semibold active"
                                    : "border-transparent text-gray-500 hover:text-gray-700 font-medium"
                                    }`}
                            >
                                <Users2 className="w-4 h-4" /> ログインユーザー管理
                            </button>
                        </div>

                        <div className="p-6 md:p-8">

                            {/* タブ1: 自社情報・基本設定 */}
                            {activeTab === "company" && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold border-l-4 border-blue-600 pl-3">会社情報 (見積書・請求書に印字されます)</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-semibold text-gray-700">自社名 <span className="text-red-500">*</span></label>
                                                <input type="text" name="companyName" value={formData.companyName || ""} onChange={handleInputChange}
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">代表者名</label>
                                                <input type="text" name="representative" value={formData.representative || ""} onChange={handleInputChange}
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">認定番号など (保証書項目)</label>
                                                <input type="text" name="accreditationNumber" value={formData.accreditationNumber || ""} onChange={handleInputChange}
                                                    placeholder="(社)日本しろあり対策協会認定 第〇〇号"
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">郵便番号</label>
                                                <input type="text" name="zipCode" value={formData.zipCode || ""} onChange={handleInputChange}
                                                    className="flex h-11 w-full md:w-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="hidden md:block"></div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-semibold text-gray-700">住所</label>
                                                <input type="text" name="address" value={formData.address || ""} onChange={handleInputChange}
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">電話番号</label>
                                                <input type="tel" name="tel" value={formData.tel || ""} onChange={handleInputChange}
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">FAX番号</label>
                                                <input type="tel" name="fax" value={formData.fax || ""} onChange={handleInputChange}
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold border-l-4 border-blue-600 pl-3">ロゴ・印影画像</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">会社ロゴ</label>
                                                <input type="file" className="hidden" ref={logoInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                                                <div
                                                    onClick={() => !uploadingLogo && logoInputRef.current?.click()}
                                                    className={`h-[120px] bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed border-gray-200 rounded-lg hover:bg-blue-50/50 hover:border-blue-400 group overflow-hidden relative ${uploadingLogo ? 'opacity-50' : ''}`}
                                                >
                                                    {formData.logoUrl ? (
                                                        <img src={formData.logoUrl} alt="Logo" className="h-full w-full object-contain p-4" />
                                                    ) : (
                                                        <>
                                                            <ImagePlus className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                                            <p className="text-sm text-gray-500">クリックしてアップロード</p>
                                                        </>
                                                    )}
                                                    {uploadingLogo && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                                                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">社印（印影画像）</label>
                                                <input type="file" className="hidden" ref={stampInputRef} accept="image/*" onChange={(e) => handleFileUpload(e, 'stamp')} />
                                                <div
                                                    onClick={() => !uploadingStamp && stampInputRef.current?.click()}
                                                    className={`h-[120px] bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed border-gray-200 rounded-lg hover:bg-blue-50/50 hover:border-blue-400 group overflow-hidden relative ${uploadingStamp ? 'opacity-50' : ''}`}
                                                >
                                                    {formData.stampUrl ? (
                                                        <img src={formData.stampUrl} alt="Stamp" className="h-full w-full object-contain p-4" />
                                                    ) : (
                                                        <>
                                                            <Stamp className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                                            <p className="text-sm text-gray-500">クリックしてアップロード</p>
                                                            <p className="text-xs text-gray-400 mt-1">※背景が透明なPNG推奨</p>
                                                        </>
                                                    )}
                                                    {uploadingStamp && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                                                            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold border-l-4 border-blue-600 pl-3">振込先・PR情報 (請求書等に印字されます)</h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">振込先銀行 1</label>
                                                <input type="text" name="bankAccount1" value={formData.bankAccount1 || ""} onChange={handleInputChange}
                                                    placeholder="例：〇〇銀行 △△支店 普通 1234567 総合衛研工業"
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">振込先銀行 2</label>
                                                <input type="text" name="bankAccount2" value={formData.bankAccount2 || ""} onChange={handleInputChange}
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">PR欄 (見積書下部の案内文)</label>
                                                <textarea
                                                    name="prMessage"
                                                    value={formData.prMessage || ""}
                                                    onChange={handleInputChange}
                                                    className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed resize-y" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* タブ2: システム・メール設定 */}
                            {activeTab === "system" && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold border-l-4 border-blue-600 pl-3">メール送信設定 (SMTP)</h3>
                                        <p className="text-sm text-gray-500">システムから直接見積書や請求書をメール送信するための設定です。</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-semibold text-gray-700">送信元メールアドレス</label>
                                                <input type="email" name="emailFrom" value={formData.emailFrom || ""} onChange={handleInputChange}
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">送信SMTPサーバー</label>
                                                <input type="text" name="smtpHost" value={formData.smtpHost || ""} onChange={handleInputChange}
                                                    placeholder="smtp.gmail.com"
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">サーバーポート</label>
                                                <input type="number" name="smtpPort" value={formData.smtpPort || 587} onChange={handleInputChange}
                                                    className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-sm font-semibold text-gray-700">SMTP ユーザー (ID) / パスワード</label>
                                                <div className="flex gap-4">
                                                    <input type="text" name="smtpUser" value={formData.smtpUser || ""} onChange={handleInputChange} placeholder="ユーザーID"
                                                        className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                                    <input type="password" name="smtpPass" value={formData.smtpPass || ""} onChange={handleInputChange} placeholder="••••••••••••"
                                                        className="flex h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-gray-100" />

                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold border-l-4 border-blue-600 pl-3">メール定型文</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 px-1">見積書送付時</label>
                                                <textarea
                                                    name="quoteEmailTemplate"
                                                    value={formData.quoteEmailTemplate || ""}
                                                    onChange={handleInputChange}
                                                    className="flex min-h-[160px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed resize-y" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 px-1">請求書送付時</label>
                                                <textarea
                                                    name="invoiceEmailTemplate"
                                                    value={formData.invoiceEmailTemplate || ""}
                                                    onChange={handleInputChange}
                                                    className="flex min-h-[160px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed resize-y" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* タブ3: ログインユーザー管理 */}
                            {activeTab === "users" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex justify-between items-center px-1">
                                        <h3 className="text-lg font-bold border-l-4 border-blue-600 pl-3">システム利用者</h3>
                                        <button className="inline-flex items-center justify-center rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 text-sm transition-all shadow-sm">
                                            <UserPlus className="w-4 h-4 mr-2" /> 新規追加
                                        </button>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold text-gray-700 text-xs">利用者名</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-700 text-xs">Google メールアドレス</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-700 text-xs">ロール</th>
                                                    <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs">操作</th>
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
                                                        <span className="bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap">Admin</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center text-gray-300">-</td>
                                                </tr>
                                                <tr className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-5 font-bold text-gray-900 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">野口</div>
                                                        野口 広満
                                                    </td>
                                                    <td className="px-6 py-5 text-gray-600 font-medium font-outfit">soken.noguchi@gmail.com</td>
                                                    <td className="px-6 py-5">
                                                        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap">User</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        <button className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-md transition-all scale-100 active:scale-95">
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
