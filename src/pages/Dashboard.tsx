
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Database, Shield, Users, Monitor, Server, Building, Eye } from "lucide-react";

interface LayerStats {
  businessLayer: number;
  applicationsLayer: number;
  dataLayer: number;
  technologyLayer: number;
  securityLayer: number;
  uxLayer: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<LayerStats>({
    businessLayer: 0,
    applicationsLayer: 0,
    dataLayer: 0,
    technologyLayer: 0,
    securityLayer: 0,
    uxLayer: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayerStats = async () => {
      try {
        const [
          { count: servicesCount },
          { count: policiesCount },
          { count: capabilitiesCount },
          { count: branchesCount },
          { count: businessOwnersCount },
          { count: formsCount },
          { count: proceduresCount },
          { count: applicationsCount },
          { count: databasesCount },
          { count: technicalLinksCount },
          { count: dataEntitiesCount },
          { count: dataStorageCount },
          { count: physicalServersCount },
          { count: virtualServersCount },
          { count: networkDevicesCount },
          { count: dataCentersCount },
          { count: networksCount },
          { count: licensesCount },
          { count: systemsCount },
          { count: securityDevicesCount },
          { count: securityServicesCount },
          { count: securitySoftwareCount },
          { count: uxPersonasCount },
          { count: uxJourneysCount },
          { count: uxBeneficiariesCount },
        ] = await Promise.all([
          supabase.from('biz_services').select('*', { count: 'exact', head: true }),
          supabase.from('biz_policies').select('*', { count: 'exact', head: true }),
          supabase.from('biz_capabilities').select('*', { count: 'exact', head: true }),
          supabase.from('biz_branches').select('*', { count: 'exact', head: true }),
          supabase.from('biz_business_owners').select('*', { count: 'exact', head: true }),
          supabase.from('biz_forms').select('*', { count: 'exact', head: true }),
          supabase.from('biz_procedures').select('*', { count: 'exact', head: true }),
          supabase.from('app_applications').select('*', { count: 'exact', head: true }),
          supabase.from('app_databases').select('*', { count: 'exact', head: true }),
          supabase.from('app_technical_links').select('*', { count: 'exact', head: true }),
          supabase.from('data_entities').select('*', { count: 'exact', head: true }),
          supabase.from('data_storage').select('*', { count: 'exact', head: true }),
          supabase.from('tech_physical_servers').select('*', { count: 'exact', head: true }),
          supabase.from('tech_virtual_servers').select('*', { count: 'exact', head: true }),
          supabase.from('tech_network_devices').select('*', { count: 'exact', head: true }),
          supabase.from('tech_data_centers').select('*', { count: 'exact', head: true }),
          supabase.from('tech_networks').select('*', { count: 'exact', head: true }),
          supabase.from('tech_licenses').select('*', { count: 'exact', head: true }),
          supabase.from('tech_systems').select('*', { count: 'exact', head: true }),
          supabase.from('sec_devices').select('*', { count: 'exact', head: true }),
          supabase.from('sec_services').select('*', { count: 'exact', head: true }),
          supabase.from('sec_software').select('*', { count: 'exact', head: true }),
          supabase.from('ux_personas').select('*', { count: 'exact', head: true }),
          supabase.from('ux_journeys').select('*', { count: 'exact', head: true }),
          supabase.from('ux_beneficiaries').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          businessLayer: (servicesCount || 0) + (policiesCount || 0) + (capabilitiesCount || 0) + (branchesCount || 0) + (businessOwnersCount || 0) + (formsCount || 0) + (proceduresCount || 0),
          applicationsLayer: (applicationsCount || 0) + (databasesCount || 0) + (technicalLinksCount || 0),
          dataLayer: (dataEntitiesCount || 0) + (dataStorageCount || 0),
          technologyLayer: (physicalServersCount || 0) + (virtualServersCount || 0) + (networkDevicesCount || 0) + (dataCentersCount || 0) + (networksCount || 0) + (licensesCount || 0) + (systemsCount || 0),
          securityLayer: (securityDevicesCount || 0) + (securityServicesCount || 0) + (securitySoftwareCount || 0),
          uxLayer: (uxPersonasCount || 0) + (uxJourneysCount || 0) + (uxBeneficiariesCount || 0),
        });
      } catch (error) {
        console.error('Error fetching layer stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLayerStats();
  }, []);

  const layerCards = [
    {
      title: "طبقة الأعمال",
      value: stats.businessLayer,
      icon: Building,
      color: "from-saudi-green-600 to-saudi-green-800",
      description: "الخدمات والسياسات والقدرات والفروع",
      components: ["الخدمات", "السياسات", "القدرات", "الفروع", "مالكي الأعمال", "النماذج", "الإجراءات"]
    },
    {
      title: "طبقة التطبيقات",
      value: stats.applicationsLayer,
      icon: Monitor,
      color: "from-blue-500 to-blue-600",
      description: "التطبيقات وقواعد البيانات والروابط التقنية",
      components: ["التطبيقات", "قواعد البيانات", "الروابط التقنية"]
    },
    {
      title: "طبقة البيانات",
      value: stats.dataLayer,
      icon: Database,
      color: "from-purple-500 to-purple-600",
      description: "كيانات البيانات وأنواع التخزين",
      components: ["كيانات البيانات", "أنواع التخزين"]
    },
    {
      title: "طبقة التقنية",
      value: stats.technologyLayer,
      icon: Server,
      color: "from-orange-500 to-orange-600",
      description: "الخوادم والأجهزة والأنظمة التقنية",
      components: ["الخوادم الفيزيائية", "الخوادم الافتراضية", "أجهزة الشبكة", "مراكز البيانات", "الشبكات", "التراخيص", "الأنظمة"]
    },
    {
      title: "طبقة الأمان",
      value: stats.securityLayer,
      icon: Shield,
      color: "from-red-500 to-red-600",
      description: "أجهزة وخدمات وبرامج الأمان",
      components: ["أجهزة الأمان", "خدمات الأمان", "برامج الأمان"]
    },
    {
      title: "طبقة تجربة المستخدم",
      value: stats.uxLayer,
      icon: Eye,
      color: "from-pink-500 to-pink-600",
      description: "الشخصيات والرحلات والمستفيدين",
      components: ["الشخصيات", "رحلات المستخدم", "المستفيدين"]
    },
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
          
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[50px] relative block">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>
      </header>

      {/* بطاقات إحصائيات الطبقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {layerCards.map((layer, index) => (
          <Card key={index} className="overflow-hidden shadow-saudi hover:shadow-saudi-lg transition-all duration-300 border-0 group cursor-pointer hover:-translate-y-1">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-saudi-green-700 transition-colors">
                  {layer.title}
                </CardTitle>
                <div className={`p-3 rounded-full bg-gradient-to-br ${layer.color} transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  <layer.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <div className="text-3xl font-bold text-gray-900">
                  {loading ? (
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="tabular-nums">{layer.value.toLocaleString('ar-SA')}</span>
                      <span className="text-sm text-gray-500 font-normal mr-2">عنصر</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{layer.description}</p>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-700 mb-2">المكونات:</h4>
                <div className="flex flex-wrap gap-1">
                  {layer.components.slice(0, 3).map((component, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                      {component}
                    </span>
                  ))}
                  {layer.components.length > 3 && (
                    <span className="px-2 py-1 bg-saudi-green-50 text-xs text-saudi-green-600 rounded-full">
                      +{layer.components.length - 3} أخرى
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-saudi-green-50 to-green-50 rounded-lg p-8 border border-saudi-green-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-saudi-green-800 font-saudi">نظرة شاملة على البنية المؤسسية</h3>
          <p className="text-saudi-green-600 font-saudi text-lg">
            إجمالي العناصر المدارة عبر جميع الطبقات
          </p>
          <div className="flex justify-center items-center space-x-8 space-x-reverse mt-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-saudi-green-700">
                {loading ? "..." : (stats.businessLayer + stats.applicationsLayer + stats.dataLayer + stats.technologyLayer + stats.securityLayer + stats.uxLayer).toLocaleString('ar-SA')}
              </div>
              <div className="text-sm text-saudi-green-600">إجمالي العناصر</div>
            </div>
            <div className="w-px h-12 bg-saudi-green-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-saudi-green-700">6</div>
              <div className="text-sm text-saudi-green-600">طبقات معمارية</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
