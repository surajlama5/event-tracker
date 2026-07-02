<template>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
    <div class="mb-4 flex items-start justify-between">
      <div class="flex-1">
        <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          {{ event.title }}
        </h3>
        <StatusBadge :status="event.status" />
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ formatDate(event.startAt) }}
        </p>
      </div>
    </div>

    <p class="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
      {{ event.description }}
    </p>

    <div class="mb-4 space-y-2">
      <p class="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <MapPinIcon class="mr-2 h-4 w-4" />
        {{ event.location }}
      </p>
      <p class="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <UsersIcon class="mr-2 h-4 w-4" />
        {{ event.attendeesCount }} attendees
      </p>
    </div>

    <div v-if="event.tags.length > 0" class="mb-4 flex flex-wrap gap-2">
      <span
        v-for="tag in event.tags"
        :key="tag"
        class="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      >
        {{ tag }}
      </span>
    </div>

    <div class="flex gap-2">
      <router-link
        :to="{ name: 'EventDetail', params: { id: event.id } }"
        class="flex-1 rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
      >
        View Details
      </router-link>
      <button
        @click="$emit('edit')"
        class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Edit
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Event } from '@/types'
import StatusBadge from './StatusBadge.vue'
import { MapPinIcon, UsersIcon } from '@heroicons/vue/24/outline'

defineProps<{
  event: Event
}>()

defineEmits<{
  edit: []
}>()

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>
