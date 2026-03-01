import { NextResponse } from 'next/server';
import { getAvailableModels } from '@/lib/server/config/models';

export const GET = async () => {
    try {
        const availableModels = getAvailableModels();

        return NextResponse.json({
            models: availableModels
        });
    } catch (err) {
        console.error('Error fetching available models:', err);
        return NextResponse.json(
            { message: 'An error occurred while fetching models.' },
            { status: 500 }
        );
    }
};
