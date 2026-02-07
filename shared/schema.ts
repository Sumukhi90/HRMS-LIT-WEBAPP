import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  joinDate: timestamp("join_date").defaultNow(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // 'Present', 'Absent', 'Leave'
  checkIn: text("check_in"),
  checkOut: text("check_out"),
});

// === BASE SCHEMAS ===
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true });
export const insertAttendanceSchema = createInsertSchema(attendance, {
  date: z.coerce.date(),
}).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type AttendanceRecord = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type CreateEmployeeRequest = InsertEmployee;
export type CreateAttendanceRequest = InsertAttendance;
