import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { projects, quotes, quoteDetails, customers } from "./schema";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(turso);

async function main() {
    try {
        console.log("Seeding dummy quotes and projects data...");

        const existingCustomers = await db.select().from(customers).limit(10);
        if (existingCustomers.length === 0) {
            console.error("No customers found. Please run seed-customers.ts first.");
            return;
        }

        const dummyProjects = [];
        const dummyQuotes = [];
        const dummyQuoteDetails = [];

        const statuses = ["in_progress", "completed"];
        const typeCombinations = [
            ["A"], ["B"], ["C"],
            ["A", "C"], ["B", "C"], ["A", "B", "C"]
        ];
        const subjects = [
            "シロアリ駆除工事一式",
            "床下防処理およびシロアリ駆除の件",
            "ゴキブリ防除工事",
            "ネズミ駆除（定期契約）",
            "ハチ駆除及び巣穴封鎖工事",
            "床下海水処理およびシロアリ防除",
            "川底消毒工事",
            "ネズミ駆除一式",
            "ペット身振り叮防除工事",
            "彼見超防工事一式",
            "川底消毒および防蛙工事",
            "床下改修およびシロアリ駆除工事",
            "子供室カカル駆除工事",
            "川底消毒まわり防工事",
            "防蛙一式および坂駆除工事",
            "床下シロアリおよびネズミ形跡結果報告書",
            "川底消毒えこキ工事",
            "コウモリ駆除及び工務店打起工事",
            "なぶきでの廃内広山物宿泊散布工事",
            "床下シロアリ工事及び消毒一式",
        ];

        for (let i = 0; i < 20; i++) {
            const projectId = crypto.randomUUID();
            const customer = existingCustomers[i % existingCustomers.length];
            const pTypes = typeCombinations[Math.floor(Math.random() * typeCombinations.length)];

            dummyProjects.push({
                id: projectId,
                customerId: customer.id,
                projectTypes: JSON.stringify(pTypes),
                status: statuses[Math.floor(Math.random() * statuses.length)],
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
            });

            const quoteId = crypto.randomUUID();
            dummyQuotes.push({
                id: quoteId,
                projectId: projectId,
                subject: subjects[i % subjects.length],
                termiteCalcData: pTypes.includes("A") ? JSON.stringify({ floorArea: Math.floor(Math.random() * 50) + 30 }) : null,
                pestCalcData: pTypes.includes("B") ? JSON.stringify({ pestType: "ゴキブリ", isRegular: true }) : null,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000),
            });

            const numDetails = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numDetails; j++) {
                const quantity = Math.floor(Math.random() * 10) + 1;
                const unitPrice = (Math.floor(Math.random() * 10) + 1) * 1000;
                dummyQuoteDetails.push({
                    id: crypto.randomUUID(),
                    quoteId: quoteId,
                    itemName: `ダミー明細 ${j + 1} (${pTypes.join(", ")})`,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    totalPrice: quantity * unitPrice,
                });
            }
        }

        console.log("Inserting projects...");
        for (const p of dummyProjects) {
            await db.insert(projects).values(p);
        }

        console.log("Inserting quotes...");
        for (const q of dummyQuotes) {
            await db.insert(quotes).values(q);
        }

        console.log("Inserting quote details...");
        for (const qd of dummyQuoteDetails) {
            await db.insert(quoteDetails).values(qd);
        }

        console.log("Successfully seeded 20 quotes!");
    } catch (error) {
        console.error("Error seeding quotes:", error);
    } finally {
        process.exit(0);
    }
}

main();
