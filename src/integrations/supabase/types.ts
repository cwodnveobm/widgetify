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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ab_test_metrics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          session_id: string | null
          user_agent: string | null
          variation_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          session_id?: string | null
          user_agent?: string | null
          variation_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          session_id?: string | null
          user_agent?: string | null
          variation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_metrics_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "widget_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_tests: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
          widget_config: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
          widget_config: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          widget_config?: Json
        }
        Relationships: []
      }
      creator_verifications: {
        Row: {
          application_note: string | null
          badge_type: string
          created_at: string
          earning_multiplier: number
          follower_count: number | null
          id: string
          instagram_handle: string
          rejection_reason: string | null
          status: string
          updated_at: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          application_note?: string | null
          badge_type?: string
          created_at?: string
          earning_multiplier?: number
          follower_count?: number | null
          id?: string
          instagram_handle: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          application_note?: string | null
          badge_type?: string
          created_at?: string
          earning_multiplier?: number
          follower_count?: number | null
          id?: string
          instagram_handle?: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          referral_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          referral_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          referral_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_widgets: {
        Row: {
          background_color: string
          border_radius: string | null
          button_action: string | null
          button_color: string
          button_text: string
          created_at: string
          custom_css: string | null
          description: string | null
          font_family: string | null
          id: string
          logo_url: string | null
          name: string
          position: string
          shadow: string | null
          size: string
          text_color: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          background_color?: string
          border_radius?: string | null
          button_action?: string | null
          button_color?: string
          button_text: string
          created_at?: string
          custom_css?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          name: string
          position?: string
          shadow?: string | null
          size?: string
          text_color?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          background_color?: string
          border_radius?: string | null
          button_action?: string | null
          button_color?: string
          button_text?: string
          created_at?: string
          custom_css?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          position?: string
          shadow?: string | null
          size?: string
          text_color?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          badge_type: string
          created_at: string
          currency: string
          display_name: string
          email: string | null
          id: string
          is_public: boolean
          message: string | null
          payment_id: string | null
          payment_provider: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          badge_type?: string
          created_at?: string
          currency?: string
          display_name: string
          email?: string | null
          id?: string
          is_public?: boolean
          message?: string | null
          payment_id?: string | null
          payment_provider?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          badge_type?: string
          created_at?: string
          currency?: string
          display_name?: string
          email?: string | null
          id?: string
          is_public?: boolean
          message?: string | null
          payment_id?: string | null
          payment_provider?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_captures: {
        Row: {
          browsing_data: Json | null
          created_at: string
          email: string
          id: string
          name: string | null
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
          user_segment: string | null
          widget_preferences: Json | null
        }
        Insert: {
          browsing_data?: Json | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_segment?: string | null
          widget_preferences?: Json | null
        }
        Update: {
          browsing_data?: Json | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_segment?: string | null
          widget_preferences?: Json | null
        }
        Relationships: []
      }
      favorite_widgets: {
        Row: {
          created_at: string
          id: string
          user_id: string
          widget_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          widget_type: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          widget_type?: string
        }
        Relationships: []
      }
      payout_requests: {
        Row: {
          account_holder_name: string | null
          admin_notes: string | null
          amount_credits: number
          amount_rupees: number
          bank_account: string | null
          created_at: string
          id: string
          ifsc_code: string | null
          payment_method: string
          processed_at: string | null
          status: string
          updated_at: string
          upi_id: string | null
          user_id: string
        }
        Insert: {
          account_holder_name?: string | null
          admin_notes?: string | null
          amount_credits: number
          amount_rupees: number
          bank_account?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          payment_method?: string
          processed_at?: string | null
          status?: string
          updated_at?: string
          upi_id?: string | null
          user_id: string
        }
        Update: {
          account_holder_name?: string | null
          admin_notes?: string | null
          amount_credits?: number
          amount_rupees?: number
          bank_account?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          payment_method?: string
          processed_at?: string | null
          status?: string
          updated_at?: string
          upi_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_tiers: {
        Row: {
          badge_color: string
          bonus_credits: number
          created_at: string
          credits_per_referral: number
          id: string
          min_referrals: number
          tier_name: string
        }
        Insert: {
          badge_color?: string
          bonus_credits?: number
          created_at?: string
          credits_per_referral: number
          id?: string
          min_referrals: number
          tier_name: string
        }
        Update: {
          badge_color?: string
          bonus_credits?: number
          created_at?: string
          credits_per_referral?: number
          id?: string
          min_referrals?: number
          tier_name?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          credited_at: string | null
          id: string
          referral_code: string
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          credited_at?: string | null
          id?: string
          referral_code: string
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          credited_at?: string | null
          id?: string
          referral_code?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          end_date: string | null
          id: string
          plan_type: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          plan_type?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          end_date?: string | null
          id?: string
          plan_type?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_credits: {
        Row: {
          created_at: string
          id: string
          redeemed_credits: number
          total_credits: number
          total_referrals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          redeemed_credits?: number
          total_credits?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          redeemed_credits?: number
          total_credits?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      widget_variations: {
        Row: {
          ab_test_id: string
          config: Json
          created_at: string
          id: string
          name: string
          traffic_percentage: number
          updated_at: string
        }
        Insert: {
          ab_test_id: string
          config: Json
          created_at?: string
          id?: string
          name: string
          traffic_percentage?: number
          updated_at?: string
        }
        Update: {
          ab_test_id?: string
          config?: Json
          created_at?: string
          id?: string
          name?: string
          traffic_percentage?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "widget_variations_ab_test_id_fkey"
            columns: ["ab_test_id"]
            isOneToOne: false
            referencedRelation: "ab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_email_rate_limit: { Args: { p_email: string }; Returns: boolean }
      get_creator_multiplier: { Args: { p_user_id: string }; Returns: number }
      has_active_subscription: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_verified_creator: { Args: { p_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
