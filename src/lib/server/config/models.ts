import { getEnv, parseModelList } from './env';
import { getAvailableProviders } from './providers';

export interface AIModel {
    name: string;
    provider: string;
    type: 'fast' | 'balanced' | 'quality';
    key: string;
}

const staticModels: AIModel[] = [
    // Gemini Models
    {
        name: 'Gemini 2.5 Flash',
        provider: 'gemini',
        type: 'fast',
        key: 'gemini-2.5-flash',
    },
    {
        name: 'Gemini 2.5 Pro',
        provider: 'gemini',
        type: 'quality',
        key: 'gemini-2.5-pro',
    },
    {
        name: 'Gemini 2.0 Flash',
        provider: 'gemini',
        type: 'fast',
        key: 'gemini-2.0-flash',
    },
    {
        name: 'Gemini 2.0 Flash 001',
        provider: 'gemini',
        type: 'fast',
        key: 'gemini-2.0-flash-001',
    },
    {
        name: 'Gemini 2.0 Flash (Image Generation)',
        provider: 'gemini',
        type: 'fast',
        key: 'gemini-2.0-flash-exp-image-generation',
    },
    {
        name: 'Gemini 2.0 Flash-Lite 001',
        provider: 'gemini',
        type: 'fast',
        key: 'gemini-2.0-flash-lite-001',
    },
    {
        name: 'Gemini 1.5 Flash',
        provider: 'gemini',
        type: 'fast',
        key: 'gemini-1.5-flash',
    },
    {
        name: 'Gemini 1.5 Pro',
        provider: 'gemini',
        type: 'balanced',
        key: 'gemini-1.5-pro',
    },
    // OpenAI Models
    {
        name: 'GPT-4o',
        provider: 'openai',
        type: 'quality',
        key: 'gpt-4o',
    },
    {
        name: 'GPT-4o Mini',
        provider: 'openai',
        type: 'fast',
        key: 'gpt-4o-mini',
    },
    {
        name: 'o1',
        provider: 'openai',
        type: 'quality',
        key: 'o1',
    },
    {
        name: 'o3 Mini',
        provider: 'openai',
        type: 'balanced',
        key: 'o3-mini',
    },
    // Groq Models
    {
        name: 'Llama 3 70B (Groq)',
        provider: 'groq',
        type: 'balanced',
        key: 'llama3-70b-8192',
    },
    {
        name: 'Llama 3 8B (Groq)',
        provider: 'groq',
        type: 'fast',
        key: 'llama3-8b-8192',
    },
    {
        name: 'Mixtral 8x7B (Groq)',
        provider: 'groq',
        type: 'fast',
        key: 'mixtral-8x7b-32768',
    },
];

// Build the OpenAI chat model list from OPENAI_CHAT_MODELS env var (overrides static list)
const getEnvOpenAIModels = (): AIModel[] => {
    const keys = parseModelList(getEnv().OPENAI_CHAT_MODELS);
    if (keys.length === 0) return [];
    return keys.map((key) => ({
        name: key,
        provider: 'openai',
        type: 'quality' as const,
        key,
    }));
};

export const getAvailableModels = (): AIModel[] => {
    const configuredProviders = getAvailableProviders().map((p) => p.key);
    const envOpenAIModels = getEnvOpenAIModels();

    // If OPENAI_CHAT_MODELS is set, replace the static openai entries with env-driven ones
    const baseModels = envOpenAIModels.length > 0
        ? staticModels.filter((m) => m.provider !== 'openai')
        : staticModels;

    const allModels = [...baseModels, ...envOpenAIModels];
    return allModels.filter((model) => configuredProviders.includes(model.provider));
};
