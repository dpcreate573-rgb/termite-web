import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from "./index";
import { customers } from "./schema";

const dummyCustomers = [
    { id: "C-00001", type: "法人", name: "地域共生ステーション (ぬくもいホーム) 明神の家ひいらぎ", furigana: "チイキキョウセイステーション ミョウジンノイエヒイラギ", tel: "0954-23-7334", address: "佐賀県武雄市武雄町永島14704-14", date: "2026/03/05" },
    { id: "C-00002", type: "法人", name: "株式会社 佐賀建設", furigana: "カブシキガイシャ サガケンセツ", tel: "0952-11-2233", address: "佐賀県佐賀市城内1-1-59", date: "2026/02/28" },
    { id: "C-00003", type: "個人", name: "山田 太郎", furigana: "ヤマダ タロウ", tel: "090-1234-5678", address: "福岡県福岡市博多区博多駅前1-1-1", date: "2026/02/15" },
    { id: "C-00004", type: "法人", name: "有限会社 ターマイト工業", furigana: "ユウゲンガイシャ ターマイトコウギョウ", tel: "092-555-1234", address: "福岡県福岡市中央区天神2-3-4", date: "2026/01/20" },
    { id: "C-00005", type: "個人", name: "鈴木 花子", furigana: "スズキ ハナコ", tel: "090-9876-5432", address: "佐賀県唐津市新興町1-2-3", date: "2026/01/10" },
    { id: "C-00006", type: "法人", name: "合同会社 九州エステート", furigana: "ゴウドウガイシャ キュウシュウエステート", tel: "092-333-4567", address: "福岡県久留米市中央町3-5-8", date: "2025/12/25" },
    { id: "C-00007", type: "個人", name: "高橋 健太", furigana: "タカハシ ケンタ", tel: "080-2345-6789", address: "長崎県佐世保市白岳町5-10", date: "2025/12/18" },
    { id: "C-00008", type: "法人", name: "株式会社 博多ハウジング", furigana: "カブシキガイシャ ハカタハウジング", tel: "092-777-8899", address: "福岡県福岡市早良区百道浜1-2-3", date: "2025/12/01" },
    { id: "C-00009", type: "個人", name: "田中 大輔", furigana: "タナカ ダイスケ", tel: "090-3456-7890", address: "佐賀県武雄市北方町大字大崎3-1", date: "2025/11/22" },
    { id: "C-00010", type: "個人", name: "伊藤 美咲", furigana: "イトウ ミサキ", tel: "080-4567-8901", address: "福岡県筑紫野市二日市中央3-4-5", date: "2025/11/15" },
    { id: "C-00011", type: "法人", name: "有限会社 武雄不動産", furigana: "ユウゲンガイシャ タケオフドウサン", tel: "0954-20-1234", address: "佐賀県武雄市武雄町昭和1-5", date: "2025/11/01" },
    { id: "C-00012", type: "個人", name: "渡辺 一郎", furigana: "ワタナベ イチロウ", tel: "090-5678-1234", address: "佐賀県鳥栖市京町1-2-3", date: "2025/10/20" },
    { id: "C-00013", type: "法人", name: "株式会社 西日本ビル管理", furigana: "カブシキガイシャ ニシニホンビルカンリ", tel: "092-888-3344", address: "福岡県福岡市東区箱崎1-5-10", date: "2025/10/05" },
    { id: "C-00014", type: "個人", name: "中村 さくら", furigana: "ナカムラ サクラ", tel: "080-6789-2345", address: "長崎県大村市桜馬場2-1-3", date: "2025/09/28" },
    { id: "C-00015", type: "法人", name: "合同会社 肥前総合サービス", furigana: "ゴウドウガイシャ ヒゼンソウゴウサービス", tel: "0952-40-5566", address: "佐賀県佐賀市大和町大字尼寺1-2", date: "2025/09/15" },
    { id: "C-00016", type: "個人", name: "小林 結衣", furigana: "コバヤシ ユイ", tel: "090-7890-3456", address: "福岡県福岡市南区大橋4-2-1", date: "2025/09/01" },
    { id: "C-00017", type: "法人", name: "株式会社 有明建装", furigana: "カブシキガイシャ アリアケケンソウ", tel: "0944-62-7788", address: "福岡県大牟田市有明町2-3-4", date: "2025/08/20" },
    { id: "C-00018", type: "個人", name: "加藤 陽菜", furigana: "カトウ ヒナ", tel: "080-8901-4567", address: "佐賀県小城市三日月町久米1234", date: "2025/08/10" },
    { id: "C-00019", type: "法人", name: "有限会社 嬉野温泉観光", furigana: "ユウゲンガイシャ ウレシノオンセンカンコウ", tel: "0954-43-1122", address: "佐賀県嬉野市嬉野町大字下宿甲4100", date: "2025/07/25" },
    { id: "C-00020", type: "個人", name: "佐藤 次郎", furigana: "サトウ ジロウ", tel: "090-2345-6780", address: "長崎県諫早市栄田町1-1-1", date: "2025/07/10" },
];

async function seed() {
    console.log("Seeding customers...");
    for (const c of dummyCustomers) {
        await db.insert(customers).values({
            id: c.id,
            type: c.type,
            name: c.name,
            furigana: c.furigana,
            tel: c.tel,
            address: c.address,
            createdAt: new Date(c.date),
        }).onConflictDoNothing({ target: customers.id });
    }
    console.log("Seeding completed.");
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
