
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
  Key,
  Building,
  Monitor,
  Server,
  HardDrive,
  Eye,
  UserCheck,
  Home
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { User as SupabaseUser } from "@supabase/supabase-js";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarNavigationProps {
  user: SupabaseUser | null;
}

const SidebarNavigation = ({ user }: SidebarNavigationProps) => {
  const { hasPermission } = usePermissions(user);

  const menuItems = [
    {
      title: "الصفحة الرئيسية",
      icon: Home,
      path: "/",
      show: true
    },
    {
      title: "طبقة الأعمال",
      icon: Building,
      path: "/architecture/business",
      show: hasPermission('architecture.view')
    },
    {
      title: "طبقة التطبيقات", 
      icon: Monitor,
      path: "/architecture/applications",
      show: hasPermission('architecture.view')
    },
    {
      title: "طبقة البيانات",
      icon: Database,
      path: "/architecture/data",
      show: hasPermission('architecture.view')
    },
    {
      title: "طبقة التقنية",
      icon: Server,
      path: "/architecture/technology",
      show: hasPermission('architecture.view')
    },
    {
      title: "طبقة الأمان",
      icon: Shield,
      path: "/architecture/security",
      show: hasPermission('architecture.view')
    },
    {
      title: "طبقة تجربة المستخدم",
      icon: Eye,
      path: "/architecture/ux",
      show: hasPermission('architecture.view')
    },
    {
      title: "الإعدادات",
      icon: Settings,
      path: "/settings",
      show: hasPermission('references.view')
    }
  ];

  return (
    <nav className="mt-8 px-4">
      <div className="space-y-2">
        {menuItems.map((item) => (
          <SidebarMenuItem
            key={item.path || item.title}
            title={item.title}
            icon={item.icon}
            path={item.path}
            show={item.show}
          />
        ))}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
