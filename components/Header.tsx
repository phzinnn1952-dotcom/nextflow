import React, { useState } from "react";
import { Search, Bell, Eye, EyeOff, Menu, ChevronDown, LogOut, User, Settings, Key } from "lucide-react";
import { ApiConfigModal } from "./ApiConfigModal";

interface HeaderProps {
  showValues: boolean;
  toggleValues: () => void;
  toggleSidebar: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showValues, toggleValues, toggleSidebar, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-[#000000] px-6 py-4 h-20 border-b border-[#1f1f1f]">
      {/* Left Section: Mobile Menu & Search */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex relative w-[320px] group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full h-11 pl-12 pr-4 bg-[#1a1a1a] border border-transparent focus:border-purple-500/30 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Notifications */}
        <button className="relative p-2.5 text-white hover:bg-[#1a1a1a] rounded-full transition-colors group">
          <Bell className="w-5 h-5" />
          {/* Badge */}
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#000000]"></span>
        </button>

        {/* Hide Values Toggle */}
        <button
          onClick={toggleValues}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#252525] rounded-lg border border-[#333] transition-colors h-10"
        >
          {showValues ? <EyeOff className="w-4 h-4 text-white" /> : <Eye className="w-4 h-4 text-white" />}
          <span className="text-white text-sm font-medium">{showValues ? "Ocultar" : "Mostrar"}</span>
        </button>

        {/* Separator */}
        <div className="h-8 w-px bg-[#2a2a2a] hidden sm:block"></div>

        {/* Profile */}
        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center">
                 <span className="font-bold text-xs text-white">AD</span>
              </div>
            </div>

            {/* Info */}
            <div className="hidden md:flex flex-col items-start gap-0.5">
              <p className="text-sm font-semibold text-white leading-none group-hover:text-purple-400 transition-colors">Admin</p>
              <p className="text-xs text-gray-500 leading-none">Administrador</p>
            </div>

            <ChevronDown className={`w-4 h-4 text-gray-500 hidden md:block group-hover:text-white transition-all ${showProfileMenu ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl shadow-black/50 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#252525]">
                  <p className="text-sm font-semibold text-white">Admin</p>
                  <p className="text-xs text-gray-500">admin@nextflow.com</p>
                </div>

                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white transition-colors">
                    <User className="w-4 h-4" />
                    Meu Perfil
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                    Configurações
                  </button>
                  <button
                    onClick={() => {
                      setShowApiConfig(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] hover:text-white transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    Configurar API
                  </button>
                </div>

                <div className="border-t border-[#252525] py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* API Config Modal */}
      <ApiConfigModal isOpen={showApiConfig} onClose={() => setShowApiConfig(false)} />
    </header>
  );
};