import React from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export interface ClientHistory {
  id: string;
  name: string;
  status: 'renovado' | 'a-vencer' | 'vencido';
  value: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  plan: string;
  dueDate: string;
  server: string;
  status: 'ativo' | 'pendente' | 'bloqueado';
}

export interface Plan {
  id: string;
  name: string;
  value: string;
  period: string;
  status: 'ativo' | 'inativo';
}

export interface SidebarItem {
  name: string;
  icon: React.ComponentType<any>;
  active?: boolean;
}

export interface ChartData {
  name: string;
  clients: number;
  revenue: number;
}

export interface Transaction {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
}

export interface FinancialChartData {
  name: string;
  income: number;
  expense: number;
}

export interface PaymentMethodData {
  name: string;
  value: number;
  color: string;
}

export interface OpenInvoice {
  id: string;
  clientName: string;
  plan: string;
  dueDate: string;
  amount: string;
  daysOverdue: number;
  status: 'vencido' | 'a-vencer';
}

export interface MessageTemplate {
  id: string;
  name: string;
  message: string;
  category: 'cobrança' | 'boas-vindas' | 'suporte' | 'marketing';
  createdAt: string;
}

export interface MessageHistory {
  id: string;
  client: string;
  message: string;
  sentAt: string;
  status: 'enviado' | 'lido' | 'falhou';
  template?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'cliente';
  status: 'ativo' | 'inativo';
  createdAt: string;
}

export interface Server {
  id: string;
  name: string;
  type: 'mikrotik' | 'radius' | 'outro';
  token: string;
  secret: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
}
