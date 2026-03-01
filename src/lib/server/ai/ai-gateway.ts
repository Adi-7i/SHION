import { AIModel } from '../config/models';
import { loadOpenAIChatModel, loadOpenAIEmbeddingModel } from './openai';
import { loadGeminiChatModel, loadGeminiEmbeddingModel } from './gemini';
import { loadGroqChatModel } from './groq';
import BaseLLM from '../../models/base/llm';
import BaseEmbedding from '../../models/base/embedding';

export const getLLMForModel = async (model: AIModel): Promise<BaseLLM<any>> => {
    switch (model.provider) {
        case 'openai':
            return loadOpenAIChatModel(model.key);
        case 'gemini':
            return loadGeminiChatModel(model.key);
        case 'groq':
            return loadGroqChatModel(model.key);
        default:
            throw new Error(`Unsupported AI provider: ${model.provider}`);
    }
};

export const getEmbeddingForModel = async (model: AIModel): Promise<BaseEmbedding<any>> => {
    switch (model.provider) {
        case 'openai':
            return loadOpenAIEmbeddingModel(model.key);
        case 'gemini':
            return loadGeminiEmbeddingModel(model.key);
        case 'groq':
            throw new Error('Groq does not support embedding models');
        default:
            throw new Error(`Unsupported AI provider: ${model.provider}`);
    }
};
