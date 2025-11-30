import React, { useMemo, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, MoreVertical, Download, Send, Clock, Calendar, User, X, CreditCard, Filter, Check, Eye, EyeOff } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { FINANCIAL_FLOW_DATA, PAYMENT_METHODS_DATA, OPEN_INVOICES_DATA } from "../constants";

export const FinancialView: React.FC = () => {
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [cashFlowPeriod, setCashFlowPeriod] = useState<'7' | '15' | '30'>('30');
  const [paymentLinkModalOpen, setPaymentLinkModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showValues, setShowValues] = useState(true);

  const handleHistoryClick = (invoice: any) => {
    setSelectedInvoice(invoice);
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

  const handleResendInvoice = (invoiceId: string) => {
    // TODO: Implementar lógica de reenvio de fatura
    console.log('Reenviando fatura:', invoiceId);
  };

  const handleExportReport = () => {
    // Preparar dados para exportação
    const csvContent = [
      ['Cliente', 'Plano', 'Vencimento', 'Valor', 'Status', 'Dias em Atraso'].join(','),
      ...OPEN_INVOICES_DATA.map(inv => [
        inv.clientName,
        inv.plan,
        inv.dueDate,
        inv.amount,
        inv.status === 'vencido' ? 'Vencido' : 'A Vencer',
        inv.daysOverdue > 0 ? inv.daysOverdue : 0
      ].join(','))
    ].join('\n');

    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `faturas_em_aberto_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrar dados do gráfico por período
  const getFilteredChartData = () => {
    const periods: Record<string, number> = { '7': 7, '15': 15, '30': 30 };
    const days = periods[cashFlowPeriod];
    return FINANCIAL_FLOW_DATA.slice(-days);
  };

  // Contar faturas
  const overdueBills = OPEN_INVOICES_DATA.filter(inv => inv.status === 'vencido').length;
  const pendingBills = OPEN_INVOICES_DATA.filter(inv => inv.status === 'a-vencer').length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "vencido":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "a-vencer":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
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
      case "vencido": return "Vencido";
      case "a-vencer": return "A Vencer";
      case "pago": return "Pago";
      case "atrasado": return "Atrasado";
      default: return status;
    }
  };

  const parseCurrencyValue = (value: string) => {
    if (!value) return 0;
    const cleaned = value
      .replace(/[R$\s]/g, "")
      .replace(/\./g, "")
      .replace(/,/g, ".");
    const parsed = Number(cleaned);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

  const totalRevenueValue = FINANCIAL_FLOW_DATA.reduce((sum, item) => sum + (item.income || 0), 0);
  const overdueAmount = OPEN_INVOICES_DATA.filter(inv => inv.status === "vencido").reduce(
    (sum, inv) => sum + parseCurrencyValue(inv.amount),
    0
  );
  const pendingAmount = OPEN_INVOICES_DATA.filter(inv => inv.status === "a-vencer").reduce(
    (sum, inv) => sum + parseCurrencyValue(inv.amount),
    0
  );

  const displayValue = (value: number) =>
    showValues ? formatCurrency(value) : "R$ •••,••";

  const maskValue = (value: string) => {
    return showValues ? value : "R$ •••,••";
  };

  const paymentMethodColorMap = useMemo(() => {
    return PAYMENT_METHODS_DATA.reduce<Record<string, string>>((map, method) => {
      map[method.name] = method.color;
      return map;
    }, {});
  }, []);

  const paymentMethodsData = useMemo(() => {
    if (!OPEN_INVOICES_DATA.length) {
      return PAYMENT_METHODS_DATA;
    }
    const counts = OPEN_INVOICES_DATA.reduce<Record<string, number>>((acc, invoice) => {
      const method = invoice.paymentMethod || "PIX";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});
    const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

    if (!total) {
      return PAYMENT_METHODS_DATA;
    }

    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Number(((count / total) * 100).toFixed(1)),
      color: paymentMethodColorMap[name] ?? PAYMENT_METHODS_DATA[0].color
    }));
  }, [paymentMethodColorMap]);

  const formatPercentage = (value: number) => {
    return Number.isInteger(value) ? `${value}` : value.toFixed(1);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Financeiro</h1>
          <p className="text-sm md:text-base text-gray-400">
            Acompanhe o fluxo de caixa e saúde financeira do seu negócio
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowValues(!showValues)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white rounded-lg border border-[#333] transition-colors text-sm font-medium"
            title={showValues ? "Ocultar valores" : "Mostrar valores"}
          >
            {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showValues ? "Ocultar" : "Mostrar"}
          </button>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] text-white rounded-lg border border-[#333] transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Receita Total */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
              <ArrowUpRight className="w-3 h-3" />
              12.5%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Receita Total</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{displayValue(totalRevenueValue)}</h3>
        </div>

        {/* Faturas Vencidas */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
              <ArrowDownRight className="w-3 h-3" />
              4.2%
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Faturas Vencidas</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">{displayValue(overdueAmount)}</h3>
            <span className="text-sm text-gray-500">({overdueBills} faturas)</span>
          </div>
        </div>

        {/* Faturas Pendentes */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-[#333] transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Faturas Pendentes</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">{displayValue(pendingAmount)}</h3>
            <span className="text-sm text-gray-500">({pendingBills} faturas)</span>
          </div>
        </div>

        {/* Link de Pagamento Avulso */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] hover:border-purple-500/30 transition-all hover:-translate-y-1 cursor-pointer group" onClick={() => setPaymentLinkModalOpen(true)}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Wallet className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Gerar Link de Pagamento</p>
          <h3 className="text-lg font-bold text-purple-400 tracking-tight group-hover:text-purple-300 transition-colors">Criar Link Avulso</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart - Cash Flow */}
        <div className="lg:col-span-2 bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Fluxo de Caixa</h3>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 border ${isFilterOpen ? 'bg-[#0f0f0f] text-white border-[#333]' : 'bg-[#0f0f0f] text-gray-300 border-[#2a2a2a] hover:text-white hover:border-[#333]'}`}
              >
                <span className="text-sm font-medium">Últimos {cashFlowPeriod === '7' ? '7 dias' : cashFlowPeriod === '15' ? '15 dias' : '30 dias'}</span>
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
                    <button
                      onClick={() => { setCashFlowPeriod('7'); setIsFilterOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                    >
                      <span className={`${cashFlowPeriod === '7' ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        Últimos 7 dias
                      </span>
                      {cashFlowPeriod === '7' && (
                        <Check className="w-3.5 h-3.5 text-purple-500" />
                      )}
                    </button>
                    <button
                      onClick={() => { setCashFlowPeriod('15'); setIsFilterOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                    >
                      <span className={`${cashFlowPeriod === '15' ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        Últimos 15 dias
                      </span>
                      {cashFlowPeriod === '15' && (
                        <Check className="w-3.5 h-3.5 text-purple-500" />
                      )}
                    </button>
                    <button
                      onClick={() => { setCashFlowPeriod('30'); setIsFilterOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-[#252525] transition-colors group"
                    >
                      <span className={`${cashFlowPeriod === '30' ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        Últimos 30 dias
                      </span>
                      {cashFlowPeriod === '30' && (
                        <Check className="w-3.5 h-3.5 text-purple-500" />
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getFilteredChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
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
                  dataKey="income" 
                  name="Receita"
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  name="Despesa"
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Payment Methods */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#252525] flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Métodos de Pagamento</h3>
          <div className="flex-1 min-h-[250px] w-full relative mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#ffffff"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="14"
                        fontWeight="bold"
                      >
                        {value}%
                      </text>
                    );
                  }}
                  labelLine={false}
                >
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffffff', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  formatter={(value) => [`${value}%`, 'Percentual']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="space-y-2 mt-2">
            {paymentMethodsData.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }}></div>
                  <span className="text-sm text-gray-400">{method.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{formatPercentage(method.value)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Invoices Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden">
        <div className="p-6 border-b border-[#252525] flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Faturas em Aberto</h3>
          <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f0f0f]/50 border-b border-[#252525]">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {OPEN_INVOICES_DATA.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#252525]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0f0f0f] border border-[#333] flex items-center justify-center text-sm font-bold text-gray-400 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-colors shrink-0">
                        {invoice.clientName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-white">{invoice.clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{invoice.plan}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      {invoice.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{maskValue(invoice.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(invoice.status)}`}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResendInvoice(invoice.id)}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-all"
                        title="Reenviar Fatura"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleHistoryClick(invoice)}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all"
                        title="Histórico de Pagamentos"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Link Modal */}
      {paymentLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPaymentLinkModalOpen(false)}></div>
          <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-md shadow-2xl shadow-black animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#252525]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Gerar Link de Pagamento</h2>
                  <p className="text-sm text-gray-400">Crie um link avulso para receber pagamentos</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentLinkModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Descrição do Pagamento</label>
                <input
                  type="text"
                  placeholder="Ex: Mensalidade de Outubro"
                  className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Valor (R$)</label>
                <input
                  type="number"
                  placeholder="0,00"
                  className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 mt-4">
                <p className="text-xs text-gray-500 mb-2">Link gerado:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value="https://pay.nextflow.com/abc123"
                    readOnly
                    className="flex-1 bg-[#1a1a1a] border border-[#252525] text-gray-300 text-xs rounded px-3 py-2 focus:outline-none"
                  />
                  <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded transition-colors">
                    Copiar
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#252525]">
              <button
                onClick={() => setPaymentLinkModalOpen(false)}
                className="px-4 py-2.5 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors font-medium border border-[#333] text-sm"
              >
                Cancelar
              </button>
              <button className="px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-900/20 text-sm">
                Gerar Link
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
                  {selectedInvoice?.clientName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Histórico de Pagamentos</h2>
                  <p className="text-sm text-gray-400">{selectedInvoice?.clientName}</p>
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
                      <td className="px-6 py-3 text-sm font-medium text-white">{maskValue(payment.value)}</td>
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

    </div>
  );
};
