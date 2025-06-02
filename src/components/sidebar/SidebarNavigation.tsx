
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
  UserCheck
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { User as SupabaseUser } from "@supabase/supabase-js";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarNavigationProps {
  user: SupabaseUser | null;
}

const SidebarNavigation = ({ user }: SidebarNavigationProps) => {
  const { permissions } = usePermissions(user);

  const menuItems = [
    {
      title: "لوحة التحكم",
      icon: LayoutDashboard,
      path: "/",
      show: true
    },
    {
      title: "البنية المؤسسية",
      icon: Layers,
      show: permissions.canViewArchitecture,
      children: [
        {
          title: "طبقة الأعمال",
          icon: Building,
          path: "/architecture/business",
          show: permissions.canViewBusinessLayer
        },
        {
          title: "طبقة التطبيقات", 
          icon: Monitor,
          path: "/architecture/applications",
          show: permissions.canViewApplicationsLayer
        },
        {
          title: "طبقة البيانات",
          icon: Database,
          path: "/architecture/data",
          show: permissions.canViewDataLayer
        },
        {
          title: "طبقة التقنية",
          icon: Server,
          path: "/architecture/technology",
          show: permissions.canViewTechnologyLayer
        },
        {
          title: "طبقة الأمان",
          icon: Shield,
          path: "/architecture/security",
          show: permissions.canViewSecurityLayer
        },
        {
          title: "طبقة تجربة المستخدم",
          icon: Eye,
          path: "/architecture/ux",
          show: permissions.canViewUXLayer
        }
      ]
    },
    {
      title: "إدارة المستخدمين",
      icon: Users,
      path: "/users",
      show: permissions.canViewUsers
    },
    {
      title: "إدارة الأدوار",
      icon: Key,
      path: "/roles",
      show: permissions.canViewRoles
    },
    {
      title: "الملف الشخصي",
      icon: User,
      path: "/profile",
      show: true
    },
    {
      title: "الإعدادات",
      icon: Settings,
      path: "/settings",
      show: permissions.canViewSettings
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
            children={item.children}
            show={item.show}
          />
        ))}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
