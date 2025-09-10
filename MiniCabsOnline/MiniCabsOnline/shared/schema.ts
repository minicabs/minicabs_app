import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const vehicleTypes = pgTable("vehicle_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  passengers: integer("passengers").notNull(),
  luggage: integer("luggage").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  pricePerMile: decimal("price_per_mile", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  available: boolean("available").default(true),
});

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pickupLocation: text("pickup_location").notNull(),
  destination: text("destination").notNull(),
  pickupDate: text("pickup_date").notNull(),
  pickupTime: text("pickup_time").notNull(),
  serviceType: text("service_type").notNull(),
  vehicleTypeId: varchar("vehicle_type_id").references(() => vehicleTypes.id),
  isAccountCustomer: boolean("is_account_customer").default(false),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
  status: text("status").default("pending"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVehicleTypeSchema = createInsertSchema(vehicleTypes).omit({
  id: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
}).extend({
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  destination: z.string().min(1, "Destination is required"),
  serviceType: z.enum(["minicab", "courier", "removal"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVehicleType = z.infer<typeof insertVehicleTypeSchema>;
export type VehicleType = typeof vehicleTypes.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
