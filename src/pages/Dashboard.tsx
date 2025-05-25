
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Database, Shield, Users, Layers, Workflow } from "lucide-react";

interface Stats {
  components: number;
  layers: number;
  applications: number;
  services: number;
  users: number;
  policies: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    components: 0,
    layers: 0,
    applications: 0,
    services: 0,
    users: 0,
    policies: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: componentsCount },
          { count: layersCount },
          { count: applicationsCount },
          { count: servicesCount },
          { count: usersCount },
          { count: policiesCount },
        ] = await Promise.all([
          supabase.from('architecture_components').select('*', { count: 'exact', head: true }),
          supabase.from('architecture_layers').select('*', { count: 'exact', head: true }),
          supabase.from('app_applications').select('*', { count: 'exact', head: true }),
          supabase.from('biz_services').select('*', { count: 'exact', head: true }),
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('biz_policies').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          components: componentsCount || 0,
          layers: layersCount || 0,
          applications: applicationsCount || 0,
          services: servicesCount || 0,
          users: usersCount || 0,
          policies: policiesCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "مكونات البنية المؤسسية",
      value: stats.components,
      icon: Building2,
      color: "from-green-500 to-green-600",
      description: "إجمالي المكونات المسجلة"
    },
    {
      title: "الطبقات المعمارية",
      value: stats.layers,
      icon: Layers,
      color: "from-blue-500 to-blue-600",
      description: "طبقات البنية المؤسسية"
    },
    {
      title: "التطبيقات",
      value: stats.applications,
      icon: Database,
      color: "from-purple-500 to-purple-600",
      description: "التطبيقات المدارة"
    },
    {
      title: "الخدمات",
      value: stats.services,
      icon: Workflow,
      color: "from-orange-500 to-orange-600",
      description: "الخدمات المقدمة"
    },
    {
      title: "المستخدمين",
      value: stats.users,
      icon: Users,
      color: "from-pink-500 to-pink-600",
      description: "المستخدمين المسجلين"
    },
    {
      title: "السياسات",
      value: stats.policies,
      icon: Shield,
      color: "from-red-500 to-red-600",
      description: "السياسات المعتمدة"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">لوحة المعلومات</h1>
        <p className="text-green-100 text-lg">نظام إدارة البنية المؤسسية - هيئة الصحة العامة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  {loading ? (
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    stat.value.toLocaleString('ar-SA')
                  )}
                </div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors text-center">
            <Building2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">إضافة مكون جديد</span>
          </button>
          <button className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-center">
            <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">إضافة تطبيق</span>
          </button>
          <button className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-center">
            <Workflow className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">إضافة خدمة</span>
          </button>
          <button className="p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-center">
            <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">إضافة سياسة</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
