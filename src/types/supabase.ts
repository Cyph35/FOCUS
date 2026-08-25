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
      submissions: {
        Row: {
          response_id: string
          submitted_at: string
          consent_given: boolean
          age_bracket: string
          sex: string
          grade_level: string
          pf1: number
          pf2: number
          pf3: number
          pf4: number
          pf5: number
          cf1: number
          cf2: number
          cf3: number
          cf4: number
          cf5: number
          sleep_duration: string
          study_break_frequency: string
          pre_bed_screen_time: string
          f1: number
          f2: number
          u1: number
          u2: number
          r1: number
          r2: number
          raw_physical_score: number
          raw_cognitive_score: number
          raw_total_score: number
          result_percent: number
          result_label: string
          suggestion: string
        }
        Insert: {
          response_id?: string
          submitted_at?: string
          consent_given: boolean
          age_bracket: string
          sex: string
          grade_level: string
          pf1: number
          pf2: number
          pf3: number
          pf4: number
          pf5: number
          cf1: number
          cf2: number
          cf3: number
          cf4: number
          cf5: number
          sleep_duration: string
          study_break_frequency: string
          pre_bed_screen_time: string
          f1: number
          f2: number
          u1: number
          u2: number
          r1: number
          r2: number
          raw_physical_score: number
          raw_cognitive_score: number
          raw_total_score: number
          result_percent: number
          result_label: string
          suggestion: string
        }
        Update: Partial<Database['public']['Tables']['submissions']['Insert']>
      }
    }
  }
}
