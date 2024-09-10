<script setup lang="ts">
interface Props {
  title: string;
  description: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    class="divide-y divide-gray-200 dark:divide-gray-800 space-y-6 *:pt-6 first:*:pt-2 mb-6"
  >
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-start gap-4">
        <div>
          <p class="text-gray-900 dark:text-white font-semibold">{{ title }}</p>
          <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ description }}
          </div>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-1.5">
        <!-- Named slot 'links' -->
        <slot name="links"></slot>
      </div>
    </div>
    <!-- Default slot for buttons or actions -->
    <slot></slot>
  </div>
</template>
