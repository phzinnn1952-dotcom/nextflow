import React, { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, AlertTriangle, Mail, User as UserIcon, Shield, ChevronDown, Calendar } from "lucide-react";
import { User } from "../types";

interface UsersViewProps {
  users: User[];
  onUsersChange: (nextUsers: User[]) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({ users, onUsersChange }) => {

  // Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Editing State
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form States
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "cliente" as "admin" | "cliente",
    status: "ativo" as "ativo" | "inativo"
  });

  // Dropdown States
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const roleOptions = [
    { value: "admin", label: "Administrador" },
    { value: "cliente", label: "Cliente" }
  ];

  const statusOptions = [
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" }
  ];

  // Reset Form
  const resetForm = () => {
    setUserForm({ name: "", email: "", password: "", role: "cliente", status: "ativo" });
    setEditingUser(null);
  };

  const openNewUserModal = () => {
    resetForm();
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      const updatedUsers = users.map(u =>
        u.id === editingUser.id
          ? {
              ...u,
              name: userForm.name,
              email: userForm.email,
              role: userForm.role,
              status: userForm.status
            }
          : u
      );
      onUsersChange(updatedUsers);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).slice(2),
        name: userForm.name,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        status: userForm.status,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      onUsersChange([...users, newUser]);
    }
    setIsUserModalOpen(false);
    resetForm();
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onUsersChange(users.filter(u => u.id !== userToDelete));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
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

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "cliente":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrador";
      case "cliente": return "Cliente";
      default: return role;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "inativo": return "Inativo";
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gerenciar Usuários</h1>
          <p className="text-sm md:text-base text-gray-400">
            Gerencie os usu├írios e permiss├Áes do sistema
          </p>
        </div>

        <button
          onClick={openNewUserModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors h-10 shadow-lg shadow-purple-900/20 font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center transition-colors group-hover:bg-opacity-20">
              <UserIcon className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total de Usuários</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{users.length}</h3>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center transition-colors group-hover:bg-opacity-20">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Usuários Ativos</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{users.filter(u => u.status === 'ativo').length}</h3>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center transition-colors group-hover:bg-opacity-20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Usuários Inativos</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{users.filter(u => u.status === 'inativo').length}</h3>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden">
        <div className="p-6 border-b border-[#252525]">
          <h2 className="text-xl font-bold text-white">Lista de Usuários</h2>
          <p className="text-sm text-gray-400 mt-1">Gerencie todos os usu├írios do sistema</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252525] bg-[#0f0f0f]/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fun├º├úo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Criado em</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">A├º├Áes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="group hover:bg-[#252525]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#333] flex items-center justify-center text-sm font-bold text-gray-400 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-colors">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Mail className="w-4 h-4 text-gray-600" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleStyle(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(user.status)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        {user.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
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
                    <p className="text-base font-medium">Nenhum usu├írio encontrado</p>
                    <p className="text-sm mt-1">Adicione um novo usu├írio para come├ºar</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New/Edit User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-lg shadow-2xl shadow-black animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#252525]">
              <h2 className="text-xl font-bold text-white">{editingUser ? "Editar Usuário" : "Novo Usuário"}</h2>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }}>

                {/* Nome */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                      placeholder="Ex: Jo├úo da Silva"
                      className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      placeholder="usuario@nextflow.com"
                      className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                {/* Senha */}
                {!editingUser && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Senha</label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                      placeholder="ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó"
                      className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                    />
                  </div>
                )}

                {/* Fun├º├úo */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Fun├º├úo</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                      className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                    >
                      <span className="text-white">
                        {roleOptions.find(r => r.value === userForm.role)?.label}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </button>
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />

                    {isRoleDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsRoleDropdownOpen(false)} />
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20">
                          {roleOptions.map(role => (
                            <button
                              key={role.value}
                              type="button"
                              onClick={() => {
                                setUserForm({...userForm, role: role.value as any});
                                setIsRoleDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                            >
                              <span className={userForm.role === role.value ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}>
                                {role.label}
                              </span>
                              {userForm.role === role.value && <Check className="w-3.5 h-3.5 text-purple-500" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
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
                        {statusOptions.find(s => s.value === userForm.status)?.label}
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
                                setUserForm({...userForm, status: status.value as any});
                                setIsStatusDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                            >
                              <span className={userForm.status === status.value ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}>
                                {status.label}
                              </span>
                              {userForm.status === status.value && <Check className="w-3.5 h-3.5 text-purple-500" />}
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
                onClick={() => setIsUserModalOpen(false)}
                className="px-4 py-2.5 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors font-medium border border-[#333] text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-900/20 text-sm"
              >
                {editingUser ? "Atualizar Usuário" : "Salvar Usuário"}
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
                <h3 className="text-xl font-bold text-white mb-2">Excluir Usuário</h3>
                <p className="text-gray-400 text-sm">
                  Tem certeza que deseja excluir este usu├írio? Esta a├º├úo n├úo pode ser desfeita.
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
