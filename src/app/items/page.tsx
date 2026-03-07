import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { items } from "@/db/schema";
import { desc } from "drizzle-orm";

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(turso);

export const revalidate = 0; // Disable cache for this page to always show fresh DB data

export default async function ItemsPage() {
    const allItems = await db.select().from(items).orderBy(desc(items.createdAt));

    return (
        <AppLayout>
            <div className="p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-6 pb-6">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">施工品目マスター</h1>
                                <p className="text-sm text-neutral-500 mt-1">
                                    見積書や請求書で使用する品目や作業内容を管理します。
                                </p>
                            </div>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all" asChild>
                            <Link href="/items/new">
                                <Plus className="w-4 h-4 mr-2" />
                                新規追加
                            </Link>
                        </Button>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/60 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-neutral-50/80 border-b border-neutral-200 text-sm text-neutral-500">
                                        <th className="px-6 py-4 font-medium">カテゴリー</th>
                                        <th className="px-6 py-4 font-medium">品目名（施工・商品名）</th>
                                        <th className="px-6 py-4 font-medium text-right">単価</th>
                                        <th className="px-6 py-4 font-medium">単位</th>
                                        <th className="px-6 py-4 font-medium">備考・仕様</th>
                                        <th className="px-6 py-4 font-medium text-right">アクション</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {allItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="group hover:bg-blue-50/30 transition-colors"
                                        >
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-900 text-right font-medium">
                                                {item.unitPrice !== null ? `¥${item.unitPrice.toLocaleString()}` : "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">{item.unit}</td>
                                            <td className="px-6 py-4 text-sm text-neutral-500 truncate max-w-[200px]" title={item.remarks || undefined}>
                                                {item.remarks || <span className="text-neutral-300">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" asChild>
                                                    <Link href={`/items/${item.id}/edit`}>
                                                        編集
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {allItems.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 text-sm">
                                                品目データがありません。右上のボタンから追加してください。
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
