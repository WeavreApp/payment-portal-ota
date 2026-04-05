import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Mock Supabase client for development without database
const mockSupabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        then: (resolve: any) => resolve({ data: [], error: null })
      }),
      then: (resolve: any) => resolve({ data: [], error: null })
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: { ...data, id: 'mock-id' }, error: null })
      })
    }),
    update: (data: any) => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { ...data }, error: null })
        })
      })
    })
  }),
  auth: {
    signInWithPassword: async (email: string, password: string) => {
      return { data: { user: { id: 'mock-user', email } }, error: null };
    },
    signUp: async (email: string, password: string) => {
      return { data: { user: { id: 'mock-user', email } }, error: null };
    },
    signOut: async () => {
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      callback({ session: { user: { id: 'mock-user', email: 'mock@example.com' } } });
      return { data: { subscription: { unsubscribe: () => {} } } as any };
    }
  }
};

// Use real Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
