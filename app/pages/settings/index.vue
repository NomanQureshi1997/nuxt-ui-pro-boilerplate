<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useAuthStore } from "~/store/authStore";

const authStore = useAuthStore();

const fileRef = ref<HTMLInputElement>();
const isDeleteAccountModalOpen = ref(false);

const state = reactive({
  name: 'Benjamin Canac',
  email: 'ben@nuxtlabs.com',
  username: 'benjamincanac',
  avatar: '',
  bio: '',
  password_current: '',
  password_new: ''
})

const toast = useToast();

function validate(state: any): FormError[] {
  const errors = [];
  if (!state.name)
    errors.push({ path: "name", message: "Please enter your name." });
  if (!state.email)
    errors.push({ path: "email", message: "Please enter your email." });
  // if ((state.password_current && !state.password_new) || (!state.password_current && state.password_new)) errors.push({ path: 'password', message: 'Please enter a valid password.' })
  return errors;
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  state.avatar = URL.createObjectURL(input.files[0]);
}

function onFileClick() {
  fileRef.value?.click();
}

async function onSubmit(event: FormSubmitEvent<any>) {
  toast.add({ title: "Profile updated", icon: "i-heroicons-check-circle" });
}
</script>

<template>
  <div class="p-4 flex-1 flex flex-col overflow-y-auto pb-24">
    <UForm
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      @submit="onSubmit"
    >
      <Section
        title="Profile"
        description="This information will be displayed publicly so be careful what you share."
      >
        <template #links>
          <UButton type="submit" label="Save changes" color="black" disabled />
        </template>
        <UFormGroup
          name="name"
          label="Name"
          description="Will appear on receipts, invoices, and other communication."
          required
          class="grid grid-cols-2 gap-2 items-center"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.name"
            autocomplete="off"
            icon="i-heroicons-user"
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="email"
          label="Email"
          description="Used to sign in, for email receipts and product updates."
          required
          class="grid grid-cols-2 gap-2"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.email"
            type="email"
            autocomplete="off"
            icon="i-heroicons-envelope"
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="avatar"
          label="Avatar"
          class="grid grid-cols-2 gap-2"
          help="JPG, GIF or PNG. 1MB Max."
          :ui="{ container: 'flex flex-wrap items-center gap-3', help: 'mt-0' }"
        >
          <UAvatar :src="state.avatar" :alt="state.name" size="lg" />

          <UButton
            label="Choose"
            color="white"
            size="md"
            @click="onFileClick"
          />

          <input
            ref="fileRef"
            type="file"
            class="hidden"
            accept=".jpg, .jpeg, .png, .gif"
            @change="onFileChange"
          />
        </UFormGroup>
      </Section>

    </UForm>

    <UDivider class="mb-4" />

    <Section
      title="Account"
      description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
    >
      <div>
        <UButton
          color="red"
          label="Delete account"
          size="md"
          disabled
          @click="isDeleteAccountModalOpen = true"
        />
      </div>
    </Section>

    <!-- ~/components/settings/DeleteAccountModal.vue -->
    <SettingsDeleteAccountModal v-model="isDeleteAccountModalOpen" />
  </div>
</template>
