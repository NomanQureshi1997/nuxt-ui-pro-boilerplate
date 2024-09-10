<script setup lang="ts">
const route = useRoute();
const appConfig = useAppConfig();
const { isHelpSlideoverOpen } = useDashboard();
import { useAuthStore } from "~/store/authStore";

const authStore = useAuthStore();
const links = [
  {
    id: "home",
    label: "Home",
    icon: "i-heroicons-home",
    to: "/",
    tooltip: {
      text: "Home",
      shortcuts: ["G", "H"],
    },
  },
  {
    id: "contracts",
    label: "Contracts",
    icon: "i-heroicons-inbox",
    to: "/contracts",
    tooltip: {
      text: "Contracts",
      shortcuts: ["G", "U"],
    },
  },
  {
    id: "settings",
    label: "Settings",
    to: "/settings",
    icon: "i-heroicons-cog-8-tooth",
    children: [
      {
        label: "General",
        to: "/settings",
        exact: true,
      },
      { label: "Members", to: "/settings/members" },
    ],
    tooltip: {
      text: "Settings",
      shortcuts: ["G", "S"],
    },
  },
];

const footerLinks = [
  {
    label: "Invite people",
    icon: "i-heroicons-plus",
    to: "/settings/members",
  },
];

const groups = [
  {
    key: "links",
    label: "Go to",
    commands: links.map((link) => ({
      ...link,
      shortcuts: link.tooltip?.shortcuts,
    })),
  },
];

const defaultColors = ref(
  ["green", "teal", "cyan", "sky", "blue", "indigo", "violet"].map((color) => ({
    label: color,
    chip: color,
    click: () => (appConfig.ui.primary = color),
  }))
);
const colors = computed(() =>
  defaultColors.value.map((color) => ({
    ...color,
    active: appConfig.ui.primary === color.label,
  }))
);
</script>

<template>
  <div class="fixed inset-0 flex overflow-hidden">
    <div
      class="flex-col items-stretch relative w-full border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 lg:w-[--width] flex-shrink-0 hidden lg:flex"
      style="width: 250px"
    >
      <div
        class="h-16 flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0 !border-transparent"
      >
        <TeamsDropdown />
      </div>

      <div class="flex flex-col w-full flex-1 relative overflow-hidden">
        <div class="flex-grow flex flex-col min-h-0 gap-y-2 py-2">
          <!-- <template #header>
          <UDashboardSearchButton />
        </template> -->
          <div class="flex-1 px-4 flex flex-col gap-y-2 overflow-y-auto">
            <UVerticalNavigation :links="links" />
            <div class="flex-1" />
            <UVerticalNavigation :links="footerLinks" />
          </div>

          <UDivider class="sticky bottom-0" />
          <div
            class="flex items-center justify-between gap-x-1.5 flex-shrink-0 px-4"
          >
            <UserDropdown />
          </div>
        </div>
      </div>
    </div>
    <slot />

    <!-- ~/components/NotificationsSlideover.vue -->
    <!-- <NotificationsSlideover /> -->

    <!-- <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly> -->
  </div>
</template>

<style scoped></style>
