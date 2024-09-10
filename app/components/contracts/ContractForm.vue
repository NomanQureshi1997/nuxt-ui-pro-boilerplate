<script setup lang="ts">
import { format } from "date-fns";
import type { FormError, FormSubmitEvent } from "#ui/types";
import { useMembersStore } from "@/store/membersStore";
import { useContractsStore } from "@/store/contractsStore";

const toast = useToast()
// Define the store
const membersStore = useMembersStore();
const contractsStore = useContractsStore();

const emit = defineEmits(["close"]);

const state: any = reactive({
  title: undefined,
  description: undefined,
  startDate: new Date(),
  endDate: new Date(),
  users: [],
});

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function hashCode(str: any) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i: any) {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

function generateColorFromString(str: any) {
  return intToRGB(hashCode(str));
}

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.title)
    errors.push({ path: "title", message: "Please enter a title." });
  if (!state.description)
    errors.push({
      path: "description",
      message: "Please enter an description.",
    });
  if (!state.startDate)
    errors.push({ path: "startDate", message: "Please enter an startDate." });
  if (!state.endDate)
    errors.push({ path: "endDate", message: "Please enter an endDate." });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  state.startDate = formatDate(state.startDate);
  state.endDate = formatDate(state.endDate);
  contractsStore.addContract(state);
  if (!membersStore.error) {
    emit("close");
    toast.add({ title: "Success", description: "A new contract added" });
  } else {
    toast.add({ title: "Error", description: membersStore.error });
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
    <UFormGroup label="Title" name="title">
      <UInput v-model="state.title" placeholder="Title" autofocus />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <UTextarea
        v-model="state.description"
        placeholder="Description"
        :rows="5"
        autoresize
        size="md"
      />
    </UFormGroup>
    <div class="flex justify-between">
      <UFormGroup label="Start Date" name="startDate">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="format(state.startDate, 'yyyy-MM-dd')"
          />

          <template #panel="{ close }">
            <DatePicker v-model="state.startDate" is-required @close="close" />
          </template>
        </UPopover>
      </UFormGroup>
      <UFormGroup label="End Date" name="endDate">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="format(state.endDate, 'yyyy-MM-dd')"
          />

          <template #panel="{ close }">
            <DatePicker v-model="state.endDate" is-required @close="close" />
          </template>
        </UPopover>
      </UFormGroup>
    </div>
    <UFormGroup label="Users" name="users">
      <USelectMenu
        v-model="state.users"
        by="id"
        name="labels"
        :options="membersStore.users"
        option-attribute="name"
        multiple
        searchable
        creatable
      >
        <template #option="{ option }">
          <span
            class="flex-shrink-0 w-2 h-2 mt-px rounded-full"
            :style="{ background: `#${generateColorFromString(option.name)}` }"
          />
          <span class="truncate">{{ option.email }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>
    <div class="flex justify-end gap-3">
      <UButton
        label="Cancel"
        color="gray"
        variant="ghost"
        @click="emit('close')"
      />
      <UButton type="submit" label="Save" color="black" />
    </div>
  </UForm>
</template>
