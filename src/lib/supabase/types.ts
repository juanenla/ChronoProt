/**
 * ChronoPro - Database Types
 * Tipos generados para Supabase
 */

export interface Database {
    public: {
        Tables: {
            user_responses: {
                Row: {
                    id: string;
                    created_at: string;
                    chronotype: 'morning' | 'intermediate' | 'evening';
                    training_time: 'morning' | 'midday' | 'afternoon' | 'night';
                    frequency: 'low' | 'moderate' | 'high';
                    diet: string;
                    experience: 'beginner' | 'intermediate' | 'advanced';
                    supplements: string[];
                    goal: 'hypertrophy' | 'strength' | 'both';
                    ip_hash: string | null;
                    user_agent: string | null;
                    plan_generated: Record<string, unknown> | null;
                };
                Insert: Omit<Database['public']['Tables']['user_responses']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['user_responses']['Insert']>;
            };
            admin_users: {
                Row: {
                    id: string;
                    email: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
            };
            exercises: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    muscle_group: string;
                    equipment: string | null;
                    difficulty: string | null;
                    description: string | null;
                };
                Insert: Omit<Database['public']['Tables']['exercises']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['exercises']['Insert']>;
            };
        };
    };
}
