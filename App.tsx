import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MetricGrid } from "./components/MetricCards";
import { FinancialCard } from "./components/FinancialCard";
import { HistoryCard } from "./components/HistoryCard";
import { ChartSection } from "./components/ChartSection";
import { ClientsView } from "./components/ClientsView";
import { PlansView } from "./components/PlansView";
import { FinancialView } from "./components/FinancialView";
import { WhatsAppView } from "./components/WhatsAppView";
import { UsersView } from "./components/UsersView";
import { ServersView } from "./components/ServersView";
import { LoginView } from "./components/LoginView";

const App: React.FC = () => {
  // Estado de autenticação - mude para false para ver a tela de login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showValues, setShowValues] = useState(true);
  const [currentView, setCurrentView] = useState("Dashboard");

  const handleLogin = (email: string, password: string, remember: boolean) => {
    console.log("Tentando fazer login:", { email, password, remember });

    // Simulação de autenticação - aceita qualquer email e senha
    if (email && password) {
      console.log("Login bem-sucedido!");
      setIsAuthenticated(true);
      if (remember) {
        localStorage.setItem('rememberMe', 'true');
      }
    } else {
      console.log("Login falhou - campos vazios");
    }
  };

  const handleLogout = () => {
    console.log("Fazendo logout");
    setIsAuthenticated(false);
    localStorage.removeItem('rememberMe');
  };

  // Renderizar tela de login se não autenticado
  if (!isAuthenticated) {
    console.log("Renderizando LoginView");
    return <LoginView onLogin={handleLogin} />;
  }

  console.log("Renderizando Dashboard - usuário autenticado");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleValues = () => setShowValues(!showValues);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Main Content Area */}
      <main 
        className={`
          flex-1 transition-all duration-300 ease-in-out
          lg:ml-[240px] w-full bg-black
        `}
      >
        {/* Top Header (Sticky) */}
        <Header
          showValues={showValues}
          toggleValues={toggleValues}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
          
          {currentView === "Dashboard" ? (
            <div className="animate-in fade-in duration-500">
              {/* Page Title Section */}
              <div className="flex flex-col gap-1 mb-8 mt-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-sm md:text-base text-gray-400">
                  Visão geral e indicadores do seu negócio
                </p>
              </div>

              {/* Top Metrics Grid */}
              <MetricGrid />

              {/* Middle Section: Financial & History */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="h-full min-h-[350px]">
                  <FinancialCard showValues={showValues} />
                </div>
                <div className="h-full min-h-[350px]">
                  <HistoryCard showValues={showValues} />
                </div>
              </div>

              {/* Bottom Section: Chart */}
              <ChartSection />
            </div>
          ) : currentView === "Clientes" ? (
            <ClientsView />
          ) : currentView === "Planos" ? (
            <PlansView />
          ) : currentView === "Financeiro" ? (
            <FinancialView />
          ) : currentView === "WhatsApp" ? (
            <WhatsAppView />
          ) : currentView === "Gerenciar Usuários" ? (
            <UsersView />
          ) : currentView === "Servidores" ? (
            <ServersView />
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 animate-in fade-in">
              <h2 className="text-2xl font-bold mb-2 text-white">Em Desenvolvimento</h2>
              <p>A tela de {currentView} estará disponível em breve.</p>
            </div>
          )}

          {/* Footer Copyright */}
          <div className="mt-12 pt-6 border-t border-[#1f1f1f] text-center text-gray-500 text-sm">
            <p>&copy; 2024 NextFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;