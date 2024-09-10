// services/api.ts
import { useFetch } from "nuxt/app";
import { useAuthStore } from '~/store/authStore';

export async function fetchData(url: string, body: object) {
  try {
    const authStore = useAuthStore();
    const response = await useFetch(url, body);
    if (response?.error?.value?.statusCode === 401) {
      authStore.logout();
      return;
    }

    return response;
  } catch (err) {
    console.error('API fetch error:', err);
    throw err;
  }
}
