'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Trash2, Users } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export interface EventType {
  _id: string
  title: string
  description?: string
  location: string
  eventDate: string
  createdBy: string
  volunteersJoined: number
  maxVolunteers: number
  isJoined?: boolean
}

interface Props {
  event: EventType
  onJoin?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
}

export function EventCard({ event, onJoin, onDelete, onView }: Props) {

  const { user } = useUser()

  const isCreator = user?.id === event.createdBy

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  const isFull = event.volunteersJoined >= event.maxVolunteers

  return (
    <Card className="hover:shadow-lg transition">

      <CardHeader className="flex justify-between items-start">

        <div>
          <h3 className="text-lg font-semibold">{event.title}</h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <MapPin size={16} />
            {event.location}
          </div>
        </div>

        {/* DELETE BUTTON ONLY FOR CREATOR */}

        {isCreator && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete?.(event._id)}
            className="text-red-500 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </Button>
        )}

      </CardHeader>

      <CardContent className="space-y-4">

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          {formatDate(event.eventDate)}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          {event.volunteersJoined}/{event.maxVolunteers} volunteers
        </div>

        <p className="text-sm text-gray-700 line-clamp-3">
          {event.description}
        </p>

        <div className="flex gap-2 pt-2">

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onView?.(event._id)}
          >
            View
          </Button>

          {/* JOIN BUTTON ONLY IF USER IS NOT CREATOR */}

          {!isCreator && (
            <Button
              disabled={event.isJoined || isFull}
              className={`flex-1 ${
                event.isJoined
                  ? 'bg-green-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={() => onJoin?.(event._id)}
            >
              {event.isJoined
                ? 'Joined'
                : isFull
                ? 'Full'
                : 'Join'}
            </Button>
          )}

        </div>

      </CardContent>
    </Card>
  )
}