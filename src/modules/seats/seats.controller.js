import { Seat } from "./seats.models.js";
import { eq } from "drizzle-orm";
import { db } from "../../common/config/db.js";
import ApiError from "../../common/utils/api-error.js";

async function GetAllSeats(req, res) {
  try {
    const seats = await db.select().from(Seat);
    res.json(seats);
  } catch (error) {
    ApiError.failedToFetchSeat();
  }
}

async function GetSeatByUserId(req, res) {
  const { user_id } = req.params;
  try {
    const seat = await db.select().from(Seat).where(eq(Seat.user_id, user_id));
    if (seat.length === 0) {
      ApiError.seatNotFound();
    }
    res.json(seat);
  } catch (error) {
    ApiError.failedToFetchSeat();
  }
}

async function BookSeat(req, res) {
  const { user_id, seat_id } = req.body;
  console.log("Booking seat with user_id:", user_id, "and seat_id:", seat_id);
  try {
    // const result = await db
    //   .update(Seat)
    //   .set({ isbooked: true, user_id })
    //   .where(and(eq(Seat.seat_id, seat_id), eq(Seat.isbooked, true)))
    //   .returning();

    const result = await db.transaction(async (tx) => {
      const seat = await tx
        .select()
        .from(Seat)
        .where(eq(Seat.seat_id, seat_id))
        .for("update");

      if (!seat.length) {
        throw new Error("Seat not found");
      }

      if (seat[0].isbooked) {
        throw new Error("Seat already booked");
      }

      const [updated] = await tx
        .update(Seat)
        .set({ isbooked: true, user_id })
        .where(eq(Seat.seat_id, seat_id))
        .returning();

      return updated;
    });
    if (result.length === 0) {
      ApiError.alreadyBooked();
    }
    res.json({
      success: true,
      message: "Seat booked successfully",
      data: result[0],
    });
  } catch (error) {
    ApiError.failedToBookSeat();
  }
}

async function CancelSeat(req, res) {
  const { user_id, seat_id } = req.body;
  try {
    const seat = await db.select().from(Seat).where(eq(Seat.seat_id, seat_id));
    const user = await db.select().from(Seat).where(eq(Seat.user_id, user_id));
    if (seat.isbooked === false) {
      ApiError.notBooked();
    }
    if (seat[0].user_id === user[0].user_id) {
      const result = await db
        .update(Seat)
        .set({ isbooked: false, user_id: null })
        .where(eq(Seat.seat_id, seat_id))
        .returning();
      res.json(result[0]);
    } else {
      ApiError.unauthorizedToCancelSeat();
    }
  } catch (error) {
    ApiError.failedToCancelSeat();
  }
}

export { GetAllSeats, GetSeatByUserId, BookSeat, CancelSeat };
