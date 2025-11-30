import React, { useState } from "react";
import { DollarSign, Filter, Clock, TrendingDown, Check } from "lucide-react";

interface FinancialCardProps {
  showValues: boolean;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({ showValues }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30 dias");

  const periods = ["7 dias", "15 dias", "30 dias"];

  const items = [
    {
      label: "Receita Total",
      value: "R$ 45.280,00",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-[#252525]"
    },
    {
      label: "Receita Pendente",
      value: "R$ 3.850,00",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-[#252525]"
    },
    {
      label: "Taxa de Inadimplência",
      value: "4.2%",
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-transparent"
    }
  ];

  const handleSelectPeriod = (period: string) => {
    setSelectedPeriod(period);
    setIsFilterOpen(false);
    // Aqui entraria a lógica de recarregar os dados baseado no período
  };

  return (
    <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] flex flex-col h-full relative">
      <div className="p-6 border-b border-[#1f1f1f] flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Relatório financeiro</h3>
            <p className="text-sm text-gray-400">Receita dos últimos {selectedPeriod}</p>
          </div>
        </div>
        
        {/* Filter Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 border ${isFilterOpen ? 'bg-[#1a1a1a] text-white border-[#333]' : 'text-gray-500 border-transparent hover:text-white hover:bg-[#1a1a1a]'}`}
          >
            <span className="text-xs font-medium hidden sm:block">Últimos {selectedPeriod}</span>
            <Filter className="w-4 h-4" />
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
                   <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtrar por período</span>
                </div>
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => handleSelectPeriod(period)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                  >
                    <span className={`${selectedPeriod === period ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                      Últimos {period}
                    </span>
                    {selectedPeriod === period && (
                      <Check className="w-3.5 h-3.5 text-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center gap-4">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between p-4 rounded-xl bg-[#1a1a1a] border ${item.border} hover:border-[#333] transition-all group`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <span className="text-gray-400 text-sm font-medium">{item.label}</span>
            </div>
            <span className="text-white font-bold text-lg tracking-wide">
              {showValues ? item.value : "****"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};