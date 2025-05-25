
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SidebarLogout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نراك قريباً",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "خطأ في تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="absolute bottom-4 left-4 right-4">
      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-red-600 transition-colors bg-red-500"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">تسجيل الخروج</span>
      </button>
    </div>
  );
};

export default SidebarLogout;
