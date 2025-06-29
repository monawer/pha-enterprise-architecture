
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

export const useAuthCheck = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const requireAuth = (action: string = 'هذا الإجراء') => {
    if (!user) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: `يجب تسجيل الدخول أولاً للقيام بـ${action}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { user, loading, requireAuth, isAuthenticated: !!user };
};
