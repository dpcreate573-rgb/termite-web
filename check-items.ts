import { db } from './src/db';
import { items } from './src/db/schema';

async function main() {
    const allItems = await db.select().from(items);
    console.log("=== ALL ITEMS ===");
    console.log(allItems);
    process.exit(0);
}

main().catch(console.error);
