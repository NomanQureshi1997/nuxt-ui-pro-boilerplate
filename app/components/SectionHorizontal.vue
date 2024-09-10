<script setup lang="ts">
interface Props {
  title: string;
  description: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    class="grid lg:grid-cols-3 pt-2 pb-6 items-start first:*:col-span-2 lg:first:*:col-span-1 last:*:col-span-2 gap-6"
  >
    <div class="flex lg:flex-col justify-between flex-row flex-wrap gap-4 lg:sticky top-2">
      <div>
        <p class="text-gray-900 dark:text-white font-semibold">{{ title }}</p>
        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ description }}
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-1.5">
        <slot name="links"></slot>
      </div>
    </div>
    <div class="rounded-lg divide-y divide-gray-200 dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 min-w-0">
      <!-- Named slot 'links' -->
      <slot></slot>
    </div>
  </div>
</template>
