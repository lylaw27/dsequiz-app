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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      mcqs: {
        Row: {
          correct_answer: string
          created_at: string | null
          difficulty: number | null
          embedding: string | null
          explanation: string
          grade_level: string | null
          id: string
          metadata: Json | null
          options: Json
          question: string | null
          question_type_id: string | null
          source_material_ids: string[] | null
          subject_id: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          difficulty?: number | null
          embedding?: string | null
          explanation: string
          grade_level?: string | null
          id?: string
          metadata?: Json | null
          options: Json
          question?: string | null
          question_type_id?: string | null
          source_material_ids?: string[] | null
          subject_id: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          difficulty?: number | null
          embedding?: string | null
          explanation?: string
          grade_level?: string | null
          id?: string
          metadata?: Json | null
          options?: Json
          question?: string | null
          question_type_id?: string | null
          source_material_ids?: string[] | null
          subject_id?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcqs_question_type_id_fkey"
            columns: ["question_type_id"]
            isOneToOne: false
            referencedRelation: "question_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcqs_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      mcqset_questions: {
        Row: {
          created_at: string | null
          id: string
          mcq_id: string
          mcqset_id: string
          order_index: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          mcq_id: string
          mcqset_id: string
          order_index: number
        }
        Update: {
          created_at?: string | null
          id?: string
          mcq_id?: string
          mcqset_id?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "mcqset_questions_mcq_id_fkey"
            columns: ["mcq_id"]
            isOneToOne: false
            referencedRelation: "mcqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcqset_questions_mcqset_id_fkey"
            columns: ["mcqset_id"]
            isOneToOne: false
            referencedRelation: "mcqsets"
            referencedColumns: ["id"]
          },
        ]
      }
      mcqsets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          subject_id: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          subject_id: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          subject_id?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mcqsets_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      pastpapers: {
        Row: {
          answer: string
          created_at: string | null
          difficulty: number
          embedding: string | null
          explanation: string
          grade_level: string | null
          id: string
          metadata: Json | null
          question: string
          question_number: number
          question_type_id: string | null
          question_year: number
          subject_id: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          difficulty: number
          embedding?: string | null
          explanation: string
          grade_level?: string | null
          id?: string
          metadata?: Json | null
          question: string
          question_number: number
          question_type_id?: string | null
          question_year: number
          subject_id: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          difficulty?: number
          embedding?: string | null
          explanation?: string
          grade_level?: string | null
          id?: string
          metadata?: Json | null
          question?: string
          question_number?: number
          question_type_id?: string | null
          question_year?: number
          subject_id?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pastpapers_question_type_id_fkey"
            columns: ["question_type_id"]
            isOneToOne: false
            referencedRelation: "question_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pastpapers_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      question_types: {
        Row: {
          created_at: string | null
          id: string
          name: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_types_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string | null
          description: string | null
          eng_name: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          eng_name?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          eng_name?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      textbooks: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          grade_level: string | null
          id: string
          metadata: Json | null
          subject_id: string
          topic: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          grade_level?: string | null
          id?: string
          metadata?: Json | null
          subject_id: string
          topic: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          grade_level?: string | null
          id?: string
          metadata?: Json | null
          subject_id?: string
          topic?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "textbooks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mcqset_answers: {
        Row: {
          answered_at: string | null
          created_at: string | null
          id: string
          is_correct: boolean
          mcq_id: string
          progress_id: string
          question_order_index: number
          time_spent_seconds: number | null
          updated_at: string | null
          user_answer: string | null
        }
        Insert: {
          answered_at?: string | null
          created_at?: string | null
          id?: string
          is_correct: boolean
          mcq_id: string
          progress_id: string
          question_order_index: number
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_answer?: string | null
        }
        Update: {
          answered_at?: string | null
          created_at?: string | null
          id?: string
          is_correct?: boolean
          mcq_id?: string
          progress_id?: string
          question_order_index?: number
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_mcqset_answers_mcq_id_fkey"
            columns: ["mcq_id"]
            isOneToOne: false
            referencedRelation: "mcqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_mcqset_answers_progress_id_fkey"
            columns: ["progress_id"]
            isOneToOne: false
            referencedRelation: "user_mcqset_progress"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mcqset_progress: {
        Row: {
          answered_count: number | null
          completed_at: string | null
          correct_count: number | null
          created_at: string | null
          current_question_index: number | null
          id: string
          last_accessed_at: string | null
          mcqset_id: string
          started_at: string | null
          status: string
          total_questions: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answered_count?: number | null
          completed_at?: string | null
          correct_count?: number | null
          created_at?: string | null
          current_question_index?: number | null
          id?: string
          last_accessed_at?: string | null
          mcqset_id: string
          started_at?: string | null
          status?: string
          total_questions: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answered_count?: number | null
          completed_at?: string | null
          correct_count?: number | null
          created_at?: string | null
          current_question_index?: number | null
          id?: string
          last_accessed_at?: string | null
          mcqset_id?: string
          started_at?: string | null
          status?: string
          total_questions?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mcqset_progress_mcqset_id_fkey"
            columns: ["mcqset_id"]
            isOneToOne: false
            referencedRelation: "mcqsets"
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
