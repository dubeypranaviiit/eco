'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { toast } from 'react-toastify'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateEventForm({ open, onOpenChange }: Props) {

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    timeStart: '',
    maxVolunteers: 50
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    try {

      setLoading(true)

      const eventDateTime = new Date(
        `${formData.eventDate}T${formData.timeStart}`
      )

      await axios.post('/api/events', {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        eventDate: eventDateTime,
        maxVolunteers: Number(formData.maxVolunteers)
      })

      toast.success('Event created successfully 🌱')

      setFormData({
        title: '',
        description: '',
        location: '',
        eventDate: '',
        timeStart: '',
        maxVolunteers: 50
      })

      onOpenChange(false)

    } catch (error) {

      toast.error('Failed to create event')

    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="max-w-xl">

        <DialogHeader>
          <DialogTitle>Create Eco Event 🌍</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Event Title */}

          <div className="space-y-2">
            <Label>Event Name</Label>

            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Beach Cleanup Drive"
              required
            />
          </div>

          {/* Date */}

          <div className="space-y-2">

            <Label>Date</Label>

            <div className="relative">

              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <Input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="pl-9"
                required
              />

            </div>
          </div>

          {/* Time */}

          <div className="space-y-2">

            <Label>Start Time</Label>

            <div className="relative">

              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <Input
                type="time"
                name="timeStart"
                value={formData.timeStart}
                onChange={handleChange}
                className="pl-9"
                required
              />

            </div>
          </div>

          {/* Volunteers */}

          <div className="space-y-2">

            <Label>Max Volunteers</Label>

            <div className="relative">

              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <Input
                type="number"
                name="maxVolunteers"
                value={formData.maxVolunteers}
                onChange={handleChange}
                className="pl-9"
                min={1}
              />

            </div>

          </div>

          {/* Location */}

          <div className="space-y-2">

            <Label>Location</Label>

            <div className="relative">

              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Mumbai Beach"
                className="pl-9"
                required
              />

            </div>

          </div>

          {/* Description */}

          <div className="space-y-2">

            <Label>Description</Label>

            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Help clean the beach and protect marine life..."
            />

          </div>

          <DialogFooter>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Event'}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>
  )
}