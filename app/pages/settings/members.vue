<script setup lang="ts">
import type { Member } from "~/types";
import { useMembersStore } from "@/store/membersStore";

const { data: members } = await useFetch<Member[]>("/api/members", {
  default: () => [],
});

// Define the store
const membersStore = useMembersStore();

const q = ref("");
const isInviteModalOpen = ref(false);

const filteredMembers = computed(() => {
  if (import.meta.server) return [];
  console.log("membersStore.users", membersStore.users);
  return membersStore.users.filter((member) => {
    return (
      member.name.search(new RegExp(q.value, "i")) !== -1 ||
      member.email.search(new RegExp(q.value, "i")) !== -1
    );
  });
});
</script>

<template>
  <div class="p-4 flex-1 flex flex-col overflow-y-auto pb-24">
    <SectionHorizontal
      title="Manage access"
      description="Invite new members by email address."
    >
      <template #links>
        <UButton
          label="Invite people"
          color="black"
          @click="isInviteModalOpen = true"
        />
      </template>

      <UCard
        :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
        class="min-w-0"
      >
        <template #header>
          <UInput
            v-model="q"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search members"
            autofocus
          />
        </template>

        <!-- ~/components/settings/MembersList.vue -->
        <SettingsMembersList :members="filteredMembers" />
      </UCard>
    </SectionHorizontal>

    <UModal
      v-model="isInviteModalOpen"
      class="relative text-left rtl:text-right flex flex-col bg-white dark:bg-gray-900 shadow-xl sm:shadow-xl w-full sm:max-w-md h-dvh sm:h-auto rounded-lg sm:rounded-lg sm:my-8"
      title="Invite people"
      description="Invite new members by email address"
    >
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <h1>Invite people</h1>
        </template>

        <SettingsMembersForm
          @close="(isInviteModalOpen = false), membersStore.getUsers()"
        />
      </UCard>
    </UModal>
  </div>
</template>
