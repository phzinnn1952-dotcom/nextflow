import React, { useState } from "react";
import { History, Filter, Check } from "lucide-react";
import { HISTORY_DATA } from "../constants";

interface HistoryCardProps {
  showValues: boolean;
}

const statusConfig = {
  renovado: { label: "Renovado", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  "a-vencer": { label: "A vencer", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  vencido: { label: "Vencido", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
};

export const HistoryCard: React.FC<HistoryCardProps> = ({ showValues }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  const filterOptions = ["Todos", "Renovado", "A Vencer", "Vencido"];

  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
  };

  const filteredData = HISTORY_DATA.filter((item) => {
    if (selectedFilter === "Todos") return true;
    if (selectedFilter === "Renovado") return item.status === "renovado";
    if (selectedFilter === "A Vencer") return item.status === "a-vencer";
    if (selectedFilter === "Vencido") return item.status === "vencido";
    return true;
  });

  return (
    <div className="bg-[#0f0f0f] rounded-2xl border border-[#1f1f1f] flex flex-col h-full relative">
      <div className="p-6 border-b border-[#1f1f1f] flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <History className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Históricos</h3>
            <p className="text-sm text-gray-400">Fique por dentro do seu negócio</p>
          </div>
        </div>
        
        {/* Filter Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 border ${isFilterOpen ? 'bg-[#1a1a1a] text-white border-[#333]' : 'text-gray-500 border-transparent hover:text-white hover:bg-[#1a1a1a]'}`}
          >
            <span className="text-xs font-medium hidden sm:block">{selectedFilter}</span>
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

      <div className="p-6 flex-1 flex flex-col justify-center gap-3">
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const config = statusConfig[item.status];
            return (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 rounded-xl bg-[#1a1a1a] border border-[#252525] hover:border-[#333] transition-all group"
              >
                <div className="flex flex-col gap-1">
                  <span className={`w-fit px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                    {config.label}
                  </span>
                  <span className="text-white font-medium ml-1">{item.name}</span>
                </div>
                <span className="text-gray-300 font-mono text-sm">
                  {showValues ? item.value : "****"}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-gray-500">
            <p className="text-sm">Nenhum histórico encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};