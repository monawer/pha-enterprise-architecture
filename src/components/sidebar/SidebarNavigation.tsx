
import { 
  LayoutDashboard, 
  Building2, 
  Settings, 
  FileText,
  Users,
  Database,
  User,
  Layers,
  Shield,
  Key
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { User as SupabaseUser } from "@supabase/supabase-js";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarNavigationProps {
  user: SupabaseUser | null;
}

const SidebarNavigation = ({ user }: SidebarNavigationProps) => {
  const { hasPermission } = usePermissions(user);

  // Build admin children based on permissions
  const getAdminChildren = () => {
    const children = [];
    
    console.log('Building admin menu. User:', user?.email);
    
    if (hasPermission('users.view')) {
      console.log('Adding users menu item');
      children.push({ title: "إدارة المستخدمين", path: "/admin/users", icon: Users });
    }
    
    if (hasPermission('roles.view')) {
      console.log('Adding roles and permissions menu items');
      children.push({ title: "الصلاحيات والأدوار", path: "/admin/roles", icon: Shield });
      children.push({ title: "عرض الأذونات", path: "/admin/permissions", icon: Key });
    }
    
    if (hasPermission('references.view')) {
      console.log('Adding references menu item');
      children.push({ title: "جداول التعريفات", path: "/admin/references", icon: Database });
    }
    
    // Always show profile edit
    children.push({ title: "تعديل بيانات المستخدم", path: "/profile", icon: User });
    
    console.log('Admin menu children:', children.length);
    return children;
  };

  const menuItems = [
    {
      title: "لوحة المعلومات",
      icon: LayoutDashboard,
      path: "/",
      show: hasPermission('dashboard.view') || !user
    },
    {
      title: "البنية المؤسسية",
      icon: Building2,
      path: "/architecture",
      show: hasPermission('architecture.view') || !user,
      children: [
        { title: "إدارة الطبقات", path: "/architecture/layers", icon: Layers, show: hasPermission('architecture.layers.manage') || hasPermission('architecture.view') },
        { title: "طبقة الأعمال", path: "/architecture/business", show: hasPermission('architecture.view') },
        { title: "طبقة التطبيقات", path: "/architecture/applications", show: hasPermission('architecture.view') },
        { title: "طبقة التقنية", path: "/architecture/technology", show: hasPermission('architecture.view') },
        { title: "طبقة البيانات", path: "/architecture/data", show: hasPermission('architecture.view') },
        { title: "طبقة الأمان", path: "/architecture/security", show: hasPermission('architecture.view') },
        { title: "طبقة تجربة المستخدم", path: "/architecture/ux", show: hasPermission('architecture.view') },
      ]
    },
    {
      title: "التقارير",
      icon: FileText,
      path: "/reports",
      show: hasPermission('reports.view') || !user
    },
    {
      title: "إعدادات النظام",
      icon: Settings,
      children: getAdminChildren(),
      show: getAdminChildren().length > 1
    }
  ];

  return (
    <nav className="p-4 space-y-2">
      {menuItems.map((item) => {
        if (item.show === false) {
          console.log(`Hiding menu item: ${item.title}`);
          return null;
        }
        
        return (
          <SidebarMenuItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            path={item.path}
            children={item.children}
            show={item.show}
          />
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
