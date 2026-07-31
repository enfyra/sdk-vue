import { inject, type App, type InjectionKey } from 'vue';
import { EnfyraClient } from '@enfyra/sdk-core';
import type { AuthTokens, EnfyraClientConfig } from '@enfyra/sdk-core';

export type VueClientConfig = string | EnfyraClientConfig;

interface EnfyraPluginContext {
  client: EnfyraClient;
}

export const EnfyraKey: InjectionKey<EnfyraPluginContext> = Symbol('enfyra');

const TOKENS_STORAGE_KEY = '__enfyra_tokens';

function parseSavedTokens(raw: string | null): AuthTokens | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.accessToken === 'string' && typeof parsed.expTime === 'number') {
      return parsed;
    }
  } catch { /* ignore */ }
  return null;
}

export function createEnfyra(config: VueClientConfig) {
  return {
    install(app: App) {
      const client = new EnfyraClient(
        typeof config === 'string' ? { baseUrl: config } : config,
      );

      const saved = parseSavedTokens(localStorage.getItem(TOKENS_STORAGE_KEY));
      if (saved) {
        client.auth.setTokens(saved).catch(() => {});
      }

      let prev = localStorage.getItem(TOKENS_STORAGE_KEY);
      setInterval(() => {
        const tokens = client.auth.getTokens();
        const current = tokens ? JSON.stringify(tokens) : null;
        if (current !== prev) {
          prev = current;
          if (current) {
            localStorage.setItem(TOKENS_STORAGE_KEY, current);
          } else {
            localStorage.removeItem(TOKENS_STORAGE_KEY);
          }
        }
      }, 500);

      app.provide(EnfyraKey, { client });
    },
  };
}

export function useEnfyra(): EnfyraClient {
  const ctx = inject(EnfyraKey);
  if (!ctx) throw new Error('useEnfyra must be used with app.use(createEnfyra(...))');
  return ctx.client;
}
