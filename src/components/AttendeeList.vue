<template>
  <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
    <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">
      Attendees ({{ attendees.length }})
    </h3>

    <div v-if="attendees.length === 0" class="text-sm text-gray-500 dark:text-gray-400">
      No attendees yet
    </div>

    <div v-else class="space-y-3">
      <div v-for="attendee in attendees" :key="attendee.id" class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <span class="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {{ attendee.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ attendee.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ attendee.email }}
            </p>
          </div>
        </div>
        <span
          :class="[
            'inline-block rounded-full px-2 py-1 text-xs font-medium',
            statusClasses(attendee.status),
          ]"
        >
          {{ attendee.status }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Attendee } from '@/types'

defineProps<{
  attendees: Attendee[]
}>()

function statusClasses(status: string): string {
  const classes: Record<string, string> = {
    invited: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}
</script>
