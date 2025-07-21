
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile"; // لاستكشاف سياق الجهاز

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
        {/* === زر الهامبرجر في أعلى الصفحة للجوال فقط === */}
        {isMobile && (
          <header className="fixed top-0 right-0 left-0 z-30 h-14 flex items-center px-2 bg-white border-b md:hidden shadow-sm">
            <SidebarTrigger className="ml-2" />
            <div className="flex items-center gap-2 px-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img
                  src="/lovable-uploads/c9d30792-fb30-4f2b-943c-af6559266144.png"
                  alt="شعار هيئة الصحة العامة"
                  className="h-6 w-auto object-contain"
                />
              </div>
              <h1 className="text-base font-bold text-gray-900">
                البنية المؤسسية
              </h1>
            </div>
          </header>
        )}
        {/* الشريط الجانبي سيعمل كـ Drawer تلقائياً للجوال */}
        <AppSidebar user={user} />
        <SidebarInset>
          {/* الهيدر الديسكتوب */}
          {!isMobile && (
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
          )}
          {/* محتوى الصفحة */}
          <main className={`flex-1 overflow-auto ${isMobile ? "mt-14" : ""}`}>
            <div className="p-4 md:p-6 w-full animate-fade-in-up">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
