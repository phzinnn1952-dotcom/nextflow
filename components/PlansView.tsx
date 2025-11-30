import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Filter, AlertTriangle, X, ChevronDown, Check, FileText, DollarSign, Calendar } from "lucide-react";
import { PLANS_DATA } from "../constants";
import { Plan } from "../types";

export const PlansView: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(PLANS_DATA);
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    period: "Mensal",
    status: "ativo" as 'ativo' | 'inativo'
  });

  // Dropdown States
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Delete States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const periodOptions = ["Mensal", "Trimestral", "Semestral", "Anual"];
  const statusOptions = ["ativo", "inativo"];

  const resetForm = () => {
    setFormData({
      name: "",
      value: "",
      period: "Mensal",
      status: "ativo"
    });
    setEditingPlan(null);
  };

  const handleNewPlanClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditClick = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      value: plan.value,
      period: plan.period,
      status: plan.status
    });
    setIsModalOpen(true);
  };

  const handleSavePlan = () => {
    if (editingPlan) {
      // Update existing
      setPlans(plans.map(p => p.id === editingPlan.id ? {
        ...p,
        ...formData
      } : p));
    } else {
      // Create new
      const newPlan: Plan = {
        id: Math.random().toString(),
        ...formData
      };
      setPlans([...plans, newPlan]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedPlanId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPlanId) {
      setPlans(plans.filter(p => p.id !== selectedPlanId));
      setDeleteModalOpen(false);
      setSelectedPlanId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    return status === 'ativo' 
      ? "bg-green-500/10 text-green-400 border-green-500/20"
      : "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gerenciar Planos</h1>
          <p className="text-sm md:text-base text-gray-400">
            Cadastre e edite os planos disponíveis para seus clientes
          </p>
        </div>

        <button 
          onClick={handleNewPlanClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors h-10 shadow-lg shadow-purple-900/20 font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Plano
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-[#252525]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar plano..." 
            className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f0f] border border-[#333] text-gray-300 rounded-lg text-sm font-medium hover:text-white hover:border-gray-500 transition-all">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252525] bg-[#0f0f0f]/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome do Plano</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {plans.map((plan) => (
                <tr key={plan.id} className="group hover:bg-[#252525]/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-white">{plan.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300 font-medium">{plan.value}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {plan.period}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(plan.status)} capitalize`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(plan)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all" 
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(plan.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all" 
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New/Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-lg shadow-2xl shadow-black animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#252525]">
              <h2 className="text-xl font-bold text-white">{editingPlan ? "Editar Plano" : "Novo Plano"}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Form */}
            <div className="p-6">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSavePlan(); }}>
                
                {/* Nome do Plano */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Nome do Plano</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Plano Fibra 500MB"
                      className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Valor */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Valor</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input 
                        type="text" 
                        value={formData.value}
                        onChange={(e) => setFormData({...formData, value: e.target.value})}
                        placeholder="R$ 0,00"
                        className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Período */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Período</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                        className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                      >
                        <span className="text-white">{formData.period}</span>
                        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </button>
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      
                      {isPeriodDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setIsPeriodDropdownOpen(false)} />
                          <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 overflow-hidden">
                            {periodOptions.map(option => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setFormData({...formData, period: option});
                                  setIsPeriodDropdownOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                              >
                                <span className={formData.period === option ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}>
                                  {option}
                                </span>
                                {formData.period === option && <Check className="w-3.5 h-3.5 text-purple-500" />}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      className="w-full bg-[#0f0f0f] border border-[#333] text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-left flex items-center justify-between group"
                    >
                      <span className="text-white capitalize">{formData.status}</span>
                      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </button>
                    <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    
                    {isStatusDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-20 overflow-hidden">
                          {statusOptions.map(option => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setFormData({...formData, status: option as 'ativo' | 'inativo'});
                                setIsStatusDropdownOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                            >
                              <span className={`capitalize ${formData.status === option ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                {option}
                              </span>
                              {formData.status === option && <Check className="w-3.5 h-3.5 text-purple-500" />}
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
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors font-medium border border-[#333] text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSavePlan}
                className="px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-900/20 text-sm"
              >
                {editingPlan ? "Atualizar Plano" : "Salvar Plano"}
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
                <h3 className="text-xl font-bold text-white mb-2">Excluir Plano</h3>
                <p className="text-gray-400 text-sm">
                  Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
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