
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/hooks/usePermissions";
import { User as SupabaseUser } from "@supabase/supabase-js";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarLogout from "./sidebar/SidebarLogout";

const Sidebar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { loading: permissionsLoading } = usePermissions(user);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Sidebar: Current user:', user?.email);
      setUser(user);
    };
    getUser();
  }, []);

  if (permissionsLoading) {
    return (
      <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white h-screen overflow-y-auto">
        <SidebarHeader user={user} />
        <div className="p-4">
          <div className="w-8 h-8 border-2 border-green-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-center mt-2 text-sm">جاري تحميل الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white h-screen overflow-y-auto">
      <SidebarHeader user={user} />
      <SidebarNavigation user={user} />
      <SidebarLogout />
    </div>
  );
};

export default Sidebar;
