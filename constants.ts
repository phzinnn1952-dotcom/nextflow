import {
  LayoutGrid,
  Users,
  FileText,
  DollarSign,
  MessageCircle,
  Settings,
  Database
} from "lucide-react";
import { SidebarItem, PaymentMethodData } from "./types";

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

// Mock data arrays - now empty as we're using real database
export const HISTORY_DATA: any[] = [];
export const CHART_DATA: any[] = [];
export const CLIENTS_DATA: any[] = [];
export const PLANS_DATA: any[] = [];
export const SERVERS_DATA: any[] = [];
export const USERS_DATA: any[] = [];
export const MESSAGE_TEMPLATES_DATA: any[] = [];
export const MESSAGE_HISTORY_DATA: any[] = [];
export const FINANCIAL_FLOW_DATA: any[] = [];
export const OPEN_INVOICES_DATA: any[] = [];
