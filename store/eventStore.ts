import { create } from "zustand";
import axios from "axios";

export interface EventType {
  _id: string;
  title: string;
  description?: string;
  location: string;
  eventDate: string;
  createdBy: string;
  volunteersJoined: number;
  maxVolunteers: number;
  isJoined?: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface EventStore {
  events: EventType[];
  loading: boolean;
  lastFetched: number | null;

  fetchEvents: (force?: boolean) => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  createEvent: (data: any) => Promise<void>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  loading: false,
  lastFetched: null,

  fetchEvents: async (force = false) => {
    const { lastFetched } = get();

    const isCacheValid =
      lastFetched && Date.now() - lastFetched < CACHE_DURATION;

    if (isCacheValid && !force) {
      return; // use cached events
    }

    try {
      set({ loading: true });

      const res = await axios.get("/api/events");
    console.log(res.data)
      set({ 
        events: res.data,
        loading: false,
        lastFetched: Date.now(),
      });

    } catch (error) {
      console.error("Fetch events failed", error);
      set({ loading: false });
    }
  },
  deleteEvent: async (eventId) => {
    try {
      await axios.delete(`/api/events/${eventId}`);

      set({
        events: get().events.filter((e) => e._id !== eventId),
      });

    } catch (error) {
      console.error("Delete failed", error);
    }
  },

  createEvent: async (data) => {
    try {
      const res = await axios.post("/api/events", data);

      set({
        events: [res.data.event, ...get().events],
      });

    } catch (error) {
      console.error("Create event failed", error);
    }
  },
  joinEvent: async (eventId) => {
  try {

    // Join event
    await axios.post(`/api/events/${eventId}/join`);

    // Fetch updated event
    const res = await axios.get(`/api/events/${eventId}`);

    const updatedEvent = res.data;

    // Update only that event in store
    const updatedEvents = get().events.map((event) =>
      event._id === eventId
        ? {
            ...event,
            ...updatedEvent,
            isJoined: true
          }
        : event
    );

    set({ events: updatedEvents });

  } catch (error) {
    console.error("Join failed", error);
  }
}
}));