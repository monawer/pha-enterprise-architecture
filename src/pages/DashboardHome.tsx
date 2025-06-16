
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building, Monitor, Database, Server, Shield, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface LayerComponent {
  name: string;
  table: string;
  count: number;
}

interface LayerDef {
  key: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  path: string;
  components: LayerComponent[];
}

const layers: LayerDef[] = [
  { 
    key: "business", 
    label: "طبقة الأعمال", 
    color: "bg-green-500", 
    icon: <Building className="w-8 h-8" />,
    path: "/architecture/business",
    components: [
      { name: "الخدمات", table: "biz_services", count: 0 },
      { name: "السياسات", table: "biz_policies", count: 0 },
      { name: "الإجراءات", table: "biz_procedures", count: 0 },
      { name: "الفروع", table: "biz_branches", count: 0 },
      { name: "القدرات", table: "biz_capabilities", count: 0 }
    ]
  },
    { 
    key: "technology", 
    label: "طبقة التقنية", 
    color: "bg-teal-500", 
    icon: <Server className="w-8 h-8" />,
    path: "/architecture/technology",
    components: [
      { name: "الخوادم المادية", table: "tech_physical_servers", count: 0 },
      { name: "الخوادم الافتراضية", table: "tech_virtual_servers", count: 0 },
      { name: "أجهزة الشبكة", table: "tech_network_devices", count: 0 },
      { name: "مراكز البيانات", table: "tech_data_centers", count: 0 },
      { name: "التراخيص", table: "tech_licenses", count: 0 }
    ]
  },
  { 
    key: "applications", 
    label: "طبقة التطبيقات", 
    color: "bg-orange-500", 
    icon: <Monitor className="w-8 h-8" />,
    path: "/architecture/applications",
    components: [
      { name: "التطبيقات", table: "app_applications", count: 0 },
      { name: "قواعد البيانات", table: "app_databases", count: 0 },
      { name: "الروابط التقنية", table: "app_technical_links", count: 0 }
    ]
  },
  { 
    key: "data", 
    label: "طبقة البيانات", 
    color: "bg-blue-500", 
    icon: <Database className="w-8 h-8" />,
    path: "/architecture/data",
    components: [
      { name: "كيانات البيانات", table: "data_entities", count: 0 },
      { name: "مخازن البيانات", table: "data_storage", count: 0 }
    ]
  },

  { 
    key: "security", 
    label: "طبقة الأمان", 
    color: "bg-red-500", 
    icon: <Shield className="w-8 h-8" />,
    path: "/architecture/security",
    components: [
      { name: "أجهزة الأمان", table: "sec_devices", count: 0 },
      { name: "خدمات الأمان", table: "sec_services", count: 0 },
      { name: "برامج الأمان", table: "sec_software", count: 0 }
    ]
  },
  { 
    key: "ux", 
    label: "طبقة تجربة المستخدم", 
    color: "bg-pink-500", 
    icon: <Eye className="w-8 h-8" />,
    path: "/architecture/ux",
    components: [
      { name: "المستفيدون", table: "ux_beneficiaries", count: 0 },
      { name: "الشخصيات", table: "ux_personas", count: 0 },
      { name: "المراحل", table: "ux_stages", count: 0 }
    ]
  },
];

const DashboardHome: React.FC = () => {
  const [layersData, setLayersData] = useState<LayerDef[]>(layers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const updatedLayers = [...layers];
      
      for (let layerIndex = 0; layerIndex < updatedLayers.length; layerIndex++) {
        const layer = updatedLayers[layerIndex];
        for (let compIndex = 0; compIndex < layer.components.length; compIndex++) {
          const component = layer.components[compIndex];
          try {
            const { count } = await supabase
              .from(component.table as any)
              .select("*", { count: "exact", head: true });
            updatedLayers[layerIndex].components[compIndex].count = count ?? 0;
          } catch (error) {
            console.error(`Error fetching count for ${component.table}:`, error);
            updatedLayers[layerIndex].components[compIndex].count = 0;
          }
        }
      }
      
      setLayersData(updatedLayers);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const colorClasses = {
    'bg-green-500': 'from-green-400 to-green-600 shadow-green-200',
    'bg-orange-500': 'from-orange-400 to-orange-600 shadow-orange-200',
    'bg-blue-500': 'from-blue-400 to-blue-600 shadow-blue-200',
    'bg-teal-500': 'from-teal-400 to-teal-600 shadow-teal-200',
    'bg-red-500': 'from-red-400 to-red-600 shadow-red-200',
    'bg-pink-500': 'from-pink-400 to-pink-600 shadow-pink-200',
  };

  const getTotalCount = (components: LayerComponent[]) => {
    return components.reduce((total, comp) => total + comp.count, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الصفحة الرئيسية</h1>
            <p className="text-gray-600">نظرة شاملة على البنية المؤسسية ومكوناتها الأساسية</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layersData.map((layer) => {
              const gradientClass = colorClasses[layer.color as keyof typeof colorClasses] || 'from-gray-400 to-gray-600 shadow-gray-200';
              const totalCount = getTotalCount(layer.components);
              
              return (
                <Link 
                  key={layer.key} 
                  to={layer.path}
                  className="block group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-0 shadow-lg hover:-translate-y-1 rounded-lg overflow-hidden"
                >
                  <div className={`bg-gradient-to-br ${gradientClass} p-6 relative overflow-hidden`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-8 -translate-y-8"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-4 translate-y-4"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                          <div className="text-white">
                            {layer.icon}
                          </div>
                        </div>
                        <div className="text-white text-right">
                          <div className="text-2xl font-bold">{totalCount}</div>
                          <div className="text-white/90 text-sm">إجمالي العناصر</div>
                        </div>
                      </div>
                      
                      <div className="text-white text-center mb-4">
                        <div className="text-white/90 text-lg font-medium">{layer.label}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <div className="space-y-2">
                      {layer.components.map((component, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{component.name}</span>
                          <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                            {component.count}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(totalCount / 50 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
