// API Service para integração com Painel Cliente API
// Base URL: https://api.painelcliente.com/

const API_BASE_URL = 'https://api.painelcliente.com';

// Configuração da API - deve ser armazenada de forma segura
interface ApiConfig {
  token: string;
  secret: string;
}

// Armazenar configuração no localStorage
export const setApiConfig = (token: string, secret: string) => {
  localStorage.setItem('api_token', token);
  localStorage.setItem('api_secret', secret);
};

export const getApiConfig = (): ApiConfig | null => {
  const token = localStorage.getItem('api_token');
  const secret = localStorage.getItem('api_secret');

  if (!token || !secret) return null;

  return { token, secret };
};

// Helper para fazer requisições à API
async function apiRequest(endpoint: string, data: any) {
  const config = getApiConfig();

  if (!config) {
    throw new Error('API não configurada. Configure o TOKEN e SECRET primeiro.');
  }

  const url = `${API_BASE_URL}${endpoint.replace('{TOKEN}', config.token)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: config.secret,
      ...data,
    }),
  });

  const result = await response.json();

  if (!result.result) {
    throw new Error(result.mens || 'Erro na requisição');
  }

  return result.data;
}

// ==================== PERFIL DO REVENDA ====================
export const getRevendaProfile = async () => {
  return apiRequest('/profile/{TOKEN}', {});
};

// ==================== BOUQUETS ====================
export const getBouquets = async () => {
  return apiRequest('/bouquets/{TOKEN}', {});
};

// ==================== CRIAR CLIENTE ====================
export interface CreateClientData {
  username: string;
  password: string;
  idbouquet: number[];
  month: number;
  connections: number;
  email?: string;
  whatsapp?: string;
  notes?: string;
}

export const createClient = async (data: CreateClientData) => {
  return apiRequest('/create_client/{TOKEN}', data);
};

// ==================== ATUALIZAR CLIENTE ====================
export interface UpdateClientData {
  username: string;
  password?: string;
  idbouquet?: number[];
  notes?: string;
}

export const updateClient = async (data: UpdateClientData) => {
  return apiRequest('/update_client/{TOKEN}', data);
};

// ==================== RENOVAR CLIENTE ====================
export interface RenewClientData {
  username: string;
  month: number;
}

export const renewClient = async (data: RenewClientData) => {
  return apiRequest('/renew_client/{TOKEN}', data);
};

// ==================== ADICIONAR CONEXÃO ====================
export interface AddScreenData {
  username: string;
  connections: number;
}

export const addScreen = async (data: AddScreenData) => {
  return apiRequest('/screen_client/add/{TOKEN}', data);
};

// ==================== REMOVER CONEXÃO ====================
export interface RemoveScreenData {
  username: string;
  connections: string;
}

export const removeScreen = async (data: RemoveScreenData) => {
  return apiRequest('/screen_client/remove/{TOKEN}', data);
};

// ==================== BLOQUEAR/DESBLOQUEAR CLIENTE ====================
export interface BlockClientData {
  username: string;
  status: boolean;
}

export const blockClient = async (data: BlockClientData) => {
  return apiRequest('/block_client/{TOKEN}', data);
};

// ==================== OBTER INFORMAÇÕES DO CLIENTE ====================
export const getClient = async (username: string) => {
  return apiRequest('/get_client/{TOKEN}', { username });
};

// ==================== DELETAR CLIENTE ====================
export const deleteClient = async (username: string) => {
  return apiRequest('/delete_client/{TOKEN}', { username });
};

// ==================== CRIAR TESTE ====================
export interface CreateTrialData {
  username: string;
  password: string;
  idbouquet: number[];
  email?: string;
  whatsapp?: string;
  notes?: string;
}

export const createTrial = async (data: CreateTrialData) => {
  return apiRequest('/trial_create/{TOKEN}', data);
};

// ==================== LISTAR TODOS OS CLIENTES ====================
export interface GetAllClientsData {
  page?: number;
  limit?: number;
}

export const getAllClients = async (data?: GetAllClientsData) => {
  return apiRequest('/get_clients_all/{TOKEN}', data || {});
};
