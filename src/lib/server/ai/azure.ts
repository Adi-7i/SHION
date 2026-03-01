import { getAzureEnv } from '../config/env';
import AzureOpenAIProvider from '../../models/providers/azure';

export const getAzureProvider = () => {
    const { apiKey, endpoint, deployment, apiVersion } = getAzureEnv();

    if (!apiKey || !endpoint || !deployment) {
        throw new Error('Azure OpenAI configuration is missing in the environment. Set LLM_API_KEY, LLM_AZURE_BASE_URL, and LLM_AZURE_DEPLOYMENT.');
    }

    return new AzureOpenAIProvider('azure', 'Azure OpenAI', {
        apiKey,
        endpoint,
        deployment,
        apiVersion,
        embeddingDeployment: deployment,
    });
};

export const loadAzureChatModel = async (modelKey: string) => {
    const provider = getAzureProvider();
    return provider.loadChatModel(modelKey);
};

export const loadAzureEmbeddingModel = async (modelKey: string) => {
    const provider = getAzureProvider();
    return provider.loadEmbeddingModel(modelKey);
};
