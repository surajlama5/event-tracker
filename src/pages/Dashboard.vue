<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
      <router-link
        to="/events/create"
        class="inline-block rounded-lg bg-blue-600 px-6 py-2 text-center font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
      >
        Create Event
      </router-link>
    </div>

    <!-- Filters and Search -->
    <div class="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div class="grid gap-4 md:grid-cols-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search events..."
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select
            v-model="selectedStatus"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            multiple
          >
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button
            @click="applyFilters"
            class="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Filter
          </button>
          <button
            @click="clearFilters"
            class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="eventsStore.loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="eventsStore.error" class="rounded-lg bg-red-50 p-4 text-red-900 dark:bg-red-900 dark:text-red-50">
      {{ eventsStore.error }}
    </div>

    <!-- Events Grid -->
    <div v-else-if="eventsStore.filteredEvents.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <EventCard
        v-for="event in eventsStore.filteredEvents"
        :key="event.id"
        :event="event"
        @edit="editEvent(event.id)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
      <p class="text-gray-500 dark:text-gray-400">No events found. Create one to get started!</p>
    </div>

    <!-- Pagination -->
    <div v-if="eventsStore.filteredEvents.length > 0" class="flex items-center justify-center gap-4">
      <button
        @click="previousPage"
        :disabled="eventsStore.page === 1"
        class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Previous
      </button>
      <span class="text-gray-600 dark:text-gray-400">
        Page {{ eventsStore.page }} of {{ totalPages }}
      </span>
      <button
        @click="nextPage"
        :disabled="!eventsStore.hasMore"
        class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import EventCard from '@/components/EventCard.vue'

const router = useRouter()
const eventsStore = useEventsStore()

const searchQuery = ref('')
const selectedStatus = ref<string[]>([])

const totalPages = computed(() => Math.ceil(eventsStore.total / eventsStore.pageSize))

onMounted(() => {
  eventsStore.fetchEvents()
})

function applyFilters() {
  eventsStore.setFilters({
    search: searchQuery.value,
    status: selectedStatus.value as any,
  })
}

function clearFilters() {
  searchQuery.value = ''
  selectedStatus.value = []
  eventsStore.clearFilters()
}

function previousPage() {
  if (eventsStore.page > 1) {
    eventsStore.setPage(eventsStore.page - 1)
    eventsStore.fetchEvents()
  }
}

function nextPage() {
  if (eventsStore.hasMore) {
    eventsStore.setPage(eventsStore.page + 1)
    eventsStore.fetchEvents()
  }
}

function editEvent(id: string) {
  router.push({ name: 'EditEvent', params: { id } })
}
</script>
