<script setup lang="ts">
import type { User } from "~/types";
import ContractForm from "@/components/contracts/ContractForm.vue";
import { useMembersStore } from "@/store/membersStore";
import { useContractsStore } from "@/store/contractsStore";
import { useAuthStore } from "~/store/authStore";

const membersStore = useMembersStore();
const contractsStore = useContractsStore();
const authStore = useAuthStore();

onBeforeUnmount(() => {
  contractsStore.constracts = [];
});

const defaultColumns = [
  {
    key: "id",
    label: "#",
  },
  {
    key: "title",
    label: "Title",
    sortable: true,
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "users",
    label: "Users",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
  },
];

const q = ref("");
const selected = ref<User[]>([]);
const selectedColumns = ref(defaultColumns);
const sort = ref({ column: "id", direction: "asc" as const });
const input = ref<{ input: HTMLInputElement }>();
const isNewUserModalOpen = ref(false);

const columns = computed(() =>
  defaultColumns.filter((column) => selectedColumns.value.includes(column))
);

function onSelect(row: User) {
  const index = selected.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

defineShortcuts({
  "/": () => {
    input.value?.input?.focus();
  },
});
</script>

<template>
  <div class="flex flex-1 w-full min-w-0">
    <div class="flex-col items-stretch relative w-full flex-1 flex">
      <div
        class="h-16 flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0"
      >
        <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
          <div class="flex items-stretch gap-1.5 min-w-0">
            <h1
              class="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white min-w-0"
            >
              Contracts
            </h1>
          </div>
          <div class="flex items-stretch flex-shrink-0 gap-1.5">
            <UInput
              ref="input"
              v-model="q"
              icon="i-heroicons-funnel"
              autocomplete="off"
              placeholder="Filter contracts..."
              class="hidden lg:block"
              @keydown.esc="$event.target.blur()"
            >
              <template #trailing>
                <UKbd value="/" />
              </template>
            </UInput>

            <UButton
              label="New contract"
              trailing-icon="i-heroicons-plus"
              color="gray"
              @click="isNewUserModalOpen = true"
            />
          </div>
        </div>
      </div>

      <UModal
        v-model="isNewUserModalOpen"
        class="relative text-left rtl:text-right flex flex-col bg-white dark:bg-gray-900 shadow-xl sm:shadow-xl w-full sm:max-w-md h-dvh sm:h-auto rounded-lg sm:rounded-lg sm:my-8"
      >
        <UCard
          :ui="{
            ring: '',
            divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          }"
        >
          <template #header>
            <h1>Create a Contract</h1>
          </template>

          <ContractForm @close="isNewUserModalOpen = false" />

      
        </UCard>
        
      </UModal>

      <UTable
        v-model="selected"
        v-model:sort="sort"
        :rows="contractsStore.constracts"
        :columns="columns"
        :loading="contractsStore.isLoading"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
        @select="onSelect"
      >
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />

            <span class="text-gray-900 dark:text-white font-medium">{{
              row.name
            }}</span>
          </div>
        </template>
        <template #users-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatarGroup size="sm" :max="3">
              <UAvatar
                v-for="user in row.users"
                :key="user.id"
                :alt="user.name"
                size="xs"
              >
              </UAvatar>
            </UAvatarGroup>
          </div>
        </template>
        <template #status-data="{ row }">
          <UBadge
            :label="'active'"
            :color="
              'active' === 'active'
                ? 'green'
                : row.status === 'bounced'
                ? 'orange'
                : 'red'
            "
            variant="subtle"
            class="capitalize"
          />
        </template>
      </UTable>
    </div>
  </div>
</template>
