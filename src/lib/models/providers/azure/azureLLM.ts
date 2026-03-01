import { OpenAI } from 'openai';
import BaseLLM from '../../base/llm';
import {
    GenerateObjectInput,
    GenerateObjectOutput,
    GenerateTextInput,
    GenerateTextOutput,
    StreamObjectOutput,
    StreamTextOutput,
} from '../../types';

interface AzureLLMConfig {
    apiKey: string;
    endpoint: string;
    deployment: string;
    apiVersion?: string;
}

class AzureLLM extends BaseLLM<AzureLLMConfig> {
    private client: OpenAI;

    constructor(config: AzureLLMConfig) {
        super(config);
        this.client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: `${config.endpoint}openai/deployments/${config.deployment}`,
            defaultQuery: { 'api-version': config.apiVersion || '2024-02-15-preview' },
            defaultHeaders: { 'api-key': config.apiKey },
        });
    }

    async generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
        const res = await this.client.chat.completions.create({
            model: this.config.deployment,
            messages: input.messages as any,
            temperature: input.options?.temperature,
            top_p: input.options?.topP,
            max_tokens: input.options?.maxTokens,
            frequency_penalty: input.options?.frequencyPenalty,
            presence_penalty: input.options?.presencePenalty,
            stop: input.options?.stopSequences,
            tools: input.tools?.map((tool) => ({
                type: 'function',
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.schema as any,
                },
            })),
        });

        const message = res.choices[0].message;

        return {
            content: message.content || '',
            toolCalls:
                message.tool_calls?.map((tc: any) => ({
                    id: tc.id,
                    name: tc.function.name,
                    arguments: JSON.parse(tc.function.arguments),
                })) || [],
            additionalInfo: {
                usage: res.usage,
            },
        };
    }

    async *streamText(
        input: GenerateTextInput,
    ): AsyncGenerator<StreamTextOutput> {
        const res = await this.client.chat.completions.create({
            model: this.config.deployment,
            messages: input.messages as any,
            temperature: input.options?.temperature,
            top_p: input.options?.topP,
            max_tokens: input.options?.maxTokens,
            frequency_penalty: input.options?.frequencyPenalty,
            presence_penalty: input.options?.presencePenalty,
            stop: input.options?.stopSequences,
            stream: true,
            tools: input.tools?.map((tool) => ({
                type: 'function',
                function: {
                    name: tool.name,
                    description: tool.description,
                    parameters: tool.schema as any,
                },
            })),
        });

        return (async function* () {
            let isDone = false;
            for await (const chunk of res) {
                if (chunk.choices.length === 0) continue;
                const delta = chunk.choices[0].delta;
                const finishReason = chunk.choices[0].finish_reason;

                if (finishReason) isDone = true;

                yield {
                    contentChunk: delta.content || '',
                    toolCallChunk:
                        delta.tool_calls?.map((tc) => ({
                            id: tc.id || '',
                            name: tc.function?.name || '',
                            arguments: tc.function?.arguments
                                ? JSON.parse(tc.function.arguments)
                                : {},
                        })) || [],
                    done: isDone,
                };
            }
        })();
    }

    async generateObject<T>(
        input: GenerateObjectInput,
    ): Promise<import('zod').infer<T>> {
        const res = await this.client.chat.completions.create({
            model: this.config.deployment,
            messages: input.messages as any,
            response_format: { type: 'json_object' },
            temperature: input.options?.temperature,
            top_p: input.options?.topP,
            max_tokens: input.options?.maxTokens,
            frequency_penalty: input.options?.frequencyPenalty,
            presence_penalty: input.options?.presencePenalty,
            stop: input.options?.stopSequences,
        });

        const content = res.choices[0].message.content;
        const object = JSON.parse(content || '{}');

        return object as import('zod').infer<T>;
    }

    async *streamObject<T>(
        input: GenerateObjectInput,
    ): AsyncGenerator<Partial<import('zod').infer<T>>> {
        const res = await this.client.chat.completions.create({
            model: this.config.deployment,
            messages: input.messages as any,
            response_format: { type: 'json_object' },
            temperature: input.options?.temperature,
            top_p: input.options?.topP,
            max_tokens: input.options?.maxTokens,
            frequency_penalty: input.options?.frequencyPenalty,
            presence_penalty: input.options?.presencePenalty,
            stop: input.options?.stopSequences,
            stream: true,
        });

        let isDone = false;
        let buffer = '';

        for await (const chunk of res) {
            if (chunk.choices.length === 0) continue;
            const delta = chunk.choices[0].delta;
            const finishReason = chunk.choices[0].finish_reason;

            if (finishReason) isDone = true;

            if (delta.content) {
                buffer += delta.content;
                try {
                    const partialObject = JSON.parse(buffer + '}'); // basic partial parsing
                    yield partialObject as Partial<import('zod').infer<T>>;
                } catch (e) {
                    // Wait for more valid JSON to arrive
                }
            }
        }

        if (isDone) {
            try {
                const finalObject = JSON.parse(buffer);
                yield finalObject as Partial<import('zod').infer<T>>;
            } catch (e) { }
        }
    }
}

export default AzureLLM;
