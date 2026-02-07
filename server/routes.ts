import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Employees API
  app.get(api.employees.list.path, async (req, res) => {
    const employees = await storage.getEmployees();
    res.json(employees);
  });

  app.post(api.employees.create.path, async (req, res) => {
    try {
      const input = api.employees.create.input.parse(req.body);
      const employee = await storage.createEmployee(input);
      res.status(201).json(employee);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.employees.get.path, async (req, res) => {
    const employee = await storage.getEmployee(Number(req.params.id));
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  });

  app.delete(api.employees.delete.path, async (req, res) => {
    const success = await storage.deleteEmployee(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ success: true });
  });

  // Attendance API
  app.get(api.attendance.list.path, async (req, res) => {
    const records = await storage.getAttendanceRecords();
    res.json(records);
  });

  app.post(api.attendance.create.path, async (req, res) => {
    try {
      const input = api.attendance.create.input.parse(req.body);
      const record = await storage.createAttendance(input);
      res.status(201).json(record);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data if empty
  const existingEmployees = await storage.getEmployees();
  if (existingEmployees.length === 0) {
    await storage.createEmployee({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      position: "Software Engineer",
      department: "Engineering"
    });
    await storage.createEmployee({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      position: "HR Manager",
      department: "Human Resources"
    });
  }

  return httpServer;
}
