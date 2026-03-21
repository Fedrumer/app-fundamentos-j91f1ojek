// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          banco: string | null
          banco_branch: string | null
          cbu: string | null
          codigo: string
          condicao_fiscal: string | null
          created_at: string | null
          cuit: string | null
          data_inicio_faturamento: string | null
          data_registro: string | null
          data_ultimo_fechamento: string | null
          endereco_calle: string | null
          endereco_cep: string | null
          endereco_numero: string | null
          id: string
          id_agencia_mae: string | null
          nome_fantasia: string
          nome_legal: string | null
          numero_conta: string | null
          pais: string | null
          parametro_recorrencia: string | null
          parent_agency_code: string | null
          percentual_comissao: number
          politica_fatura_auto: boolean | null
          tipo_conta: string | null
          tipo_recorrencia: string | null
          titular_conta: string | null
          updated_at: string | null
        }
        Insert: {
          banco?: string | null
          banco_branch?: string | null
          cbu?: string | null
          codigo: string
          condicao_fiscal?: string | null
          created_at?: string | null
          cuit?: string | null
          data_inicio_faturamento?: string | null
          data_registro?: string | null
          data_ultimo_fechamento?: string | null
          endereco_calle?: string | null
          endereco_cep?: string | null
          endereco_numero?: string | null
          id?: string
          id_agencia_mae?: string | null
          nome_fantasia: string
          nome_legal?: string | null
          numero_conta?: string | null
          pais?: string | null
          parametro_recorrencia?: string | null
          parent_agency_code?: string | null
          percentual_comissao?: number
          politica_fatura_auto?: boolean | null
          tipo_conta?: string | null
          tipo_recorrencia?: string | null
          titular_conta?: string | null
          updated_at?: string | null
        }
        Update: {
          banco?: string | null
          banco_branch?: string | null
          cbu?: string | null
          codigo?: string
          condicao_fiscal?: string | null
          created_at?: string | null
          cuit?: string | null
          data_inicio_faturamento?: string | null
          data_registro?: string | null
          data_ultimo_fechamento?: string | null
          endereco_calle?: string | null
          endereco_cep?: string | null
          endereco_numero?: string | null
          id?: string
          id_agencia_mae?: string | null
          nome_fantasia?: string
          nome_legal?: string | null
          numero_conta?: string | null
          pais?: string | null
          parametro_recorrencia?: string | null
          parent_agency_code?: string | null
          percentual_comissao?: number
          politica_fatura_auto?: boolean | null
          tipo_conta?: string | null
          tipo_recorrencia?: string | null
          titular_conta?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agencies_id_agencia_mae_fkey"
            columns: ["id_agencia_mae"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          created_at: string | null
          id: string
          message: string
          timestamp: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          timestamp?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          timestamp?: string | null
          type?: string
        }
        Relationships: []
      }
      audit_log_comissoes: {
        Row: {
          acao: string
          created_at: string | null
          dados_antes: Json | null
          dados_depois: Json | null
          entidade: string
          entidade_id: string
          executado_por: string
          id: string
          motivo: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          dados_antes?: Json | null
          dados_depois?: Json | null
          entidade: string
          entidade_id: string
          executado_por: string
          id?: string
          motivo: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          dados_antes?: Json | null
          dados_depois?: Json | null
          entidade?: string
          entidade_id?: string
          executado_por?: string
          id?: string
          motivo?: string
        }
        Relationships: []
      }
      faturamento_net: {
        Row: {
          comissao: number
          created_at: string | null
          data_evento: string | null
          data_lock: string | null
          data_pagamento: string | null
          id: string
          id_agencia: string
          id_fatura: string | null
          id_voucher: string
          modelo_faturamento: string | null
          nome_agencia_origem: string | null
          periodo_apuracao: string
          status_pagamento: string
          tipo: string
          tipo_comissao: string | null
          tipo_lancamento: string | null
          updated_at: string | null
          valor_bruto: number
          valor_repasse: number
        }
        Insert: {
          comissao?: number
          created_at?: string | null
          data_evento?: string | null
          data_lock?: string | null
          data_pagamento?: string | null
          id?: string
          id_agencia: string
          id_fatura?: string | null
          id_voucher: string
          modelo_faturamento?: string | null
          nome_agencia_origem?: string | null
          periodo_apuracao: string
          status_pagamento: string
          tipo: string
          tipo_comissao?: string | null
          tipo_lancamento?: string | null
          updated_at?: string | null
          valor_bruto?: number
          valor_repasse?: number
        }
        Update: {
          comissao?: number
          created_at?: string | null
          data_evento?: string | null
          data_lock?: string | null
          data_pagamento?: string | null
          id?: string
          id_agencia?: string
          id_fatura?: string | null
          id_voucher?: string
          modelo_faturamento?: string | null
          nome_agencia_origem?: string | null
          periodo_apuracao?: string
          status_pagamento?: string
          tipo?: string
          tipo_comissao?: string | null
          tipo_lancamento?: string | null
          updated_at?: string | null
          valor_bruto?: number
          valor_repasse?: number
        }
        Relationships: [
          {
            foreignKeyName: "faturamento_net_id_agencia_fkey"
            columns: ["id_agencia"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faturamento_net_id_fatura_fkey"
            columns: ["id_fatura"]
            isOneToOne: false
            referencedRelation: "faturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faturamento_net_id_voucher_fkey"
            columns: ["id_voucher"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      faturas: {
        Row: {
          created_at: string | null
          data_corte: string
          data_inicio_periodo: string | null
          data_lock: string | null
          fechado_por: string | null
          id: string
          id_agencia: string
          posicao_gross: number
          posicao_net: number
          saldo_final: number
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_corte: string
          data_inicio_periodo?: string | null
          data_lock?: string | null
          fechado_por?: string | null
          id?: string
          id_agencia: string
          posicao_gross?: number
          posicao_net?: number
          saldo_final?: number
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_corte?: string
          data_inicio_periodo?: string | null
          data_lock?: string | null
          fechado_por?: string | null
          id?: string
          id_agencia?: string
          posicao_gross?: number
          posicao_net?: number
          saldo_final?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faturas_id_agencia_fkey"
            columns: ["id_agencia"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      periods: {
        Row: {
          created_at: string | null
          id: string
          is_closed: boolean | null
          label: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_closed?: boolean | null
          label: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_closed?: boolean | null
          label?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      process_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          entity_type: string
          fonte_origen: string
          id: string
          status: string
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          entity_type: string
          fonte_origen: string
          id?: string
          status: string
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          entity_type?: string
          fonte_origen?: string
          id?: string
          status?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      transaction_logs: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          status: string
          timestamp: string | null
          voucher_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          status: string
          timestamp?: string | null
          voucher_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          status?: string
          timestamp?: string | null
          voucher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_logs_voucher_id_fkey"
            columns: ["voucher_id"]
            isOneToOne: false
            referencedRelation: "vouchers"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          canal: string | null
          cliente: string
          codigo_autorizacao: string | null
          codigo_desconto: string | null
          cortesia: boolean | null
          created_at: string | null
          data_criacao: string
          desconto_aplicado: number
          destination_country: string | null
          flag_pre_venda: boolean | null
          id: string
          id_agencia: string
          installments: number | null
          monto: number
          numero: string
          numero_cartao: string | null
          numero_operacao: string | null
          origin_country: string | null
          passengers: Json | null
          payment_gateway: string | null
          periodo_apuracao: string
          periodo_fechado: boolean | null
          preco_lista: number
          preco_local: number
          product_code: string
          status_original: string
          tipo_viagem: string | null
          updated_at: string | null
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          canal?: string | null
          cliente: string
          codigo_autorizacao?: string | null
          codigo_desconto?: string | null
          cortesia?: boolean | null
          created_at?: string | null
          data_criacao: string
          desconto_aplicado?: number
          destination_country?: string | null
          flag_pre_venda?: boolean | null
          id?: string
          id_agencia: string
          installments?: number | null
          monto?: number
          numero: string
          numero_cartao?: string | null
          numero_operacao?: string | null
          origin_country?: string | null
          passengers?: Json | null
          payment_gateway?: string | null
          periodo_apuracao: string
          periodo_fechado?: boolean | null
          preco_lista?: number
          preco_local?: number
          product_code: string
          status_original: string
          tipo_viagem?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          canal?: string | null
          cliente?: string
          codigo_autorizacao?: string | null
          codigo_desconto?: string | null
          cortesia?: boolean | null
          created_at?: string | null
          data_criacao?: string
          desconto_aplicado?: number
          destination_country?: string | null
          flag_pre_venda?: boolean | null
          id?: string
          id_agencia?: string
          installments?: number | null
          monto?: number
          numero?: string
          numero_cartao?: string | null
          numero_operacao?: string | null
          origin_country?: string | null
          passengers?: Json | null
          payment_gateway?: string | null
          periodo_apuracao?: string
          periodo_fechado?: boolean | null
          preco_lista?: number
          preco_local?: number
          product_code?: string
          status_original?: string
          tipo_viagem?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_id_agencia_fkey"
            columns: ["id_agencia"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: agencies
//   id: uuid (not null, default: gen_random_uuid())
//   nome_fantasia: text (not null)
//   nome_legal: text (nullable)
//   codigo: text (not null)
//   parent_agency_code: text (nullable)
//   id_agencia_mae: uuid (nullable)
//   pais: text (nullable)
//   data_registro: timestamp with time zone (nullable)
//   cuit: text (nullable)
//   condicao_fiscal: text (nullable)
//   banco: text (nullable)
//   banco_branch: text (nullable)
//   tipo_conta: text (nullable)
//   numero_conta: text (nullable)
//   cbu: text (nullable)
//   titular_conta: text (nullable)
//   endereco_calle: text (nullable)
//   endereco_numero: text (nullable)
//   endereco_cep: text (nullable)
//   percentual_comissao: numeric (not null, default: 0)
//   tipo_recorrencia: text (nullable)
//   parametro_recorrencia: text (nullable)
//   politica_fatura_auto: boolean (nullable, default: false)
//   data_inicio_faturamento: timestamp with time zone (nullable)
//   data_ultimo_fechamento: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: alerts
//   id: uuid (not null, default: gen_random_uuid())
//   type: text (not null)
//   message: text (not null)
//   timestamp: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())
// Table: audit_log_comissoes
//   id: uuid (not null, default: gen_random_uuid())
//   entidade: text (not null)
//   entidade_id: uuid (not null)
//   acao: text (not null)
//   dados_antes: jsonb (nullable)
//   dados_depois: jsonb (nullable)
//   executado_por: text (not null)
//   motivo: text (not null)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: faturamento_net
//   id: uuid (not null, default: gen_random_uuid())
//   id_voucher: uuid (not null)
//   id_agencia: uuid (not null)
//   valor_bruto: numeric (not null, default: 0)
//   comissao: numeric (not null, default: 0)
//   valor_repasse: numeric (not null, default: 0)
//   periodo_apuracao: text (not null)
//   status_pagamento: text (not null)
//   data_lock: timestamp with time zone (nullable)
//   data_pagamento: timestamp with time zone (nullable)
//   tipo: text (not null)
//   id_fatura: uuid (nullable)
//   modelo_faturamento: text (nullable)
//   tipo_lancamento: text (nullable)
//   tipo_comissao: text (nullable)
//   nome_agencia_origem: text (nullable)
//   data_evento: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: faturas
//   id: uuid (not null, default: gen_random_uuid())
//   id_agencia: uuid (not null)
//   data_corte: timestamp with time zone (not null)
//   data_inicio_periodo: timestamp with time zone (nullable)
//   status: text (not null)
//   posicao_gross: numeric (not null, default: 0)
//   posicao_net: numeric (not null, default: 0)
//   saldo_final: numeric (not null, default: 0)
//   data_lock: timestamp with time zone (nullable)
//   fechado_por: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: periods
//   id: text (not null)
//   label: text (not null)
//   is_closed: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: process_logs
//   id: uuid (not null, default: gen_random_uuid())
//   timestamp: timestamp with time zone (nullable, default: now())
//   fonte_origen: text (not null)
//   entity_type: text (not null)
//   status: text (not null)
//   details: jsonb (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: transaction_logs
//   id: uuid (not null, default: gen_random_uuid())
//   voucher_id: uuid (not null)
//   amount: numeric (not null)
//   status: text (not null)
//   timestamp: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())
// Table: vouchers
//   id: uuid (not null, default: gen_random_uuid())
//   numero: text (not null)
//   id_agencia: uuid (not null)
//   cliente: text (not null)
//   canal: text (nullable)
//   status_original: text (not null)
//   data_criacao: timestamp with time zone (not null)
//   valid_from: timestamp with time zone (nullable)
//   valid_to: timestamp with time zone (nullable)
//   tipo_viagem: text (nullable)
//   origin_country: text (nullable)
//   destination_country: text (nullable)
//   product_code: text (not null)
//   preco_lista: numeric (not null, default: 0)
//   preco_local: numeric (not null, default: 0)
//   monto: numeric (not null, default: 0)
//   desconto_aplicado: numeric (not null, default: 0)
//   codigo_desconto: text (nullable)
//   payment_gateway: text (nullable)
//   numero_operacao: text (nullable)
//   codigo_autorizacao: text (nullable)
//   numero_cartao: text (nullable)
//   installments: integer (nullable)
//   flag_pre_venda: boolean (nullable, default: false)
//   cortesia: boolean (nullable, default: false)
//   periodo_apuracao: text (not null)
//   periodo_fechado: boolean (nullable, default: false)
//   passengers: jsonb (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: agencies
//   UNIQUE agencies_codigo_key: UNIQUE (codigo)
//   FOREIGN KEY agencies_id_agencia_mae_fkey: FOREIGN KEY (id_agencia_mae) REFERENCES agencies(id) ON DELETE SET NULL
//   PRIMARY KEY agencies_pkey: PRIMARY KEY (id)
// Table: alerts
//   PRIMARY KEY alerts_pkey: PRIMARY KEY (id)
// Table: audit_log_comissoes
//   PRIMARY KEY audit_log_comissoes_pkey: PRIMARY KEY (id)
// Table: faturamento_net
//   FOREIGN KEY faturamento_net_id_agencia_fkey: FOREIGN KEY (id_agencia) REFERENCES agencies(id) ON DELETE CASCADE
//   FOREIGN KEY faturamento_net_id_fatura_fkey: FOREIGN KEY (id_fatura) REFERENCES faturas(id) ON DELETE SET NULL
//   FOREIGN KEY faturamento_net_id_voucher_fkey: FOREIGN KEY (id_voucher) REFERENCES vouchers(id) ON DELETE CASCADE
//   PRIMARY KEY faturamento_net_pkey: PRIMARY KEY (id)
// Table: faturas
//   FOREIGN KEY faturas_id_agencia_fkey: FOREIGN KEY (id_agencia) REFERENCES agencies(id) ON DELETE CASCADE
//   PRIMARY KEY faturas_pkey: PRIMARY KEY (id)
// Table: periods
//   PRIMARY KEY periods_pkey: PRIMARY KEY (id)
// Table: process_logs
//   PRIMARY KEY process_logs_pkey: PRIMARY KEY (id)
// Table: transaction_logs
//   PRIMARY KEY transaction_logs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY transaction_logs_voucher_id_fkey: FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE
// Table: vouchers
//   FOREIGN KEY vouchers_id_agencia_fkey: FOREIGN KEY (id_agencia) REFERENCES agencies(id) ON DELETE CASCADE
//   UNIQUE vouchers_numero_key: UNIQUE (numero)
//   PRIMARY KEY vouchers_pkey: PRIMARY KEY (id)

// --- INDEXES ---
// Table: agencies
//   CREATE UNIQUE INDEX agencies_codigo_key ON public.agencies USING btree (codigo)
// Table: vouchers
//   CREATE UNIQUE INDEX vouchers_numero_key ON public.vouchers USING btree (numero)

