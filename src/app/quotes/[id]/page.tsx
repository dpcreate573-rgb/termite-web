import { Metadata } from "next"
import { notFound } from "next/navigation"
import { AppLayout } from "@/components/AppLayout"
import { QuoteDetailClient } from "./QuoteDetailClient"

import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { projects, quotes, quoteDetails, customers } from "@/db/schema"
import { eq } from "drizzle-orm"

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
})
const db = drizzle(turso)

export const metadata: Metadata = {
    title: "見積書詳細 | Termit",
}

export const revalidate = 0;

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Fetch Quote
    const quoteResult = await db
        .select()
        .from(quotes)
        .where(eq(quotes.id, id))
        .limit(1);

    if (quoteResult.length === 0) {
        notFound();
    }
    const quote = quoteResult[0];

    // 2. Fetch Project
    const projectResult = await db
        .select()
        .from(projects)
        .where(eq(projects.id, quote.projectId))
        .limit(1);

    if (projectResult.length === 0) {
        notFound();
    }
    const project = projectResult[0];

    // 3. Fetch Customer
    const customerResult = await db
        .select()
        .from(customers)
        .where(eq(customers.id, project.customerId))
        .limit(1);

    const customerName = customerResult.length > 0 ? customerResult[0].name : "名称未設定";

    // 4. Fetch Quote Details (Items)
    const detailsResult = await db
        .select()
        .from(quoteDetails)
        .where(eq(quoteDetails.quoteId, id));

    // Transform data for the client component
    // note: details doesn't cleanly separate into A,B,C in the dummy data, but we can group them
    // or simply pass them as itemsA for preview purposes (assuming a simple mapping for this demo).
    // Real implementation might store the category on the quote_details row.
    const itemsA = detailsResult; // Assigning all to A for demo simplicity based on seed structure

    const totalA = itemsA.reduce((sum, item) => sum + item.totalPrice, 0);
    const grandTotal = totalA;

    return (
        <AppLayout>
            <QuoteDetailClient
                quoteId={quote.id}
                projectId={project.id}
                status={project.status}
                subject={quote.subject}
                projectTypes={JSON.parse(project.projectTypes)}
                customerName={customerName}
                itemsA={itemsA}
                totalA={totalA}
                grandTotal={grandTotal}
                createdAt={quote.createdAt}
            />
        </AppLayout>
    )
}
