// Arquivo para expor serviços do banco de dados para o renderer (React)
import {
  userService,
  planService,
  clientService,
  invoiceService,
  serverService,
  templateService,
  messageHistoryService,
  transactionService
} from '../db/services';

// Expor serviços do banco de dados globalmente
window.db = {
  users: userService,
  plans: planService,
  clients: clientService,
  invoices: invoiceService,
  servers: serverService,
  templates: templateService,
  messageHistory: messageHistoryService,
  transactions: transactionService,
};

console.log('✅ Banco de dados conectado e disponível!');
