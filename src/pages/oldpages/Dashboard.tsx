
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building, 
  Monitor, 
  Database, 
  Server, 
  Shield, 
  Eye,
  Users,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const architectureLayers = [
    {
      title: "طبقة الأعمال",
      description: "الخدمات والإجراءات والسياسات",
      icon: Building,
      path: "/architecture/business",
      color: "from-blue-500 to-blue-600",
      show: true
    },
    {
      title: "طبقة التطبيقات",
      description: "التطبيقات وقواعد البيانات والروابط التقنية",
      icon: Monitor,
      path: "/architecture/applications",
      color: "from-green-500 to-green-600",
      show: true
    },
    {
      title: "طبقة البيانات",
      description: "كيانات البيانات وأماكن التخزين",
      icon: Database,
      path: "/architecture/data",
      color: "from-purple-500 to-purple-600",
      show: true
    },
    {
      title: "طبقة التقنية",
      description: "الخوادم والشبكات ومراكز البيانات",
      icon: Server,
      path: "/architecture/technology",
      color: "from-orange-500 to-orange-600",
      show: true
    },
    {
      title: "طبقة الأمان",
      description: "أجهزة وخدمات وبرمجيات الأمان",
      icon: Shield,
      path: "/architecture/security",
      color: "from-red-500 to-red-600",
      show: true
    },
    {
      title: "طبقة تجربة المستخدم",
      description: "الشخصيات والرحلات والمراحل",
      icon: Eye,
      path: "/architecture/ux",
      color: "from-pink-500 to-pink-600",
      show: true
    }
  ];

  const adminModules = [
    {
      title: "التقارير والإحصائيات",
      description: "تقارير النظام والبيانات",
      icon: BarChart3,
      path: "/reports",
      show: true
    }
  ];

  const visibleLayers = architectureLayers.filter(layer => layer.show);
  const visibleAdminModules = adminModules.filter(module => module.show);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-3 md:space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 font-saudi">
          الإدارة التنفيذية لتقنية المعلومات - هيئة الصحة العامة
        </h1>
     
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-saudi-green-50 to-white rounded-lg p-4 md:p-8 text-center">
          <h3 className="text-lg md:text-2xl font-bold text-saudi-green-800 mb-2 md:mb-4">
            نظام إدارة البنية المؤسسية 
          </h3>
          <h3>منصة شاملة لإدارة وتطوير الخدمات والتطبيقات</h3>
          <p className="text-sm md:text-lg text-saudi-green-700">
            استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة أو اختر من البطاقات أدناه
          </p>
        </div>
      </div>

      {/* Architecture Layers Grid */}
      {visibleLayers.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
            طبقات البنية المؤسسية
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {visibleLayers.map((layer) => {
              const IconComponent = layer.icon;
              return (
                <Link key={layer.path} to={layer.path}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <CardHeader className="text-center pb-3 md:pb-4">
                      <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-gradient-to-r ${layer.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
                        {layer.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <p className="text-sm md:text-base text-gray-600">
                        {layer.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin Modules */}
      {visibleAdminModules.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center">
            وحدات الإدارة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {visibleAdminModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Link key={module.path} to={module.path}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <CardHeader className="text-center pb-3 md:pb-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg md:text-xl font-bold text-gray-900">
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <p className="text-sm md:text-base text-gray-600">
                        {module.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
