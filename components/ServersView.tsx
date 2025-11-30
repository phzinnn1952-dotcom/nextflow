import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, AlertTriangle, Database, Key, Lock, ChevronDown, Calendar, Eye, EyeOff, Globe } from "lucide-react";
import { Server } from "../types";
import { useServers } from "../src/hooks/useDatabase";

export const ServersView: React.FC = () => {
  // Database hooks
  const { servers: dbServers, loading, createServer: dbCreateServer, updateServer: dbUpdateServer, deleteServer: dbDeleteServer } = useServers();

  // Modal States
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<string | null>(null);

  // Editing State
  const [editingServer, setEditingServer] = useState<any | null>(null);

  // Form States
  const [serverForm, setServerForm] = useState({
    name: "",
    type: "club" as "club" | "painel-fast",
    url: "",
    token: "",
    secret: "",
    status: "ativo" as "ativo" | "inativo"
  });

  // Dropdown States
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Password visibility
  const [showToken, setShowToken] = useState<{[key: string]: boolean}>({});
  const [showSecret, setShowSecret] = useState<{[key: string]: boolean}>({});
  const [showFormToken, setShowFormToken] = useState(false);
  const [showFormSecret, setShowFormSecret] = useState(false);

  // Use database servers - ensure it's always an array
  const servers = Array.isArray(dbServers) ? dbServers : [];

  const typeOptions = [
    { value: "club", label: "Club" },
    { value: "painel-fast", label: "Painel Fast" }
  ];

  const statusOptions = [
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" }
  ];

  // Reset Form
  const resetForm = () => {
    setServerForm({ name: "", type: "club", url: "", token: "", secret: "", status: "ativo" });
    setEditingServer(null);
    setShowFormToken(false);
    setShowFormSecret(false);
  };

  const openNewServerModal = () => {
    resetForm();
    setIsServerModalOpen(true);
  };

  const handleEditServer = (server: any) => {
    setEditingServer(server);
    setServerForm({
      name: server.name,
      type: server.type,
      url: server.url || "",
      token: server.token,
      secret: server.secret,
      status: server.status
    });
    setIsServerModalOpen(true);
  };

  const handleSaveServer = async () => {
    const serverData = {
      name: serverForm.name,
      type: serverForm.type,
      url: serverForm.url,
      token: serverForm.token,
      secret: serverForm.secret,
      status: serverForm.status
    };

    try {
      if (editingServer) {
        // Update existing
        await dbUpdateServer(editingServer.id, serverData);
      } else {
        // Create new
        await dbCreateServer({
          ...serverData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        });
      }
      setIsServerModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving server:", error);
      alert("Erro ao salvar servidor. Verifique os dados e tente novamente.");
    }
  };

  const handleDeleteClick = (id: string) => {
    setServerToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (serverToDelete) {
      try {
        await dbDeleteServer(serverToDelete);
        setDeleteModalOpen(false);
        setServerToDelete(null);
      } catch (error) {
        console.error("Error deleting server:", error);
        alert("Erro ao excluir servidor.");
      }
    }
  };

  const toggleTokenVisibility = (id: string) => {
    setShowToken(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSecretVisibility = (id: string) => {
    setShowSecret(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskText = (text: string, visible: boolean) => {
    return visible ? text : '•'.repeat(text.length);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "inativo":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "club":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "painel-fast":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "club": return "Club";
      case "painel-fast": return "Painel Fast";
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "inativo": return "Inativo";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gerenciar Servidores</h1>
            <p className="text-sm md:text-base text-gray-400">Configure e gerencie os servidores de autenticação</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] animate-pulse">
              <div className="h-12 w-12 bg-[#252525] rounded-xl mb-4"></div>
              <div className="h-4 bg-[#252525] rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-[#252525] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gerenciar Servidores</h1>
          <p className="text-sm md:text-base text-gray-400">
            Configure e gerencie os servidores de autenticação
          </p>
        </div>

        <button
          onClick={openNewServerModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors h-10 shadow-lg shadow-purple-900/20 font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Servidor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center transition-colors group-hover:bg-opacity-20">
              <Database className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total de Servidores</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{servers.length}</h3>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center transition-colors group-hover:bg-opacity-20">
              <Check className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Servidores Ativos</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{servers.filter(s => s.status === 'ativo').length}</h3>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center transition-colors group-hover:bg-opacity-20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Servidores Inativos</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{servers.filter(s => s.status === 'inativo').length}</h3>
          </div>
        </div>
      </div>

      {/* Servers Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden">
        <div className="p-6 border-b border-[#252525]">
          <h2 className="text-xl font-bold text-white">Lista de Servidores</h2>
          <p className="text-sm text-gray-400 mt-1">Gerencie todos os servidores do sistema</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252525] bg-[#0f0f0f]/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Secret</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Criado em</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {servers.length > 0 ? (
                servers.map((server) => (
                  <tr key={server.id} className="group hover:bg-[#252525]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#333] flex items-center justify-center text-sm font-bold text-gray-400 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-colors">
                          <Database className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-white">{server.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeStyle(server.type)}`}>
                        {getTypeLabel(server.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-gray-400 font-mono bg-[#0f0f0f] px-2 py-1 rounded border border-[#333]">
                          {maskText(server.token, showToken[server.id])}
                        </code>
                        <button
                          onClick={() => toggleTokenVisibility(server.id)}
                          className="p-1 text-gray-500 hover:text-white transition-colors"
                        >
                          {showToken[server.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-gray-400 font-mono bg-[#0f0f0f] px-2 py-1 rounded border border-[#333]">
                          {maskText(server.secret, showSecret[server.id])}
                        </code>
                        <button
                          onClick={() => toggleSecretVisibility(server.id)}
                          className="p-1 text-gray-500 hover:text-white transition-colors"
                        >
                          {showSecret[server.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(server.status)}`}>
                        {getStatusLabel(server.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        {server.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditServer(server)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(server.id)}
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
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <p className="text-base font-medium">Nenhum servidor encontrado</p>
                    <p className="text-sm mt-1">Adicione um novo servidor para começar</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New/Edit Server Modal */}
      {isServerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsServerModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-lg shadow-2xl shadow-black animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#252525]">
              <h2 className="text-xl font-bold text-white">{editingServer ? "Editar Servidor" : "Novo Servidor"}</h2>
              <button
                onClick={() => setIsServerModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveServer(); }}>

                {/* Nome */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Nome do Servidor</label>
                  <div className="relative">
                    <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={serverForm.name}
                      onChange={(e) => setServerForm({...serverForm, name: e.target.value})}
                      placeholder="Ex: Servidor Principal BR"
                      className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                {/* Tipo */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Tipo</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                      className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                    >
                      <span className="text-white">
                        {typeOptions.find(t => t.value === serverForm.type)?.label}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </button>

                    {isTypeDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsTypeDropdownOpen(false)} />
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20">
                          {typeOptions.map(type => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => {
                                setServerForm({...serverForm, type: type.value as any});
                                setIsTypeDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                            >
                              <span className={serverForm.type === type.value ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}>
                                {type.label}
                              </span>
                              {serverForm.type === type.value && <Check className="w-3.5 h-3.5 text-purple-500" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* URL da API */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">URL da API</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={serverForm.url}
                      onChange={(e) => setServerForm({...serverForm, url: e.target.value})}
                      placeholder="https://api.painelcliente.com"
                      className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    URL base da API do painel (ex: https://api.painelcliente.com)
                  </p>
                </div>

                {/* Token */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Token</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showFormToken ? "text" : "password"}
                      value={serverForm.token}
                      onChange={(e) => setServerForm({...serverForm, token: e.target.value})}
                      placeholder="TOKEN_ABC123"
                      className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormToken(!showFormToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showFormToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Secret */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Secret</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showFormSecret ? "text" : "password"}
                      value={serverForm.secret}
                      onChange={(e) => setServerForm({...serverForm, secret: e.target.value})}
                      placeholder="SECRET_KEY_XYZ789"
                      className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFormSecret(!showFormSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showFormSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                    >
                      <span className="text-white">
                        {statusOptions.find(s => s.value === serverForm.status)?.label}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </button>

                    {isStatusDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20">
                          {statusOptions.map(status => (
                            <button
                              key={status.value}
                              type="button"
                              onClick={() => {
                                setServerForm({...serverForm, status: status.value as any});
                                setIsStatusDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                            >
                              <span className={serverForm.status === status.value ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}>
                                {status.label}
                              </span>
                              {serverForm.status === status.value && <Check className="w-3.5 h-3.5 text-purple-500" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#252525]">
              <button
                onClick={() => setIsServerModalOpen(false)}
                className="px-4 py-2.5 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors font-medium border border-[#333] text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveServer}
                className="px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-900/20 text-sm"
              >
                {editingServer ? "Atualizar Servidor" : "Salvar Servidor"}
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
                <h3 className="text-xl font-bold text-white mb-2">Excluir Servidor</h3>
                <p className="text-gray-400 text-sm">
                  Tem certeza que deseja excluir este servidor? Esta ação não pode ser desfeita e pode afetar os clientes conectados.
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
