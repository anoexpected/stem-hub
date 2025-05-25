export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          id: number
          name: string
          code: string
          board: string
          level: string
          description: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          code: string
          board: string
          level: string
          description: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          code?: string
          board?: string
          level?: string
          description?: string
          created_at?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          id: number
          subject_id: number
          title: string
          type: string
          order: number
          created_at: string
        }
        Insert: {
          id?: number
          subject_id: number
          title: string
          type: string
          order: number
          created_at?: string
        }
        Update: {
          id?: number
          subject_id?: number
          title?: string
          type?: string
          order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          id: number
          chapter_id: number
          title: string
          content_md: string
          assets: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          chapter_id: number
          title: string
          content_md: string
          assets?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          chapter_id?: number
          title?: string
          content_md?: string
          assets?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_chapter_id_fkey"
            columns: ["chapter_id"]
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          id: number
          topic_id: number
          question: string
          options: string[]
          correct_answer: number
          created_at: string
        }
        Insert: {
          id?: number
          topic_id: number
          question: string
          options: string[]
          correct_answer: number
          created_at?: string
        }
        Update: {
          id?: number
          topic_id?: number
          question?: string
          options?: string[]
          correct_answer?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          id: number
          subject_id: number
          quote: string
          author: string
          created_at: string
        }
        Insert: {
          id?: number
          subject_id: number
          quote: string
          author: string
          created_at?: string
        }
        Update: {
          id?: number
          subject_id?: number
          quote?: string
          author?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_subject_id_fkey"
            columns: ["subject_id"]
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      webinars: {
        Row: {
          id: number
          title: string
          date: string
          topic: string
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          date: string
          topic: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          date?: string
          topic?: string
          created_at?: string
        }
        Relationships: []
      }
      discord_stats: {
        Row: {
          id: number
          online: number
          members: number
          messages_today: number
          updated_at: string
        }
        Insert: {
          id?: number
          online: number
          members: number
          messages_today: number
          updated_at?: string
        }
        Update: {
          id?: number
          online?: number
          members?: number
          messages_today?: number
          updated_at?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          id: number
          user_id: string
          type: string
          item_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          type: string
          item_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          type?: string
          item_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
