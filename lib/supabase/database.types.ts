export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      actions: {
        Row: {
          action_id: string
          completed_at: string | null
          config: Json
          created_at: string
          execution_id: string
          id: string
          inputs: Json
          name: string
          outputs: Json
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_id: string
          completed_at?: string | null
          config: Json
          created_at?: string
          execution_id: string
          id?: string
          inputs: Json
          name: string
          outputs: Json
          started_at?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_id?: string
          completed_at?: string | null
          config?: Json
          created_at?: string
          execution_id?: string
          id?: string
          inputs?: Json
          name?: string
          outputs?: Json
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      celery_taskmeta: {
        Row: {
          args: string | null
          date_done: string | null
          id: number
          kwargs: string | null
          name: string | null
          queue: string | null
          result: string | null
          retries: number | null
          status: string
          task_id: string
          traceback: string | null
          worker: string | null
        }
        Insert: {
          args?: string | null
          date_done?: string | null
          id?: number
          kwargs?: string | null
          name?: string | null
          queue?: string | null
          result?: string | null
          retries?: number | null
          status: string
          task_id: string
          traceback?: string | null
          worker?: string | null
        }
        Update: {
          args?: string | null
          date_done?: string | null
          id?: number
          kwargs?: string | null
          name?: string | null
          queue?: string | null
          result?: string | null
          retries?: number | null
          status?: string
          task_id?: string
          traceback?: string | null
          worker?: string | null
        }
        Relationships: []
      }
      celery_tasksetmeta: {
        Row: {
          date_done: string
          id: number
          result: string
          taskset_id: string
        }
        Insert: {
          date_done: string
          id?: number
          result: string
          taskset_id: string
        }
        Update: {
          date_done?: string
          id?: number
          result?: string
          taskset_id?: string
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          created_at: string | null
          id: string
          messages: Json
          summary: string
          updated_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          messages: Json
          summary: string
          updated_at?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          messages?: Json
          summary?: string
          updated_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_history_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      edges: {
        Row: {
          animated: boolean
          created_at: string
          id: string
          source: string
          source_handle: string
          target: string
          target_handle: string
          type: string
          updated_at: string
          user_id: string
          workflow_id: string
        }
        Insert: {
          animated: boolean
          created_at?: string
          id?: string
          source: string
          source_handle: string
          target: string
          target_handle: string
          type: string
          updated_at?: string
          user_id: string
          workflow_id: string
        }
        Update: {
          animated?: boolean
          created_at?: string
          id?: string
          source?: string
          source_handle?: string
          target?: string
          target_handle?: string
          type?: string
          updated_at?: string
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edges_source_fkey"
            columns: ["source"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edges_target_fkey"
            columns: ["target"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edges_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      executions: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          name: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          name: string
          started_at?: string
          status: string
          updated_at?: string
          user_id: string
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          name?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "executions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      nodes: {
        Row: {
          absolute_position: Json | null
          created_at: string
          data: Json
          dragging: boolean | null
          id: string
          name: string
          position: Json
          selected: boolean | null
          type: string
          updated_at: string
          user_id: string
          workflow_id: string
        }
        Insert: {
          absolute_position?: Json | null
          created_at?: string
          data: Json
          dragging?: boolean | null
          id?: string
          name: string
          position: Json
          selected?: boolean | null
          type: string
          updated_at?: string
          user_id: string
          workflow_id: string
        }
        Update: {
          absolute_position?: Json | null
          created_at?: string
          data?: Json
          dragging?: boolean | null
          id?: string
          name?: string
          position?: Json
          selected?: boolean | null
          type?: string
          updated_at?: string
          user_id?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nodes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nodes_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      panels: {
        Row: {
          id: string
          name: string
          url: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "panels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "panels_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      sec_filings: {
        Row: {
          accession_number: string | null
          cik: string | null
          company_name: string | null
          date_as_of_change: string | null
          filed_as_of_date: string | null
          filing_path: string | null
          filing_type: string | null
          id: string
          period_of_report_date: string | null
          quarter: string | null
          ticker: string | null
          year: number | null
        }
        Insert: {
          accession_number?: string | null
          cik?: string | null
          company_name?: string | null
          date_as_of_change?: string | null
          filed_as_of_date?: string | null
          filing_path?: string | null
          filing_type?: string | null
          id?: string
          period_of_report_date?: string | null
          quarter?: string | null
          ticker?: string | null
          year?: number | null
        }
        Update: {
          accession_number?: string | null
          cik?: string | null
          company_name?: string | null
          date_as_of_change?: string | null
          filed_as_of_date?: string | null
          filing_path?: string | null
          filing_type?: string | null
          id?: string
          period_of_report_date?: string | null
          quarter?: string | null
          ticker?: string | null
          year?: number | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          credit_limit: number
          email: string
          id: string
          plan: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credit_limit?: number
          email: string
          id?: string
          plan?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credit_limit?: number
          email?: string
          id?: string
          plan?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subactions: {
        Row: {
          action_id: string
          completed_at: string | null
          created_at: string
          execution_id: string
          id: string
          name: string
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_id: string
          completed_at?: string | null
          created_at?: string
          execution_id: string
          id?: string
          name: string
          started_at?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_id?: string
          completed_at?: string | null
          created_at?: string
          execution_id?: string
          id?: string
          name?: string
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subactions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subactions_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tickers: {
        Row: {
          asset_type: string
          delisting_date: string | null
          display_name: string | null
          exchange: string
          id: string
          ipo_date: string | null
          name: string
          status: string
          symbol: string
        }
        Insert: {
          asset_type: string
          delisting_date?: string | null
          display_name?: string | null
          exchange: string
          id?: string
          ipo_date?: string | null
          name: string
          status: string
          symbol: string
        }
        Update: {
          asset_type?: string
          delisting_date?: string | null
          display_name?: string | null
          exchange?: string
          id?: string
          ipo_date?: string | null
          name?: string
          status?: string
          symbol?: string
        }
        Relationships: []
      }
      widget_groups: {
        Row: {
          created_at: string | null
          id: string
          name: string
          panel_id: string
          ticker_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          panel_id: string
          ticker_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          panel_id?: string
          ticker_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "widget_groups_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: false
            referencedRelation: "panels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widget_groups_ticker_id_fkey"
            columns: ["ticker_id"]
            isOneToOne: false
            referencedRelation: "tickers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widget_groups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      widgets: {
        Row: {
          config: Json
          data: Json
          group_id: string
          id: string
          last_updated: string
          panel_id: string
          position: Json | null
          type: string
          user_id: string
        }
        Insert: {
          config: Json
          data: Json
          group_id: string
          id?: string
          last_updated?: string
          panel_id: string
          position?: Json | null
          type: string
          user_id: string
        }
        Update: {
          config?: Json
          data?: Json
          group_id?: string
          id?: string
          last_updated?: string
          panel_id?: string
          position?: Json | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "widgets_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "widget_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widgets_panel_id_fkey"
            columns: ["panel_id"]
            isOneToOne: false
            referencedRelation: "panels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "widgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

