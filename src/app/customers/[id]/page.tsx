import { getCustomerById } from "../actions";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, MapPin, Phone, Calendar, Clock, FileText, ChevronRight, Edit, Users, MessageSquare, Receipt } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const customer = await getCustomerById(id);

    if (!customer) {
        notFound();
    }

    return (
        <AppLayout>
            <div className="p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-6 pb-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <Link href="/customers" className="hover:text-gray-900 transition-colors">
                                    顧客マスター
                                </Link>
                                <ChevronRight className="w-4 h-4" />
                                <span>顧客詳細</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold">{customer.name}</h2>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${customer.type === "法人"
                                    ? "bg-indigo-100 text-indigo-800"
                                    : "bg-emerald-100 text-emerald-800"
                                    }`}>
                                    {customer.type}
                                </span>
                            </div>
                            {customer.furigana && <p className="text-sm text-gray-500 mt-1">{customer.furigana}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/customers">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    一覧に戻る
                                </Button>
                            </Link>
                            <Link href={`/customers/${customer.id}/edit`}>
                                <Button variant="outline" className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50">
                                    <Edit className="w-4 h-4 mr-2" />
                                    編集する
                                </Button>
                            </Link>
                            <Link href={`/quotes/new?customerId=${customer.id}&customerName=${encodeURIComponent(customer.name)}`}>
                                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-md">
                                    <FileText className="w-4 h-4 mr-2" />
                                    この顧客で見積作成
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-6">
                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-500" />
                                    <h3 className="font-semibold">基本情報</h3>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">顧客コード</span>
                                        <p className="mt-1 font-mono text-gray-900">{customer.id}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <Phone className="w-3.5 h-3.5" /> 電話番号
                                        </span>
                                        <p className="mt-1 text-gray-900">{customer.tel || "未登録"}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" /> 住所
                                        </span>
                                        <p className="mt-1 text-gray-900">{customer.address || "未登録"}</p>
                                    </div>
                                    {(customer.contactPerson || customer.contactPersonTel) && (
                                        <div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5" /> 担当者
                                            </span>
                                            <p className="mt-1 text-gray-900">{customer.contactPerson || "—"}</p>
                                            {customer.contactPersonTel && <p className="text-sm text-gray-500 mt-0.5">{customer.contactPersonTel}</p>}
                                        </div>
                                    )}
                                    {(customer.referee || customer.refereeTel) && (
                                        <div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5" /> 紹介者
                                            </span>
                                            <p className="mt-1 text-gray-900">{customer.referee || "—"}</p>
                                            {customer.refereeTel && <p className="text-sm text-gray-500 mt-0.5">{customer.refereeTel}</p>}
                                        </div>
                                    )}
                                    {customer.memo && (
                                        <div>
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                <MessageSquare className="w-3.5 h-3.5" /> メモ
                                            </span>
                                            <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{customer.memo}</p>
                                        </div>
                                    )}
                                    <div className="pt-4 border-t border-gray-100">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" /> 登録日
                                        </span>
                                        <p className="mt-1 text-gray-900">{customer.date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: History & Stats */}
                        <div className="space-y-6">
                            {/* Stats Row: 見積 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <span className="text-sm text-gray-500">発行済見積数</span>
                                    <p className="text-2xl font-bold mt-1">0 <span className="text-sm font-normal text-gray-400">件</span></p>
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <span className="text-sm text-gray-500">成約件数</span>
                                    <p className="text-2xl font-bold mt-1">0 <span className="text-sm font-normal text-gray-400">件</span></p>
                                </div>
                            </div>

                            {/* 見積履歴 */}
                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                        <h3 className="font-semibold">過去の見積・案件履歴</h3>
                                    </div>
                                </div>
                                <div className="p-8 text-center text-gray-400">
                                    <FileText className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                    <p className="text-sm font-medium">履歴はありません</p>
                                    <p className="text-xs mt-1">この顧客に対する見積を作成するとここに表示されます。</p>
                                </div>
                            </div>

                            {/* Stats Row: 請求 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <span className="text-sm text-gray-500">発行済請求数</span>
                                    <p className="text-2xl font-bold mt-1">0 <span className="text-sm font-normal text-gray-400">件</span></p>
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <span className="text-sm text-gray-500">入金済み</span>
                                    <p className="text-2xl font-bold mt-1">¥0</p>
                                </div>
                            </div>

                            {/* 請求書履歴 */}
                            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Receipt className="w-5 h-5 text-gray-500" />
                                        <h3 className="font-semibold">請求書履歴</h3>
                                    </div>
                                </div>
                                <div className="p-8 text-center text-gray-400">
                                    <Receipt className="w-12 h-12 mx-auto text-gray-200 mb-3" />
                                    <p className="text-sm font-medium">請求書はありません</p>
                                    <p className="text-xs mt-1">この顧客に対する請求書を発行するとここに表示されます。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
