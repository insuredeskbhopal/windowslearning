import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { createBooking, getBookingsForLearner } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    const bookings = await getBookingsForLearner(session.id);
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch bookings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in to book a session." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { mentorId, skillSlug, topic, scheduledDate, timeSlot, notes } = body;

    if (!mentorId || !scheduledDate || !timeSlot) {
      return NextResponse.json(
        { success: false, message: "Please provide mentor, date, and preferred time slot." },
        { status: 400 }
      );
    }

    const booking = await createBooking({
      learnerId: session.id,
      mentorId,
      skillSlug: skillSlug || "general",
      topic: topic || "Practical 1-on-1 Guidance",
      scheduledDate,
      timeSlot,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: "Booking confirmed successfully!",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create booking." },
      { status: 500 }
    );
  }
}
