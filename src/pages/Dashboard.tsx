
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Database, Shield, Users, Layers, Workflow, Clock, HelpCircle, Share } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
      title: "مكونات البنية",
      value: stats.components,
      icon: Building2,
      color: "from-saudi-green-600 to-saudi-green-800",
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

  // الأخبار والتحديثات
  const recentUpdates = [
    {
      title: "إطلاق نسخة جديدة من النظام",
      time: "قبل ساعتين",
      description: "تم إطلاق النسخة 2.0 من نظام البنية المؤسسية بمميزات جديدة",
      icon: Clock
    },
    {
      title: "تدريب مستخدمي النظام",
      time: "قبل 3 أيام",
      description: "تم الانتهاء من تدريب 25 مستخدم على استخدام النظام",
      icon: Users
    },
    {
      title: "إضافة طبقة الأمان الجديدة",
      time: "قبل أسبوع",
      description: "تمت إضافة طبقة الأمان الجديدة ضمن البنية المؤسسية",
      icon: Shield
    }
  ];

  return (
    <div className="space-y-8">
      {/* الهيدر وشعار هيئة الصحة العامة */}
      <header className="bg-white rounded-xl overflow-hidden shadow-saudi animate-fade-in-up">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-saudi-green-800 to-saudi-green-700 opacity-95"></div>
          <div className="relative z-10 px-8 py-10 md:py-16">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="order-2 md:order-1 text-center md:text-right">
                <h1 className="text-3xl md:text-4xl font-bold text-white saudi-heading">لوحة معلومات البنية المؤسسية</h1>
                <p className="text-saudi-green-100 text-lg mt-2">نظام إدارة البنية المؤسسية - هيئة الصحة العامة</p>
                <div className="mt-4 inline-flex">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm">
                    الإصدار 2.0
                  </span>
                </div>
              </div>
              <div className="order-1 md:order-2 mb-6 md:mb-0">
                <div className="w-24 h-24 bg-white rounded-2xl p-4 shadow-saudi-lg">
                  <img 
                    src="/lovable-uploads/c9d30792-fb30-4f2b-943c-af6559266144.png"
                    alt="هيئة الصحة العامة"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* أشكال زخرفية */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[50px] relative block">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden shadow-saudi hover:shadow-saudi-lg transition-shadow duration-300 border-0">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  {stat.title}
                </CardTitle>
                <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color} transform transition-transform duration-300 hover:scale-105 hover:rotate-6`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  {loading ? (
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="tabular-nums">{stat.value.toLocaleString('ar-SA')}</span>
                      <span className="text-sm text-gray-500 font-normal mr-2">عنصر</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* الأقسام السفلية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* إجراءات سريعة */}
        <Card className="md:col-span-1 shadow-saudi hover:shadow-saudi-lg transition-shadow duration-300 border-0">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Share className="w-5 h-5 text-saudi-green-700" /> 
              <span>إجراءات سريعة</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              <button className="w-full p-4 flex items-center text-right hover:bg-saudi-green-50 transition-colors duration-200">
                <Building2 className="w-5 h-5 text-saudi-green-600 ml-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">إضافة مكون جديد</div>
                  <div className="text-xs text-gray-500">إضافة مكون للبنية المؤسسية</div>
                </div>
              </button>
              <button className="w-full p-4 flex items-center text-right hover:bg-saudi-green-50 transition-colors duration-200">
                <Database className="w-5 h-5 text-saudi-green-600 ml-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">إضافة تطبيق</div>
                  <div className="text-xs text-gray-500">تسجيل تطبيق جديد في النظام</div>
                </div>
              </button>
              <button className="w-full p-4 flex items-center text-right hover:bg-saudi-green-50 transition-colors duration-200">
                <Workflow className="w-5 h-5 text-saudi-green-600 ml-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">إضافة خدمة</div>
                  <div className="text-xs text-gray-500">تسجيل خدمة جديدة</div>
                </div>
              </button>
              <button className="w-full p-4 flex items-center text-right hover:bg-saudi-green-50 transition-colors duration-200">
                <Shield className="w-5 h-5 text-saudi-green-600 ml-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">إضافة سياسة</div>
                  <div className="text-xs text-gray-500">إنشاء سياسة جديدة</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* آخر التحديثات والإشعارات */}
        <Card className="md:col-span-2 shadow-saudi hover:shadow-saudi-lg transition-shadow duration-300 border-0">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-saudi-green-700" /> 
              <span>آخر التحديثات</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentUpdates.map((update, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-saudi-green-50 text-saudi-green-700">
                      <update.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900">{update.title}</h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{update.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{update.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-4 text-center">
                <button className="text-saudi-green-700 text-sm hover:text-saudi-green-800 hover:underline">
                  عرض كل التحديثات
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قسم المساعدة السريعة */}
      <div className="bg-white rounded-xl p-6 shadow-saudi animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-saudi-green-700 text-white">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold">هل تحتاج إلى مساعدة؟</h3>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">دليل المستخدم</h4>
            <p className="text-sm text-gray-600">اطلع على دليل استخدام النظام والإرشادات</p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">الأسئلة الشائعة</h4>
            <p className="text-sm text-gray-600">الإجابات على الأسئلة المتكررة</p>
          </div>
          <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <h4 className="font-medium text-gray-900 mb-2">التواصل مع الدعم</h4>
            <p className="text-sm text-gray-600">تواصل مع فريق الدعم الفني للمساعدة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
