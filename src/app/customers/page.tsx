"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { AppLayout } from "@/components/AppLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit, ArrowLeft, Save, User, ChevronLeft, ChevronRight, Loader2, ExternalLink } from "lucide-react"
import { getCustomers, createCustomer, updateCustomer, type CustomerInput, type CustomerType } from "./actions"
import { useRouter, useSearchParams } from "next/navigation"
import { formatWareki } from "@/lib/date"

// ========================
// Types
// ========================
interface Customer {
  id: string
  type: CustomerType
  name: string
  furigana: string | null
  tel: string | null
  address: string | null
  contactPerson: string | null
  contactPersonTel: string | null
  referee: string | null
  refereeTel: string | null
  memo: string | null
  date: string
}


// ========================
// Form Component
// ========================
function CustomerForm({
  customer,
  onSave,
  onCancel,
  isSaving
}: {
  customer: Customer | null;
  onSave: (customer: CustomerInput) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [type, setType] = useState<CustomerType>(customer?.type || "法人")
  const [name, setName] = useState(customer?.name || "")
  const [furigana, setFurigana] = useState(customer?.furigana || "")
  const [tel, setTel] = useState(customer?.tel || "")
  const [address, setAddress] = useState(customer?.address || "")
  const [contactPerson, setContactPerson] = useState(customer?.contactPerson || "")
  const [contactPersonTel, setContactPersonTel] = useState(customer?.contactPersonTel || "")
  const [referee, setReferee] = useState(customer?.referee || "")
  const [refereeTel, setRefereeTel] = useState(customer?.refereeTel || "")
  const [memo, setMemo] = useState(customer?.memo || "")
  const [id] = useState(() => customer?.id || `C-${Math.floor(Math.random() * 90000 + 10000)}`)

  const handleSave = () => {
    if (!name || !tel) {
      alert("顧客名と電話番号は必須です。")
      return
    }
    onSave({
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
    })
  }

  return (
    <div className="space-y-6">
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
                  <input type="radio" name="customer_type" value="法人" checked={type === "法人"} onChange={() => setType("法人")} className="w-4 h-4 text-blue-600" />
                  <span className="text-base">法人</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="customer_type" value="個人" checked={type === "個人"} onChange={() => setType("個人")} className="w-4 h-4 text-blue-600" />
                  <span className="text-base">個人</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">顧客コード</Label>
              <Input value={id} readOnly className="h-11 bg-gray-100 text-gray-500 cursor-not-allowed" />
              <p className="text-xs text-gray-500">※自動採番されます</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-semibold text-gray-700">顧客名 (会社名・氏名) <span className="text-red-500">*</span></Label>
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
          <Button variant="outline" size="lg" onClick={onCancel} className="w-full md:w-auto">
            キャンセルして戻る
          </Button>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            顧客情報を保存する
          </Button>
        </div>
      </div>
    </div>
  )
}

// ========================
// Main Page Content
// ========================
function CustomersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [view, setView] = useState<"list" | "form">("list")
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Load from DB
  useEffect(() => {
    getCustomers().then(data => {
      setCustomers(data)
      setIsLoading(false)

      const editId = searchParams.get('editId')
      if (editId) {
        const target = data.find(c => c.id === editId)
        if (target) {
          setEditingCustomer(target)
          setView("form")
        }
      }
    }).catch(err => {
      console.error(err)
      setIsLoading(false)
    })
  }, [searchParams])

  // Filter customers
  const filtered = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = searchTerm === "" ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.furigana && c.furigana.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.tel && c.tel.includes(searchTerm)) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchType = typeFilter === "all" || c.type === typeFilter
      return matchSearch && matchType
    })
  }, [searchTerm, typeFilter, customers])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage)

  const handleRowClick = (id: string, e: React.MouseEvent) => {
    // 編集ボタン等を押したときは遷移させない
    if ((e.target as HTMLElement).closest('button')) return;
    router.push(`/customers/${id}`);
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setView("form")
  }

  const handleNew = () => {
    setEditingCustomer(null)
    setView("form")
  }

  const handleBack = () => {
    const editId = searchParams.get("editId")
    if (editId) {
      router.push(`/customers/${editId}`)
    } else {
      setView("list")
      setEditingCustomer(null)
    }
  }

  const handleSave = async (customerInput: CustomerInput) => {
    setIsSaving(true)
    try {
      if (editingCustomer) {
        // Update existing
        await updateCustomer(customerInput)
        setCustomers(customers.map(c => c.id === customerInput.id ? { ...c, ...customerInput, date: c.date } as Customer : c))
      } else {
        // Add new
        await createCustomer(customerInput)
        const newCustomer: Customer = {
          ...customerInput,
          date: new Date().toISOString().split("T")[0].replace(/-/g, "/"),
        } as Customer
        setCustomers([newCustomer, ...customers])
      }
      setView("list")
      setEditingCustomer(null)
      const editId = searchParams.get("editId")
      if (editId) {
        router.push(`/customers/${editId}`)
      }
    } catch (error) {
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

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6 pb-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">マスター管理 / 顧客情報</p>
              <h2 className="text-2xl font-bold">
                {view === "list" ? "顧客マスター" : "顧客の登録・編集"}
              </h2>
            </div>
            <div>
              {view === "list" ? (
                <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" /> 新規顧客を登録する
                </Button>
              ) : (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> 一覧に戻る
                </Button>
              )}
            </div>
          </div>

          {/* List View */}
          {view === "list" && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Search & Filter */}
              <div className="p-4 border-b border-gray-200 bg-gray-50/50 rounded-t-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Input
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                    placeholder="顧客名、ふりがな、電話番号で検索..."
                    className="pl-10 h-10"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
                <div className="w-full md:w-auto">
                  <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setCurrentPage(1) }}>
                    <SelectTrigger className="w-full md:w-44 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべての区分</SelectItem>
                      <SelectItem value="法人">法人</SelectItem>
                      <SelectItem value="個人">個人</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 font-semibold w-32 whitespace-nowrap">顧客コード</th>
                      <th className="px-6 py-3 font-semibold">顧客名 / 区分</th>
                      <th className="px-6 py-3 font-semibold">連絡先 (TEL / 住所)</th>
                      <th className="px-6 py-3 font-semibold w-32">最終取引日</th>
                      <th className="px-6 py-3 font-semibold text-center w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map(c => (
                      <tr
                        key={c.id}
                        className="bg-white hover:bg-blue-50/50 transition-colors cursor-pointer group"
                        onClick={(e) => handleRowClick(c.id, e)}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 font-mono group-hover:text-blue-600 transition-colors whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {c.id}
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-base text-gray-900 line-clamp-1" title={c.name}>{c.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${c.type === "法人"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-emerald-100 text-emerald-800"
                              }`}>{c.type}</span>
                            <span className="text-xs text-gray-500 truncate">{c.furigana}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900 font-medium">{c.tel}</div>
                          <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={c.address || ""}>{c.address}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">{formatWareki(c.date)}</td>
                        <td className="px-6 py-4 text-center">
                          <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-100" onClick={() => handleEdit(c)} title="編集する">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">見つかりませんでした</h3>
                    <p className="text-gray-500 text-sm">検索条件を変更してください。</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filtered.length > 0 && (
                <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4">
                  <div>全 {filtered.length} 件中 {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filtered.length)} 件を表示</div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? "bg-blue-600 text-white" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Form View */}
          {view === "form" && (
            <CustomerForm
              customer={editingCustomer}
              onSave={handleSave}
              onCancel={handleBack}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default function CustomersPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div className="flex h-full items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AppLayout>
    }>
      <CustomersContent />
    </Suspense>
  )
}
