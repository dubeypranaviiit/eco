'use client'

import { useEffect, useState } from 'react'
import { EventCard } from '@/components/event/EventCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CreateEventForm from '@/components/event/CreateEventForm'
import { useEventStore } from '@/store/eventStore'
import { useUser } from '@clerk/nextjs'

export default function EventsPage() {

  const { events, fetchEvents, joinEvent, deleteEvent } = useEventStore()
  const { user } = useUser()

  const [filter, setFilter] = useState('upcoming')
  const [location, setLocation] = useState('')
  const [openCreate, setOpenCreate] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const filteredEvents = events.filter((event) => {

    const eventDate = new Date(event.eventDate)
    const today = new Date()

    if (
      location &&
      !event.location.toLowerCase().includes(location.toLowerCase())
    )
      return false

    if (filter === 'upcoming')
      return eventDate >= today

    if (filter === 'past')
      return eventDate < today

    if (filter === 'joined')
      return event.isJoined === true

    if (filter === 'my')
      return event.createdBy === user?.id

    return true
  })

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          Eco Events 🌍
        </h1>

        <Button onClick={() => setOpenCreate(true)}>
          Create Event
        </Button>

      </div>

      {/* Create Event Modal */}

      <CreateEventForm
        open={openCreate}
        onOpenChange={(open) => {
          setOpenCreate(open)
          if (!open) fetchEvents(true)
        }}
      />

      {/* Filters */}

      <div className="flex flex-wrap gap-3">

        <Input
          placeholder="Search location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Button
          variant={filter === 'upcoming' ? 'default' : 'outline'}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </Button>

        <Button
          variant={filter === 'past' ? 'default' : 'outline'}
          onClick={() => setFilter('past')}
        >
          Past
        </Button>

        <Button
          variant={filter === 'joined' ? 'default' : 'outline'}
          onClick={() => setFilter('joined')}
        >
          Joined
        </Button>

        <Button
          variant={filter === 'my' ? 'default' : 'outline'}
          onClick={() => setFilter('my')}
        >
          My Events
        </Button>

        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>

      </div>

      {/* Events Grid */}

      {filteredEvents.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredEvents.map((event) => (

            <EventCard
              key={event._id}
              event={event}
              onJoin={joinEvent}
              onDelete={deleteEvent}
            />

          ))}

        </div>
      )}

    </div>
  )
}