# 📚 Flashcards & Quiz App

Um aplicativo moderno de flashcards e quizzes, construído com React, TypeScript e Supabase.

## ✨ Funcionalidades

### 📖 Flashcards
- Criar e gerenciar baralhos de flashcards
- Estudo interativo com cartas que viram
- Estatísticas de progresso
- Importação de baralhos via CSV/JSON
- Categorização e níveis de dificuldade

### 📝 Quiz
- Criar quizzes com múltipla escolha
- Configurar tempo limite e nota de aprovação
- Adicionar explicações para respostas
- Categorizar questões por tema
- Importação via JSON com preview
- Resultados detalhados com estatísticas
- Navegação entre questões
- Timer com avisos visuais

### ☁️ Armazenamento em Nuvem
- Sincronização automática com Supabase
- Backup seguro dos dados
- Acesso de qualquer dispositivo

## 🚀 Como Usar

### 1. Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Execute os comandos SQL do arquivo `supabase-setup.md` no SQL Editor
4. Copie as credenciais do projeto (Settings > API)

### 2. Configuração Local

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd Flashcards

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp config.env .env
# Edite o arquivo .env com suas credenciais do Supabase

# Inicie o servidor de desenvolvimento
npm run dev
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── DeckList.tsx    # Lista de baralhos
│   ├── DeckEditor.tsx  # Editor de baralhos
│   ├── StudySession.tsx # Sessão de estudo
│   ├── QuizList.tsx    # Lista de quizzes
│   ├── QuizEditor.tsx  # Editor de quizzes
│   ├── QuizSession.tsx # Execução do quiz
│   ├── ImportModal.tsx # Importação de flashcards
│   └── QuizImportModal.tsx # Importação de quizzes
├── services/
│   └── supabaseService.ts # Serviços do Supabase
├── types.ts            # Definições de tipos
└── App.tsx             # Componente principal
```

## 🎯 Como Usar

### Flashcards

1. **Criar um Baralho**: Clique em "Novo Deck" e adicione cartas
2. **Estudar**: Selecione um baralho e clique em "Estudar"
3. **Importar**: Use o botão "Importar" para carregar baralhos existentes

### Quiz

1. **Navegar para Quiz**: Clique no botão "📝 Quiz" no cabeçalho
2. **Criar Quiz**: Clique em "Novo Quiz" para criar um novo
3. **Configurar Quiz**: Defina título, descrição, tempo limite e nota mínima
4. **Adicionar Questões**: Crie questões de múltipla escolha
5. **Configurar Alternativas**: Defina as alternativas e marque a correta
6. **Adicionar Explicações**: Inclua explicações opcionais
7. **Fazer Quiz**: Clique em "Fazer Quiz" para iniciar
8. **Ver Resultados**: Analise os resultados detalhados

## 📊 Formatos de Importação

### Flashcards (CSV)
```csv
front,back,category,difficulty
"Pergunta 1","Resposta 1","Geral","fácil"
"Pergunta 2","Resposta 2","História","médio"
```

### Quiz (JSON)
```json
{
  "title": "Quiz de Conhecimentos Gerais",
  "description": "Um quiz com questões variadas",
  "timeLimit": 15,
  "passingScore": 70,
  "questions": [
    {
      "question": "Qual é a capital do Brasil?",
      "alternatives": [
        "São Paulo",
        "Rio de Janeiro", 
        "Brasília",
        "Salvador"
      ],
      "correctAnswer": "Brasília",
      "explanation": "Brasília foi inaugurada em 1960",
      "category": "Geografia",
      "difficulty": "fácil"
    }
  ]
}
```

**Exemplo completo**: Veja `examples/quiz-example.json`

## 🛠️ Tecnologias

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Estilização**: CSS3 com design responsivo
- **Deploy**: Vercel, Netlify ou similar

## 🔧 Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático

## 🔒 Segurança

- Todas as operações são validadas no frontend e backend
- Dados são armazenados de forma segura no Supabase
- Políticas de segurança configuráveis
- Backup automático dos dados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se o Supabase está configurado corretamente
2. Confirme se as variáveis de ambiente estão definidas
3. Verifique os logs do console do navegador
4. Abra uma issue no GitHub

## 🎉 Agradecimentos

- Supabase pela infraestrutura
- React e TypeScript pelas ferramentas
- Comunidade open source pelo suporte 