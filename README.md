# �� Flashcards App

Um aplicativo moderno de flashcards desenvolvido em React com TypeScript, projetado para facilitar o aprendizado e memorização através de cartões de estudo interativos.

## ✨ Funcionalidades

- **Criação e Edição de Baralhos**: Interface intuitiva para criar e editar baralhos de flashcards
- **Sessões de Estudo**: Sistema de estudo com cartões que podem ser virados
- **Importação de Dados**: Suporte para importar baralhos via arquivos JSON ou TXT
- **Estatísticas de Aprendizado**: Acompanhe seu progresso com métricas detalhadas
- **Persistência de Dados**: Integração com Supabase para armazenamento na nuvem
- **Fallback Local**: Funciona offline usando localStorage quando Supabase não está configurado
- **Design Responsivo**: Interface moderna e adaptável a diferentes dispositivos

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Supabase** para backend e banco de dados
- **Lucide React** para ícones
- **CSS3** com design moderno e responsivo

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Flashcards
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Supabase (opcional):
   - Siga o guia em `supabase-setup.md`
   - Crie um arquivo `.env` com suas credenciais do Supabase

4. Execute o projeto:
```bash
npm run dev
```

## 🔧 Configuração do Supabase

Para usar o Supabase como backend:

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute os comandos SQL fornecidos em `supabase-setup.md`
3. Configure as variáveis de ambiente no arquivo `.env`:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

**Nota**: Se o Supabase não estiver configurado, o app funcionará usando localStorage como fallback.

## 📖 Como Usar

### Criando um Baralho
1. Clique em "Novo Baralho"
2. Preencha o nome e descrição
3. Adicione cards com frente e verso
4. Salve o baralho

### Estudando
1. Selecione um baralho da lista
2. Clique em "Estudar"
3. Clique no card para virá-lo
4. Use os botões "Acertei", "Errei" ou "Pular"
5. Acompanhe seu progresso em tempo real

### Importando Baralhos
1. Clique em "Importar"
2. Escolha um arquivo JSON ou TXT
3. O baralho será adicionado automaticamente

## 🗂️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── DeckList.tsx    # Lista de baralhos
│   ├── DeckEditor.tsx  # Editor de baralhos
│   ├── StudySession.tsx # Sessão de estudo
│   └── ImportModal.tsx # Modal de importação
├── services/           # Serviços
│   └── supabaseService.ts # Integração com Supabase
├── lib/               # Configurações
│   └── supabase.ts    # Cliente Supabase
├── types/             # Definições de tipos
│   └── index.ts       # Tipos TypeScript
└── App.tsx           # Componente principal
```

## 📊 Funcionalidades Avançadas

### Estatísticas de Aprendizado
- Contagem de revisões por card
- Taxa de acerto individual
- Progresso geral da sessão

### Sistema de Dificuldade
- Cards podem ser marcados como fácil, médio ou difícil
- Acompanhamento de performance por nível

### Persistência Inteligente
- Sincronização automática com Supabase
- Fallback para localStorage quando offline
- Indicador visual do tipo de armazenamento

## 🔒 Segurança

- Row Level Security (RLS) configurado no Supabase
- Políticas de acesso por usuário
- Validação de dados no frontend e backend

## 🎨 Design

- Interface moderna com gradientes e sombras
- Animações suaves e transições
- Design responsivo para mobile e desktop
- Tema consistente em todo o app

## 📱 Responsividade

O app é totalmente responsivo e funciona bem em:
- Desktops e laptops
- Tablets
- Smartphones

## 🚀 Deploy

Para fazer deploy:

1. Build do projeto:
```bash
npm run build
```

2. Os arquivos estarão em `dist/`
3. Faça upload para seu serviço de hospedagem preferido

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se o Supabase está configurado corretamente
2. Consulte o arquivo `supabase-setup.md`
3. Abra uma issue no repositório

---

**Desenvolvido com ❤️ para facilitar o aprendizado** 