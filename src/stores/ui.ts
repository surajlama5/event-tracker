import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type Theme = 'light' | 'dark' | 'system'

export const useUiStore = defineStore('ui', () => {
  const theme = ref<Theme>(getInitialTheme())
  const sidebarOpen = ref(true)
  const notifications = ref<Array<{ id: string; type: string; message: string; duration?: number }>>([])

  function getInitialTheme(): Theme {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }

  function setTheme(newTheme: Theme) {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  function applyTheme(selectedTheme: Theme) {
    const htmlElement = document.documentElement

    if (selectedTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      selectedTheme = isDark ? 'dark' : 'light'
    }

    if (selectedTheme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }

  function toggleTheme() {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function addNotification(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration = 5000
  ) {
    const id = `notification-${Date.now()}-${Math.random()}`
    notifications.value.push({ id, type, message, duration })

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Watch for system theme changes
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system')
      }
    })
  }

  // Apply theme on mount
  applyTheme(theme.value)

  return {
    theme,
    sidebarOpen,
    notifications,
    setTheme,
    toggleTheme,
    toggleSidebar,
    addNotification,
    removeNotification,
  }
})
