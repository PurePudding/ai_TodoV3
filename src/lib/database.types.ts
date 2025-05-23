export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      shared_tasks: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      task_shares: {
        Row: {
          task_id: string
          user_id: string
          can_edit: boolean
          is_minimized: boolean
          created_at: string
        }
        Insert: {
          task_id: string
          user_id: string
          can_edit?: boolean
          is_minimized?: boolean
          created_at?: string
        }
        Update: {
          task_id?: string
          user_id?: string
          can_edit?: boolean
          is_minimized?: boolean
          created_at?: string
        }
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
  }
}