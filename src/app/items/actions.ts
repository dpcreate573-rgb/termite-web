"use server"

import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ItemInput = {
    id?: string;
    category: string;
    name: string;
    unitPrice: number | null;
    unit: string;
    remarks: string | null;
};

export async function getItemById(id: string) {
    const records = await db.select().from(items).where(eq(items.id, id));
    return records[0] || null;
}

export async function getItemsByCategory(category: string) {
    return await db.select().from(items).where(eq(items.category, category));
}

export async function createItem(input: ItemInput) {
    const newId = crypto.randomUUID();
    await db.insert(items).values({
        id: newId,
        category: input.category,
        name: input.name,
        unitPrice: input.unitPrice,
        unit: input.unit,
        remarks: input.remarks,
        createdAt: new Date(),
    });

    revalidatePath("/items");
    return newId;
}

export async function updateItem(input: ItemInput) {
    if (!input.id) throw new Error("ID is required for update");

    await db.update(items)
        .set({
            category: input.category,
            name: input.name,
            unitPrice: input.unitPrice,
            unit: input.unit,
            remarks: input.remarks,
        })
        .where(eq(items.id, input.id));

    revalidatePath("/items");
}

export async function deleteItem(id: string) {
    await db.delete(items).where(eq(items.id, id));
    revalidatePath("/items");
}
