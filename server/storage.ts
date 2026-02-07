import { db } from "./db";
import {
  employees,
  attendance,
  type Employee,
  type InsertEmployee,
  type AttendanceRecord,
  type InsertAttendance
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  deleteEmployee(id: number): Promise<boolean>;
  
  getAttendanceRecords(): Promise<AttendanceRecord[]>;
  createAttendance(record: InsertAttendance): Promise<AttendanceRecord>;
}

export class DatabaseStorage implements IStorage {
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db.insert(employees).values(insertEmployee).returning();
    return employee;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const [deleted] = await db.delete(employees).where(eq(employees.id, id)).returning();
    return !!deleted;
  }

  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    return await db.select().from(attendance);
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<AttendanceRecord> {
    const [record] = await db.insert(attendance).values(insertAttendance).returning();
    return record;
  }
}

export const storage = new DatabaseStorage();
