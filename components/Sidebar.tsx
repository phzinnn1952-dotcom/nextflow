import React from "react";
import { LogOut, Hexagon } from "lucide-react";
import { SIDEBAR_ITEMS } from "../constants";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentView: string;
  onNavigate: (viewName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, currentView, onNavigate }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[240px] bg-[#0f0f0f] border-r border-[#1f1f1f] z-50
          transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded flex items-center justify-center shadow-lg shadow-purple-900/20">
              <Hexagon className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">NEXTFLOW</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item, index) => {
            const isActive = currentView === item.name;
            return (
              <button
                key={index}
                onClick={() => {
                  onNavigate(item.name);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-[#1a1a1a] text-white border-l-4 border-purple-500"
                      : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                  }
                `}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isActive ? "text-purple-400" : "text-gray-500 group-hover:text-white"
                  }`}
                />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f1f1f]">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-[#1a1a1a] rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>
    </>
  );
};