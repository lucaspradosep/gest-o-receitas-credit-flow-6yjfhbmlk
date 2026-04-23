// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      devolutivas: {
        Row: {
          additional_info: string | null
          analysis_date: string | null
          client_name: string | null
          created_at: string | null
          denial_reasons: string[] | null
          id: string
          info_request_date: string | null
          requester_email: string | null
          requires_follow_up: boolean | null
          solicitacao_id: string | null
          status: string | null
          value: number | null
        }
        Insert: {
          additional_info?: string | null
          analysis_date?: string | null
          client_name?: string | null
          created_at?: string | null
          denial_reasons?: string[] | null
          id?: string
          info_request_date?: string | null
          requester_email?: string | null
          requires_follow_up?: boolean | null
          solicitacao_id?: string | null
          status?: string | null
          value?: number | null
        }
        Update: {
          additional_info?: string | null
          analysis_date?: string | null
          client_name?: string | null
          created_at?: string | null
          denial_reasons?: string[] | null
          id?: string
          info_request_date?: string | null
          requester_email?: string | null
          requires_follow_up?: boolean | null
          solicitacao_id?: string | null
          status?: string | null
          value?: number | null
        }
        Relationships: []
      }
      solicitacoes_credito: {
        Row: {
          client_name: string | null
          created_at: string | null
          delivery_address: string | null
          document: string | null
          empresa: string | null
          id: string
          notes: string | null
          quantity: number | null
          requester_email: string | null
          uf: string | null
          unidade_negocio: string | null
          value: number | null
        }
        Insert: {
          client_name?: string | null
          created_at?: string | null
          delivery_address?: string | null
          document?: string | null
          empresa?: string | null
          id?: string
          notes?: string | null
          quantity?: number | null
          requester_email?: string | null
          uf?: string | null
          unidade_negocio?: string | null
          value?: number | null
        }
        Update: {
          client_name?: string | null
          created_at?: string | null
          delivery_address?: string | null
          document?: string | null
          empresa?: string | null
          id?: string
          notes?: string | null
          quantity?: number | null
          requester_email?: string | null
          uf?: string | null
          unidade_negocio?: string | null
          value?: number | null
        }
        Relationships: []
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
// Table: devolutivas
//   id: uuid (not null, default: gen_random_uuid())
//   created_at: timestamp with time zone (nullable, default: now())
//   solicitacao_id: uuid (nullable)
//   client_name: text (nullable)
//   requester_email: text (nullable)
//   status: text (nullable)
//   value: numeric (nullable)
//   requires_follow_up: boolean (nullable, default: false)
//   denial_reasons: _text (nullable)
//   additional_info: text (nullable)
//   info_request_date: text (nullable)
//   analysis_date: text (nullable)
// Table: solicitacoes_credito
//   id: uuid (not null, default: gen_random_uuid())
//   created_at: timestamp with time zone (nullable, default: now())
//   requester_email: text (nullable)
//   client_name: text (nullable)
//   document: text (nullable)
//   empresa: text (nullable)
//   uf: text (nullable)
//   unidade_negocio: text (nullable)
//   value: numeric (nullable)
//   quantity: integer (nullable)
//   delivery_address: text (nullable)
//   notes: text (nullable)

// --- CONSTRAINTS ---
// Table: devolutivas
//   PRIMARY KEY devolutivas_pkey: PRIMARY KEY (id)
// Table: solicitacoes_credito
//   PRIMARY KEY solicitacoes_credito_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: devolutivas
//   Policy "Allow all for anon" (ALL, PERMISSIVE) roles={anon}
//     WITH CHECK: true
// Table: solicitacoes_credito
//   Policy "Allow insert for all" (INSERT, PERMISSIVE) roles={anon}
//     WITH CHECK: true
