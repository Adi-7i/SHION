import { getEnv } from './env';

export interface ProviderConfig {
    key: string;
    name: string;
    isConfigured: () => boolean;
}

export const providers: Record<string, ProviderConfig> = {
    openai: {
        key: 'openai',
        name: 'OpenAI',
        isConfigured: () => {
            const env = getEnv();
            return !!env.OPENAI_API_KEY;
        },
    },
    gemini: {
        key: 'gemini',
        name: 'Gemini',
        isConfigured: () => {
            const env = getEnv();
            return !!env.GEMINI_API_KEY;
        },
    },
    groq: {
        key: 'groq',
        name: 'Groq',
        isConfigured: () => {
            const env = getEnv();
            return !!env.GROQ_API_KEY;
        },
    },
};

export const getAvailableProviders = () => {
    return Object.values(providers).filter((provider) =>
        provider.isConfigured(),
    );
};
