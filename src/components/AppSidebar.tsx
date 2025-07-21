import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Home,
  Building,
  Monitor,
  Database,
  Server,
  Shield,
  Eye,
  Settings,
  LogOut,
  Workflow
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AppSidebarProps {
  user: SupabaseUser | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نراكم قريباً",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    {
      title: "الصفحة الرئيسية",
      icon: Home,
      path: "/",
      show: true
    },
    {
      title: "المناظير المؤسسية",
      icon: Workflow,
      path: "/architecture/views",
      show: true
    },
        {
      title: "النموذج العام",
      icon: Workflow,
      path: "/architecture/metamodel",
      show: true
    },
    {
      title: "طبقة الأعمال",
      icon: Building,
      path: "/architecture/business",
      show: true
    },
    {
      title: "طبقة التطبيقات", 
      icon: Monitor,
      path: "/architecture/applications",
      show: true
    },
    {
      title: "طبقة البيانات",
      icon: Database,
      path: "/architecture/data",
      show: true
    },
    {
      title: "طبقة التقنية",
      icon: Server,
      path: "/architecture/technology",
      show: true
    },
    {
      title: "طبقة الأمان",
      icon: Shield,
      path: "/architecture/security",
      show: true
    },
    {
      title: "طبقة تجربة المستخدم",
      icon: Eye,
      path: "/architecture/ux",
      show: true
    },
    {
      title: "الإعدادات",
      icon: Settings,
      path: "/settings",
      show: true
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar side="right">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-center mb-4 p-4">
          <div className="w-45 h-25 flex items-center justify-center rounded-xl bg-white shadow-saudi p-2">
            <img 
              src="/lovable-uploads/c9d30792-fb30-4f2b-943c-af6559266144.png" 
              alt="شعار هيئة الصحة العامة" 
              className="h-auto w-auto object-contain"
            />
          </div>
        </div>
        <div className="text-center px-4">
          <h2 className="font-bold text-base text-sidebar-foreground">البنية المؤسسية</h2>
          <p className="text-sidebar-foreground/70 text-sm">هيئة الصحة العامة</p>
          {user && (
            <div className="mt-3 py-2 px-3 bg-sidebar-accent/20 rounded-lg">
              <p className="text-xs text-sidebar-foreground/80 truncate">
                {user.email}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            if (!item.show) return null;
            
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={isActive(item.path)}>
                  <Link to={item.path}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
