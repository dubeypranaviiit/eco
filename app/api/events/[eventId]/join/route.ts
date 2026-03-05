import dbConnect from "@/database/dbConfig";
import { EventParticipant } from "@/database/models/eventParticipantSchema";
import { Event } from "@/database/models/eventSchema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ eventId: string }> }
) {

  try {

    await dbConnect();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { eventId } = await context.params; 

    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // Prevent creator joining
    if (event.createdBy === userId) {
      return NextResponse.json(
        { message: "Creator cannot join own event" },
        { status: 400 }
      );
    }

    // Check event full
    if (event.volunteersJoined >= event.maxVolunteers) {
      return NextResponse.json(
        { message: "Event is full" },
        { status: 400 }
      );
    }

    // Prevent duplicate join
    const alreadyJoined = await EventParticipant.findOne({
      eventId,
      userId,
    });

    if (alreadyJoined) {
      return NextResponse.json(
        { message: "Already joined" },
        { status: 409 }
      );
    }

    await EventParticipant.create({
      eventId,
      userId,
    });

    await Event.updateOne(
      { _id: eventId },
      { $inc: { volunteersJoined: 1 } }
    );

    return NextResponse.json({
      success: true,
      message: "Joined event successfully",
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { message: "Join failed" },
      { status: 500 }
    );
  }
}