<script setup lang="ts">
import { useAuthStore } from "~/store/authStore";

const authStore = useAuthStore();
const links = [
  [
    {
      label: "General",
      icon: "i-heroicons-user-circle",
      to: "/settings",
      exact: true,
    },
    {
      label: "Members",
      icon: "i-heroicons-user-group",
      to: "/settings/members",
    },
  ],
];
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
              Settings
            </h1>
          </div>
        </div>
      </div>
      <div
        class="min-h-[49px] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 gap-x-4 py-0 px-1.5 overflow-x-auto"
      >
        <UHorizontalNavigation :links="links" />
      </div>

      <NuxtPage />
    </div>
  </div>
</template>
