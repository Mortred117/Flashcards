# Setup do Supabase para Flashcards App

## Configuração Inicial

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Vá para Settings > API e copie:
   - Project URL
   - anon public key

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## Script SQL Completo para Configuração

Execute este script completo no **SQL Editor** do Supabase para configurar tudo de uma vez:

```sql
-- ========================================
-- CONFIGURAÇÃO COMPLETA DO SUPABASE
-- ========================================

-- 1. CRIAR TABELAS
-- ========================================

-- Tabela de Decks (Baralhos)
CREATE TABLE IF NOT EXISTS decks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Cards (Flashcards)
CREATE TABLE IF NOT EXISTS cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('fácil', 'médio', 'difícil')),
  review_count INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR ÍNDICES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_decks_user_id ON decks(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);

-- 3. HABILITAR RLS E CRIAR POLÍTICAS
-- ========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Políticas para decks
DROP POLICY IF EXISTS "Allow all access to decks" ON decks;
CREATE POLICY "Allow all access to decks" ON decks FOR ALL USING (true);

-- Políticas para cards
DROP POLICY IF EXISTS "Allow all access to cards" ON cards;
CREATE POLICY "Allow all access to cards" ON cards FOR ALL USING (true);

-- 4. CRIAR FUNÇÕES E TRIGGERS
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_decks_updated_at ON decks;
CREATE TRIGGER update_decks_updated_at BEFORE UPDATE ON decks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. DADOS DE TESTE (OPCIONAL)
-- ========================================

-- Inserir dados de teste
INSERT INTO decks (name, description, user_id) 
VALUES ('Deck de Teste', 'Um deck para testar a aplicação', 'temp-user')
ON CONFLICT DO NOTHING;

INSERT INTO cards (deck_id, front, back, category, difficulty) 
VALUES (
  (SELECT id FROM decks WHERE name = 'Deck de Teste' LIMIT 1),
  'Qual é a capital do Brasil?',
  'Brasília',
  'Geografia',
  'fácil'
)
ON CONFLICT DO NOTHING;

-- ========================================
-- CONFIGURAÇÃO CONCLUÍDA!
-- ========================================
```

**Como executar:**

1. Vá para o dashboard do Supabase
2. Clique em **SQL Editor** no menu lateral
3. Clique em **"New query"**
4. Cole todo o script acima
5. Clique em **"Run"**

Após executar este script, tudo estará configurado corretamente, incluindo:
- Todas as tabelas necessárias para flashcards
- Índices para performance
- Políticas de segurança
- Triggers para atualização automática
- Dados de teste

## Próximos Passos

1. Configure autenticação de usuários (opcional)
2. Implemente políticas de segurança mais restritivas
3. Configure backup automático
4. Configure monitoramento e logs

## Notas Importantes

- As políticas de segurança atuais permitem acesso total aos dados (não recomendado para produção)
- O `user_id` está sendo usado como 'temp-user' para todos os registros
- Em produção, implemente autenticação real e políticas de segurança adequadas
- Considere implementar soft delete para não perder dados importantes