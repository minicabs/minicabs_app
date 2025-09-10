import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertVehicleTypeSchema, insertServiceSchema } from "@shared/schema";
import { z } from "zod";

const quoteRequestSchema = z.object({
  pickupLocation: z.string().min(1),
  destination: z.string().min(1),
  vehicleTypeId: z.string().min(1),
  distance: z.number().min(0).optional().default(10), // Default 10 miles for demo
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all vehicle types
  app.get("/api/vehicle-types", async (req, res) => {
    try {
      const vehicleTypes = await storage.getVehicleTypes();
      res.json(vehicleTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicle types" });
    }
  });

  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get quote calculation
  app.post("/api/quote", async (req, res) => {
    try {
      const { pickupLocation, destination, vehicleTypeId, distance } = quoteRequestSchema.parse(req.body);
      
      const vehicleType = await storage.getVehicleType(vehicleTypeId);
      if (!vehicleType) {
        return res.status(404).json({ message: "Vehicle type not found" });
      }

      const basePrice = parseFloat(vehicleType.basePrice);
      const pricePerMile = parseFloat(vehicleType.pricePerMile);
      const totalPrice = basePrice + (pricePerMile * distance);

      res.json({
        vehicleType,
        distance,
        basePrice,
        pricePerMile,
        totalPrice: totalPrice.toFixed(2),
        estimatedDuration: Math.ceil(distance * 2.5), // Rough estimation in minutes
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to calculate quote" });
    }
  });

  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get single booking
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
