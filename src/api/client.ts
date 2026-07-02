import axios, { AxiosInstance, AxiosError } from 'axios'
import type { Event, CreateEventPayload, UpdateEventPayload, UpdateStatusPayload, TimelineResponse } from '@/types'

const isMockMode = import.meta.env.VITE_API_MOCK_MODE === 'true'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const mockToken = import.meta.env.VITE_API_MOCK_TOKEN || 'dev-token'

class ApiClient {
  private client: AxiosInstance
  private token: string

  constructor() {
    this.token = this.getToken()
    this.client = axios.create({
      baseURL: apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  private getToken(): string {
    if (isMockMode) {
      return mockToken
    }
    return localStorage.getItem('authToken') || ''
  }

  setToken(token: string): void {
    this.token = token
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('authToken', token)
  }

  clearToken(): void {
    this.token = ''
    delete this.client.defaults.headers.common['Authorization']
    localStorage.removeItem('authToken')
  }

  async getEvents(page = 1, pageSize = 10) {
    try {
      const response = await this.client.get('/api/events', {
        params: { page, pageSize },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getEventById(id: string) {
    try {
      const response = await this.client.get(`/api/events/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createEvent(payload: CreateEventPayload) {
    try {
      const response = await this.client.post('/api/events', payload)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateEvent(id: string, payload: UpdateEventPayload) {
    try {
      const response = await this.client.put(`/api/events/${id}`, payload)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateEventStatus(id: string, payload: UpdateStatusPayload) {
    try {
      const response = await this.client.post(`/api/events/${id}/status`, payload)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getEventTimeline(id: string) {
    try {
      const response = await this.client.get(`/api/events/${id}/timeline`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      return new Error(message)
    }
    return error instanceof Error ? error : new Error('Unknown error')
  }
}

export const apiClient = new ApiClient()
export default apiClient
