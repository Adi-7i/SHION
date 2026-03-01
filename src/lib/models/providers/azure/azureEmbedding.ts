import { OpenAI } from 'openai';
import BaseEmbedding from '../../base/embedding';

interface AzureEmbeddingConfig {
    apiKey: string;
    endpoint: string;
    deployment: string;
    apiVersion?: string;
}

class AzureEmbedding extends BaseEmbedding<AzureEmbeddingConfig> {
    private client: OpenAI;

    constructor(config: AzureEmbeddingConfig) {
        super(config);
        this.client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: `${config.endpoint}openai/deployments/${config.deployment}`,
            defaultQuery: { 'api-version': config.apiVersion || '2024-02-15-preview' },
            defaultHeaders: { 'api-key': config.apiKey },
        });
    }

    async embedText(texts: string[]): Promise<number[][]> {
        const res = await this.client.embeddings.create({
            model: this.config.deployment,
            input: texts,
        });

        return res.data.map((e) => e.embedding);
    }

    async embedChunks(chunks: import('@/lib/types').Chunk[]): Promise<number[][]> {
        const texts = chunks.map((c) => c.content);
        return this.embedText(texts);
    }
}

export default AzureEmbedding;
