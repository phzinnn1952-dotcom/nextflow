import type { Plugin } from 'vite';
import { initDatabase } from './db/index';
import {
  userService,
  planService,
  clientService,
  invoiceService,
  serverService,
  templateService,
  messageHistoryService,
  transactionService
} from './db/services';

export function dbPlugin(): Plugin {
  return {
    name: 'vite-plugin-db',
    configureServer(server) {
      // Inicializar banco de dados
      initDatabase();
      console.log('✅ Banco de dados inicializado!');

      // API Routes
      server.middlewares.use('/api', (req, res, next) => {
        res.setHeader('Content-Type', 'application/json');

        const url = req.url || '';
        const method = req.method;

        // Helper function
        const send = (data: any) => res.end(JSON.stringify(data));
        const sendError = (message: string, status = 400) => {
          res.statusCode = status;
          send({ error: message });
        };

        // Parse body for POST/PUT/PATCH
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
          const data = body ? JSON.parse(body) : {};

          try {
            // ==================== USERS ====================
            if (url === '/users' && method === 'GET') {
              return send(userService.getAll());
            }
            if (url.startsWith('/users/') && method === 'GET') {
              const id = url.split('/')[2];
              return send(userService.getById(id));
            }
            if (url === '/users' && method === 'POST') {
              userService.create(data);
              return send({ success: true });
            }
            if (url.startsWith('/users/') && method === 'PUT') {
              const id = url.split('/')[2];
              userService.update(id, data);
              return send({ success: true });
            }
            if (url.startsWith('/users/') && method === 'DELETE') {
              const id = url.split('/')[2];
              userService.delete(id);
              return send({ success: true });
            }

            // ==================== PLANS ====================
            if (url === '/plans' && method === 'GET') {
              return send(planService.getAll());
            }
            if (url === '/plans' && method === 'POST') {
              planService.create(data);
              return send({ success: true });
            }
            if (url.startsWith('/plans/') && method === 'PUT') {
              const id = url.split('/')[2];
              planService.update(id, data);
              return send({ success: true });
            }
            if (url.startsWith('/plans/') && method === 'DELETE') {
              const id = url.split('/')[2];
              planService.delete(id);
              return send({ success: true });
            }

            // ==================== CLIENTS ====================
            if (url === '/clients' && method === 'GET') {
              return send(clientService.getAll());
            }
            if (url === '/clients' && method === 'POST') {
              clientService.create(data);
              return send({ success: true });
            }
            if (url.startsWith('/clients/') && method === 'PUT') {
              const id = url.split('/')[2];
              clientService.update(id, data);
              return send({ success: true });
            }
            if (url.startsWith('/clients/') && method === 'DELETE') {
              const id = url.split('/')[2];
              clientService.delete(id);
              return send({ success: true });
            }

            // ==================== INVOICES ====================
            if (url === '/invoices' && method === 'GET') {
              return send(invoiceService.getAll());
            }
            if (url === '/invoices' && method === 'POST') {
              invoiceService.create(data);
              return send({ success: true });
            }
            if (url.startsWith('/invoices/') && method === 'PUT') {
              const id = url.split('/')[2];
              invoiceService.update(id, data);
              return send({ success: true });
            }
            if (url.startsWith('/invoices/') && method === 'DELETE') {
              const id = url.split('/')[2];
              invoiceService.delete(id);
              return send({ success: true });
            }

            // ==================== SERVERS ====================
            if (url === '/servers' && method === 'GET') {
              return send(serverService.getAll());
            }
            if (url === '/servers' && method === 'POST') {
              serverService.create(data);
              return send({ success: true });
            }
            if (url.startsWith('/servers/') && method === 'PUT') {
              const id = url.split('/')[2];
              serverService.update(id, data);
              return send({ success: true });
            }
            if (url.startsWith('/servers/') && method === 'DELETE') {
              const id = url.split('/')[2];
              serverService.delete(id);
              return send({ success: true });
            }

            // ==================== MESSAGE TEMPLATES ====================
            if (url === '/templates' && method === 'GET') {
              return send(templateService.getAll());
            }
            if (url === '/templates' && method === 'POST') {
              templateService.create(data);
              return send({ success: true });
            }
            if (url.startsWith('/templates/') && method === 'PUT') {
              const id = url.split('/')[2];
              templateService.update(id, data);
              return send({ success: true });
            }
            if (url.startsWith('/templates/') && method === 'DELETE') {
              const id = url.split('/')[2];
              templateService.delete(id);
              return send({ success: true });
            }

            // ==================== MESSAGE HISTORY ====================
            if (url === '/messages' && method === 'GET') {
              return send(messageHistoryService.getAll());
            }
            if (url === '/messages' && method === 'POST') {
              messageHistoryService.create(data);
              return send({ success: true });
            }

            // ==================== TRANSACTIONS ====================
            if (url === '/transactions' && method === 'GET') {
              return send(transactionService.getAll());
            }
            if (url === '/transactions' && method === 'POST') {
              transactionService.create(data);
              return send({ success: true });
            }

            return sendError('Endpoint not found', 404);
          } catch (error: any) {
            return sendError(error.message, 500);
          }
        });
      });
    },
  };
}
