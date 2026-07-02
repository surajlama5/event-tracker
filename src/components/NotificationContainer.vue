<template>
  <div class="space-y-4">
    <div v-for="notification in notifications" :key="notification.id" class="flex items-start gap-4 rounded-lg p-4" :class="notificationClasses(notification.type)" role="alert">
      <div class="flex-1">
        <p class="font-medium">{{ notification.message }}</p>
      </div>
      <button @click="removeNotification(notification.id)" class="text-sm opacity-70 hover:opacity-100" aria-label="Close notification">
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

const notifications = computed(() => uiStore.notifications)

function notificationClasses(type: string): string {
  const classes: Record<string, string> = {
    success: 'bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-50',
    error: 'bg-red-50 text-red-900 dark:bg-red-900 dark:text-red-50',
    warning: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-50',
    info: 'bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-50',
  }
  return classes[type] || classes.info
}

function removeNotification(id: string) {
  uiStore.removeNotification(id)
}
</script>
