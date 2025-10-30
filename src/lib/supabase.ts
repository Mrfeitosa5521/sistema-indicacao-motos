import { createClient } from '@supabase/supabase-js'

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Criar cliente apenas se as variáveis estiverem definidas
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Função helper para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabase)
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'vendedor' | 'indicador'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'vendedor' | 'indicador'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'vendedor' | 'indicador'
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          nome: string
          email: string
          telefone: string
          cpf: string
          renda: number
          interesse_moto: string
          valor_entrada: number
          indicador_id: string
          vendedor_id: string | null
          status: 'novo' | 'em_atendimento' | 'simulacao_feita' | 'vendido' | 'perdido'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          telefone: string
          cpf: string
          renda: number
          interesse_moto: string
          valor_entrada: number
          indicador_id: string
          vendedor_id?: string | null
          status?: 'novo' | 'em_atendimento' | 'simulacao_feita' | 'vendido' | 'perdido'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          telefone?: string
          cpf?: string
          renda?: number
          interesse_moto?: string
          valor_entrada?: number
          indicador_id?: string
          vendedor_id?: string | null
          status?: 'novo' | 'em_atendimento' | 'simulacao_feita' | 'vendido' | 'perdido'
          created_at?: string
          updated_at?: string
        }
      }
      simulacoes: {
        Row: {
          id: string
          lead_id: string
          vendedor_id: string
          valor_moto: number
          valor_entrada: number
          valor_financiado: number
          parcelas: number
          valor_parcela: number
          taxa_juros: number
          aprovado: boolean | null
          observacoes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          vendedor_id: string
          valor_moto: number
          valor_entrada: number
          valor_financiado: number
          parcelas: number
          valor_parcela: number
          taxa_juros: number
          aprovado?: boolean | null
          observacoes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          vendedor_id?: string
          valor_moto?: number
          valor_entrada?: number
          valor_financiado?: number
          parcelas?: number
          valor_parcela?: number
          taxa_juros?: number
          aprovado?: boolean | null
          observacoes?: string | null
          created_at?: string
        }
      }
      comissoes: {
        Row: {
          id: string
          indicador_id: string
          vendedor_id: string
          lead_id: string
          valor_venda: number
          percentual_indicador: number
          percentual_vendedor: number
          valor_comissao_indicador: number
          valor_comissao_vendedor: number
          pago: boolean
          created_at: string
        }
        Insert: {
          id?: string
          indicador_id: string
          vendedor_id: string
          lead_id: string
          valor_venda: number
          percentual_indicador: number
          percentual_vendedor: number
          valor_comissao_indicador: number
          valor_comissao_vendedor: number
          pago?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          indicador_id?: string
          vendedor_id?: string
          lead_id?: string
          valor_venda?: number
          percentual_indicador?: number
          percentual_vendedor?: number
          valor_comissao_indicador?: number
          valor_comissao_vendedor?: number
          pago?: boolean
          created_at?: string
        }
      }
    }
  }
}