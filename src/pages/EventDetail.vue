<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <router-link to="/" class="mb-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          ← Back to Events
        </router-link>
        <h1 v-if="event" class="text-3xl font-bold text-gray-900 dark:text-white">{{ event.title }}</h1>
      </div>
      <button
        @click="showDeleteConfirm = true"
        class="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900"
      >
        Delete
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="eventsStore.loading" class="space-y-4">
      <div class="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="eventsStore.error" class="rounded-lg bg-red-50 p-4 text-red-900 dark:bg-red-900 dark:text-red-50">
      {{ eventsStore.error }}
    </div>

    <!-- Event Details -->
    <div v-else-if="event" class="grid gap-6 lg:grid-cols-3">
      <!-- Main Content -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Status and Actions -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
            <StatusBadge :status="event.status" />
          </div>
          <div class="space-y-2">
            <select
              :value="event.status"
              @change="updateStatus($event.target as HTMLSelectElement)"
              class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Description</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ event.description }}</p>
        </div>

        <!-- Details -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Details</h2>
          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Location</label>
              <p class="mt-1 text-gray-900 dark:text-white">{{ event.location }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Starts At</label>
              <p class="mt-1 text-gray-900 dark:text-white">{{ formatDateTime(event.startAt) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Ends At</label>
              <p class="mt-1 text-gray-900 dark:text-white">{{ formatDateTime(event.endAt) }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600 dark:text-gray-400">Tags</label>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="tag in event.tags"
                  :key="tag"
                  class="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Timeline</h2>
          <EventTimeline :timeline="timeline" />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Actions -->
        <div class="space-y-2">
          <router-link
            :to="{ name: 'EditEvent', params: { id: event.id } }"
            class="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Edit Event
          </router-link>
        </div>

        <!-- Attendees -->
        <AttendeeList :attendees="mockAttendees" />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Delete Event"
      message="Are you sure you want to delete this event? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      :dangerous-action="true"
      @confirm="deleteEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { useUiStore } from '@/stores/ui'
import type { Event, TimelineResponse, Attendee } from '@/types'
import { apiClient } from '@/api/client'
import StatusBadge from '@/components/StatusBadge.vue'
import EventTimeline from '@/components/EventTimeline.vue'
import AttendeeList from '@/components/AttendeeList.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const router = useRouter()
const route = useRoute()
const eventsStore = useEventsStore()
const uiStore = useUiStore()

const event = ref<Event | null>(null)
const timeline = ref<TimelineResponse>({ eventId: '', entries: [] })
const showDeleteConfirm = ref(false)

// Mock attendees for demo
const mockAttendees: Attendee[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'accepted' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'accepted' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', status: 'pending' },
]

onMounted(async () => {
  const id = route.params.id as string
  await eventsStore.fetchEventById(id)
  event.value = eventsStore.currentEvent

  try {
    const timelineData = await apiClient.getEventTimeline(id)
    timeline.value = timelineData
  } catch (error) {
    console.error('Failed to load timeline:', error)
  }
})

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function updateStatus(element: HTMLSelectElement) {
  if (!event.value) return

  try {
    await eventsStore.updateEventStatus(event.value.id, element.value as any)
    uiStore.addNotification('Event status updated', 'success')
  } catch (error) {
    uiStore.addNotification('Failed to update status', 'error')
  }
}

async function deleteEvent() {
  if (!event.value) return

  try {
    // In a real app, you'd call an API to delete
    // await apiClient.deleteEvent(event.value.id)
    uiStore.addNotification('Event deleted', 'success')
    router.push('/')
  } catch (error) {
    uiStore.addNotification('Failed to delete event', 'error')
  }
}
</script>
