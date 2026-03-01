import configManager from './index';
import { ConfigModelProvider } from './types';
import { getAzureEnv } from '../server/config/env';

export const getConfiguredModelProviders = (): ConfigModelProvider[] => {
  const configProviders = configManager.getConfig('modelProviders', []);

  // Auto-inject Azure provider from environment variables if not already present
  const { apiKey, endpoint, deployment, apiVersion } = getAzureEnv();
  const azureExistsInConfig = configProviders.some(
    (p: ConfigModelProvider) => p.type === 'azure',
  );

  if (apiKey && endpoint && deployment && !azureExistsInConfig) {
    configProviders.push({
      id: 'azure',
      type: 'azure',
      name: 'Azure OpenAI',
      config: {
        apiKey,
        endpoint,
        deployment,
        apiVersion,
        embeddingDeployment: deployment,
      },
      chatModels: [{ key: deployment, name: deployment }],
      embeddingModels: [],
    });
  }

  return configProviders;
};

export const getConfiguredModelProviderById = (
  id: string,
): ConfigModelProvider | undefined => {
  return getConfiguredModelProviders().find((p) => p.id === id) ?? undefined;
};

export const getSearxngURL = () =>
  process.env.SEARXNG_URL || '';
