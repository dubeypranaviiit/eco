import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConfig";
import { Event } from "@/database/models/eventSchema";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    await dbConnect();

    const event = await Event.findById(params.eventId);

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);

  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error },
      { status: 500 }
    );
  }
}
import { auth } from "@clerk/nextjs/server"; 

export async function PATCH(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    await dbConnect();

    const { userId } = await auth();
    const body = await req.json();

    const event = await Event.findById(params.eventId);

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    if (event.createdBy !== userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      params.eventId,
      body,
      { new: true }
    );

    return NextResponse.json(updatedEvent);

  } catch (error) {
    return NextResponse.json(
      { message: "Update failed", error },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    await dbConnect();

    const { userId } = await auth();

    const event = await Event.findById(params.eventId);

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    if (event.createdBy !== userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    await Event.findByIdAndDelete(params.eventId);

    return NextResponse.json({
      message: "Event deleted successfully",
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed", error },
      { status: 500 }
    );
  }
}