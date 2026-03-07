import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { items } from "./schema";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// 環境変数の読み込み(.env.localがあれば)
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(turso);

// CSVファイルのパス
const csvFilePath = path.join(process.cwd(), "..", "my-web", "駆除業務_施工品目マスタ.csv");

async function main() {
    try {
        console.log("Reading CSV file...");
        const csvData = fs.readFileSync(csvFilePath, "utf8");

        console.log("Parsing CSV data...");
        const records = parse(csvData, {
            columns: true,
            skip_empty_lines: true,
        });

        console.log(`Found ${records.length} records. Inserting into db...`);

        const itemsToInsert = (records as Record<string, string>[]).map((record) => {
            // 単価のパース処理: "7,000" -> 7000, "-" -> null
            let unitPrice = null;
            if (record["単価"] && record["単価"] !== "-") {
                const parsedPrice = parseInt(record["単価"].replace(/,/g, ""), 10);
                if (!isNaN(parsedPrice)) {
                    unitPrice = parsedPrice;
                }
            }

            // UUID生成用にcryptoは使わず、新しいID（UUID）を割り当てるようユーザーから指示があった。
            // 新規にUUIDを設定して生成する。
            const newId = crypto.randomUUID();

            return {
                id: newId,
                category: record["カテゴリー"],
                name: record["品目名（施工・商品名）"],
                unitPrice: unitPrice,
                unit: record["単位"],
                remarks: record["備考・仕様"] || null,
                createdAt: new Date(),
            };
        });

        // 既存のitemsを削除してからインポートするか、ここでは追記か
        // seedスクリプトなので、既存レコードのリセットは行わずとりあえず追加
        // しかし同じレコードが重複しないようにするなら一旦消す方が安全（要件次第だが今回はシンプルにinsert）

        // 分割してインサート (SQLite制限回避のため)
        const chunkSize = 50;
        for (let i = 0; i < itemsToInsert.length; i += chunkSize) {
            const chunk = itemsToInsert.slice(i, i + chunkSize);
            await db.insert(items).values(chunk);
        }

        console.log("Successfully seeded items data!");
    } catch (error) {
        console.error("Error seeding items:", error);
    } finally {
        process.exit(0);
    }
}

main();
