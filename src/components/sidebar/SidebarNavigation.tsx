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
  Home,
  Workflow
} from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarNavigationProps {
  user: SupabaseUser | null;
}

const SidebarNavigation = ({ user }: SidebarNavigationProps) => {
  const menuItems = [
    {
      title: "لوحة القيادة",
      icon: LayoutDashboard,
      path: "/",
      show: true
    },
    {
      title: "المناظر المعمارية",
      icon: Workflow,
      path: "/architecture/views",
      show: true
    },
    {
      title: "عن توجاف ونورة",
      icon: Layers,
      path: "/info/togaf-nora",
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
            rtl={true}
          />
        ))}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
