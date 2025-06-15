
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../AppSidebar";

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
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6">
            <img 
              src="/lovable-uploads/c9d30792-fb30-4f2b-943c-af6559266144.png" 
              alt="شعار هيئة الصحة العامة" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-saudi-green-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
            <div className="w-2 h-2 md:w-3 md:h-3 bg-saudi-green-700 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 md:w-3 md:h-3 bg-saudi-green-800 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-saudi-green-700 text-base md:text-lg font-saudi mt-4">جاري تحميل النظام...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50" dir="rtl">
        <AppSidebar user={user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/c9d30792-fb30-4f2b-943c-af6559266144.png" 
                  alt="شعار هيئة الصحة العامة" 
                  className="h-6 w-auto object-contain"
                />
              </div>
              <h1 className="text-lg font-bold text-gray-900 hidden sm:block">
                البنية المؤسسية
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in-up">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
