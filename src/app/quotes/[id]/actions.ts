"use server"

import { db } from "@/db"
import { quoteDetails, quotes, projects, customers } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

type QuoteDetailItemInput = {
    id: string;
    quoteId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export async function updateQuoteDetailAction(
    quoteId: string,
    subject: string,
    customerName: string,
    items: QuoteDetailItemInput[]
) {
    // 1. Update the subject in the quotes table
    await db.update(quotes)
        .set({ subject })
        .where(eq(quotes.id, quoteId))

    // 2. Get the quote to find the project and customer ID
    const quoteResult = await db.select().from(quotes).where(eq(quotes.id, quoteId)).limit(1)
    if (quoteResult.length === 0) throw new Error("Quote not found")

    const projectId = quoteResult[0].projectId

    const projectResult = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1)
    if (projectResult.length === 0) throw new Error("Project not found")

    const customerId = projectResult[0].customerId

    // 2. Update the customer name
    await db.update(customers)
        .set({ name: customerName })
        .where(eq(customers.id, customerId))

    // 3. Update all detail items
    for (const item of items) {
        await db.update(quoteDetails)
            .set({
                itemName: item.itemName,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                totalPrice: Number(item.totalPrice)
            })
            .where(eq(quoteDetails.id, item.id))
    }

    // 4. Revalidate cache
    revalidatePath(`/quotes/${quoteId}`)
    revalidatePath(`/quotes`)

    return { success: true }
}
