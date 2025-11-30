import { db } from './index';
import {
  users,
  plans,
  clients,
  invoices,
  servers,
  messageTemplates,
  messageHistory,
  transactions
} from './schema';
import { eq } from 'drizzle-orm';

// ==================== USERS ====================
export const userService = {
  getAll: () => db.select().from(users).all(),
  getById: (id: string) => db.select().from(users).where(eq(users.id, id)).get(),
  getByEmail: (email: string) => db.select().from(users).where(eq(users.email, email)).get(),
  create: (data: typeof users.$inferInsert) => db.insert(users).values(data).run(),
  update: (id: string, data: Partial<typeof users.$inferInsert>) =>
    db.update(users).set(data).where(eq(users.id, id)).run(),
  delete: (id: string) => db.delete(users).where(eq(users.id, id)).run(),
};

// ==================== PLANS ====================
export const planService = {
  getAll: () => db.select().from(plans).all(),
  getById: (id: string) => db.select().from(plans).where(eq(plans.id, id)).get(),
  create: (data: typeof plans.$inferInsert) => db.insert(plans).values(data).run(),
  update: (id: string, data: Partial<typeof plans.$inferInsert>) =>
    db.update(plans).set(data).where(eq(plans.id, id)).run(),
  delete: (id: string) => db.delete(plans).where(eq(plans.id, id)).run(),
};

// ==================== CLIENTS ====================
export const clientService = {
  getAll: () => db.select().from(clients).all(),
  getById: (id: string) => db.select().from(clients).where(eq(clients.id, id)).get(),
  create: (data: typeof clients.$inferInsert) => db.insert(clients).values(data).run(),
  update: (id: string, data: Partial<typeof clients.$inferInsert>) =>
    db.update(clients).set(data).where(eq(clients.id, id)).run(),
  delete: (id: string) => db.delete(clients).where(eq(clients.id, id)).run(),
  getByStatus: (status: string) => db.select().from(clients).where(eq(clients.status, status)).all(),
};

// ==================== INVOICES ====================
export const invoiceService = {
  getAll: () => db.select().from(invoices).all(),
  getById: (id: string) => db.select().from(invoices).where(eq(invoices.id, id)).get(),
  create: (data: typeof invoices.$inferInsert) => db.insert(invoices).values(data).run(),
  update: (id: string, data: Partial<typeof invoices.$inferInsert>) =>
    db.update(invoices).set(data).where(eq(invoices.id, id)).run(),
  delete: (id: string) => db.delete(invoices).where(eq(invoices.id, id)).run(),
  getByStatus: (status: string) => db.select().from(invoices).where(eq(invoices.status, status)).all(),
  getByClient: (clientId: string) => db.select().from(invoices).where(eq(invoices.clientId, clientId)).all(),
};

// ==================== SERVERS ====================
export const serverService = {
  getAll: () => db.select().from(servers).all(),
  getById: (id: string) => db.select().from(servers).where(eq(servers.id, id)).get(),
  create: (data: typeof servers.$inferInsert) => db.insert(servers).values(data).run(),
  update: (id: string, data: Partial<typeof servers.$inferInsert>) =>
    db.update(servers).set(data).where(eq(servers.id, id)).run(),
  delete: (id: string) => db.delete(servers).where(eq(servers.id, id)).run(),
};

// ==================== MESSAGE TEMPLATES ====================
export const templateService = {
  getAll: () => db.select().from(messageTemplates).all(),
  getById: (id: string) => db.select().from(messageTemplates).where(eq(messageTemplates.id, id)).get(),
  create: (data: typeof messageTemplates.$inferInsert) => db.insert(messageTemplates).values(data).run(),
  update: (id: string, data: Partial<typeof messageTemplates.$inferInsert>) =>
    db.update(messageTemplates).set(data).where(eq(messageTemplates.id, id)).run(),
  delete: (id: string) => db.delete(messageTemplates).where(eq(messageTemplates.id, id)).run(),
  getByCategory: (category: string) =>
    db.select().from(messageTemplates).where(eq(messageTemplates.category, category)).all(),
};

// ==================== MESSAGE HISTORY ====================
export const messageHistoryService = {
  getAll: () => db.select().from(messageHistory).all(),
  getById: (id: string) => db.select().from(messageHistory).where(eq(messageHistory.id, id)).get(),
  create: (data: typeof messageHistory.$inferInsert) => db.insert(messageHistory).values(data).run(),
  getByClient: (clientId: string) =>
    db.select().from(messageHistory).where(eq(messageHistory.clientId, clientId)).all(),
};

// ==================== TRANSACTIONS ====================
export const transactionService = {
  getAll: () => db.select().from(transactions).all(),
  getById: (id: string) => db.select().from(transactions).where(eq(transactions.id, id)).get(),
  create: (data: typeof transactions.$inferInsert) => db.insert(transactions).values(data).run(),
  getByType: (type: 'income' | 'expense') =>
    db.select().from(transactions).where(eq(transactions.type, type)).all(),
};
