import { getEnv } from '../config/env';
import OpenAIProvider from '../../models/providers/openai';

export const getOpenAIProvider = () => {
    const env = getEnv();

    if (!env.OPENAI_API_KEY) {
        throw new Error('OpenAI API Key is not configured in the environment.');
    }

    return new OpenAIProvider('openai', 'OpenAI', {
        apiKey: env.OPENAI_API_KEY,
        baseURL: env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    });
};

export const loadOpenAIChatModel = async (modelKey: string) => {
    const provider = getOpenAIProvider();
    return provider.loadChatModel(modelKey);
};

export const loadOpenAIEmbeddingModel = async (modelKey: string) => {
    const provider = getOpenAIProvider();
    return provider.loadEmbeddingModel(modelKey);
};
