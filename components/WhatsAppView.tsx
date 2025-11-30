import React, { useState } from "react";
import { Plus, Edit2, Trash2, Send, Clock, X, Check, MessageCircle, Users, Filter, Search, ChevronDown, AlertTriangle, FileText } from "lucide-react";
import { MESSAGE_TEMPLATES_DATA, MESSAGE_HISTORY_DATA, CLIENTS_DATA } from "../constants";
import { MessageTemplate, MessageHistory } from "../types";

export const WhatsAppView: React.FC = () => {
  // Main Data States
  const [templates, setTemplates] = useState<MessageTemplate[]>(MESSAGE_TEMPLATES_DATA);
  const [messageHistory, setMessageHistory] = useState<MessageHistory[]>(MESSAGE_HISTORY_DATA);

  // Modal States
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSendMessageModalOpen, setIsSendMessageModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  // Editing States
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Todos");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form States (Template)
  const [templateForm, setTemplateForm] = useState({
    name: "",
    message: "",
    category: "cobrança" as "cobrança" | "boas-vindas" | "suporte" | "marketing"
  });

  // Form States (Send Message)
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const categoryOptions = ["Todos", "Cobrança", "Boas-Vindas", "Suporte", "Marketing"];
  const statusOptions = ["Todos", "Enviado", "Lido", "Falhou"];

  // Reset Form
  const resetTemplateForm = () => {
    setTemplateForm({ name: "", message: "", category: "cobrança" });
    setEditingTemplate(null);
  };

  const openNewTemplateModal = () => {
    resetTemplateForm();
    setIsTemplateModalOpen(true);
  };

  const handleEditTemplate = (template: MessageTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      message: template.message,
      category: template.category
    });
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      // Update existing
      setTemplates(templates.map(t => t.id === editingTemplate.id ? {
        ...t,
        name: templateForm.name,
        message: templateForm.message,
        category: templateForm.category
      } : t));
    } else {
      // Create new
      const newTemplate: MessageTemplate = {
        id: Math.random().toString(),
        name: templateForm.name,
        message: templateForm.message,
        category: templateForm.category,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      setTemplates([...templates, newTemplate]);
    }
    setIsTemplateModalOpen(false);
    resetTemplateForm();
  };

  const handleDeleteClick = (id: string) => {
    setTemplateToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      setTemplates(templates.filter(t => t.id !== templateToDelete));
      setDeleteModalOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleSendMessage = () => {
    // Mock send message logic
    const template = templates.find(t => t.id === selectedTemplateId);
    selectedClients.forEach(clientId => {
      const client = CLIENTS_DATA.find(c => c.id === clientId);
      if (client) {
        const newMessage: MessageHistory = {
          id: Math.random().toString(),
          client: client.name,
          message: customMessage || template?.message || "",
          sentAt: new Date().toLocaleString('pt-BR'),
          status: 'enviado',
          template: template?.name
        };
        setMessageHistory([newMessage, ...messageHistory]);
      }
    });

    setIsSendMessageModalOpen(false);
    setSelectedClients([]);
    setSelectedTemplateId("");
    setCustomMessage("");
  };

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  // Filters
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "Todos"
      ? true
      : template.category === selectedCategory.toLowerCase();
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredHistory = messageHistory.filter(msg => {
    const matchesStatus = selectedStatusFilter === "Todos"
      ? true
      : msg.status === selectedStatusFilter.toLowerCase();
    return matchesStatus;
  });

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "cobrança":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "boas-vindas":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "suporte":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "marketing":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "enviado":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "lido":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "falhou":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "cobrança": return "Cobrança";
      case "boas-vindas": return "Boas-Vindas";
      case "suporte": return "Suporte";
      case "marketing": return "Marketing";
      default: return category;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "enviado": return "Enviado";
      case "lido": return "Lido";
      case "falhou": return "Falhou";
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gerenciar WhatsApp</h1>
          <p className="text-sm md:text-base text-gray-400">
            Crie modelos de mensagens e envie comunicações em massa
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsSendMessageModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors h-10 shadow-lg shadow-green-900/20 font-medium"
          >
            <Send className="w-5 h-5" />
            Enviar Mensagem
          </button>
          <button
            onClick={openNewTemplateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors h-10 shadow-lg shadow-purple-900/20 font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Modelo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center transition-colors group-hover:bg-opacity-20">
              <MessageCircle className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total de Modelos</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{templates.length}</h3>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center transition-colors group-hover:bg-opacity-20">
              <Send className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Mensagens Enviadas</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{messageHistory.filter(m => m.status === 'enviado' || m.status === 'lido').length}</h3>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center transition-colors group-hover:bg-opacity-20">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Mensagens Lidas</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{messageHistory.filter(m => m.status === 'lido').length}</h3>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden">
        <div className="p-6 border-b border-[#252525]">
          <h2 className="text-xl font-bold text-white">Modelos de Mensagens</h2>
          <p className="text-sm text-gray-400 mt-1">Crie e gerencie modelos reutilizáveis</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-[#252525]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar modelos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${isCategoryFilterOpen ? 'bg-[#0f0f0f] text-white border-[#333]' : 'bg-[#0f0f0f] border-[#333] text-gray-300 hover:text-white hover:border-gray-500'}`}
            >
              <Filter className="w-4 h-4" />
              {selectedCategory}
            </button>

            {isCategoryFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCategoryFilterOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-[#252525]">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</span>
                  </div>
                  {categoryOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => { setSelectedCategory(option); setIsCategoryFilterOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                    >
                      <span className={`${selectedCategory === option ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {option}
                      </span>
                      {selectedCategory === option && <Check className="w-3.5 h-3.5 text-purple-500" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-[#0f0f0f] border border-[#252525] rounded-xl p-5 hover:border-[#333] transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{template.name}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryStyle(template.category)}`}>
                        {getCategoryLabel(template.category)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(template.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-3 mb-3">{template.message}</p>
                  <p className="text-xs text-gray-600">Criado em {template.createdAt}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-base font-medium">Nenhum modelo encontrado</p>
              <p className="text-sm mt-1">Crie um novo modelo para começar</p>
            </div>
          )}
        </div>
      </div>

      {/* Message History Section */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden">
        <div className="p-6 border-b border-[#252525] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Histórico de Mensagens</h2>
            <p className="text-sm text-gray-400 mt-1">Últimas mensagens enviadas</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all ${isStatusFilterOpen ? 'bg-[#0f0f0f] text-white border-[#333]' : 'bg-[#0f0f0f] border-[#333] text-gray-300 hover:text-white hover:border-gray-500'}`}
            >
              <Filter className="w-4 h-4" />
              {selectedStatusFilter}
            </button>

            {isStatusFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsStatusFilterOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-[#252525]">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                  </div>
                  {statusOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => { setSelectedStatusFilter(option); setIsStatusFilterOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                    >
                      <span className={`${selectedStatusFilter === option ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {option}
                      </span>
                      {selectedStatusFilter === option && <Check className="w-3.5 h-3.5 text-purple-500" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252525] bg-[#0f0f0f]/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mensagem</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data/Hora</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((msg) => (
                  <tr key={msg.id} className="group hover:bg-[#252525]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#333] flex items-center justify-center text-sm font-bold text-gray-400 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-colors">
                          {msg.client.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white">{msg.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-300 line-clamp-2 max-w-xs">{msg.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FileText className="w-4 h-4 text-gray-600" />
                        {msg.template || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4 text-gray-600" />
                        {msg.sentAt}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(msg.status)}`}>
                        {getStatusLabel(msg.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-base font-medium">Nenhuma mensagem encontrada</p>
                    <p className="text-sm mt-1">Envie sua primeira mensagem</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New/Edit Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTemplateModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-2xl shadow-2xl shadow-black animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#252525]">
              <h2 className="text-xl font-bold text-white">{editingTemplate ? "Editar Modelo" : "Novo Modelo"}</h2>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveTemplate(); }}>

                {/* Nome do Modelo */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Nome do Modelo</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                    placeholder="Ex: Cobrança Padrão"
                    className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Categoria</label>
                  <select
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm({...templateForm, category: e.target.value as any})}
                    className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  >
                    <option value="cobrança">Cobrança</option>
                    <option value="boas-vindas">Boas-Vindas</option>
                    <option value="suporte">Suporte</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>

                {/* Mensagem */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Mensagem</label>
                  <textarea
                    value={templateForm.message}
                    onChange={(e) => setTemplateForm({...templateForm, message: e.target.value})}
                    placeholder="Digite sua mensagem... Use {nome}, {valor}, {data}, {plano}, {dias} como variáveis"
                    rows={6}
                    className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 resize-none"
                  />
                  <p className="text-xs text-gray-500">Variáveis disponíveis: {"{nome}"}, {"{valor}"}, {"{data}"}, {"{plano}"}, {"{dias}"}</p>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#252525]">
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-2.5 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors font-medium border border-[#333] text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-900/20 text-sm"
              >
                {editingTemplate ? "Atualizar Modelo" : "Salvar Modelo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {isSendMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSendMessageModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-2xl shadow-2xl shadow-black animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#252525]">
              <h2 className="text-xl font-bold text-white">Enviar Mensagem</h2>
              <button
                onClick={() => setIsSendMessageModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>

                {/* Selecionar Clientes */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Selecionar Clientes</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
                      className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                    >
                      <span className={selectedClients.length > 0 ? "text-white" : "text-gray-600"}>
                        {selectedClients.length > 0 ? `${selectedClients.length} cliente(s) selecionado(s)` : "Selecione os clientes"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </button>

                    {isClientDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsClientDropdownOpen(false)} />
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 max-h-60 overflow-y-auto">
                          {CLIENTS_DATA.map(client => (
                            <button
                              key={client.id}
                              type="button"
                              onClick={() => toggleClientSelection(client.id)}
                              className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                            >
                              <span className={selectedClients.includes(client.id) ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}>
                                {client.name}
                              </span>
                              {selectedClients.includes(client.id) && <Check className="w-3.5 h-3.5 text-purple-500" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Selecionar Modelo (Opcional) */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Modelo (Opcional)</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                      className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                    >
                      <span className={selectedTemplateId ? "text-white" : "text-gray-600"}>
                        {selectedTemplateId ? templates.find(t => t.id === selectedTemplateId)?.name : "Selecione um modelo"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </button>

                    {isTemplateDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsTemplateDropdownOpen(false)} />
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 max-h-60 overflow-y-auto">
                          {templates.map(template => (
                            <button
                              key={template.id}
                              type="button"
                              onClick={() => {
                                setSelectedTemplateId(template.id);
                                setCustomMessage(template.message);
                                setIsTemplateDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                            >
                              <span className={selectedTemplateId === template.id ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}>
                                {template.name}
                              </span>
                              {selectedTemplateId === template.id && <Check className="w-3.5 h-3.5 text-purple-500" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Mensagem Personalizada */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Mensagem</label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Digite sua mensagem ou selecione um modelo acima"
                    rows={6}
                    className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 resize-none"
                  />
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#252525]">
              <button
                onClick={() => setIsSendMessageModalOpen(false)}
                className="px-4 py-2.5 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors font-medium border border-[#333] text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-green-900/20 text-sm"
              >
                Enviar Mensagem
              </button>
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
                <h3 className="text-xl font-bold text-white mb-2">Excluir Modelo</h3>
                <p className="text-gray-400 text-sm">
                  Tem certeza que deseja excluir este modelo? Esta ação não pode ser desfeita.
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
