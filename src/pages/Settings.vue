<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

    <!-- Theme Settings -->
    <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
          <select
            :value="uiStore.theme"
            @change="updateTheme($event.target as HTMLSelectElement)"
            class="mt-2 block rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Choose your preferred color scheme for the application.
          </p>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
      <div class="space-y-4">
        <label class="flex items-center gap-3">
          <input
            v-model="notificationSettings.emailNotifications"
            type="checkbox"
            class="rounded border-gray-300 dark:border-gray-600"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
        </label>
        <label class="flex items-center gap-3">
          <input
            v-model="notificationSettings.pushNotifications"
            type="checkbox"
            class="rounded border-gray-300 dark:border-gray-600"
          />
          <span class="text-sm text-gray-700 dark:text-gray-300">Push notifications</span>
        </label>
      </div>
    </div>

    <!-- API Settings (Dev Mode) -->
    <div v-if="isMockMode" class="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-900">
      <h2 class="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">Development Mode</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-blue-900 dark:text-blue-200">API Base URL</label>
          <p class="mt-1 text-sm text-blue-800 dark:text-blue-300">{{ apiBaseUrl }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-900 dark:text-blue-200">Mock Mode</label>
          <p class="mt-1 text-sm text-blue-800 dark:text-blue-300">Enabled - Using mock API with MSW</p>
        </div>
        <p class="text-sm text-blue-700 dark:text-blue-400">
          To use a real backend, update your environment variables and set <code class="bg-blue-100 px-2 py-1 dark:bg-blue-800">VITE_API_MOCK_MODE=false</code>
        </p>
      </div>
    </div>

    <!-- Account Settings -->
    <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
      <div class="space-y-4">
        <button
          @click="logout"
          class="rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700 dark:hover:bg-red-800"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const uiStore = useUiStore()
const authStore = useAuthStore()
const router = useRouter()

const isMockMode = import.meta.env.VITE_API_MOCK_MODE === 'true'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const notificationSettings = ref({
  emailNotifications: true,
  pushNotifications: true,
})

function updateTheme(element: HTMLSelectElement) {
  uiStore.setTheme(element.value as 'light' | 'dark' | 'system')
}

function logout() {
  authStore.clearToken()
  uiStore.addNotification('Logged out successfully', 'success')
  router.push('/')
}
</script>
