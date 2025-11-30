# 🚀 Início Rápido - NextFlow Dashboard

## 3 Passos para Começar

### Passo 1: Instalar Dependências
```bash
cd NextFlow
npm install
```

### Passo 2: Inicializar Banco de Dados
```bash
npm run db:init
```

✅ Você verá:
```
✅ Banco de dados inicializado com sucesso!
👤 Criando usuário administrador padrão...
✅ Usuário admin criado com sucesso!
📧 Email: admin@nextflow.com
🔑 Senha: admin123
```

### Passo 3: Executar Sistema
```bash
npm run dev
```

✅ Acesse: http://localhost:3000

---

## 🎯 Primeiro Login

1. Abra http://localhost:3000
2. **Email**: admin@nextflow.com
3. **Senha**: admin123

⚠️ Altere a senha após o primeiro acesso!

---

## ✨ Testando o Sistema

### 1. Criar um Plano
- Vá em **"Planos"**
- Clique em **"Novo Plano"**
- Preencha:
  - Nome: "Plano Básico"
  - Valor: R$ 49,90
  - Duração: 30 dias
  - Status: Ativo
- Clique em **"Criar Plano"**

### 2. Adicionar um Servidor
- Vá em **"Servidores"**
- Clique em **"Adicionar Servidor"**
- Preencha:
  - Nome: "Servidor Principal"
  - Tipo: MikroTik
  - Token: (seu token)
  - Secret: (seu secret)
  - Status: Ativo
- Clique em **"Criar Servidor"**

### 3. Cadastrar um Cliente
- Vá em **"Clientes"**
- Clique em **"Novo Cliente"**
- Preencha:
  - Nome: "João Silva"
  - Email: "joao@email.com"
  - Telefone: "(11) 99999-9999"
  - Plano: Selecione o plano criado
  - Status: Ativo
  - Próxima Cobrança: (data futura)
- Clique em **"Criar Cliente"**

### 4. Criar Template WhatsApp
- Vá em **"WhatsApp"**
- Clique em **"Novo Template"**
- Preencha:
  - Nome: "Cobrança"
  - Categoria: Cobrança
  - Mensagem: "Olá {nome}, sua fatura de {valor} vence em {data}"
- Clique em **"Criar Template"**

### 5. Adicionar Usuário
- Vá em **"Gerenciar Usuários"**
- Clique em **"Novo Usuário"**
- Preencha:
  - Nome: "Maria Santos"
  - Email: "maria@empresa.com"
  - Senha: (senha forte)
  - Tipo: Administrador
  - Status: Ativo
- Clique em **"Criar Usuário"**

---

## 📊 Visualizar Banco de Dados

Para ver os dados no banco em tempo real:

```bash
npm run db:studio
```

Isso abrirá uma interface visual do Drizzle Studio no navegador.

---

## 💾 Backup do Banco

Para fazer backup:

```bash
# Windows
copy db\nextflow.db db\nextflow.backup.db

# Linux/Mac
cp db/nextflow.db db/nextflow.backup.db
```

---

## 🔄 Resetar Sistema (Zerar Tudo)

Para começar do zero:

```bash
# Windows
del db\nextflow.db
npm run db:init

# Linux/Mac
rm db/nextflow.db
npm run db:init
```

---

## 🎨 Funcionalidades Especiais

### Botão Mostrar/Ocultar Valores
- **Dashboard**: Botão no canto superior direito
- **Financeiro**: Botão no canto superior direito
- Oculta todos os valores monetários com `R$ •••,••`

### Exportar Relatórios
- **Financeiro**: Botão "Exportar Relatório"
- Gera arquivo CSV com todas as faturas

### Envio em Massa WhatsApp
- **WhatsApp**: Selecione múltiplos clientes
- Escolha um template
- Clique em "Enviar Mensagem em Massa"

---

## 📱 Acesso Mobile

O sistema é responsivo! Acesse de qualquer dispositivo:
- Desktop
- Tablet
- Smartphone

---

## 🆘 Problemas Comuns

### Erro: "Port 3000 is in use"
Solução: O Vite usará automaticamente a porta 3001

### Erro ao criar cliente: "Plan not found"
Solução: Crie um plano primeiro em "Planos"

### Banco de dados não inicializa
Solução:
```bash
rm db/nextflow.db
npm run db:init
```

---

## ✅ Pronto!

Seu sistema NextFlow está 100% funcional com banco de dados real!

🎉 **Sistema zerado e pronto para venda!**

Para mais informações, consulte:
- `DATABASE.md` - Documentação completa do banco
- `PRONTO_PARA_VENDA.md` - Guia de produção
