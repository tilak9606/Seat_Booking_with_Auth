import { boolean, integer, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

const User = pgTable("users", {
  user_id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 60 }).notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationToken: varchar("verification_token", { length: 64 }),
  refreshToken: varchar("refresh_token", { length: 255 }), 
  resetPasswordToken: varchar("reset_password_token", { length: 64 }),
  resetPasswordExpires: timestamp("reset_password_expires"), 
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export default User;