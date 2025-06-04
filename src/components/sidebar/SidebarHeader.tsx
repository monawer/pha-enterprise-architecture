
import { User as SupabaseUser } from "@supabase/supabase-js";

interface SidebarHeaderProps {
  user: SupabaseUser | null;
}

const SidebarHeader = ({ user }: SidebarHeaderProps) => {
  return (
    <div className="p-6 border-b border-sidebar-border">
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white shadow-saudi p-2">
          <img 
            src="/lovable-uploads/c9d30792-fb30-4f2b-943c-af6559266144.png" 
            alt="شعار هيئة الصحة العامة" 
            className="h-12 w-auto object-contain"
          />
        </div>
      </div>
      <div className="text-center">
        <h2 className="font-bold text-lg text-white">البنية المؤسسية</h2>
        <p className="text-green-100 text-sm">هيئة الصحة العامة</p>
        {user && (
          <div className="mt-3 py-1 px-2 bg-sidebar-accent/20 rounded-lg">
          <p className="text-green-100 text-xs opacity-80 truncate">{user.email}</p> 
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
