import { z } from 'zod';
import { insertEmployeeSchema, insertAttendanceSchema, employees, attendance } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  employees: {
    list: {
      method: 'GET' as const,
      path: '/api/employees' as const,
      responses: {
        200: z.array(z.custom<typeof employees.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/employees' as const,
      input: insertEmployeeSchema,
      responses: {
        201: z.custom<typeof employees.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/employees/:id' as const,
      responses: {
        200: z.custom<typeof employees.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/employees/:id' as const,
      responses: {
        200: z.object({ success: z.boolean() }),
        404: errorSchemas.notFound,
      },
    },
  },
  attendance: {
    list: {
      method: 'GET' as const,
      path: '/api/attendance' as const,
      responses: {
        200: z.array(z.custom<typeof attendance.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/attendance' as const,
      input: insertAttendanceSchema,
      responses: {
        201: z.custom<typeof attendance.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type EmployeeResponse = z.infer<typeof api.employees.create.responses[201]>;
export type AttendanceResponse = z.infer<typeof api.attendance.create.responses[201]>;
