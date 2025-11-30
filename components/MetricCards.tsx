import React from "react";
import { Users, CheckCircle, AlertTriangle, XCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MetricCardProps } from "../types";
import { useClients } from "../src/hooks/useDatabase";

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  iconBgColor = "bg-purple-500/10",
  iconColor = "text-purple-500"
}) => {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColor} transition-colors group-hover:bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trend.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {value}
        </h3>
      </div>
    </div>
  );
};

interface MetricGridProps {
  className?: string;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ className = "mb-8" }) => {
  const { clients, loading } = useClients();

  // Calcular métricas baseadas nos dados reais
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'ativo').length;
  const expiredClients = clients.filter(c => c.status === 'vencido' || c.status === 'pendente').length;
  const blockedClients = clients.filter(c => c.status === 'bloqueado' || c.status === 'inativo').length;

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] animate-pulse">
            <div className="h-12 w-12 bg-[#252525] rounded-xl mb-4"></div>
            <div className="h-4 bg-[#252525] rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-[#252525] rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      <MetricCard
        title="Total de Clientes"
        value={totalClients}
        icon={Users}
      />
      <MetricCard
        title="Clientes Ativos"
        value={activeClients}
        icon={CheckCircle}
        iconBgColor="bg-green-500/10"
        iconColor="text-green-500"
      />
      <MetricCard
        title="Clientes Vencidos"
        value={expiredClients}
        icon={AlertTriangle}
        iconBgColor="bg-red-500/10"
        iconColor="text-red-500"
      />
      <MetricCard
        title="Clientes Desativados"
        value={blockedClients}
        icon={XCircle}
        iconBgColor="bg-gray-500/10"
        iconColor="text-gray-400"
      />
    </div>
  );
};