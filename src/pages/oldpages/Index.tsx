
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        // User is authenticated, redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "خطأ في التحقق من الهوية",
          description: "حدث خطأ أثناء التحقق من صحة تسجيل الدخول",
          variant: "destructive"
        });
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">جاري التحقق من الهوية...</p>
      </div>
    </div>
  );
};

export default Index;
