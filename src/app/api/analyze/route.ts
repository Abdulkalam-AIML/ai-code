import { NextRequest, NextResponse } from 'next/server';
import { analyzeCode } from '@/lib/analyzer';

export async function POST(req: NextRequest) {
    try {
        const { code, language } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'No code provided' }, { status: 400 });
        }

        const analysis = analyzeCode(code, language || 'javascript');

        return NextResponse.json(analysis);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
