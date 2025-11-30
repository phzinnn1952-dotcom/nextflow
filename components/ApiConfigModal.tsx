import React, { useState, useEffect } from "react";
import { X, Key, Lock, Save, AlertCircle } from "lucide-react";
import { setApiConfig, getApiConfig } from "../src/services/apiService";

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const config = getApiConfig();
    if (config) {
      setToken(config.token);
      setSecret(config.secret);
      setIsSaved(true);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!token || !secret) {
      alert("Por favor, preencha TOKEN e SECRET");
      return;
    }

    setApiConfig(token, secret);
    setIsSaved(true);
    alert("Configuração da API salva com sucesso!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-[#1a1a1a] border border-[#252525] rounded-2xl w-full max-w-md shadow-2xl shadow-black animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#252525]">
          <h2 className="text-xl font-bold text-white">Configuração da API</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#252525] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Configuração da API Painel Cliente</p>
              <p className="text-blue-400/80">
                Insira suas credenciais da API para integrar o sistema com o Painel Cliente.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {/* TOKEN */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">TOKEN</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Insira seu TOKEN da API"
                  className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* SECRET */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">SECRET</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Insira sua chave SECRET"
                  className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            {isSaved && (
              <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Configuração salva anteriormente
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#252525]">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-[#252525] text-white rounded-lg hover:bg-[#333] transition-colors font-medium border border-[#333] text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-900/20 text-sm"
          >
            <Save className="w-4 h-4" />
            Salvar Configuração
          </button>
        </div>
      </div>
    </div>
  );
};
