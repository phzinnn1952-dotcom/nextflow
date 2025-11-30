import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tabela de Usuários (Administradores e Clientes)
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'cliente'] }).notNull(),
  status: text('status', { enum: ['ativo', 'inativo'] }).notNull().default('ativo'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Planos
export const plans = sqliteTable('plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  price: real('price').notNull(),
  duration: integer('duration').notNull(), // em dias
  features: text('features').notNull(), // JSON string
  status: text('status', { enum: ['ativo', 'inativo'] }).notNull().default('ativo'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Clientes (IPTV)
export const clients = sqliteTable('clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  planId: text('plan_id').references(() => plans.id),
  status: text('status', { enum: ['ativo', 'suspenso', 'cancelado'] }).notNull(),
  nextBillingDate: text('next_billing_date').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Faturas
export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  clientId: text('client_id').notNull().references(() => clients.id),
  clientName: text('client_name').notNull(),
  plan: text('plan').notNull(),
  amount: real('amount').notNull(),
  dueDate: text('due_date').notNull(),
  paidDate: text('paid_date'),
  status: text('status', { enum: ['vencido', 'a-vencer', 'pago'] }).notNull(),
  paymentMethod: text('payment_method'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Servidores
export const servers = sqliteTable('servers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: ['club', 'painel-fast'] }).notNull(),
  url: text('url'),
  token: text('token').notNull(),
  secret: text('secret').notNull(),
  status: text('status', { enum: ['ativo', 'inativo'] }).notNull().default('ativo'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Templates de WhatsApp
export const messageTemplates = sqliteTable('message_templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  category: text('category', { enum: ['cobrança', 'boas-vindas', 'suporte', 'marketing'] }).notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Tabela de Histórico de Mensagens WhatsApp
export const messageHistory = sqliteTable('message_history', {
  id: text('id').primaryKey(),
  clientId: text('client_id').references(() => clients.id),
  client: text('client').notNull(),
  message: text('message').notNull(),
  sentAt: text('sent_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  status: text('status', { enum: ['enviado', 'lido', 'falhou'] }).notNull(),
  template: text('template'),
});

// Tabela de Transações Financeiras
export const transactions = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['income', 'expense'] }).notNull(),
  amount: real('amount').notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});
