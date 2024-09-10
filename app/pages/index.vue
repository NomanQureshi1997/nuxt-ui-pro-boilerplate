<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
import { sub } from "date-fns";
import type { Period, Range } from "~/types";

const { isNotificationsSlideoverOpen } = useDashboard();

const items = [
  [
    {
      label: "New mail",
      icon: "i-heroicons-paper-airplane",
      to: "/inbox",
    },
    {
      label: "New user",
      icon: "i-heroicons-user-plus",
      to: "/users",
    },
  ],
];

const range = ref<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
const period = ref<Period>("daily");
</script>

<template>
  <div class="flex flex-1 w-full min-w-0">
    <div class="flex-col items-stretch relative w-full flex-1 flex">
      <div
        class="h-16 flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 gap-x-4 min-w-0"
      >
        <div class="flex items-center justify-between flex-1 gap-x-1.5 min-w-0">
          <div class="flex items-stretch gap-1.5 min-w-0">
            <h1 class="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white min-w-0"> Home</h1>
          </div>
          <div class="flex items-stretch flex-shrink-0 gap-1.5">
            <UTooltip text="Notifications" :shortcuts="['N']">
              <UButton
                color="gray"
                variant="ghost"
                square
                @click="isNotificationsSlideoverOpen = true"
              >
                <UChip color="red" inset>
                  <UIcon name="i-heroicons-bell" class="w-5 h-5" />
                </UChip>
              </UButton>
            </UTooltip>

            <UDropdown :items="items">
              <UButton
                icon="i-heroicons-plus"
                size="md"
                class="ml-1.5 rounded-full"
              />
            </UDropdown>
          </div>
        </div>
      </div>

      <div
        class="min-h-[49px] flex-shrink-0 flex items-center border-b border-gray-200 dark:border-gray-800 px-4 py-2 gap-x-4"
      >
        <!-- ~/components/home/HomeDateRangePicker.vue -->
        <HomeDateRangePicker v-model="range" class="-ml-2.5" />

        <!-- ~/components/home/HomePeriodSelect.vue -->
        <HomePeriodSelect v-model="period" :range="range" />
      </div>

      <div class="p-4 flex-1 flex flex-col overflow-y-auto">
        <!-- ~/components/home/HomeChart.vue -->
        <HomeChart :period="period" :range="range" />

        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <!-- ~/components/home/HomeSales.vue -->
          <HomeSales />
          <!-- ~/components/home/HomeCountries.vue -->
          <HomeCountries />
        </div>
      </div>
    </div>
  </div>
</template>
