<script setup lang="ts">
import { useMembersStore } from "@/store/membersStore"; // Adjust the path as necessary
import type { FormError, FormSubmitEvent } from "#ui/types";

const emit = defineEmits(["close"]);
const toast = useToast();

const state = reactive({
  name: "",
  role: "",
  email: undefined,
  password: undefined,
});

// Define the store
const membersStore = useMembersStore();

// Validate function for form inputs
const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email)
    errors.push({ path: "email", message: "Please enter an email." });
  if (!state.password)
    errors.push({ path: "password", message: "Please enter a password." });
  // if (!state.role)
  //   errors.push({ path: "role", message: "Please select a role." });
  return errors;
};

// Handle form submission and call API to create a new user
async function onSubmit(event: FormSubmitEvent<any>) {
  const errors = validate(state);
  if (errors.length > 0) {
    return; // Exit if validation fails
  }

  // Prepare the payload for the API
  const payload = {
    name: event.data.name, // Using email as name for simplicity, adjust as needed
    email: event.data.email,
    password: event.data.password,
    // role: event.data.role,
  };

  // Call the store's addUser method to create a new user
  try {
    await membersStore.addUser(payload);
    if (!membersStore.error) {
      emit("close");
      toast.add({ title: "Success", description: "User added successfully" });
    } else {
      toast.add({ title: "Error", description: membersStore.error });
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
</script>

<template>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="Full name" name="name">
      <UInput
        v-model="state.name"
        type="text"
        placeholder="John doe"
        autofocus
      />
    </UFormGroup>
    <UFormGroup label="Email" name="email">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="john.doe@example.com"
        autofocus
      />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <!-- <UFormGroup label="Role" name="role">
      <USelectMenu
        v-model="state.role"
        :options="membersStore.roles"
        :ui-menu="{ select: 'capitalize', option: { base: 'capitalize' } }"
      />
    </UFormGroup> -->

    <div class="flex justify-end gap-3">
      <UButton
        label="Cancel"
        color="gray"
        variant="ghost"
        @click="emit('close')"
      />
      <UButton :loading="membersStore.isLoading" type="submit" label="Save" color="black" />
    </div>
  </UForm>
</template>
