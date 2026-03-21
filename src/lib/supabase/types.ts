// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      agencias: {
        Row: {
          codigo: string | null
          created_at: string | null
          data_inicio_faturamento: string | null
          data_ultimo_fechamento: string | null
          id: string
          id_agencia_pai: string | null
          moeda_padrao: string | null
          nivel: string | null
          nome_fantasia: string | null
          nome_legal: string | null
          pais: string | null
          percentual_comissao: number | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          data_inicio_faturamento?: string | null
          data_ultimo_fechamento?: string | null
          id?: string
          id_agencia_pai?: string | null
          moeda_padrao?: string | null
          nivel?: string | null
          nome_fantasia?: string | null
          nome_legal?: string | null
          pais?: string | null
          percentual_comissao?: number | null
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          data_inicio_faturamento?: string | null
          data_ultimo_fechamento?: string | null
          id?: string
          id_agencia_pai?: string | null
          moeda_padrao?: string | null
          nivel?: string | null
          nome_fantasia?: string | null
          nome_legal?: string | null
          pais?: string | null
          percentual_comissao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'agencias_id_agencia_pai_fkey'
            columns: ['id_agencia_pai']
            isOneToOne: false
            referencedRelation: 'agencias'
            referencedColumns: ['id']
          },
        ]
      }
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
            foreignKeyName: 'agencies_id_agencia_mae_fkey'
            columns: ['id_agencia_mae']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
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
      audit_reclassificacao: {
        Row: {
          classificado_em: string | null
          classificado_por: string | null
          created_at: string | null
          id: string
          id_voucher: string | null
          motivo: string | null
          tipo_anterior: string | null
          tipo_novo: string | null
        }
        Insert: {
          classificado_em?: string | null
          classificado_por?: string | null
          created_at?: string | null
          id?: string
          id_voucher?: string | null
          motivo?: string | null
          tipo_anterior?: string | null
          tipo_novo?: string | null
        }
        Update: {
          classificado_em?: string | null
          classificado_por?: string | null
          created_at?: string | null
          id?: string
          id_voucher?: string | null
          motivo?: string | null
          tipo_anterior?: string | null
          tipo_novo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_reclassificacao_classificado_por_fkey'
            columns: ['classificado_por']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_reclassificacao_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'audit_reclassificacao_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers_vigentes'
            referencedColumns: ['id']
          },
        ]
      }
      contratos_pre_venda: {
        Row: {
          created_at: string | null
          data_validade: string | null
          dias_consumidos: number | null
          dias_iniciais: number | null
          id: string
          id_agencia: string | null
          id_produto: string | null
          moeda: string | null
          pais: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          data_validade?: string | null
          dias_consumidos?: number | null
          dias_iniciais?: number | null
          id?: string
          id_agencia?: string | null
          id_produto?: string | null
          moeda?: string | null
          pais?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          data_validade?: string | null
          dias_consumidos?: number | null
          dias_iniciais?: number | null
          id?: string
          id_agencia?: string | null
          id_produto?: string | null
          moeda?: string | null
          pais?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'contratos_pre_venda_id_agencia_fkey'
            columns: ['id_agencia']
            isOneToOne: false
            referencedRelation: 'agencias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'contratos_pre_venda_id_produto_fkey'
            columns: ['id_produto']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
      extrato_pre_venda: {
        Row: {
          created_at: string | null
          data_movimento: string | null
          dias_consumidos: number | null
          id: string
          id_contrato: string | null
          id_voucher: string | null
          tipo_movimento: string | null
        }
        Insert: {
          created_at?: string | null
          data_movimento?: string | null
          dias_consumidos?: number | null
          id?: string
          id_contrato?: string | null
          id_voucher?: string | null
          tipo_movimento?: string | null
        }
        Update: {
          created_at?: string | null
          data_movimento?: string | null
          dias_consumidos?: number | null
          id?: string
          id_contrato?: string | null
          id_voucher?: string | null
          tipo_movimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'extrato_pre_venda_id_contrato_fkey'
            columns: ['id_contrato']
            isOneToOne: false
            referencedRelation: 'contratos_pre_venda'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'extrato_pre_venda_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'extrato_pre_venda_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers_vigentes'
            referencedColumns: ['id']
          },
        ]
      }
      faturamento_net: {
        Row: {
          comissao: number
          created_at: string | null
          data_evento: string | null
          data_lock: string | null
          data_pagamento: string | null
          data_vencimento_quitacao: string | null
          id: string
          id_agencia: string
          id_agencia_recebedora: string | null
          id_agencia_vendedora: string | null
          id_fatura: string | null
          id_lancamento_origem: string | null
          id_voucher: string
          modelo_faturamento: string | null
          moeda: string | null
          nome_agencia_origem: string | null
          pais: string | null
          percentual_aplicado: number | null
          periodo_apuracao: string
          status_pagamento: string
          status_quitacao: string | null
          tipo: string
          tipo_comissao: string | null
          tipo_lancamento: string | null
          updated_at: string | null
          valor_bruto: number
          valor_moeda_nativa: number | null
          valor_repasse: number
          versao_calculo: number | null
        }
        Insert: {
          comissao?: number
          created_at?: string | null
          data_evento?: string | null
          data_lock?: string | null
          data_pagamento?: string | null
          data_vencimento_quitacao?: string | null
          id?: string
          id_agencia: string
          id_agencia_recebedora?: string | null
          id_agencia_vendedora?: string | null
          id_fatura?: string | null
          id_lancamento_origem?: string | null
          id_voucher: string
          modelo_faturamento?: string | null
          moeda?: string | null
          nome_agencia_origem?: string | null
          pais?: string | null
          percentual_aplicado?: number | null
          periodo_apuracao: string
          status_pagamento: string
          status_quitacao?: string | null
          tipo: string
          tipo_comissao?: string | null
          tipo_lancamento?: string | null
          updated_at?: string | null
          valor_bruto?: number
          valor_moeda_nativa?: number | null
          valor_repasse?: number
          versao_calculo?: number | null
        }
        Update: {
          comissao?: number
          created_at?: string | null
          data_evento?: string | null
          data_lock?: string | null
          data_pagamento?: string | null
          data_vencimento_quitacao?: string | null
          id?: string
          id_agencia?: string
          id_agencia_recebedora?: string | null
          id_agencia_vendedora?: string | null
          id_fatura?: string | null
          id_lancamento_origem?: string | null
          id_voucher?: string
          modelo_faturamento?: string | null
          moeda?: string | null
          nome_agencia_origem?: string | null
          pais?: string | null
          percentual_aplicado?: number | null
          periodo_apuracao?: string
          status_pagamento?: string
          status_quitacao?: string | null
          tipo?: string
          tipo_comissao?: string | null
          tipo_lancamento?: string | null
          updated_at?: string | null
          valor_bruto?: number
          valor_moeda_nativa?: number | null
          valor_repasse?: number
          versao_calculo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'faturamento_net_id_agencia_fkey'
            columns: ['id_agencia']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'faturamento_net_id_agencia_recebedora_fkey'
            columns: ['id_agencia_recebedora']
            isOneToOne: false
            referencedRelation: 'agencias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'faturamento_net_id_agencia_vendedora_fkey'
            columns: ['id_agencia_vendedora']
            isOneToOne: false
            referencedRelation: 'agencias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'faturamento_net_id_fatura_fkey'
            columns: ['id_fatura']
            isOneToOne: false
            referencedRelation: 'faturas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'faturamento_net_id_lancamento_origem_fkey'
            columns: ['id_lancamento_origem']
            isOneToOne: false
            referencedRelation: 'faturamento_net'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'faturamento_net_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'faturamento_net_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers_vigentes'
            referencedColumns: ['id']
          },
        ]
      }
      faturas: {
        Row: {
          competencia_ano: number | null
          competencia_mes: number | null
          created_at: string | null
          data_corte: string
          data_inicio_periodo: string | null
          data_lock: string | null
          fechado_por: string | null
          id: string
          id_agencia: string
          moeda: string | null
          pais: string | null
          posicao_gross: number
          posicao_net: number
          saldo_final: number
          status: string
          status_lock: boolean | null
          updated_at: string | null
        }
        Insert: {
          competencia_ano?: number | null
          competencia_mes?: number | null
          created_at?: string | null
          data_corte: string
          data_inicio_periodo?: string | null
          data_lock?: string | null
          fechado_por?: string | null
          id?: string
          id_agencia: string
          moeda?: string | null
          pais?: string | null
          posicao_gross?: number
          posicao_net?: number
          saldo_final?: number
          status: string
          status_lock?: boolean | null
          updated_at?: string | null
        }
        Update: {
          competencia_ano?: number | null
          competencia_mes?: number | null
          created_at?: string | null
          data_corte?: string
          data_inicio_periodo?: string | null
          data_lock?: string | null
          fechado_por?: string | null
          id?: string
          id_agencia?: string
          moeda?: string | null
          pais?: string | null
          posicao_gross?: number
          posicao_net?: number
          saldo_final?: number
          status?: string
          status_lock?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'faturas_id_agencia_fkey'
            columns: ['id_agencia']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
        ]
      }
      grupos_produtos: {
        Row: {
          created_at: string | null
          e_pre_venda: boolean | null
          id: string
          moeda_cadastro: string | null
          nome: string | null
          pais: string | null
          percentual_comissao_maximo: number | null
          tem_tarifa_net: boolean | null
        }
        Insert: {
          created_at?: string | null
          e_pre_venda?: boolean | null
          id?: string
          moeda_cadastro?: string | null
          nome?: string | null
          pais?: string | null
          percentual_comissao_maximo?: number | null
          tem_tarifa_net?: boolean | null
        }
        Update: {
          created_at?: string | null
          e_pre_venda?: boolean | null
          id?: string
          moeda_cadastro?: string | null
          nome?: string | null
          pais?: string | null
          percentual_comissao_maximo?: number | null
          tem_tarifa_net?: boolean | null
        }
        Relationships: []
      }
      ingestao_logs: {
        Row: {
          created_at: string | null
          data_ingestao: string | null
          id: string
          id_usuario: string | null
          mensagem_erro: string | null
          moedas_processadas: string[] | null
          pais_processado: string | null
          quantidade_falhadas: number | null
          quantidade_registros: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          data_ingestao?: string | null
          id?: string
          id_usuario?: string | null
          mensagem_erro?: string | null
          moedas_processadas?: string[] | null
          pais_processado?: string | null
          quantidade_falhadas?: number | null
          quantidade_registros?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          data_ingestao?: string | null
          id?: string
          id_usuario?: string | null
          mensagem_erro?: string | null
          moedas_processadas?: string[] | null
          pais_processado?: string | null
          quantidade_falhadas?: number | null
          quantidade_registros?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ingestao_logs_id_usuario_fkey'
            columns: ['id_usuario']
            isOneToOne: false
            referencedRelation: 'usuarios'
            referencedColumns: ['id']
          },
        ]
      }
      passageiros: {
        Row: {
          contato_email: string | null
          contato_emergencia_nome: string | null
          contato_emergencia_telefone: string | null
          contato_telefone: string | null
          data_nascimento: string | null
          documento_numero: string | null
          documento_tipo: string | null
          id: string
          id_voucher: string
          nome: string | null
          ultima_atualizacao: string | null
          voucher_passenger_code: string | null
        }
        Insert: {
          contato_email?: string | null
          contato_emergencia_nome?: string | null
          contato_emergencia_telefone?: string | null
          contato_telefone?: string | null
          data_nascimento?: string | null
          documento_numero?: string | null
          documento_tipo?: string | null
          id?: string
          id_voucher: string
          nome?: string | null
          ultima_atualizacao?: string | null
          voucher_passenger_code?: string | null
        }
        Update: {
          contato_email?: string | null
          contato_emergencia_nome?: string | null
          contato_emergencia_telefone?: string | null
          contato_telefone?: string | null
          data_nascimento?: string | null
          documento_numero?: string | null
          documento_tipo?: string | null
          id?: string
          id_voucher?: string
          nome?: string | null
          ultima_atualizacao?: string | null
          voucher_passenger_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'passageiros_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'passageiros_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers_vigentes'
            referencedColumns: ['id']
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
      produtos: {
        Row: {
          created_at: string | null
          e_pre_venda: boolean | null
          id: string
          id_grupo: string | null
          nome: string | null
          tarifa_net: boolean | null
        }
        Insert: {
          created_at?: string | null
          e_pre_venda?: boolean | null
          id?: string
          id_grupo?: string | null
          nome?: string | null
          tarifa_net?: boolean | null
        }
        Update: {
          created_at?: string | null
          e_pre_venda?: boolean | null
          id?: string
          id_grupo?: string | null
          nome?: string | null
          tarifa_net?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'produtos_id_grupo_fkey'
            columns: ['id_grupo']
            isOneToOne: false
            referencedRelation: 'grupos_produtos'
            referencedColumns: ['id']
          },
        ]
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
            foreignKeyName: 'transaction_logs_voucher_id_fkey'
            columns: ['voucher_id']
            isOneToOne: false
            referencedRelation: 'vouchers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transaction_logs_voucher_id_fkey'
            columns: ['voucher_id']
            isOneToOne: false
            referencedRelation: 'vouchers_vigentes'
            referencedColumns: ['id']
          },
        ]
      }
      usuarios: {
        Row: {
          auth_user_id: string
          created_at: string | null
          id: string
          id_agencia: string | null
          moeda_padrao: string | null
          nivel: string | null
          nome: string | null
          pais: string | null
          perfil_admin: boolean | null
        }
        Insert: {
          auth_user_id: string
          created_at?: string | null
          id?: string
          id_agencia?: string | null
          moeda_padrao?: string | null
          nivel?: string | null
          nome?: string | null
          pais?: string | null
          perfil_admin?: boolean | null
        }
        Update: {
          auth_user_id?: string
          created_at?: string | null
          id?: string
          id_agencia?: string | null
          moeda_padrao?: string | null
          nivel?: string | null
          nome?: string | null
          pais?: string | null
          perfil_admin?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'usuarios_id_agencia_fkey'
            columns: ['id_agencia']
            isOneToOne: false
            referencedRelation: 'agencias'
            referencedColumns: ['id']
          },
        ]
      }
      variacoes_preco: {
        Row: {
          created_at: string | null
          destino: string | null
          faixa_etaria: string | null
          id: string
          id_produto: string | null
          preco_moeda_cadastro: number | null
        }
        Insert: {
          created_at?: string | null
          destino?: string | null
          faixa_etaria?: string | null
          id?: string
          id_produto?: string | null
          preco_moeda_cadastro?: number | null
        }
        Update: {
          created_at?: string | null
          destino?: string | null
          faixa_etaria?: string | null
          id?: string
          id_produto?: string | null
          preco_moeda_cadastro?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'variacoes_preco_id_produto_fkey'
            columns: ['id_produto']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
      voucher_processamentos: {
        Row: {
          created_at: string | null
          hash_input: string | null
          id: string
          id_voucher: string | null
          processado_em: string | null
          resultado_status: string | null
          status_voucher: string | null
          versao_calculo: number | null
        }
        Insert: {
          created_at?: string | null
          hash_input?: string | null
          id?: string
          id_voucher?: string | null
          processado_em?: string | null
          resultado_status?: string | null
          status_voucher?: string | null
          versao_calculo?: number | null
        }
        Update: {
          created_at?: string | null
          hash_input?: string | null
          id?: string
          id_voucher?: string | null
          processado_em?: string | null
          resultado_status?: string | null
          status_voucher?: string | null
          versao_calculo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'voucher_processamentos_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'voucher_processamentos_id_voucher_fkey'
            columns: ['id_voucher']
            isOneToOne: false
            referencedRelation: 'vouchers_vigentes'
            referencedColumns: ['id']
          },
        ]
      }
      vouchers: {
        Row: {
          agencia_atual: string | null
          agencia_original: string | null
          amount_paid: number | null
          canal: string | null
          cliente: string
          codigo_autorizacao: string | null
          codigo_desconto: string | null
          cortesia: boolean | null
          created_at: string | null
          data_criacao: string
          data_fim_viagem: string | null
          data_inicio_viagem: string | null
          data_vencimento_pagamento: string | null
          desconto_aplicado: number
          destination_country: string | null
          destino: string | null
          flag_pre_venda: boolean | null
          id: string
          id_agencia: string
          id_agencia_atual: string | null
          id_agencia_original: string | null
          id_produto: string | null
          installments: number | null
          moeda_monto: string | null
          monto: number
          numero: string
          numero_cartao: string | null
          numero_operacao: string | null
          origin_country: string | null
          pais: string | null
          passengers: Json | null
          payment_gateway: string | null
          periodo_apuracao: string
          periodo_fechado: boolean | null
          preco_lista: number
          preco_local: number
          product_code: string
          status_original: string
          status_pagamento: string | null
          status_voucher: string | null
          tipo_canal_atual: string | null
          tipo_canal_origem: string | null
          tipo_viagem: string | null
          tipo_zero_amount: string | null
          updated_at: string | null
          valid_from: string | null
          valid_to: string | null
          versao_calculo: number | null
          voucher_code: string | null
        }
        Insert: {
          agencia_atual?: string | null
          agencia_original?: string | null
          amount_paid?: number | null
          canal?: string | null
          cliente: string
          codigo_autorizacao?: string | null
          codigo_desconto?: string | null
          cortesia?: boolean | null
          created_at?: string | null
          data_criacao: string
          data_fim_viagem?: string | null
          data_inicio_viagem?: string | null
          data_vencimento_pagamento?: string | null
          desconto_aplicado?: number
          destination_country?: string | null
          destino?: string | null
          flag_pre_venda?: boolean | null
          id?: string
          id_agencia: string
          id_agencia_atual?: string | null
          id_agencia_original?: string | null
          id_produto?: string | null
          installments?: number | null
          moeda_monto?: string | null
          monto?: number
          numero: string
          numero_cartao?: string | null
          numero_operacao?: string | null
          origin_country?: string | null
          pais?: string | null
          passengers?: Json | null
          payment_gateway?: string | null
          periodo_apuracao: string
          periodo_fechado?: boolean | null
          preco_lista?: number
          preco_local?: number
          product_code: string
          status_original: string
          status_pagamento?: string | null
          status_voucher?: string | null
          tipo_canal_atual?: string | null
          tipo_canal_origem?: string | null
          tipo_viagem?: string | null
          tipo_zero_amount?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
          versao_calculo?: number | null
          voucher_code?: string | null
        }
        Update: {
          agencia_atual?: string | null
          agencia_original?: string | null
          amount_paid?: number | null
          canal?: string | null
          cliente?: string
          codigo_autorizacao?: string | null
          codigo_desconto?: string | null
          cortesia?: boolean | null
          created_at?: string | null
          data_criacao?: string
          data_fim_viagem?: string | null
          data_inicio_viagem?: string | null
          data_vencimento_pagamento?: string | null
          desconto_aplicado?: number
          destination_country?: string | null
          destino?: string | null
          flag_pre_venda?: boolean | null
          id?: string
          id_agencia?: string
          id_agencia_atual?: string | null
          id_agencia_original?: string | null
          id_produto?: string | null
          installments?: number | null
          moeda_monto?: string | null
          monto?: number
          numero?: string
          numero_cartao?: string | null
          numero_operacao?: string | null
          origin_country?: string | null
          pais?: string | null
          passengers?: Json | null
          payment_gateway?: string | null
          periodo_apuracao?: string
          periodo_fechado?: boolean | null
          preco_lista?: number
          preco_local?: number
          product_code?: string
          status_original?: string
          status_pagamento?: string | null
          status_voucher?: string | null
          tipo_canal_atual?: string | null
          tipo_canal_origem?: string | null
          tipo_viagem?: string | null
          tipo_zero_amount?: string | null
          updated_at?: string | null
          valid_from?: string | null
          valid_to?: string | null
          versao_calculo?: number | null
          voucher_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vouchers_id_agencia_atual_fkey'
            columns: ['id_agencia_atual']
            isOneToOne: false
            referencedRelation: 'agencias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vouchers_id_agencia_fkey'
            columns: ['id_agencia']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vouchers_id_agencia_original_fkey'
            columns: ['id_agencia_original']
            isOneToOne: false
            referencedRelation: 'agencias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vouchers_id_produto_fkey'
            columns: ['id_produto']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      vouchers_vigentes: {
        Row: {
          agencia_atual: string | null
          agencia_original: string | null
          amount_paid: number | null
          canal: string | null
          cliente: string | null
          codigo_autorizacao: string | null
          codigo_desconto: string | null
          cortesia: boolean | null
          created_at: string | null
          data_criacao: string | null
          data_fim_viagem: string | null
          data_inicio_viagem: string | null
          data_vencimento_pagamento: string | null
          desconto_aplicado: number | null
          destination_country: string | null
          destino: string | null
          flag_pre_venda: boolean | null
          id: string | null
          id_agencia: string | null
          id_agencia_atual: string | null
          id_agencia_original: string | null
          id_produto: string | null
          installments: number | null
          moeda_monto: string | null
          monto: number | null
          numero: string | null
          numero_cartao: string | null
          numero_operacao: string | null
          origin_country: string | null
          pais: string | null
          passengers: Json | null
          payment_gateway: string | null
          periodo_apuracao: string | null
          periodo_fechado: boolean | null
          preco_lista: number | null
          preco_local: number | null
          product_code: string | null
          status_original: string | null
          status_pagamento: string | null
          status_voucher: string | null
          tipo_canal_atual: string | null
          tipo_canal_origem: string | null
          tipo_viagem: string | null
          tipo_zero_amount: string | null
          updated_at: string | null
          valid_from: string | null
          valid_to: string | null
          versao_calculo: number | null
          voucher_code: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vouchers_id_agencia_atual_fkey'
            columns: ['id_agencia_atual']
            isOneToOne: false
            referencedRelation: 'agencias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vouchers_id_agencia_fkey'
            columns: ['id_agencia']
            isOneToOne: false
            referencedRelation: 'agencies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vouchers_id_agencia_original_fkey'
            columns: ['id_agencia_original']
            isOneToOne: false
            referencedRelation: 'agencias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vouchers_id_produto_fkey'
            columns: ['id_produto']
            isOneToOne: false
            referencedRelation: 'produtos'
            referencedColumns: ['id']
          },
        ]
      }
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
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
// Table: agencias
//   id: uuid (not null, default: gen_random_uuid())
//   nome_fantasia: text (nullable)
//   nome_legal: text (nullable)
//   codigo: text (nullable)
//   pais: text (nullable)
//   nivel: text (nullable)
//   id_agencia_pai: uuid (nullable)
//   percentual_comissao: numeric (nullable, default: 0)
//   moeda_padrao: text (nullable)
//   data_inicio_faturamento: date (nullable)
//   data_ultimo_fechamento: date (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
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
// Table: audit_reclassificacao
//   id: uuid (not null, default: gen_random_uuid())
//   id_voucher: uuid (nullable)
//   tipo_anterior: text (nullable)
//   tipo_novo: text (nullable)
//   motivo: text (nullable)
//   classificado_por: uuid (nullable)
//   classificado_em: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())
// Table: contratos_pre_venda
//   id: uuid (not null, default: gen_random_uuid())
//   id_agencia: uuid (nullable)
//   id_produto: uuid (nullable)
//   dias_iniciais: integer (nullable, default: 0)
//   dias_consumidos: integer (nullable, default: 0)
//   data_validade: date (nullable)
//   status: text (nullable)
//   pais: text (nullable)
//   moeda: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: extrato_pre_venda
//   id: uuid (not null, default: gen_random_uuid())
//   id_contrato: uuid (nullable)
//   id_voucher: uuid (nullable)
//   tipo_movimento: text (nullable)
//   dias_consumidos: integer (nullable, default: 0)
//   data_movimento: timestamp with time zone (nullable, default: now())
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
//   versao_calculo: integer (nullable)
//   id_agencia_vendedora: uuid (nullable)
//   id_agencia_recebedora: uuid (nullable)
//   pais: text (nullable)
//   percentual_aplicado: numeric (nullable, default: 0)
//   valor_moeda_nativa: numeric (nullable, default: 0)
//   moeda: text (nullable)
//   status_quitacao: text (nullable)
//   data_vencimento_quitacao: timestamp with time zone (nullable)
//   id_lancamento_origem: uuid (nullable)
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
//   pais: text (nullable)
//   moeda: text (nullable)
//   competencia_mes: integer (nullable)
//   competencia_ano: integer (nullable)
//   status_lock: boolean (nullable, default: false)
// Table: grupos_produtos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (nullable)
//   percentual_comissao_maximo: numeric (nullable, default: 0)
//   e_pre_venda: boolean (nullable, default: false)
//   tem_tarifa_net: boolean (nullable, default: false)
//   pais: text (nullable)
//   moeda_cadastro: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: ingestao_logs
//   id: uuid (not null, default: gen_random_uuid())
//   data_ingestao: timestamp with time zone (nullable, default: now())
//   quantidade_registros: integer (nullable, default: 0)
//   quantidade_falhadas: integer (nullable, default: 0)
//   status: text (nullable)
//   mensagem_erro: text (nullable)
//   pais_processado: text (nullable)
//   moedas_processadas: _text (nullable)
//   id_usuario: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: passageiros
//   id: uuid (not null, default: gen_random_uuid())
//   id_voucher: uuid (not null)
//   voucher_passenger_code: text (nullable)
//   nome: text (nullable)
//   documento_tipo: text (nullable)
//   documento_numero: text (nullable)
//   data_nascimento: date (nullable)
//   contato_telefone: text (nullable)
//   contato_email: text (nullable)
//   contato_emergencia_nome: text (nullable)
//   contato_emergencia_telefone: text (nullable)
//   ultima_atualizacao: timestamp with time zone (nullable, default: now())
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
// Table: produtos
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (nullable)
//   id_grupo: uuid (nullable)
//   e_pre_venda: boolean (nullable, default: false)
//   tarifa_net: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: transaction_logs
//   id: uuid (not null, default: gen_random_uuid())
//   voucher_id: uuid (not null)
//   amount: numeric (not null)
//   status: text (not null)
//   timestamp: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())
// Table: usuarios
//   id: uuid (not null, default: gen_random_uuid())
//   auth_user_id: uuid (not null)
//   nome: text (nullable)
//   nivel: text (nullable)
//   id_agencia: uuid (nullable)
//   pais: text (nullable)
//   moeda_padrao: text (nullable)
//   perfil_admin: boolean (nullable, default: false)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: variacoes_preco
//   id: uuid (not null, default: gen_random_uuid())
//   id_produto: uuid (nullable)
//   destino: text (nullable)
//   faixa_etaria: text (nullable)
//   preco_moeda_cadastro: numeric (nullable, default: 0)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: voucher_processamentos
//   id: uuid (not null, default: gen_random_uuid())
//   id_voucher: uuid (nullable)
//   status_voucher: text (nullable)
//   versao_calculo: integer (nullable)
//   processado_em: timestamp with time zone (nullable, default: now())
//   hash_input: text (nullable)
//   resultado_status: text (nullable)
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
//   voucher_code: text (nullable)
//   id_agencia_original: uuid (nullable)
//   id_agencia_atual: uuid (nullable)
//   agencia_original: text (nullable)
//   agencia_atual: text (nullable)
//   amount_paid: numeric (nullable, default: 0)
//   moeda_monto: text (nullable)
//   pais: text (nullable)
//   id_produto: uuid (nullable)
//   destino: text (nullable)
//   data_inicio_viagem: date (nullable)
//   data_fim_viagem: date (nullable)
//   tipo_canal_origem: text (nullable)
//   tipo_canal_atual: text (nullable)
//   tipo_zero_amount: text (nullable)
//   status_voucher: text (nullable)
//   status_pagamento: text (nullable)
//   data_vencimento_pagamento: timestamp with time zone (nullable)
//   versao_calculo: integer (nullable, default: 1)
// Table: vouchers_vigentes
//   id: uuid (nullable)
//   numero: text (nullable)
//   id_agencia: uuid (nullable)
//   cliente: text (nullable)
//   canal: text (nullable)
//   status_original: text (nullable)
//   data_criacao: timestamp with time zone (nullable)
//   valid_from: timestamp with time zone (nullable)
//   valid_to: timestamp with time zone (nullable)
//   tipo_viagem: text (nullable)
//   origin_country: text (nullable)
//   destination_country: text (nullable)
//   product_code: text (nullable)
//   preco_lista: numeric (nullable)
//   preco_local: numeric (nullable)
//   monto: numeric (nullable)
//   desconto_aplicado: numeric (nullable)
//   codigo_desconto: text (nullable)
//   payment_gateway: text (nullable)
//   numero_operacao: text (nullable)
//   codigo_autorizacao: text (nullable)
//   numero_cartao: text (nullable)
//   installments: integer (nullable)
//   flag_pre_venda: boolean (nullable)
//   cortesia: boolean (nullable)
//   periodo_apuracao: text (nullable)
//   periodo_fechado: boolean (nullable)
//   passengers: jsonb (nullable)
//   created_at: timestamp with time zone (nullable)
//   updated_at: timestamp with time zone (nullable)
//   voucher_code: text (nullable)
//   id_agencia_original: uuid (nullable)
//   id_agencia_atual: uuid (nullable)
//   agencia_original: text (nullable)
//   agencia_atual: text (nullable)
//   amount_paid: numeric (nullable)
//   moeda_monto: text (nullable)
//   pais: text (nullable)
//   id_produto: uuid (nullable)
//   destino: text (nullable)
//   data_inicio_viagem: date (nullable)
//   data_fim_viagem: date (nullable)
//   tipo_canal_origem: text (nullable)
//   tipo_canal_atual: text (nullable)
//   tipo_zero_amount: text (nullable)
//   status_voucher: text (nullable)
//   status_pagamento: text (nullable)
//   data_vencimento_pagamento: timestamp with time zone (nullable)
//   versao_calculo: integer (nullable)

// --- CONSTRAINTS ---
// Table: agencias
//   UNIQUE agencias_codigo_key: UNIQUE (codigo)
//   FOREIGN KEY agencias_id_agencia_pai_fkey: FOREIGN KEY (id_agencia_pai) REFERENCES agencias(id) ON DELETE SET NULL
//   PRIMARY KEY agencias_pkey: PRIMARY KEY (id)
// Table: agencies
//   UNIQUE agencies_codigo_key: UNIQUE (codigo)
//   FOREIGN KEY agencies_id_agencia_mae_fkey: FOREIGN KEY (id_agencia_mae) REFERENCES agencies(id) ON DELETE SET NULL
//   PRIMARY KEY agencies_pkey: PRIMARY KEY (id)
// Table: alerts
//   PRIMARY KEY alerts_pkey: PRIMARY KEY (id)
// Table: audit_log_comissoes
//   PRIMARY KEY audit_log_comissoes_pkey: PRIMARY KEY (id)
// Table: audit_reclassificacao
//   FOREIGN KEY audit_reclassificacao_classificado_por_fkey: FOREIGN KEY (classificado_por) REFERENCES usuarios(id) ON DELETE SET NULL
//   FOREIGN KEY audit_reclassificacao_id_voucher_fkey: FOREIGN KEY (id_voucher) REFERENCES vouchers(id) ON DELETE CASCADE
//   PRIMARY KEY audit_reclassificacao_pkey: PRIMARY KEY (id)
// Table: contratos_pre_venda
//   FOREIGN KEY contratos_pre_venda_id_agencia_fkey: FOREIGN KEY (id_agencia) REFERENCES agencias(id) ON DELETE CASCADE
//   FOREIGN KEY contratos_pre_venda_id_produto_fkey: FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE
//   PRIMARY KEY contratos_pre_venda_pkey: PRIMARY KEY (id)
// Table: extrato_pre_venda
//   FOREIGN KEY extrato_pre_venda_id_contrato_fkey: FOREIGN KEY (id_contrato) REFERENCES contratos_pre_venda(id) ON DELETE CASCADE
//   FOREIGN KEY extrato_pre_venda_id_voucher_fkey: FOREIGN KEY (id_voucher) REFERENCES vouchers(id) ON DELETE CASCADE
//   PRIMARY KEY extrato_pre_venda_pkey: PRIMARY KEY (id)
//   CHECK extrato_pre_venda_tipo_movimento_check: CHECK ((tipo_movimento = ANY (ARRAY['DEBITO'::text, 'CREDITO'::text])))
// Table: faturamento_net
//   FOREIGN KEY faturamento_net_id_agencia_fkey: FOREIGN KEY (id_agencia) REFERENCES agencies(id) ON DELETE CASCADE
//   FOREIGN KEY faturamento_net_id_agencia_recebedora_fkey: FOREIGN KEY (id_agencia_recebedora) REFERENCES agencias(id) ON DELETE SET NULL
//   FOREIGN KEY faturamento_net_id_agencia_vendedora_fkey: FOREIGN KEY (id_agencia_vendedora) REFERENCES agencias(id) ON DELETE SET NULL
//   FOREIGN KEY faturamento_net_id_fatura_fkey: FOREIGN KEY (id_fatura) REFERENCES faturas(id) ON DELETE SET NULL
//   FOREIGN KEY faturamento_net_id_lancamento_origem_fkey: FOREIGN KEY (id_lancamento_origem) REFERENCES faturamento_net(id) ON DELETE SET NULL
//   FOREIGN KEY faturamento_net_id_voucher_fkey: FOREIGN KEY (id_voucher) REFERENCES vouchers(id) ON DELETE CASCADE
//   PRIMARY KEY faturamento_net_pkey: PRIMARY KEY (id)
// Table: faturas
//   FOREIGN KEY faturas_id_agencia_fkey: FOREIGN KEY (id_agencia) REFERENCES agencies(id) ON DELETE CASCADE
//   PRIMARY KEY faturas_pkey: PRIMARY KEY (id)
// Table: grupos_produtos
//   PRIMARY KEY grupos_produtos_pkey: PRIMARY KEY (id)
// Table: ingestao_logs
//   FOREIGN KEY ingestao_logs_id_usuario_fkey: FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
//   PRIMARY KEY ingestao_logs_pkey: PRIMARY KEY (id)
// Table: passageiros
//   FOREIGN KEY passageiros_id_voucher_fkey: FOREIGN KEY (id_voucher) REFERENCES vouchers(id) ON DELETE CASCADE
//   PRIMARY KEY passageiros_pkey: PRIMARY KEY (id)
//   UNIQUE unq_voucher_passenger: UNIQUE (id_voucher, voucher_passenger_code)
// Table: periods
//   PRIMARY KEY periods_pkey: PRIMARY KEY (id)
// Table: process_logs
//   PRIMARY KEY process_logs_pkey: PRIMARY KEY (id)
// Table: produtos
//   FOREIGN KEY produtos_id_grupo_fkey: FOREIGN KEY (id_grupo) REFERENCES grupos_produtos(id) ON DELETE CASCADE
//   PRIMARY KEY produtos_pkey: PRIMARY KEY (id)
// Table: transaction_logs
//   PRIMARY KEY transaction_logs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY transaction_logs_voucher_id_fkey: FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE
// Table: usuarios
//   UNIQUE usuarios_auth_user_id_key: UNIQUE (auth_user_id)
//   FOREIGN KEY usuarios_id_agencia_fkey: FOREIGN KEY (id_agencia) REFERENCES agencias(id) ON DELETE SET NULL
//   PRIMARY KEY usuarios_pkey: PRIMARY KEY (id)
// Table: variacoes_preco
//   FOREIGN KEY variacoes_preco_id_produto_fkey: FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE
//   PRIMARY KEY variacoes_preco_pkey: PRIMARY KEY (id)
// Table: voucher_processamentos
//   UNIQUE unq_voucher_processamento: UNIQUE (id_voucher, status_voucher, versao_calculo)
//   FOREIGN KEY voucher_processamentos_id_voucher_fkey: FOREIGN KEY (id_voucher) REFERENCES vouchers(id) ON DELETE CASCADE
//   PRIMARY KEY voucher_processamentos_pkey: PRIMARY KEY (id)
//   CHECK voucher_processamentos_resultado_status_check: CHECK ((resultado_status = ANY (ARRAY['SUCESSO'::text, 'FALHA'::text])))
// Table: vouchers
//   FOREIGN KEY vouchers_id_agencia_atual_fkey: FOREIGN KEY (id_agencia_atual) REFERENCES agencias(id) ON DELETE SET NULL
//   FOREIGN KEY vouchers_id_agencia_fkey: FOREIGN KEY (id_agencia) REFERENCES agencies(id) ON DELETE CASCADE
//   FOREIGN KEY vouchers_id_agencia_original_fkey: FOREIGN KEY (id_agencia_original) REFERENCES agencias(id) ON DELETE SET NULL
//   FOREIGN KEY vouchers_id_produto_fkey: FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE SET NULL
//   UNIQUE vouchers_numero_key: UNIQUE (numero)
//   PRIMARY KEY vouchers_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: agencias
//   Policy "tenant_agencias_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((( SELECT usuarios.perfil_admin    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid())) = true) OR (pais = ( SELECT usuarios.pais    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid()))))
//     WITH CHECK: ((( SELECT usuarios.perfil_admin    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid())) = true) OR (pais = ( SELECT usuarios.pais    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid()))))
// Table: agencies
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: alerts
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: audit_log_comissoes
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: audit_reclassificacao
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: contratos_pre_venda
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: extrato_pre_venda
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: faturamento_net
//   Policy "tenant_faturamento_net_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((( SELECT usuarios.perfil_admin    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid())) = true) OR (pais = ( SELECT usuarios.pais    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid()))))
//     WITH CHECK: ((( SELECT usuarios.perfil_admin    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid())) = true) OR (pais = ( SELECT usuarios.pais    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid()))))
// Table: faturas
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: grupos_produtos
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: ingestao_logs
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: passageiros
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: periods
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: process_logs
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: produtos
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: transaction_logs
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: usuarios
//   Policy "tenant_usuarios_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (auth_user_id = auth.uid())
//   Policy "tenant_usuarios_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (auth_user_id = auth.uid())
//     WITH CHECK: (auth_user_id = auth.uid())
// Table: variacoes_preco
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: voucher_processamentos
//   Policy "authenticated_delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "authenticated_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "authenticated_update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: vouchers
//   Policy "tenant_vouchers_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((( SELECT usuarios.perfil_admin    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid())) = true) OR (pais = ( SELECT usuarios.pais    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid()))))
//     WITH CHECK: ((( SELECT usuarios.perfil_admin    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid())) = true) OR (pais = ( SELECT usuarios.pais    FROM usuarios   WHERE (usuarios.auth_user_id = auth.uid()))))

// --- DATABASE FUNCTIONS ---
// FUNCTION check_imutabilidade_tipo_canal()
//   CREATE OR REPLACE FUNCTION public.check_imutabilidade_tipo_canal()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//       IF OLD.tipo_canal_origem IS DISTINCT FROM NEW.tipo_canal_origem THEN
//           RAISE EXCEPTION 'tipo_canal_origem não pode ser modificado após inserção';
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION check_teto_operacional()
//   CREATE OR REPLACE FUNCTION public.check_teto_operacional()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       v_total_aplicado NUMERIC;
//       v_teto NUMERIC;
//   BEGIN
//       IF NEW.tipo_lancamento = 'COMISSAO' THEN
//           SELECT gp.percentual_comissao_maximo INTO v_teto
//           FROM public.vouchers v
//           JOIN public.produtos p ON v.id_produto = p.id
//           JOIN public.grupos_produtos gp ON p.id_grupo = gp.id
//           WHERE v.id = NEW.id_voucher;
//
//           SELECT COALESCE(SUM(percentual_aplicado), 0) INTO v_total_aplicado
//           FROM public.faturamento_net
//           WHERE id_voucher = NEW.id_voucher
//             AND versao_calculo = NEW.versao_calculo
//             AND tipo_lancamento = 'COMISSAO'
//             AND id != NEW.id;
//
//           IF (v_total_aplicado + COALESCE(NEW.percentual_aplicado, 0)) > COALESCE(v_teto, 100) THEN
//               RAISE EXCEPTION 'Teto de comissão excedido. Limite: %, Tentado: %', v_teto, (v_total_aplicado + COALESCE(NEW.percentual_aplicado, 0));
//           END IF;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: faturamento_net
//   trg_check_teto: CREATE TRIGGER trg_check_teto BEFORE INSERT OR UPDATE ON public.faturamento_net FOR EACH ROW EXECUTE FUNCTION check_teto_operacional()
// Table: vouchers
//   trg_vouchers_tipo_canal_origem: CREATE TRIGGER trg_vouchers_tipo_canal_origem BEFORE UPDATE ON public.vouchers FOR EACH ROW EXECUTE FUNCTION check_imutabilidade_tipo_canal()

// --- INDEXES ---
// Table: agencias
//   CREATE UNIQUE INDEX agencias_codigo_key ON public.agencias USING btree (codigo)
// Table: agencies
//   CREATE UNIQUE INDEX agencies_codigo_key ON public.agencies USING btree (codigo)
// Table: faturamento_net
//   CREATE UNIQUE INDEX idx_estorno_unico ON public.faturamento_net USING btree (id_lancamento_origem) WHERE (tipo_lancamento = 'ESTORNO'::text)
//   CREATE INDEX idx_faturamento_net_voucher_versao ON public.faturamento_net USING btree (id_voucher, versao_calculo DESC)
// Table: passageiros
//   CREATE UNIQUE INDEX unq_voucher_passenger ON public.passageiros USING btree (id_voucher, voucher_passenger_code)
// Table: usuarios
//   CREATE UNIQUE INDEX usuarios_auth_user_id_key ON public.usuarios USING btree (auth_user_id)
// Table: voucher_processamentos
//   CREATE UNIQUE INDEX unq_voucher_processamento ON public.voucher_processamentos USING btree (id_voucher, status_voucher, versao_calculo)
// Table: vouchers
//   CREATE UNIQUE INDEX vouchers_numero_key ON public.vouchers USING btree (numero)
