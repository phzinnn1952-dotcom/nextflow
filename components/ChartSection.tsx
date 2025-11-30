import React, { useState } from "react";
import { Activity, Filter, Check } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { CHART_DATA } from "../constants";

// Mock data for different periods to simulate filtering visual feedback
const DATA_7_DAYS = [
  { name: 'Seg', clients: 15, revenue: 1500 },
  { name: 'Ter', clients: 22, revenue: 2200 },
  { name: 'Qua', clients: 18, revenue: 1800 },
  { name: 'Qui', clients: 28, revenue: 2800 },
  { name: 'Sex', clients: 25, revenue: 2500 },
  { name: 'Sab', clients: 35, revenue: 3500 },
  { name: 'Dom', clients: 30, revenue: 3000 },
];

const DATA_15_DAYS = [
  { name: '01', clients: 20, revenue: 2000 },
  { name: '03', clients: 25, revenue: 2500 },
  { name: '05', clients: 22, revenue: 2200 },
  { name: '07', clients: 30, revenue: 3000 },
  { name: '09', clients: 28, revenue: 2800 },
  { name: '11', clients: 35, revenue: 3500 },
  { name: '13', clients: 32, revenue: 3200 },
  { name: '15', clients: 40, revenue: 4000 },
];

export const ChartSection: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30 dias");

  const periods = ["7 dias", "15 dias", "30 dias"];

  const handleSelectPeriod = (period: string) => {
    setSelectedPeriod(period);
    setIsFilterOpen(false);
  };

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case "7 dias":
        return DATA_7_DAYS;
      case "15 dias":
        return DATA_15_DAYS;
      default:
        return CHART_DATA;
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Relatório de Clientes</h3>
            <p className="text-sm text-gray-400">Análise de movimentação nos últimos {selectedPeriod}</p>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 border ${isFilterOpen ? 'bg-[#0f0f0f] text-white border-[#333]' : 'bg-[#0f0f0f] text-gray-300 border-[#2a2a2a] hover:text-white hover:border-[#333]'}`}
          >
            <span className="text-sm font-medium">Últimos {selectedPeriod}</span>
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
                   <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtrar período</span>
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

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getCurrentData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              cursor={{ stroke: '#444', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="clients" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorClients)" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};