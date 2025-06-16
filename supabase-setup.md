# Configuração do Supabase

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha as informações do projeto:
   - **Name**: Flashcards App
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a região mais próxima

## 2. Configurar as tabelas

Após criar o projeto, execute os seguintes comandos SQL no SQL Editor do Supabase:

### Tabela `decks`
```sql
CREATE TABLE decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `cards`
```sql
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  difficulty TEXT DEFAULT 'médio' CHECK (difficulty IN ('fácil', 'médio', 'difícil')),
  review_count INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Índices para performance
```sql
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_cards_deck_id ON cards(deck_id);
```

## 3. Configurar Row Level Security (RLS)

### Política para decks
```sql
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own decks" ON decks
  FOR SELECT USING (user_id = 'temp-user');

CREATE POLICY "Users can insert their own decks" ON decks
  FOR INSERT WITH CHECK (user_id = 'temp-user');

CREATE POLICY "Users can update their own decks" ON decks
  FOR UPDATE USING (user_id = 'temp-user');

CREATE POLICY "Users can delete their own decks" ON decks
  FOR DELETE USING (user_id = 'temp-user');
```

### Política para cards
```sql
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cards from their decks" ON cards
  FOR SELECT USING (
    deck_id IN (SELECT id FROM decks WHERE user_id = 'temp-user')
  );

CREATE POLICY "Users can insert cards to their decks" ON cards
  FOR INSERT WITH CHECK (
    deck_id IN (SELECT id FROM decks WHERE user_id = 'temp-user')
  );

CREATE POLICY "Users can update cards from their decks" ON cards
  FOR UPDATE USING (
    deck_id IN (SELECT id FROM decks WHERE user_id = 'temp-user')
  );

CREATE POLICY "Users can delete cards from their decks" ON cards
  FOR DELETE USING (
    deck_id IN (SELECT id FROM decks WHERE user_id = 'temp-user')
  );
```

## 4. Obter credenciais

1. No dashboard do Supabase, vá em **Settings** > **API**
2. Copie:
   - **Project URL** (será o valor de `VITE_SUPABASE_URL`)
   - **anon public** key (será o valor de `VITE_SUPABASE_ANON_KEY`)

## 5. Configurar variáveis de ambiente

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as seguintes linhas:

```env
VITE_SUPABASE_URL=sua_url_do_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase_aqui
```

## 6. Testar a conexão

1. Execute `npm run dev` para iniciar o servidor de desenvolvimento
2. Abra o app no navegador
3. Verifique se o ícone do banco de dados (Database) aparece no cabeçalho
4. Tente criar um novo baralho para testar a conexão

## Notas importantes

- O app usa `temp-user` como ID de usuário temporário
- Para implementar autenticação real, você precisará configurar o Supabase Auth
- Os dados são salvos automaticamente no Supabase quando configurado
- Se o Supabase não estiver configurado, o app usa localStorage como fallback 