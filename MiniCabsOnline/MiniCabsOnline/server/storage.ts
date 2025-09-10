import { type User, type InsertUser, type VehicleType, type InsertVehicleType, type Service, type InsertService, type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getVehicleTypes(): Promise<VehicleType[]>;
  getVehicleType(id: string): Promise<VehicleType | undefined>;
  createVehicleType(vehicleType: InsertVehicleType): Promise<VehicleType>;
  
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private vehicleTypes: Map<string, VehicleType>;
  private services: Map<string, Service>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.vehicleTypes = new Map();
    this.services = new Map();
    this.bookings = new Map();
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    // Vehicle Types
    const saloon = await this.createVehicleType({
      name: "Saloon Car",
      description: "Standard family size saloon car",
      passengers: 4,
      luggage: 2,
      basePrice: "15.00",
      pricePerMile: "2.50",
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    });

    const estate = await this.createVehicleType({
      name: "Estate Car",
      description: "Standard family size estate car",
      passengers: 4,
      luggage: 3,
      basePrice: "18.00",
      pricePerMile: "2.75",
      imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    });

    const sevenSeater = await this.createVehicleType({
      name: "7 Seater Car",
      description: "7 seater large family car",
      passengers: 6,
      luggage: 2,
      basePrice: "25.00",
      pricePerMile: "3.50",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    });

    const eightSeater = await this.createVehicleType({
      name: "8 Seater Car",
      description: "8 Seater extra large family car",
      passengers: 8,
      luggage: 6,
      basePrice: "30.00",
      pricePerMile: "4.00",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    });

    const executive = await this.createVehicleType({
      name: "Executive Car",
      description: "Executive car",
      passengers: 4,
      luggage: 2,
      basePrice: "35.00",
      pricePerMile: "5.00",
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    });

    // Services
    await this.createService({
      name: "Airport Transfer",
      description: "Getting to the airport can often be the most stressful part of any journey. Parking your car in the parking areas cramming into...",
      icon: "plane",
      available: true
    });

    await this.createService({
      name: "Courier Service",
      description: "You might not immediately think of a minicab company when looking to have your important parcel...",
      icon: "package",
      available: true
    });

    await this.createService({
      name: "Hospital Transportation",
      description: "Leaving hospital can be a worrying time for many people, and the journey from the hospital back to their home needs...",
      icon: "heart-pulse",
      available: true
    });

    await this.createService({
      name: "Hotel Transfer",
      description: "You have just touched down after a long flight, safely negotiated your way through baggage and barged your way through the crowds...",
      icon: "building",
      available: true
    });

    await this.createService({
      name: "Removals",
      description: "Are you looking to move house, and need to find a reliable, affordable and friendly removal service? And do you need to find...",
      icon: "truck",
      available: true
    });

    await this.createService({
      name: "School Runs",
      description: "Getting your child to school on time is incredibly important, as their education is probably the most important thing in...",
      icon: "graduation-cap",
      available: true
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getVehicleTypes(): Promise<VehicleType[]> {
    return Array.from(this.vehicleTypes.values());
  }

  async getVehicleType(id: string): Promise<VehicleType | undefined> {
    return this.vehicleTypes.get(id);
  }

  async createVehicleType(insertVehicleType: InsertVehicleType): Promise<VehicleType> {
    const id = randomUUID();
    const vehicleType: VehicleType = { ...insertVehicleType, id };
    this.vehicleTypes.set(id, vehicleType);
    return vehicleType;
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = { 
      ...insertBooking, 
      id,
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }
}

export const storage = new MemStorage();
