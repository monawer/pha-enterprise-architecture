
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building, Monitor, Database, Server, Shield, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// 1. تحديد نوع ثابت لأسماء الجداول المسموحة
type LayerTable = 
  | "biz_services"
  | "app_applications"
  | "data_entities"
  | "tech_physical_servers"
  | "sec_devices"
  | "ux_beneficiaries";

interface LayerDef {
  key: string;
  label: string;
  color: string;
  table: LayerTable;
  icon: React.ReactNode;
  path: string;
}

const layers: LayerDef[] = [
  { 
    key: "business", 
    label: "طبقة الأعمال", 
    color: "bg-green-500", 
    table: "biz_services",
    icon: <Building className="w-8 h-8" />,
    path: "/architecture/business"
  },
  { 
    key: "applications", 
    label: "طبقة التطبيقات", 
    color: "bg-orange-500", 
    table: "app_applications",
    icon: <Monitor className="w-8 h-8" />,
    path: "/architecture/applications"
  },
  { 
    key: "data", 
    label: "طبقة البيانات", 
    color: "bg-blue-500", 
    table: "data_entities",
    icon: <Database className="w-8 h-8" />,
    path: "/architecture/data"
  },
  { 
    key: "technology", 
    label: "طبقة التقنية", 
    color: "bg-teal-500", 
    table: "tech_physical_servers",
    icon: <Server className="w-8 h-8" />,
    path: "/architecture/technology"
  },
  { 
    key: "security", 
    label: "طبقة الأمان", 
    color: "bg-red-500", 
    table: "sec_devices",
    icon: <Shield className="w-8 h-8" />,
    path: "/architecture/security"
  },
  { 
    key: "ux", 
    label: "طبقة تجربة المستخدم", 
    color: "bg-pink-500", 
    table: "ux_beneficiaries",
    icon: <Eye className="w-8 h-8" />,
    path: "/architecture/ux"
  },
];

interface StatsState {
  [key: string]: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<StatsState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const out: StatsState = {};
      await Promise.all(
        layers.map(async (l) => {
          // 2. l.table صار نوعه LayerTable وبالتالي يقبله .from كمحدد نوعي صحيح
          const { count } = await supabase
            .from(l.table)
            .select("*", { count: "exact", head: true });
          out[l.key] = count ?? 0;
        })
      );
      setStats(out);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة القيادة</h1>
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
            {layers.map((layer) => {
              const gradientClass = colorClasses[layer.color as keyof typeof colorClasses] || 'from-gray-400 to-gray-600 shadow-gray-200';
              
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
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                          <div className="text-white">
                            {layer.icon}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-white text-center">
                        <div className="text-4xl font-bold mb-2">{stats[layer.key] ?? 0}</div>
                        <div className="text-white/90 text-lg font-medium">{layer.label}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <div className="text-center">
                      <span className="text-sm text-gray-600">عنصر نشط</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min((stats[layer.key] ?? 0) / 10 * 100, 100)}%` }}
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
