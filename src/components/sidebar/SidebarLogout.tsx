
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
    <div className="p-4 mt-auto border-t border-green-700/30">
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-start space-x-3 space-x-reverse p-3 rounded-lg bg-green-700/20 hover:bg-green-700/40 transition-all duration-200 text-green-100 hover:text-white group border border-green-600/30 hover:border-green-500"
      >
        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium text-sm">تسجيل الخروج</span>
      </button>
    </div>
  );
};

export default SidebarLogout;
