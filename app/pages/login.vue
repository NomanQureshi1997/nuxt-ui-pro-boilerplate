<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "#ui/types";
import { useAuthStore } from '~/store/authStore';

const toast = useToast()

definePageMeta({
  layout: 'auth',
  middleware: ['auth-bypass'],
});

useSeoMeta({
  title: "Login",
});

const authStore = useAuthStore();

const state = reactive({
  email: undefined,
  password: undefined,
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  await authStore.login(event.data.email, event.data.password);
  if (!authStore.error) {
    navigateTo('/contracts');
  }else {
    toast.add({ title: 'Login Attempt Failed!' })
  }
}

async function onError(event: FormErrorEvent) {
  const element = document.getElementById(event.errors[0].id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur" :ui="{ footer: 'text-center' }">
    <template #header><h1 class="w-full flex justify-center items-center">  Welcome back.</h1> </template>
    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
      @error="onError"
    >
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit" class="w-full flex justify-center items-center"> Submit </UButton>
    </UForm>
  </UCard>
</template>
