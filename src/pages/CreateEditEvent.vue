<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <router-link to="/" class="mb-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
        ← Back to Events
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ isEditing ? 'Edit Event' : 'Create Event' }}
      </h1>
    </div>

    <!-- Form -->
    <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Event Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            placeholder="Enter event title"
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.title }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            required
            rows="4"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            placeholder="Enter event description"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.description }}
          </p>
        </div>

        <!-- Location -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location *
          </label>
          <input
            id="location"
            v-model="form.location"
            type="text"
            required
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            placeholder="Enter event location"
          />
          <p v-if="errors.location" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.location }}
          </p>
        </div>

        <!-- Date and Time -->
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label for="startAt" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date & Time *
            </label>
            <input
              id="startAt"
              v-model="form.startAt"
              type="datetime-local"
              required
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <p v-if="errors.startAt" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.startAt }}
            </p>
          </div>
          <div>
            <label for="endAt" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date & Time *
            </label>
            <input
              id="endAt"
              v-model="form.endAt"
              type="datetime-local"
              required
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <p v-if="errors.endAt" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.endAt }}
            </p>
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <input
            id="tags"
            v-model="tagsInput"
            type="text"
            class="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
            placeholder="Enter tags separated by commas"
          />
          <div v-if="form.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="(tag, index) in form.tags"
              :key="tag"
              class="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {{ tag }}
              <button type="button" @click="removeTag(index)" class="font-bold opacity-70 hover:opacity-100">
                ×
              </button>
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:hover:bg-blue-800"
          >
            {{ loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event' }}
          </button>
          <router-link
            to="/"
            class="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEventsStore } from '@/stores/events'
import { useUiStore } from '@/stores/ui'
import type { CreateEventPayload } from '@/types'

const router = useRouter()
const route = useRoute()
const eventsStore = useEventsStore()
const uiStore = useUiStore()

const isEditing = computed(() => route.name === 'EditEvent')
const loading = ref(false)
const tagsInput = ref('')

const form = ref<CreateEventPayload & { tags: string[] }>({
  title: '',
  description: '',
  location: '',
  startAt: '',
  endAt: '',
  tags: [],
})

const errors = ref<Record<string, string>>({})

onMounted(async () => {
  if (isEditing.value) {
    const id = route.params.id as string
    await eventsStore.fetchEventById(id)
    const event = eventsStore.currentEvent
    if (event) {
      form.value = {
        title: event.title,
        description: event.description,
        location: event.location,
        startAt: formatDateTimeForInput(event.startAt),
        endAt: formatDateTimeForInput(event.endAt),
        tags: event.tags,
      }
      tagsInput.value = event.tags.join(', ')
    }
  }
})

function formatDateTimeForInput(dateString: string): string {
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

function removeTag(index: number) {
  form.value.tags.splice(index, 1)
}

function validateForm(): boolean {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required'
  }
  if (!form.value.location.trim()) {
    errors.value.location = 'Location is required'
  }
  if (!form.value.startAt) {
    errors.value.startAt = 'Start date is required'
  }
  if (!form.value.endAt) {
    errors.value.endAt = 'End date is required'
  }
  if (form.value.startAt && form.value.endAt && new Date(form.value.startAt) >= new Date(form.value.endAt)) {
    errors.value.endAt = 'End date must be after start date'
  }

  return Object.keys(errors.value).length === 0
}

async function submitForm() {
  if (!validateForm()) return

  // Update tags from input
  if (tagsInput.value) {
    form.value.tags = tagsInput.value.split(',').map((t) => t.trim()).filter((t) => t)
  }

  loading.value = true
  try {
    if (isEditing.value) {
      const id = route.params.id as string
      await eventsStore.updateEvent(id, form.value)
      uiStore.addNotification('Event updated successfully', 'success')
    } else {
      await eventsStore.createEvent(form.value)
      uiStore.addNotification('Event created successfully', 'success')
    }
    router.push('/')
  } catch (error) {
    uiStore.addNotification(
      error instanceof Error ? error.message : 'Failed to save event',
      'error'
    )
  } finally {
    loading.value = false
  }
}
</script>
