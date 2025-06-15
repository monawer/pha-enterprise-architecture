
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarLogout from "./sidebar/SidebarLogout";

const Sidebar = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Sidebar: Current user:', user?.email);
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white h-screen overflow-y-auto">
      <SidebarHeader user={user} />
      <SidebarNavigation user={user} />
      <SidebarLogout />
    </div>
  );
};

export default Sidebar;
