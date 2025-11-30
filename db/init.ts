import { initDatabase } from './index';
import { userService } from './services';
import { randomUUID } from 'crypto';

// Função para criar hash simples (em produção use bcrypt)
function hashPassword(password: string): string {
  return Buffer.from(password).toString('base64');
}

// Inicializar banco e criar usuário admin padrão
async function initialize() {
  try {
    console.log('🚀 Inicializando banco de dados...');

    // Criar tabelas
    initDatabase();

    // Verificar se já existe um admin
    const existingAdmins = userService.getAll().filter(u => u.role === 'admin');

    if (existingAdmins.length === 0) {
      console.log('👤 Criando usuário administrador padrão...');

      const adminId = randomUUID();
      userService.create({
        id: adminId,
        name: 'Administrador',
        email: 'admin@nextflow.com',
        password: hashPassword('admin123'),
        role: 'admin',
        status: 'ativo',
      });

      console.log('✅ Usuário admin criado com sucesso!');
      console.log('📧 Email: admin@nextflow.com');
      console.log('🔑 Senha: admin123');
      console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    } else {
      console.log('ℹ️  Administrador já existe no sistema.');
    }

    console.log('\n✅ Sistema pronto para uso!');
    console.log('📊 Banco de dados: ./db/nextflow.db');

  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

initialize();
