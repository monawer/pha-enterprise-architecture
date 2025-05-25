
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Settings, 
  FileText, 
  LogOut,
  ChevronDown,
  ChevronRight,
  Users,
  Database,
  User,
  Layers,
  Shield,
  Key
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/usePermissions";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { hasPermission, loading: permissionsLoading } = usePermissions(user);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

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

  const isActive = (path: string) => location.pathname === path;

  // Build admin children based on permissions
  const getAdminChildren = () => {
    const children = [];
    
    if (hasPermission('users.view')) {
      children.push({ title: "إدارة المستخدمين", path: "/admin/users", icon: Users });
    }
    
    if (hasPermission('roles.view')) {
      children.push({ title: "الصلاحيات والأدوار", path: "/admin/roles", icon: Shield });
      children.push({ title: "عرض الأذونات", path: "/admin/permissions", icon: Key });
    }
    
    if (hasPermission('references.view')) {
      children.push({ title: "جداول التعريفات", path: "/admin/references", icon: Database });
    }
    
    // Always show profile edit
    children.push({ title: "تعديل بيانات المستخدم", path: "/profile" });
    
    return children;
  };

  const menuItems = [
    {
      title: "لوحة المعلومات",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      title: "البنية المؤسسية",
      icon: Building2,
      path: "/architecture",
      children: [
        { title: "إدارة الطبقات", path: "/architecture/layers", icon: Layers },
        { title: "طبقة الأعمال", path: "/architecture/business" },
        { title: "طبقة التطبيقات", path: "/architecture/applications" },
        { title: "طبقة التقنية", path: "/architecture/technology" },
        { title: "طبقة البيانات", path: "/architecture/data" },
        { title: "طبقة الأمان", path: "/architecture/security" },
        { title: "طبقة تجربة المستخدم", path: "/architecture/ux" },
      ]
    },
    {
      title: "التقارير",
      icon: FileText,
      path: "/reports",
      show: hasPermission('reports.view') || !user // Show for non-authenticated or with permission
    },
    {
      title: "إعدادات النظام",
      icon: Settings,
      children: getAdminChildren(),
      show: getAdminChildren().length > 1 // Show if has admin permissions or just profile
    }
  ];

  if (permissionsLoading) {
    return (
      <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white h-screen overflow-y-auto">
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
          </div>
        </div>
        <div className="p-4">
          <div className="w-8 h-8 border-2 border-green-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gradient-to-b from-green-800 to-green-900 text-white h-screen overflow-y-auto">
      {/* Header */}
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
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          // Hide items that don't have permission
          if (item.show === false) return null;
          
          return (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.title)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {expandedSections.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedSections.includes(item.title) && (
                    <div className="mr-6 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center space-x-2 space-x-reverse p-2 rounded-md text-sm hover:bg-green-700 transition-colors ${
                            isActive(child.path) ? "bg-green-600" : ""
                          }`}
                        >
                          {child.icon && <child.icon className="w-4 h-4" />}
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-green-700 transition-colors ${
                    isActive(item.path) ? "bg-green-600" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-red-600 transition-colors bg-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
