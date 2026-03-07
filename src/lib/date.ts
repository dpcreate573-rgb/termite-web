/**
 * 日付を和暦形式にフォーマットするユーティリティ
 */
export const formatWareki = (date: Date | number | string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
        era: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(d);
};
