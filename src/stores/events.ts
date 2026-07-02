import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Event, EventFilters, EventStatus } from '@/types'
import { apiClient } from '@/api/client'

interface EventState {
  events: Event[]
  currentEvent: Event | null
  loading: boolean
  error: string | null
  total: number
  page: number
  pageSize: number
}

export const useEventsStore = defineStore('events', () => {
  const events = ref<Event[]>([])
  const currentEvent = ref<Event | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const filters = ref<EventFilters>({})

  // Computed properties
  const filteredEvents = computed(() => {
    return events.value.filter((event) => {
      if (filters.value.status && !filters.value.status.includes(event.status)) {
        return false
      }
      if (filters.value.tags && filters.value.tags.length > 0) {
        const hasTag = filters.value.tags.some((tag) => event.tags.includes(tag))
        if (!hasTag) return false
      }
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        const matchesSearch =
          event.title.toLowerCase().includes(search) ||
          event.description.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }
      return true
    })
  })

  const hasMore = computed(() => page.value * pageSize.value < total.value)

  // Actions
  async function fetchEvents() {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.getEvents(page.value, pageSize.value)
      events.value = response.data
      total.value = response.total
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch events'
    } finally {
      loading.value = false
    }
  }

  async function fetchEventById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.getEventById(id)
      currentEvent.value = response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch event'
    } finally {
      loading.value = false
    }
  }

  async function createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'attendeesCount'>) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.createEvent(eventData)
      events.value.push(response)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create event'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateEvent(id: string, eventData: Partial<Event>) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.updateEvent(id, eventData)
      const index = events.value.findIndex((e) => e.id === id)
      if (index !== -1) {
        events.value[index] = response
      }
      if (currentEvent.value?.id === id) {
        currentEvent.value = response
      }
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update event'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateEventStatus(id: string, status: EventStatus) {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.updateEventStatus(id, { status })
      const index = events.value.findIndex((e) => e.id === id)
      if (index !== -1) {
        events.value[index] = response
      }
      if (currentEvent.value?.id === id) {
        currentEvent.value = response
      }
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update status'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: EventFilters) {
    filters.value = { ...filters.value, ...newFilters }
    page.value = 1 // Reset to first page
  }

  function clearFilters() {
    filters.value = {}
    page.value = 1
  }

  function setPage(newPage: number) {
    page.value = newPage
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    events,
    currentEvent,
    loading,
    error,
    total,
    page,
    pageSize,
    filters,
    // Computed
    filteredEvents,
    hasMore,
    // Actions
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    updateEventStatus,
    setFilters,
    clearFilters,
    setPage,
    clearError,
  }
})
