import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Server, 
  HardDrive, 
  Wifi,
  Building2,
  Network,
  FileText,
  Settings
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import LayerStatsCard from '@/components/layer/LayerStatsCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const technologyComponents = [
  {
    title: 'الخوادم الفيزيائية',
    description: 'إدارة الخوادم الفيزيائية والأجهزة',
    icon: <Server className="w-6 h-6" />,
    path: '/architecture/technology/physical-servers',
    color: 'bg-blue-500',
    stats: 'خادم نشط',
    table: 'tech_physical_servers'
  },
  {
    title: 'الخوادم الافتراضية',
    description: 'إدارة الخوادم الافتراضية والحاويات',
    icon: <HardDrive className="w-6 h-6" />,
    path: '/architecture/technology/virtual-servers',
    color: 'bg-green-500',
    stats: 'خادم افتراضي',
    table: 'tech_virtual_servers'
  },
  {
    title: 'أجهزة الشبكة',
    description: 'إدارة أجهزة الشبكة والاتصالات',
    icon: <Wifi className="w-6 h-6" />,
    path: '/architecture/technology/network-devices',
    color: 'bg-purple-500',
    stats: 'جهاز شبكة',
    table: 'tech_network_devices'
  },
  {
    title: 'مراكز البيانات',
    description: 'إدارة مراكز البيانات والمواقع',
    icon: <Building2 className="w-6 h-6" />,
    path: '/architecture/technology/data-centers',
    color: 'bg-orange-500',
    stats: 'مركز بيانات',
    table: 'tech_data_centers'
  },
  {
    title: 'الشبكات',
    description: 'إدارة الشبكات والاتصالات',
    icon: <Network className="w-6 h-6" />,
    path: '/architecture/technology/networks',
    color: 'bg-indigo-500',
    stats: 'شبكة',
    table: 'tech_networks'
  },
  {
    title: 'التراخيص',
    description: 'إدارة تراخيص البرمجيات والأنظمة',
    icon: <FileText className="w-6 h-6" />,
    path: '/architecture/technology/licenses',
    color: 'bg-teal-500',
    stats: 'ترخيص',
    table: 'tech_licenses'
  },
  {
    title: 'الأنظمة',
    description: 'إدارة الأنظمة التقنية',
    icon: <Settings className="w-6 h-6" />,
    path: '/architecture/technology/systems',
    color: 'bg-red-500',
    stats: 'نظام',
    table: 'tech_systems'
  }
];

const TechnologyLayer = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<{ [key: string]: number | null }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      const newCounts: { [key: string]: number | null } = {};
      await Promise.all(
        technologyComponents.map(async (comp) => {
          const { count } = await supabase
            .from(comp.table as any)
            .select("*", { count: "exact", head: true });
          newCounts[comp.table] = count ?? 0;
        })
      );
      setCounts(newCounts);
      setLoading(false);
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-saudi-sm border border-gray-100">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-16 h-16 bg-gradient-to-br from-saudi-green-600 to-saudi-green-700 rounded-xl flex items-center justify-center shadow-saudi">
            <Server className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">طبقة التقنية</h1>
            <p className="text-gray-600 mt-1 font-saudi">
              إدارة مكونات طبقة التقنية في البنية المؤسسية
            </p>
            <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm text-saudi-green-700">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-saudi-green-500 rounded-full mr-2"></div>
                {technologyComponents.length} مكون متاح
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* قسم إحصائيات الطبقة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          technologyComponents.map((comp) => (
            <LayerStatsCard
              key={comp.table}
              icon={comp.icon}
              label={comp.title}
              count={counts[comp.table] ?? 0}
              color={comp.color}
            />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technologyComponents.map((component, index) => (
          <Card 
            key={component.path} 
            className="group hover:shadow-saudi-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-saudi-green-200 hover:-translate-y-1 bg-white"
            onClick={() => navigate(component.path)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`p-3 rounded-xl ${component.color} text-white shadow-saudi group-hover:scale-110 transition-transform duration-300`}>
                    {component.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-saudi group-hover:text-saudi-green-700 transition-colors">
                      {component.title}
                    </CardTitle>
                    <p className="text-xs text-saudi-green-600 mt-1 bg-saudi-green-50 px-2 py-1 rounded-full inline-block">
                      {component.stats}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm leading-relaxed font-saudi">
                {component.description}
              </p>
              <Button 
                variant="outline" 
                className="w-full group-hover:bg-saudi-green-50 group-hover:border-saudi-green-300 group-hover:text-saudi-green-700 transition-all duration-300 font-saudi"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(component.path);
                }}
              >
                عرض التفاصيل
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-saudi-green-50 to-green-50 rounded-lg p-6 border border-saudi-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-saudi-green-800 font-saudi">نظرة عامة على طبقة التقنية</h3>
            <p className="text-saudi-green-600 mt-1 font-saudi">
              تشمل هذه الطبقة جميع المكونات التقنية والأجهزة المستخدمة
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-saudi-green-700">{technologyComponents.length}</div>
            <div className="text-xs text-saudi-green-600">مكون نشط</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyLayer;
