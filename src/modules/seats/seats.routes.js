import { Router } from "express";
import { BookSeat, GetAllSeats, GetSeatByUserId, CancelSeat } from "./seats.controller.js";
import { isLoggedIn } from "./seats.middleware.js";

const seatsRouter = Router();

seatsRouter.get("/", GetAllSeats);
seatsRouter.get("/:user_id", isLoggedIn, GetSeatByUserId);
seatsRouter.post("/book", isLoggedIn, BookSeat);
seatsRouter.put("/cancel", isLoggedIn, CancelSeat);

export default seatsRouter;