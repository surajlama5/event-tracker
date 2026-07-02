<template>
  <span
    :class="[
      'inline-block rounded-full px-3 py-1 text-xs font-semibold',
      statusClasses,
    ]"
  >
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EventStatus } from '@/types'

const props = defineProps<{
  status: EventStatus
}>()

const statusLabel = computed(() => {
  const labels: Record<EventStatus, string> = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return labels[props.status]
})

const statusClasses = computed(() => {
  const classes: Record<EventStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return classes[props.status]
})
</script>
