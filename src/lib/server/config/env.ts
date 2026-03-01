import z from 'zod';

const envSchema = z.object({
    OPENAI_API_KEY: z.string().optional(),
    OPENAI_BASE_URL: z.string().optional(),
    GEMINI_API_KEY: z.string().optional(),
    GROQ_API_KEY: z.string().optional(),
    // Legacy Azure env vars (kept for backwards compat)
    AZURE_OPENAI_API_KEY: z.string().optional(),
    AZURE_OPENAI_ENDPOINT: z.string().optional(),
    AZURE_OPENAI_DEPLOYMENT: z.string().optional(),
    AZURE_OPENAI_API_VERSION: z.string().optional(),
    // New LLM-prefixed Azure env vars (higher priority)
    LLM_API_KEY: z.string().optional(),
    LLM_AZURE_BASE_URL: z.string().optional(),
    LLM_AZURE_API_VERSION: z.string().optional(),
    LLM_AZURE_DEPLOYMENT: z.string().optional(),
    SEARXNG_URL: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

let env: Env = {};

try {
    env = envSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error('Invalid environment variables:', error.format());
    } else {
        console.error('Error parsing environment variables:', error);
    }
}

export const getEnv = () => env;

// Helper to get the effective Azure config (LLM_ vars take priority)
export const getAzureEnv = () => {
    const e = getEnv();
    const apiKey = e.LLM_API_KEY || e.AZURE_OPENAI_API_KEY;
    const endpoint = e.LLM_AZURE_BASE_URL || e.AZURE_OPENAI_ENDPOINT;
    const deployment = e.LLM_AZURE_DEPLOYMENT || e.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = e.LLM_AZURE_API_VERSION || e.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';
    return { apiKey, endpoint, deployment, apiVersion };
};
