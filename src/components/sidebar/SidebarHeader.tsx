
import { User as SupabaseUser } from "@supabase/supabase-js";

interface SidebarHeaderProps {
  user: SupabaseUser | null;
}

const SidebarHeader = ({ user }: SidebarHeaderProps) => {
  return (
    <div className="p-6 border-b border-green-700">
      <div className="flex items-center justify-center mb-4">
        <img 
          src="/lovable-uploads/c9d30792-fb30-4f2b-943c-af6559266144.png" 
          alt="شعار هيئة الصحة العامة" 
          className="h-16 w-auto"
        />
      </div>
      <div className="text-center">
        <h2 className="font-bold text-lg">البنية المؤسسية</h2>
        <p className="text-green-300 text-sm">هيئة الصحة العامة</p>
        {user && (
          <p className="text-green-200 text-xs mt-1">{user.email}</p>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
