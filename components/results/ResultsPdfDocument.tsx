import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfFontFamily } from '@/lib/pdf-fonts';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: pdfFontFamily, fontSize: 11 },
    title: { fontSize: 18, marginBottom: 4, fontWeight: 'bold' },
    subtitle: { fontSize: 12, marginBottom: 20, color: '#666' },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 16, marginBottom: 10 },
    item: { marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #eee' },
    itemTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
    itemMeta: { fontSize: 10, color: '#666' },
    recItem: { marginBottom: 10, padding: 8, backgroundColor: '#f5f5f5' },
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 9, color: '#999' },
});

interface PdfDocument {
    name: string;
    description: string;
    mandatory: boolean;
}

interface PdfRecommendation {
    title: string;
    description: string;
}

interface ResultsPdfDocumentProps {
    visaType: string;
    documents: PdfDocument[];
    recommendations: PdfRecommendation[];
    lang: string;
}

export default function ResultsPdfDocument({
    visaType,
    documents,
    recommendations,
    lang,
}: ResultsPdfDocumentProps) {
    const isRu = lang === 'ru';
    const disclaimer = isRu
        ? 'Информация носит образовательный характер и не является юридической консультацией.'
        : 'This information is for educational purposes only and is not legal advice.';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>VisaGuide — {visaType}</Text>
                <Text style={styles.subtitle}>
                    {isRu ? 'Чек-лист и рекомендации' : 'Checklist and recommendations'}
                </Text>

                {documents.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            {isRu ? 'Необходимые документы' : 'Required documents'}
                        </Text>
                        {documents.map((item, i) => (
                            <View key={i} style={styles.item}>
                                <Text style={styles.itemTitle}>
                                    {i + 1}. {item.name} {item.mandatory ? '*' : ''}
                                </Text>
                                {item.description ? (
                                    <Text style={styles.itemMeta}>{item.description}</Text>
                                ) : null}
                                <Text style={styles.itemMeta}>
                                    {item.mandatory
                                        ? (isRu ? 'Обязательно' : 'Required')
                                        : (isRu ? 'По желанию' : 'Optional')}
                                </Text>
                            </View>
                        ))}
                    </>
                )}

                {recommendations.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>
                            {isRu ? 'Рекомендации' : 'Recommendations'}
                        </Text>
                        {recommendations.map((rec, i) => (
                            <View key={i} style={styles.recItem}>
                                <Text style={styles.itemTitle}>{rec.title}</Text>
                                <Text style={styles.itemMeta}>{rec.description}</Text>
                            </View>
                        ))}
                    </>
                )}

                <Text style={styles.footer}>{disclaimer}</Text>
            </Page>
        </Document>
    );
}
