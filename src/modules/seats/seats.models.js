import { boolean, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import User from "../auth/auth.models.js";

const Seat = pgTable("seats", {
  seat_id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  isbooked: boolean("isbooked").notNull().default(false),
  user_id: integer("user_id").references(() => User.user_id, { onDelete: 'set null' }),
});


export { Seat, User};