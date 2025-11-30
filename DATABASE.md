# 🗄️ Banco de Dados NextFlow

## Banco de Dados Real - SQLite + Drizzle ORM

O sistema NextFlow agora utiliza um banco de dados **SQLite real** com Drizzle ORM para persistência de dados.

## 📊 Estrutura do Banco

### Tabelas

1. **users** - Usuários do sistema (Administradores e Clientes)
2. **plans** - Planos de IPTV
3. **clients** - Clientes de IPTV
4. **invoices** - Faturas e cobranças
5. **servers** - Servidores (MikroTik, Radius, etc)
6. **message_templates** - Templates de mensagens WhatsApp
7. **message_history** - Histórico de mensagens enviadas
8. **transactions** - Transações financeiras

## 🚀 Como Usar

### Inicializar o Banco de Dados

```bash
npm run db:init
```

Este comando irá:
- Criar o banco de dados SQLite em `./db/nextflow.db`
- Criar todas as tabelas necessárias
- Criar um usuário administrador padrão

**Credenciais padrão:**
- Email: `admin@nextflow.com`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

### Visualizar Banco de Dados (Drizzle Studio)

```bash
npm run db:studio
```

Isso abrirá uma interface visual no navegador para visualizar e editar o banco de dados.

### Executar o Sistema

```bash
npm run dev
```

O servidor Vite irá:
- Inicializar o banco de dados automaticamente
- Expor API REST em `/api/*`
- Servir o frontend React

## 📡 API REST

O sistema expõe endpoints REST para todas as operações:

### Usuários
- `GET /api/users` - Listar todos
- `GET /api/users/:id` - Buscar por ID
- `POST /api/users` - Criar novo
- `PUT /api/users/:id` - Atualizar
- `DELETE /api/users/:id` - Deletar

### Planos
- `GET /api/plans` - Listar todos
- `POST /api/plans` - Criar novo
- `PUT /api/plans/:id` - Atualizar
- `DELETE /api/plans/:id` - Deletar

### Clientes
- `GET /api/clients` - Listar todos
- `POST /api/clients` - Criar novo
- `PUT /api/clients/:id` - Atualizar
- `DELETE /api/clients/:id` - Deletar

### Faturas
- `GET /api/invoices` - Listar todas
- `POST /api/invoices` - Criar nova
- `PUT /api/invoices/:id` - Atualizar
- `DELETE /api/invoices/:id` - Deletar

### Servidores
- `GET /api/servers` - Listar todos
- `POST /api/servers` - Criar novo
- `PUT /api/servers/:id` - Atualizar
- `DELETE /api/servers/:id` - Deletar

### Templates WhatsApp
- `GET /api/templates` - Listar todos
- `POST /api/templates` - Criar novo
- `PUT /api/templates/:id` - Atualizar
- `DELETE /api/templates/:id` - Deletar

### Histórico de Mensagens
- `GET /api/messages` - Listar todas
- `POST /api/messages` - Criar nova

### Transações
- `GET /api/transactions` - Listar todas
- `POST /api/transactions` - Criar nova

## 🔧 Hooks React

O sistema fornece hooks personalizados para facilitar o uso do banco de dados nos componentes React:

```typescript
import { useClients, usePlans, useInvoices } from './hooks/useDatabase';

function MyComponent() {
  const { clients, createClient, updateClient, deleteClient } = useClients();
  const { plans } = usePlans();
  const { invoices } = useInvoices();

  // Use os dados...
}
```

Hooks disponíveis:
- `useUsers()`
- `usePlans()`
- `useClients()`
- `useInvoices()`
- `useServers()`
- `useMessageTemplates()`
- `useMessageHistory()`
- `useTransactions()`

## 🎯 Sistema Zerado

O sistema está **completamente zerado** e pronto para venda:
- ✅ Sem dados mock/fictícios
- ✅ Banco de dados vazio (exceto admin padrão)
- ✅ Pronto para receber dados reais
- ✅ API REST completa
- ✅ Interface totalmente funcional

## 📦 Arquivos do Banco

- `db/schema.ts` - Definição das tabelas
- `db/index.ts` - Conexão com o banco
- `db/services.ts` - Serviços CRUD
- `db/init.ts` - Script de inicialização
- `db/nextflow.db` - Arquivo do banco SQLite (criado automaticamente)

## 🔒 Segurança

⚠️ **Para Produção**:
1. Implemente autenticação real (JWT, sessions)
2. Use `bcrypt` para hash de senhas
3. Adicione validação de dados
4. Implemente rate limiting
5. Use HTTPS
6. Configure CORS adequadamente

## 💾 Backup

Para fazer backup do banco de dados, basta copiar o arquivo:
```bash
cp db/nextflow.db db/nextflow.backup.db
```

## 🔄 Resetar Banco

Para resetar o banco de dados:
```bash
rm db/nextflow.db
npm run db:init
```
