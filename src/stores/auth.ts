import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('authToken'))
  const isAuthenticated = ref(!!token.value)
  const user = ref<{ id: string; name: string; email: string } | null>(null)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('authToken', newToken)
    isAuthenticated.value = true
  }

  function clearToken() {
    token.value = null
    localStorage.removeItem('authToken')
    isAuthenticated.value = false
    user.value = null
  }

  function setUser(userData: { id: string; name: string; email: string }) {
    user.value = userData
  }

  return {
    token,
    isAuthenticated,
    user,
    setToken,
    clearToken,
    setUser,
  }
})
