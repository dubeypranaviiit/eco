import dbConnect from "@/database/dbConfig";
import { auth } from "@clerk/nextjs/server"; 
import { NextResponse } from "next/server";
import { Event } from "@/database/models/eventSchema";
import { EventParticipant } from "@/database/models/eventParticipantSchema";
/* ---------------- GET ALL EVENTS ---------------- */
export async function GET() {
  try {
    await dbConnect();

    const { userId } = await auth();

    const events = await Event.find().sort({ createdAt: -1 });

    if (!userId) {
      return NextResponse.json(events);
    }

    const eventIds = events.map((event) => event._id);

    const joinedEvents = await EventParticipant.find({
      userId,
      eventId: { $in: eventIds },
    });

    const joinedSet = new Set(
      joinedEvents.map((e) => e.eventId.toString())
    );

    const eventsWithJoinStatus = events.map((event) => ({
      ...event.toObject(),
      isJoined: joinedSet.has(event._id.toString()),
    }));

    return NextResponse.json(eventsWithJoinStatus);

  } catch (error) {

    console.error("Fetch events error:", error);

    return NextResponse.json(
      { message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

/* ---------------- CREATE EVENT ---------------- */

export async function POST(req: Request) {

  try {

    await dbConnect();

   const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const { title, description, location, eventDate } = body;

    if (!title || !location || !eventDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, location and event date are required",
        },
        { status: 400 }
      );
    }

    const event = await Event.create({
      title,
      description,
      location,
      eventDate,
      createdBy: userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        event,
      },
      { status: 201 }
    );

  } catch (error) {

    console.error("Event creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create event",
      },
      { status: 500 }
    );
  }
}