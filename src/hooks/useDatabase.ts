import { useState, useEffect } from 'react';

// Helper para fazer requisições à API
async function api(endpoint: string, options?: RequestInit) {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return response.json();
}

// ==================== USERS ====================
export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const data = await api('/users');
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (userData: any) => {
    await api('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    await loadUsers();
  };

  const updateUser = async (id: string, userData: any) => {
    await api(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    await loadUsers();
  };

  const deleteUser = async (id: string) => {
    await api(`/users/${id}`, { method: 'DELETE' });
    await loadUsers();
  };

  return { users, loading, createUser, updateUser, deleteUser, reload: loadUsers };
}

// ==================== PLANS ====================
export function usePlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlans = async () => {
    try {
      const data = await api('/plans');
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const createPlan = async (planData: any) => {
    await api('/plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
    await loadPlans();
  };

  const updatePlan = async (id: string, planData: any) => {
    await api(`/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planData),
    });
    await loadPlans();
  };

  const deletePlan = async (id: string) => {
    await api(`/plans/${id}`, { method: 'DELETE' });
    await loadPlans();
  };

  return { plans, loading, createPlan, updatePlan, deletePlan, reload: loadPlans };
}

// ==================== CLIENTS ====================
export function useClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    try {
      const data = await api('/clients');
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const createClient = async (clientData: any) => {
    await api('/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
    await loadClients();
  };

  const updateClient = async (id: string, clientData: any) => {
    await api(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
    await loadClients();
  };

  const deleteClient = async (id: string) => {
    await api(`/clients/${id}`, { method: 'DELETE' });
    await loadClients();
  };

  return { clients, loading, createClient, updateClient, deleteClient, reload: loadClients };
}

// ==================== INVOICES ====================
export function useInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    try {
      const data = await api('/invoices');
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const createInvoice = async (invoiceData: any) => {
    await api('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
    await loadInvoices();
  };

  const updateInvoice = async (id: string, invoiceData: any) => {
    await api(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
    await loadInvoices();
  };

  const deleteInvoice = async (id: string) => {
    await api(`/invoices/${id}`, { method: 'DELETE' });
    await loadInvoices();
  };

  return { invoices, loading, createInvoice, updateInvoice, deleteInvoice, reload: loadInvoices };
}

// ==================== SERVERS ====================
export function useServers() {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServers = async () => {
    try {
      const data = await api('/servers');
      setServers(data || []);
    } catch (error) {
      console.error('Error loading servers:', error);
      setServers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
  }, []);

  const createServer = async (serverData: any) => {
    await api('/servers', {
      method: 'POST',
      body: JSON.stringify(serverData),
    });
    await loadServers();
  };

  const updateServer = async (id: string, serverData: any) => {
    await api(`/servers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serverData),
    });
    await loadServers();
  };

  const deleteServer = async (id: string) => {
    await api(`/servers/${id}`, { method: 'DELETE' });
    await loadServers();
  };

  return { servers, loading, createServer, updateServer, deleteServer, reload: loadServers };
}

// ==================== MESSAGE TEMPLATES ====================
export function useMessageTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTemplates = async () => {
    try {
      const data = await api('/templates');
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const createTemplate = async (templateData: any) => {
    await api('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
    await loadTemplates();
  };

  const updateTemplate = async (id: string, templateData: any) => {
    await api(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
    await loadTemplates();
  };

  const deleteTemplate = async (id: string) => {
    await api(`/templates/${id}`, { method: 'DELETE' });
    await loadTemplates();
  };

  return { templates, loading, createTemplate, updateTemplate, deleteTemplate, reload: loadTemplates };
}

// ==================== MESSAGE HISTORY ====================
export function useMessageHistory() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const data = await api('/messages');
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const createMessage = async (messageData: any) => {
    await api('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
    await loadMessages();
  };

  return { messages, loading, createMessage, reload: loadMessages };
}

// ==================== TRANSACTIONS ====================
export function useTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const data = await api('/transactions');
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const createTransaction = async (transactionData: any) => {
    await api('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
    await loadTransactions();
  };

  return { transactions, loading, createTransaction, reload: loadTransactions };
}
