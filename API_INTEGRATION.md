# Integração da API Painel Cliente

## Visão Geral

O sistema NextFlow agora está integrado com a API do Painel Cliente (https://api.painelcliente.com/), permitindo gerenciar clientes IPTV diretamente através do painel.

## Configuração

### 1. Acessar Configuração da API

1. Faça login no sistema
2. Clique no seu perfil no canto superior direito
3. Selecione "Configurar API"
4. Insira suas credenciais:
   - **TOKEN**: Seu token de autenticação da API
   - **SECRET**: Sua chave secreta

### 2. Salvar Configuração

As credenciais são armazenadas localmente no navegador (localStorage) e são usadas automaticamente em todas as requisições à API.

## Funcionalidades Disponíveis

### Perfil do Revenda
- **Endpoint**: `/profile/{TOKEN}`
- **Função**: `getRevendaProfile()`
- **Descrição**: Retorna informações do perfil do revenda (créditos, status, etc.)

### Bouquets (Listas/Pacotes)
- **Endpoint**: `/bouquets/{TOKEN}`
- **Função**: `getBouquets()`
- **Descrição**: Lista todos os bouquets/pacotes disponíveis

### Gerenciamento de Clientes

#### Criar Cliente
- **Endpoint**: `/create_client/{TOKEN}`
- **Função**: `createClient(data)`
- **Parâmetros**:
  ```typescript
  {
    username: string;
    password: string;
    idbouquet: number[];
    month: number;
    connections: number;
    email?: string;
    whatsapp?: string;
    notes?: string;
  }
  ```

#### Atualizar Cliente
- **Endpoint**: `/update_client/{TOKEN}`
- **Função**: `updateClient(data)`
- **Parâmetros**:
  ```typescript
  {
    username: string;
    password?: string;
    idbouquet?: number[];
    notes?: string;
  }
  ```

#### Renovar Cliente
- **Endpoint**: `/renew_client/{TOKEN}`
- **Função**: `renewClient(data)`
- **Parâmetros**:
  ```typescript
  {
    username: string;
    month: number;
  }
  ```
- **⚠️ Rate Limit**: 1 minuto entre renovações do mesmo usuário

#### Adicionar Conexão (Tela)
- **Endpoint**: `/screen_client/add/{TOKEN}`
- **Função**: `addScreen(data)`
- **Parâmetros**:
  ```typescript
  {
    username: string;
    connections: number;
  }
  ```
- **⚠️ Rate Limit**: 1 minuto entre adições ao mesmo usuário

#### Remover Conexão (Tela)
- **Endpoint**: `/screen_client/remove/{TOKEN}`
- **Função**: `removeScreen(data)`
- **Parâmetros**:
  ```typescript
  {
    username: string;
    connections: string;
  }
  ```

#### Bloquear/Desbloquear Cliente
- **Endpoint**: `/block_client/{TOKEN}`
- **Função**: `blockClient(data)`
- **Parâmetros**:
  ```typescript
  {
    username: string;
    status: boolean; // true = bloquear, false = desbloquear
  }
  ```

#### Obter Informações do Cliente
- **Endpoint**: `/get_client/{TOKEN}`
- **Função**: `getClient(username)`
- **Retorna**: Informações detalhadas do cliente

#### Deletar Cliente
- **Endpoint**: `/delete_client/{TOKEN}`
- **Função**: `deleteClient(username)`
- **Descrição**: Remove o cliente permanentemente

#### Criar Teste (4 horas)
- **Endpoint**: `/trial_create/{TOKEN}`
- **Função**: `createTrial(data)`
- **Duração**: 4 horas a partir da criação
- **Parâmetros**:
  ```typescript
  {
    username: string;
    password: string;
    idbouquet: number[];
    email?: string;
    whatsapp?: string;
    notes?: string;
  }
  ```

#### Listar Todos os Clientes
- **Endpoint**: `/get_clients_all/{TOKEN}`
- **Função**: `getAllClients(data)`
- **Parâmetros**:
  ```typescript
  {
    page?: number;
    limit?: number;
  }
  ```
- **Retorna**: Lista paginada de clientes + total de páginas

## Uso no Código

### Exemplo: Criar Cliente

```typescript
import { createClient } from '../src/services/apiService';

const novoCliente = {
  username: "cliente123",
  password: "senha123",
  idbouquet: [1, 2, 3],
  month: 12,
  connections: 2,
  email: "cliente@email.com",
  whatsapp: "11999999999",
  notes: "Cliente VIP"
};

try {
  const result = await createClient(novoCliente);
  console.log("Cliente criado:", result);
} catch (error) {
  console.error("Erro:", error.message);
}
```

### Exemplo: Renovar Cliente

```typescript
import { renewClient } from '../src/services/apiService';

try {
  const result = await renewClient({
    username: "cliente123",
    month: 6
  });
  console.log("Cliente renovado:", result);
} catch (error) {
  if (error.message.includes('429')) {
    alert("Aguarde 1 minuto antes de renovar novamente");
  }
}
```

### Exemplo: Listar Clientes

```typescript
import { getAllClients } from '../src/services/apiService';

try {
  const result = await getAllClients({
    page: 1,
    limit: 10
  });

  console.log("Clientes:", result.data);
  console.log("Total:", result.totalClients);
  console.log("Páginas:", result.totalPages);
} catch (error) {
  console.error("Erro:", error.message);
}
```

## Tratamento de Erros

Todas as funções lançam erros quando:
1. A API não está configurada (TOKEN/SECRET não definidos)
2. A requisição retorna `result: false`
3. Há um erro de rede

Sempre use `try/catch` ao chamar as funções da API.

## Segurança

⚠️ **IMPORTANTE**:
- As credenciais (TOKEN e SECRET) são armazenadas no localStorage do navegador
- Em produção, considere implementar uma camada de backend para proteger as credenciais
- Nunca compartilhe seu TOKEN e SECRET publicamente

## Próximos Passos

Para integrar completamente a API ao sistema:
1. Modificar os hooks do banco de dados para usar a API
2. Adicionar sincronização entre banco local e API
3. Implementar cache para reduzir chamadas à API
4. Adicionar indicadores visuais de sincronização
