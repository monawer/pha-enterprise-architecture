
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Sidebar from "../Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user && event !== 'INITIAL_SESSION') {
          navigate("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-saudi-green-50 to-white flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-24 h-24 mx-auto mb-6">
            <img 
              src="/lovable-uploads/c9d30792-fb30-4f2b-943c-af6559266144.png" 
              alt="شعار هيئة الصحة العامة" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-saudi-green-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-3 h-3 bg-saudi-green-700 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 bg-saudi-green-800 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-saudi-green-700 text-lg font-saudi mt-4">جاري تحميل النظام...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
