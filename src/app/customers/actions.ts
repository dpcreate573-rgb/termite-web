"use server";

import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CustomerType = "法人" | "個人";

export interface CustomerInput {
    id: string;
    type: CustomerType;
    name: string;
    furigana?: string | null;
    tel?: string | null;
    address?: string | null;
    contactPerson?: string | null;
    contactPersonTel?: string | null;
    referee?: string | null;
    refereeTel?: string | null;
    memo?: string | null;
}

export async function getCustomers() {
    try {
        const results = await db
            .select()
            .from(customers)
            .orderBy(desc(customers.createdAt));

        // Convert to UI format
        return results.map((c) => ({
            id: c.id,
            type: c.type as CustomerType,
            name: c.name,
            furigana: c.furigana,
            tel: c.tel,
            address: c.address,
            contactPerson: c.contactPerson,
            contactPersonTel: c.contactPersonTel,
            referee: c.referee,
            refereeTel: c.refereeTel,
            memo: c.memo,
            date: new Date(c.createdAt).toISOString().split("T")[0].replace(/-/g, "/"),
        }));
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        throw new Error("顧客データの取得に失敗しました");
    }
}

export async function getCustomerById(id: string) {
    try {
        const result = await db
            .select()
            .from(customers)
            .where(eq(customers.id, id))
            .limit(1);

        if (result.length === 0) return null;

        const c = result[0];
        return {
            id: c.id,
            type: c.type as CustomerType,
            name: c.name,
            furigana: c.furigana,
            tel: c.tel,
            address: c.address,
            contactPerson: c.contactPerson,
            contactPersonTel: c.contactPersonTel,
            referee: c.referee,
            refereeTel: c.refereeTel,
            memo: c.memo,
            date: new Date(c.createdAt).toISOString().split("T")[0].replace(/-/g, "/"),
        };
    } catch (error) {
        console.error("Failed to fetch customer:", error);
        throw new Error("顧客の取得に失敗しました");
    }
}

export async function createCustomer(data: CustomerInput) {
    try {
        await db.insert(customers).values({
            id: data.id,
            type: data.type,
            name: data.name,
            furigana: data.furigana || null,
            tel: data.tel || null,
            address: data.address || null,
            contactPerson: data.contactPerson || null,
            contactPersonTel: data.contactPersonTel || null,
            referee: data.referee || null,
            refereeTel: data.refereeTel || null,
            memo: data.memo || null,
            createdAt: new Date(),
        });

        revalidatePath("/customers");
        return { success: true };
    } catch (error) {
        console.error("Failed to create customer:", error);
        throw new Error("顧客の作成に失敗しました");
    }
}

export async function updateCustomer(data: CustomerInput) {
    try {
        await db
            .update(customers)
            .set({
                type: data.type,
                name: data.name,
                furigana: data.furigana || null,
                tel: data.tel || null,
                address: data.address || null,
                contactPerson: data.contactPerson || null,
                contactPersonTel: data.contactPersonTel || null,
                referee: data.referee || null,
                refereeTel: data.refereeTel || null,
                memo: data.memo || null,
            })
            .where(eq(customers.id, data.id));

        revalidatePath("/customers");
        return { success: true };
    } catch (error) {
        console.error("Failed to update customer:", error);
        throw new Error("顧客の更新に失敗しました");
    }
}
