import { http, HttpResponse } from 'msw'
import type { Event, TimelineEntry, TimelineResponse } from '@/types'

// Mock data
const mockEvents: Record<string, Event> = {
  'evt-1': {
    id: 'evt-1',
    title: 'Vue 3 Workshop',
    description: 'Learn Vue 3 and TypeScript in this comprehensive workshop.',
    startAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    endAt: new Date(Date.now() + 90000000).toISOString(),
    status: 'scheduled',
    location: 'San Francisco, CA',
    tags: ['vue', 'typescript', 'workshop'],
    attendeesCount: 42,
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    updatedAt: new Date().toISOString(),
  },
  'evt-2': {
    id: 'evt-2',
    title: 'React Meetup',
    description: 'Monthly React developers meetup.',
    startAt: new Date(Date.now() + 172800000).toISOString(), // In 2 days
    endAt: new Date(Date.now() + 176400000).toISOString(),
    status: 'scheduled',
    location: 'New York, NY',
    tags: ['react', 'javascript', 'meetup'],
    attendeesCount: 28,
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date().toISOString(),
  },
  'evt-3': {
    id: 'evt-3',
    title: 'TypeScript Advanced Patterns',
    description: 'Deep dive into TypeScript advanced patterns and techniques.',
    startAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago (in progress)
    endAt: new Date(Date.now() + 7200000).toISOString(),
    status: 'in-progress',
    location: 'Online',
    tags: ['typescript', 'advanced'],
    attendeesCount: 65,
    createdAt: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
    updatedAt: new Date().toISOString(),
  },
  'evt-4': {
    id: 'evt-4',
    title: 'DevOps Conference 2026',
    description: 'Annual DevOps conference with talks from industry experts.',
    startAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday (completed)
    endAt: new Date().toISOString(),
    status: 'completed',
    location: 'Austin, TX',
    tags: ['devops', 'conference', 'infrastructure'],
    attendeesCount: 150,
    createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
    updatedAt: new Date().toISOString(),
  },
}

const mockTimelines: Record<string, TimelineEntry[]> = {
  'evt-1': [
    {
      id: 'tl-1',
      eventId: 'evt-1',
      type: 'created',
      description: 'Event created',
      timestamp: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: 'tl-2',
      eventId: 'evt-1',
      type: 'updated',
      description: 'Event details updated',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: 'tl-3',
      eventId: 'evt-1',
      type: 'attendee-joined',
      description: '42 attendees registered',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
}

export const handlers = [
  // GET /api/events
  http.get('/api/events', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

    const events = Object.values(mockEvents)
    const total = events.length
    const startIndex = (page - 1) * pageSize
    const paginatedEvents = events.slice(startIndex, startIndex + pageSize)

    return HttpResponse.json({
      data: paginatedEvents,
      total,
      page,
      pageSize,
      hasMore: startIndex + pageSize < total,
    })
  }),

  // GET /api/events/:id
  http.get('/api/events/:id', ({ params }) => {
    const event = mockEvents[params.id as string]
    if (!event) {
      return HttpResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    return HttpResponse.json(event)
  }),

  // POST /api/events
  http.post('/api/events', async ({ request }) => {
    const data = await request.json() as Record<string, unknown>
    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title: data.title as string,
      description: data.description as string,
      startAt: data.startAt as string,
      endAt: data.endAt as string,
      status: 'draft',
      location: data.location as string,
      tags: data.tags as string[],
      attendeesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockEvents[newEvent.id] = newEvent
    return HttpResponse.json(newEvent, { status: 201 })
  }),

  // PUT /api/events/:id
  http.put('/api/events/:id', async ({ params, request }) => {
    const event = mockEvents[params.id as string]
    if (!event) {
      return HttpResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    const updates = await request.json() as Partial<Event>
    const updatedEvent = { ...event, ...updates, updatedAt: new Date().toISOString() }
    mockEvents[event.id] = updatedEvent
    return HttpResponse.json(updatedEvent)
  }),

  // POST /api/events/:id/status
  http.post('/api/events/:id/status', async ({ params, request }) => {
    const event = mockEvents[params.id as string]
    if (!event) {
      return HttpResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    const { status } = await request.json() as { status: string }
    const updatedEvent = { ...event, status, updatedAt: new Date().toISOString() }
    mockEvents[event.id] = updatedEvent
    return HttpResponse.json(updatedEvent)
  }),

  // GET /api/events/:id/timeline
  http.get('/api/events/:id/timeline', ({ params }) => {
    const eventId = params.id as string
    const entries = mockTimelines[eventId] || []
    const response: TimelineResponse = {
      eventId,
      entries,
    }
    return HttpResponse.json(response)
  }),
]
