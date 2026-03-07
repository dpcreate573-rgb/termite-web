"use server"

import { db } from "@/db"
import { quotes, quoteDetails, projects, customers } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

type LineItemInput = {
    name: string;
    qty: number;
    unit: string;
    price: number;
    amount: number;
}

type CreateQuoteInput = {
    quoteId: string;
    customerId: string | null;
    customerName: string;
    subject: string;
    projectTypes: string[]; // ["A", "B", "C"]
    itemsA: LineItemInput[];
    itemsB: LineItemInput[];
    itemsC: LineItemInput[];
}

export async function createQuoteAction(data: CreateQuoteInput) {
    try {
        let finalCustomerId = data.customerId;

        // 1. 顧客が未登録の場合は新規作成
        if (!finalCustomerId) {
            finalCustomerId = `CUST-${Date.now()}`;
            await db.insert(customers).values({
                id: finalCustomerId,
                type: "個人", // デフォルト
                name: data.customerName,
                createdAt: new Date(),
            });
        }

        // 2. 案件 (Project) の作成
        const projectId = `PROJ-${Date.now()}`;
        await db.insert(projects).values({
            id: projectId,
            customerId: finalCustomerId,
            projectTypes: JSON.stringify(data.projectTypes),
            status: "in_progress",
            createdAt: new Date(),
        });

        // 3. 見積 (Quote) の作成
        await db.insert(quotes).values({
            id: data.quoteId,
            projectId: projectId,
            subject: data.subject,
            createdAt: new Date(),
        });

        // 4. 見積明細 (QuoteDetails) の作成
        const allItems = [
            ...data.itemsA,
            ...data.itemsB,
            ...data.itemsC
        ];

        for (const item of allItems) {
            await db.insert(quoteDetails).values({
                id: uuidv4(),
                quoteId: data.quoteId,
                itemName: item.name,
                quantity: item.qty,
                unitPrice: item.price,
                totalPrice: item.amount,
            });
        }

        revalidatePath("/quotes");
        revalidatePath("/customers");

        return { success: true, quoteId: data.quoteId };
    } catch (error) {
        console.error("Failed to create quote:", error);
        throw new Error("見積の作成に失敗しました");
    }
}
