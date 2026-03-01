import { getEnv } from '../config/env';
import GroqProvider from '../../models/providers/groq';

export const getGroqProvider = () => {
    const env = getEnv();

    if (!env.GROQ_API_KEY) {
        throw new Error('Groq API Key is not configured in the environment.');
    }

    return new GroqProvider('groq', 'Groq', {
        apiKey: env.GROQ_API_KEY,
    });
};

export const loadGroqChatModel = async (modelKey: string) => {
    const provider = getGroqProvider();
    return provider.loadChatModel(modelKey);
};
