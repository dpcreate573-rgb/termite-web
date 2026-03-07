import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { quotes } from "./schema";
import { eq } from "drizzle-orm";

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(turso);

const subjectPool = [
    "シロアリ駆除工事一式",
    "床下防処理およびシロアリ駆除の件",
    "ゴキブリ防除工事",
    "ネズミ駆除（定期契約）",
    "ハチ駆除及び巣穴封鎖工事",
    "床下海水処理およびシロアリ防除",
    "川底消毒工事",
    "ネズミ駆除一式",
    "ペット身振り叮防除工事",
    "シロアリ防除及び床板張替工事",
    "川底消毒および防蛙工事",
    "床下改修およびシロアリ駆除工事",
    "子供室カカル駆除工事",
    "洗面台まわり防除工事",
    "防蛙一式および坂駆除工事",
    "床下シロアリ・ネズミ点検調査",
    "厨房消毒えこキ工事",
    "コウモリ駆除及び工事",
    "和室床下散布工事",
    "床下シロアリ工事及び消毒一式",
];

async function main() {
    try {
        console.log("Fetching all quotes without subject...");
        const allQuotes = await db.select({ id: quotes.id, subject: quotes.subject }).from(quotes);
        const nullSubjects = allQuotes.filter(q => !q.subject);

        console.log(`Found ${nullSubjects.length} quotes without subject. Updating...`);

        for (let i = 0; i < nullSubjects.length; i++) {
            const subject = subjectPool[i % subjectPool.length];
            await db.update(quotes)
                .set({ subject })
                .where(eq(quotes.id, nullSubjects[i].id));
        }

        console.log(`Updated ${nullSubjects.length} quotes with subjects!`);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit(0);
    }
}

main();
