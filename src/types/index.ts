// Event types
export type EventStatus = 'draft' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled'

export interface Event {
  id: string
  title: string
  description: string
  startAt: string
  endAt: string
  status: EventStatus
  location: string
  tags: string[]
  attendeesCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateEventPayload {
  title: string
  description: string
  startAt: string
  endAt: string
  location: string
  tags: string[]
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {}

export interface UpdateStatusPayload {
  status: EventStatus
}

// Timeline types
export interface TimelineEntry {
  id: string
  eventId: string
  type: 'created' | 'updated' | 'status-changed' | 'attendee-joined' | 'comment'
  description: string
  timestamp: string
  userId?: string
  metadata?: Record<string, unknown>
}

export interface TimelineResponse {
  eventId: string
  entries: TimelineEntry[]
}

// Attendee types
export interface Attendee {
  id: string
  name: string
  email: string
  status: 'invited' | 'accepted' | 'declined' | 'pending'
  joinedAt?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Filter types
export interface EventFilters {
  status?: EventStatus[]
  tags?: string[]
  dateRange?: {
    startDate: string
    endDate: string
  }
  search?: string
  page?: number
  pageSize?: number
}

// UI State types
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface NotificationState {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}
