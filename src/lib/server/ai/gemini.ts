import { getEnv } from '../config/env';
import GeminiProvider from '../../models/providers/gemini';

export const getGeminiProvider = () => {
    const env = getEnv();

    if (!env.GEMINI_API_KEY) {
        throw new Error('Gemini API Key is not configured in the environment.');
    }

    return new GeminiProvider('gemini', 'Gemini', {
        apiKey: env.GEMINI_API_KEY,
    });
};

export const loadGeminiChatModel = async (modelKey: string) => {
    const provider = getGeminiProvider();
    return provider.loadChatModel(modelKey);
};

export const loadGeminiEmbeddingModel = async (modelKey: string) => {
    const provider = getGeminiProvider();
    return provider.loadEmbeddingModel(modelKey);
};
