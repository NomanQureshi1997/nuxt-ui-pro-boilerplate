// plugins/init-store.ts

import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '~/store/authStore';

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  authStore.init();
});
