import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// Você precisará substituir essas variáveis pelas suas credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug: verificar se as variáveis estão sendo lidas
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'PRESENTE' : 'AUSENTE');

// Criar cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export interface Database {
  public: {
    Tables: {
      decks: {
        Row: {
          id: string;
          name: string;
          description: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          deck_id: string;
          front: string;
          back: string;
          category: string;
          difficulty: 'fácil' | 'médio' | 'difícil';
          review_count: number;
          correct_answers: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          deck_id: string;
          front: string;
          back: string;
          category: string;
          difficulty?: 'fácil' | 'médio' | 'difícil';
          review_count?: number;
          correct_answers?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          deck_id?: string;
          front?: string;
          back?: string;
          category?: string;
          difficulty?: 'fácil' | 'médio' | 'difícil';
          review_count?: number;
          correct_answers?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 