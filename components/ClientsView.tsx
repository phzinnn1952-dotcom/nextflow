import React, { useState } from "react";
import { Plus, Edit2, FileText, RefreshCw, Clock, Search, Filter, Trash2, Calendar, Check, X, User, Lock, Smartphone, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle, Database, CreditCard } from "lucide-react";
import { MetricGrid } from "./MetricCards";
import { Client } from "../types";
import { useClients, usePlans, useServers } from "../src/hooks/useDatabase";

export const ClientsView: React.FC = () => {
  // Database hooks
  const { clients: dbClients, loading, createClient: dbCreateClient, updateClient: dbUpdateClient, deleteClient: dbDeleteClient } = useClients();
  const { plans: dbPlans } = usePlans();
  const { servers: dbServers } = useServers();
  
  // Filter & Search States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Modal States
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  // Delete States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  // History States
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [clientForHistory, setClientForHistory] = useState<Client | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  
  // Form States
  const [formData, setFormData] = useState({
    name: "",
    login: "",
    password: "",
    phone: ""
  });
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  
  const [selectedServer, setSelectedServer] = useState("");
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);

  // Date Picker States
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(new Date());

  const filterOptions = ["Todos", "Ativo", "Vencido", "Pendente", "Bloqueado", "Inativo"];
  const serverList = Array.isArray(dbServers) ? dbServers : [];
  const serverOptions = serverList.map(s => s.name);
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  // Use database clients
  const clients = dbClients;

  // Helper: Parse DD/MM/YYYY string to Date object
  const parseDateString = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Reset Form Logic
  const resetForm = () => {
    setFormData({ name: "", login: "", password: "", phone: "" });
    setSelectedPlan("");
    setSelectedServer("");
    setSelectedDate(null);
    setEditingClient(null);
  };

  const openNewClientModal = () => {
    resetForm();
    setIsNewClientModalOpen(true);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    // Populate form data
    setFormData({
      name: client.name,
      login: client.login || client.email?.split('@')[0] || "",
      password: "", // Password usually not retrievable
      phone: client.phone || ""
    });

    // Set plan ID
    setSelectedPlan(client.planId || "");

    setSelectedServer(client.serverId || "");

    if (client.dueDate) {
      const date = new Date(client.dueDate);
      setSelectedDate(date);
      setViewDate(date);
    }

    setIsNewClientModalOpen(true);
  };

  const handleSaveClient = async () => {
    const dueDate = selectedDate ? selectedDate.toISOString() : new Date().toISOString();

    const clientData = {
      name: formData.name,
      email: formData.login ? `${formData.login}@email.com` : "novo@email.com",
      login: formData.login,
      password: formData.password,
      phone: formData.phone,
      planId: selectedPlan,
      serverId: selectedServer,
      dueDate: dueDate,
      status: "ativo"
    };

    try {
      if (editingClient) {
        // Update existing
        await dbUpdateClient(editingClient.id, clientData);
      } else {
        // Create new
        await dbCreateClient({
          ...clientData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        });
      }
      setIsNewClientModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Erro ao salvar cliente. Verifique os dados e tente novamente.");
    }
  };

  const handleDeleteClick = (id: string) => {
    setClientToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        await dbDeleteClient(clientToDelete);
        setDeleteModalOpen(false);
        setClientToDelete(null);
        // Reset page if deleting last item on page
        if (paginatedClients.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Erro ao excluir cliente.");
      }
    }
  };

  // History Logic
  const handleHistoryClick = (client: Client) => {
    setClientForHistory(client);
    // Mock Payment Data
    const mockPayments = [
      { id: 1, date: '10/10/2024', value: 'R$ 99,90', method: 'PIX', status: 'pago' },
      { id: 2, date: '10/09/2024', value: 'R$ 99,90', method: 'Cartão de Crédito', status: 'pago' },
      { id: 3, date: '10/08/2024', value: 'R$ 99,90', method: 'Boleto', status: 'atrasado' },
      { id: 4, date: '10/07/2024', value: 'R$ 99,90', method: 'PIX', status: 'pago' },
    ];
    setPaymentHistory(mockPayments);
    setHistoryModalOpen(true);
  };

  // Lógica combinada de Filtro (Status) e Busca (Texto)
  const filteredClients = clients.filter((client) => {
    // 1. Filtro de Status
    const matchesStatus = 
      selectedFilter === "Todos" 
      ? true 
      : client.status === selectedFilter.toLowerCase();

    // 2. Filtro de Busca (Nome ou Email)
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Calendar Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pendente":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "bloqueado":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "pago":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "atrasado":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "pendente": return "Pendente";
      case "bloqueado": return "Bloqueado";
      case "pago": return "Pago";
      case "atrasado": return "Atrasado";
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gerenciar Clientes</h1>
          <p className="text-sm md:text-base text-gray-400">
            Visualize e gerencie toda sua base de clientes
          </p>
        </div>

        <button 
          onClick={openNewClientModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg border border-transparent transition-colors h-10 shadow-lg shadow-purple-900/20 font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      {/* Metrics Grid */}
      <MetricGrid className="" />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-[#252525]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou email..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${isFilterOpen ? 'bg-[#0f0f0f] text-white border-[#333]' : 'bg-[#0f0f0f] border-[#333] text-gray-300 hover:text-white hover:border-gray-500'}`}
          >
            <Filter className="w-4 h-4" />
            {selectedFilter === "Todos" ? "Todos os Status" : selectedFilter}
          </button>

          {isFilterOpen && (
            <>
              {/* Click outside backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsFilterOpen(false)}
              />
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 overflow-hidden py-1">
                <div className="px-4 py-2 border-b border-[#252525]">
                   <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtrar por Status</span>
                </div>
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectFilter(option)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                  >
                    <span className={`${selectedFilter === option ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      {option}
                    </span>
                    {selectedFilter === option && (
                      <Check className="w-3.5 h-3.5 text-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Clients Table Card */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252525] bg-[#0f0f0f]/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome do Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Servidor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {paginatedClients.length > 0 ? (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="group hover:bg-[#252525]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#333] flex items-center justify-center text-sm font-bold text-gray-400 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-colors shrink-0">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-base font-bold text-white">{client.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <FileText className="w-4 h-4 text-gray-600" />
                        {client.plan}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        {client.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Database className="w-4 h-4 text-gray-600" />
                        {client.server}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(client.status)}`}>
                        {getStatusLabel(client.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClient(client)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all" 
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all" title="Enviar Fatura">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all" title="Renovar">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleHistoryClick(client)}
                          className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-all" 
                          title="Histórico"
                        >
                          <Clock className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(client.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" 
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-base font-medium">Nenhum cliente encontrado</p>
                    <p className="text-sm mt-1">Tente ajustar seus filtros de busca</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#252525] flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredClients.length)} de {filteredClients.length} clientes
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
              >
                Anterior
              </button>
              
              {/* Simple page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button 
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    currentPage === page 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-[#252525]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
              >
                Próximo
              </button>
            </div>
        </div>
      </div>

      {/* New/Edit Client Modal */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsNewClientModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-lg shadow-2xl shadow-black animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#252525]">
              <h2 className="text-xl font-bold text-white">{editingClient ? "Editar Cliente" : "Novo Cliente"}</h2>
              <button 
                onClick={() => setIsNewClientModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Form */}
            <div className="p-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveClient(); }}>
                
                {/* Nome e Sobrenome */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Nome e Sobrenome</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: João da Silva"
                      className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Login */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Login</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        value={formData.login}
                        onChange={(e) => setFormData({...formData, login: e.target.value})}
                        placeholder="Ex: joao.silva"
                        className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="******"
                        className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plano - Custom Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Plano</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
                        className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                      >
                        <span className={selectedPlan ? "text-white" : "text-gray-600"}>
                          {selectedPlan ? dbPlans.find(p => p.id === selectedPlan)?.name : "Selecione um plano"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </button>

                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />

                      {isPlanDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsPlanDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 max-h-60 overflow-y-auto">
                              {dbPlans.map(plan => (
                                  <button
                                      key={plan.id}
                                      type="button"
                                      onClick={() => {
                                          setSelectedPlan(plan.id);
                                          setIsPlanDropdownOpen(false);
                                      }}
                                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                                  >
                                      <span className={selectedPlan === plan.id ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}>
                                          {plan.name} - R$ {plan.price}
                                      </span>
                                      {selectedPlan === plan.id && <Check className="w-3.5 h-3.5 text-purple-500" />}
                                  </button>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Servidor - Custom Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Servidor</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsServerDropdownOpen(!isServerDropdownOpen)}
                        className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                      >
                        <span className={selectedServer ? "text-white" : "text-gray-600"}>
                          {selectedServer || "Selecione um servidor"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </button>
                      
                      <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      
                      {isServerDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsServerDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 max-h-60 overflow-y-auto">
                              {serverOptions.map(server => (
                                  <button
                                      key={server}
                                      type="button"
                                      onClick={() => {
                                          setSelectedServer(server);
                                          setIsServerDropdownOpen(false);
                                      }}
                                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                                  >
                                      <span className={selectedServer === server ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}>
                                          {server}
                                      </span>
                                      {selectedServer === server && <Check className="w-3.5 h-3.5 text-purple-500" />}
                                  </button>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Data de Vencimento - Custom Date Picker */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Vencimento</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                      >
                         <span className={selectedDate ? "text-white" : "text-gray-600"}>
                          {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : "Selecione uma data"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </button>
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />

                      {isDatePickerOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsDatePickerOpen(false)} />
                          <div className="absolute left-0 md:left-auto right-auto md:right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 w-[280px] p-4">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-4">
                              <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-[#252525] rounded-full text-gray-400 hover:text-white transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className="text-white font-medium text-sm">
                                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
                              </span>
                              <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-[#252525] rounded-full text-gray-400 hover:text-white transition-colors">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1 mb-1">
                              {weekDays.map((day, i) => (
                                <div key={i} className="text-center text-xs text-gray-500 font-medium py-1">
                                  {day}
                                </div>
                              ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {generateCalendarDays().map((day, i) => (
                                <div key={i} className="aspect-square">
                                  {day && (
                                    <button
                                      type="button"
                                      onClick={() => handleSelectDate(day)}
                                      className={`w-full h-full flex items-center justify-center rounded-lg text-sm transition-colors
                                        ${
                                          selectedDate &&
                                          day.getDate() === selectedDate.getDate() &&
                                          day.getMonth() === selectedDate.getMonth() &&
                                          day.getFullYear() === selectedDate.getFullYear()
                                            ? "bg-[#8b5cf6] text-white font-bold"
                                            : "text-gray-300 hover:bg-[#252525] hover:text-white"
                                        }
                                      `}
                                    >
                                      {day.getDate()}
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Número */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Número (WhatsApp)</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Logic in parent form tag */}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#252525]">
              <button 
                onClick={() => setIsNewClientModalOpen(false)}
                className="px-4 py-2.5 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors font-medium border border-[#333] text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveClient}
                className="px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-900/20 text-sm"
              >
                {editingClient ? "Atualizar Cliente" : "Salvar Cliente"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setHistoryModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-2xl shadow-2xl shadow-black animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#252525]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#333] flex items-center justify-center text-sm font-bold text-gray-400">
                  {clientForHistory?.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Histórico de Pagamentos</h2>
                  <p className="text-sm text-gray-400">{clientForHistory?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setHistoryModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - History Table */}
            <div className="p-0 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0f0f0f]/50 border-b border-[#252525]">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Forma de Pagamento</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252525]">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#252525]/30 transition-colors">
                      <td className="px-6 py-3 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          {payment.date}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm font-medium text-white">{payment.value}</td>
                      <td className="px-6 py-3 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                          {payment.method}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(payment.status)}`}>
                          {getStatusLabel(payment.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#252525] bg-[#0f0f0f]/30 text-center">
              <span className="text-xs text-gray-500">Exibindo os últimos 5 pagamentos</span>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Excluir Cliente</h3>
                <p className="text-gray-400 text-sm">
                  Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita e todos os dados serão perdidos.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors font-medium border border-[#333]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-900/20"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
