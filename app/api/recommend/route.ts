import { NextResponse } from 'next/server';
import { DEFAULT_ELIGIBILITY_RULES, evaluateEligibility } from '@/lib/eligibility-engine';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const answers = body.answers;

        if (!answers || typeof answers !== 'object') {
            return NextResponse.json({ error: 'Invalid answers' }, { status: 400 });
        }

        const result = evaluateEligibility(answers, DEFAULT_ELIGIBILITY_RULES);
        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: 'Recommendation failed' }, { status: 500 });
    }
}
