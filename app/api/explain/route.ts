import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { recommendation, answers, lang = 'en' } = body;

        if (!recommendation?.visaType) {
            return NextResponse.json({ error: 'Missing recommendation' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            const fallback = lang === 'ru'
                ? `На основе ваших ответов рекомендуется виза ${recommendation.visaType}. Это образовательная информация, не юридическая консультация.`
                : `Based on your answers, ${recommendation.visaType} is recommended. This is educational information, not legal advice.`;
            return NextResponse.json({ summary: fallback });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = lang === 'ru'
            ? `Объясни простым языком, почему рекомендована виза ${recommendation.visaType}. НЕ меняй рекомендацию. Укажи, что это не юридическая консультация. Ответы пользователя: ${JSON.stringify(answers)}`
            : `Explain in plain language why visa ${recommendation.visaType} is recommended. Do NOT change the recommendation. Note this is not legal advice. User answers: ${JSON.stringify(answers)}`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        return NextResponse.json({ summary });
    } catch {
        return NextResponse.json({ error: 'Explanation failed' }, { status: 500 });
    }
}
