import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { User as UserType } from "../types";

interface LoginViewProps {
  users: UserType[];
  onLogin: (user: UserType, remember: boolean) => void;
  onRegister: (payload: { name: string; email: string; password: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ users, onLogin, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // true = login, false = criar conta
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");

  // Estados para criar conta
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // Estado para esqueceu senha
  const [forgotEmail, setForgotEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = users.find(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.password &&
        user.password === password
    );
    if (!matchedUser) {
      setError("Credenciais inválidas. Verifique usuário e senha.");
      return;
    }

    if (matchedUser.status !== "ativo") {
      setError("Usuário inativo. Entre em contato com o administrador.");
      return;
    }

    onLogin(matchedUser, rememberMe);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (registerPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const normalizedEmail = registerEmail.trim().toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      setError("Este email já está cadastrado.");
      return;
    }

    onRegister({
      name: registerName.trim(),
      email: normalizedEmail,
      password: registerPassword,
    });

    setError("");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setIsLogin(true);
    alert("Conta criada com sucesso! Faça login com as credenciais cadastradas.");
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!forgotEmail) {
      setError("Por favor, informe seu email");
      return;
    }

    // Aqui você implementaria a lógica de recuperação de senha
    console.log("Recuperar senha para:", forgotEmail);
    setError("");
    setShowForgotPassword(false);
    alert("Link de recuperação enviado para seu email!");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] shadow-2xl shadow-black/50 overflow-hidden">

          {/* Header com Logo */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">NextFlow</h1>
            </div>
            <p className="text-purple-100 text-sm">
              {isLogin ? "" : "Crie sua conta"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Formulário de Login */}
          {isLogin && !showForgotPassword && (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Lembrar-me e Esqueceu senha */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 bg-[#0f0f0f] border-2 border-[#333] rounded peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all"></div>
                    <svg
                      className="w-3 h-3 text-white absolute top-1 left-1 hidden peer-checked:block pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                    Lembrar-me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Botão Login */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5"
              >
                Entrar
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#333]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1a1a1a] px-2 text-gray-400">Não tem conta?</span>
                </div>
              </div>

              {/* Criar Conta */}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="w-full bg-[#0f0f0f] hover:bg-[#252525] text-white font-medium py-3 rounded-lg border border-[#333] hover:border-[#444] transition-all duration-200"
              >
                Criar nova conta
              </button>
            </form>
          )}

          {/* Formulário de Criar Conta */}
          {!isLogin && !showForgotPassword && (
            <form onSubmit={handleRegister} className="p-6 space-y-5">
              {/* Nome */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email
                </label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Confirmar Senha
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              {/* Botão Criar Conta */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5"
              >
                Criar Conta
              </button>

              {/* Voltar para Login */}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Já tem uma conta? <span className="text-purple-400">Fazer login</span>
              </button>
            </form>
          )}

          {/* Formulário Esqueceu Senha */}
          {showForgotPassword && (
            <form onSubmit={handleForgotPassword} className="p-6 space-y-5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Recuperar Senha</h3>
                <p className="text-sm text-gray-400">
                  Digite seu email e enviaremos um link para redefinir sua senha
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-[#0f0f0f] border border-[#333] text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              {/* Botão Enviar */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5"
              >
                Enviar Link de Recuperação
              </button>

              {/* Voltar */}
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Voltar para o login
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="px-6 py-4 bg-[#0f0f0f] border-t border-[#252525] text-center">
            <p className="text-xs text-gray-500">
              © 2025 NextFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>

        {/* Texto abaixo do card */}
        <p className="text-center text-sm text-gray-500 mt-6">
        </p>
      </div>
    </div>
  );
};
