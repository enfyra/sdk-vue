import { computed, readonly, ref, shallowRef } from 'vue';
import { isEnfyraError } from '@enfyra/sdk-core';
import type { AuthLoginResult, LoginCredentials, RequestStatus, UserInfo } from '@enfyra/sdk-core';
import { useEnfyra } from './useEnfyra';

const user = shallowRef<UserInfo | null>(null);
const pending = ref(false);
const status = ref<RequestStatus | null>(null);
const error = ref<Error | null>(null);
let refreshPromise: Promise<UserInfo | null> | null = null;

export function useAuth() {
  const client = useEnfyra();

  const refresh = async (): Promise<UserInfo | null> => {
    if (refreshPromise) return refreshPromise;
    pending.value = true;
    status.value = 'pending';
    error.value = null;
    refreshPromise = (async () => {
      try {
        const currentUser = await client.auth.getMe();
        user.value = currentUser;
        status.value = 'success';
        return currentUser;
      } catch (err) {
        if (isEnfyraError(err) && err.statusCode === 401) {
          user.value = null;
          status.value = 'success';
          return null;
        }
        error.value = err instanceof Error ? err : new Error('Auth check failed');
        status.value = 'error';
        return null;
      } finally {
        pending.value = false;
        refreshPromise = null;
      }
    })();
    return refreshPromise;
  };

  const login = async (credentials: LoginCredentials): Promise<AuthLoginResult | null> => {
    pending.value = true;
    status.value = 'pending';
    error.value = null;
    try {
      const result = await client.auth.login(credentials);
      await refresh();
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Login failed');
      status.value = 'error';
      return null;
    } finally {
      pending.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    await client.auth.logout();
    user.value = null;
    status.value = null;
  };

  void refresh();

  return {
    user: readonly(user),
    isAuthenticated: computed(() => user.value !== null),
    pending: readonly(pending),
    status: readonly(status),
    error: readonly(error),
    login,
    logout,
    refresh,
  };
}
