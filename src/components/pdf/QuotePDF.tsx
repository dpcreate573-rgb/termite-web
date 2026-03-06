import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register font for Japanese characters
Font.register({
  family: 'NotoSansJP',
  src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzCE-Iqwwz1A.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'NotoSansJP',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  total: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'right',
    fontWeight: 'bold',
  }
});

// Create Document Component
export const QuotePDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>御見積書</Text>
      <View style={styles.section}>
        <Text style={styles.text}>株式会社 〇〇 様</Text>
        <Text style={styles.text}>以下の通り御見積申し上げます。</Text>
        
        {/* Placeholder for dynamic items */}
        <Text style={{ ...styles.text, marginTop: 20 }}>【内訳】</Text>
        {data.types.includes('A') && <Text style={styles.text}>・シロアリ駆除作業 一式: ¥{data.totalA.toLocaleString()}</Text>}
        {data.types.includes('B') && <Text style={styles.text}>・害虫防除作業 一式: ¥{data.totalB.toLocaleString()}</Text>}
        {data.types.includes('C') && <Text style={styles.text}>・商品・資材: ¥{data.totalC.toLocaleString()}</Text>}

        <Text style={styles.total}>合計金額(税抜): ¥{data.grandTotal.toLocaleString()}</Text>
        <Text style={{ ...styles.text, textAlign: 'right' }}>税込: ¥{Math.floor(data.grandTotal * 1.1).toLocaleString()}</Text>
      </View>
    </Page>
  </Document>
);
