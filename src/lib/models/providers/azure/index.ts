import { UIConfigField } from '@/lib/config/types';
import { Model, ModelList, ProviderMetadata } from '../../types';
import BaseEmbedding from '../../base/embedding';
import BaseModelProvider from '../../base/provider';
import BaseLLM from '../../base/llm';
import AzureLLM from './azureLLM';
import AzureEmbedding from './azureEmbedding';

interface AzureOpenAIConfig {
    apiKey: string;
    endpoint: string;
    deployment: string;
    apiVersion?: string;
    embeddingDeployment?: string;
}

const providerConfigFields: UIConfigField[] = [
    {
        type: 'password',
        name: 'API Key',
        key: 'apiKey',
        description: 'Your Azure OpenAI API key',
        required: true,
        placeholder: 'Azure OpenAI API Key',
        env: 'AZURE_OPENAI_API_KEY',
        scope: 'server',
    },
    {
        type: 'string',
        name: 'Endpoint',
        key: 'endpoint',
        description: 'The endpoint for the Azure OpenAI service (e.g. https://my-resource.openai.azure.com/)',
        required: true,
        placeholder: 'Azure OpenAI Endpoint',
        env: 'AZURE_OPENAI_ENDPOINT',
        scope: 'server',
    },
    {
        type: 'string',
        name: 'Deployment Name',
        key: 'deployment',
        description: 'The deployment name for your chat model',
        required: true,
        placeholder: 'Azure Chat Deployment',
        env: 'AZURE_OPENAI_DEPLOYMENT',
        scope: 'server',
    }
];

class AzureOpenAIProvider extends BaseModelProvider<AzureOpenAIConfig> {
    constructor(id: string, name: string, config: AzureOpenAIConfig) {
        super(id, name, config);
    }

    async getDefaultModels(): Promise<ModelList> {
        // Azure OpenAI doesn't have an endpoint to dynamically list deployments reliably
        // We expect the user to pass the right deployment in the config or via model key.
        return {
            embedding: [
                { name: 'Azure OpenAI Embeddings', key: this.config.embeddingDeployment || 'text-embedding-ada-002' }
            ],
            chat: [
                { name: 'Azure OpenAI Chat', key: this.config.deployment }
            ],
        };
    }

    async getModelList(): Promise<ModelList> {
        return this.getDefaultModels();
    }

    async loadChatModel(key: string): Promise<BaseLLM<any>> {
        return new AzureLLM({
            apiKey: this.config.apiKey,
            endpoint: this.config.endpoint,
            deployment: key,
            apiVersion: this.config.apiVersion,
        });
    }

    async loadEmbeddingModel(key: string): Promise<BaseEmbedding<any>> {
        return new AzureEmbedding({
            apiKey: this.config.apiKey,
            endpoint: this.config.endpoint,
            deployment: key,
            apiVersion: this.config.apiVersion,
        });
    }

    static parseAndValidate(raw: any): AzureOpenAIConfig {
        if (!raw || typeof raw !== 'object')
            throw new Error('Invalid config provided. Expected object');
        if (!raw.apiKey || !raw.endpoint || !raw.deployment)
            throw new Error(
                'Invalid config provided. API key, endpoint, and deployment must be provided',
            );

        return {
            apiKey: String(raw.apiKey),
            endpoint: String(raw.endpoint),
            deployment: String(raw.deployment),
            embeddingDeployment: raw.embeddingDeployment ? String(raw.embeddingDeployment) : undefined,
        };
    }

    static getProviderConfigFields(): UIConfigField[] {
        return providerConfigFields;
    }

    static getProviderMetadata(): ProviderMetadata {
        return {
            key: 'azure',
            name: 'Azure OpenAI',
        };
    }
}

export default AzureOpenAIProvider;
