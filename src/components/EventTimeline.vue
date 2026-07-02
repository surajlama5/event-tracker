<template>
  <div class="space-y-4">
    <div v-if="timeline.entries.length === 0" class="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
      <p class="text-gray-500 dark:text-gray-400">No timeline entries yet</p>
    </div>

    <div v-for="(entry, index) in timeline.entries" :key="entry.id" class="relative">
      <!-- Timeline line -->
      <div v-if="index < timeline.entries.length - 1" class="absolute left-4 top-10 h-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

      <!-- Timeline item -->
      <div class="flex gap-4">
        <div class="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <div class="h-3 w-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
        </div>

        <div class="flex-1 pb-4">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-gray-900 dark:text-white">
              {{ typeLabel(entry.type) }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatRelativeTime(entry.timestamp) }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {{ entry.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TimelineResponse } from '@/types'

defineProps<{
  timeline: TimelineResponse
}>()

function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    created: 'Created',
    updated: 'Updated',
    'status-changed': 'Status Changed',
    'attendee-joined': 'Attendee Joined',
    comment: 'Comment',
  }
  return labels[type] || type
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
