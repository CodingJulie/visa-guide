import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfFontFamily } from '@/lib/pdf-fonts';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: pdfFontFamily, fontSize: 11 },
    title: { fontSize: 18, marginBottom: 8, fontWeight: 'bold' },
    subtitle: { fontSize: 12, marginBottom: 20, color: '#666' },
    item: { marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #eee' },
    itemTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
    itemMeta: { fontSize: 10, color: '#888' },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 9, color: '#999' },
});

interface PdfItem {
    name: string;
    description: string;
    mandatory: boolean;
    status: string;
}

interface ChecklistPdfDocumentProps {
    visaType: string;
    items: PdfItem[];
    lang: string;
}

export default function ChecklistPdfDocument({ visaType, items, lang }: ChecklistPdfDocumentProps) {
    const disclaimer = lang === 'ru'
        ? 'Информация носит образовательный характер и не является юридической консультацией.'
        : 'This information is for educational purposes only and is not legal advice.';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>VisaGuide — {visaType}</Text>
                <Text style={styles.subtitle}>
                    {lang === 'ru' ? 'Чеклист документов' : 'Document Checklist'}
                </Text>

                {items.map((item, i) => (
                    <View key={i} style={styles.item}>
                        <Text style={styles.itemTitle}>
                            {i + 1}. {item.name} {item.mandatory ? '*' : ''}
                        </Text>
                        {item.description ? <Text style={styles.itemMeta}>{item.description}</Text> : null}
                        <Text style={styles.itemMeta}>Status: {item.status}</Text>
                    </View>
                ))}

                <Text style={styles.footer}>{disclaimer}</Text>
            </Page>
        </Document>
    );
}
