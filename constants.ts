import {
  LayoutGrid,
  Users,
  FileText,
  DollarSign,
  MessageCircle,
  Settings,
  Database
} from "lucide-react";
import { SidebarItem, PaymentMethodData, User } from "./types";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Dashboard", icon: LayoutGrid },
  { name: "Clientes", icon: Users },
  { name: "Planos", icon: FileText },
  { name: "Financeiro", icon: DollarSign },
  { name: "WhatsApp", icon: MessageCircle },
  { name: "Gerenciar Usuários", icon: Settings },
  { name: "Servidores", icon: Database },
];

export const PAYMENT_METHODS_DATA: PaymentMethodData[] = [
  { name: "PIX", value: 65, color: "#10b981" },
  { name: "Cartão de Crédito", value: 25, color: "#8b5cf6" },
  { name: "Boleto", value: 10, color: "#f59e0b" },
];

export const INITIAL_USERS: User[] = [
  {
    id: "admin",
    name: "Pedro NextFlow",
    email: "pedro@nextflow.com",
    password: "82645211Mk@",
    role: "admin",
    status: "ativo",
    createdAt: "01/01/2024",
  },
];

// Mock data arrays - now empty as we're using real database
export const HISTORY_DATA: any[] = [];
export const CHART_DATA: any[] = [];
export const CLIENTS_DATA: any[] = [];
export const PLANS_DATA: any[] = [];
export const SERVERS_DATA: any[] = [];
export const USERS_DATA: User[] = [...INITIAL_USERS];
export const MESSAGE_TEMPLATES_DATA: any[] = [];
export const MESSAGE_HISTORY_DATA: any[] = [];
export const FINANCIAL_FLOW_DATA: any[] = [];
export const OPEN_INVOICES_DATA: any[] = [];
