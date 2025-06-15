import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  Database, 
  Link
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import LayerStatsCard from '@/components/layer/LayerStatsCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const applicationComponents = [
  {
    title: 'قائمة التطبيقات',
    description: 'إدارة التطبيقات والأنظمة',
    icon: <Monitor className="w-6 h-6" />,
    path: '/architecture/applications/apps',
    color: 'bg-blue-500',
    stats: 'تطبيق نشط',
    table: 'app_applications'
  },
  {
    title: 'قواعد بيانات التطبيقات',
    description: 'إدارة قواعد البيانات ومحركاتها',
    icon: <Database className="w-6 h-6" />,
    path: '/architecture/applications/databases',
    color: 'bg-green-500',
    stats: 'قاعدة بيانات',
    table: 'app_databases'
  },
  {
    title: 'نقاط الربط التقني',
    description: 'إدارة الروابط والاتصالات التقنية',
    icon: <Link className="w-6 h-6" />,
    path: '/architecture/applications/technical-links',
    color: 'bg-purple-500',
    stats: 'نقطة ربط',
    table: 'app_technical_links'
  }
];

const ApplicationsLayer = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<{ [key: string]: number | null }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      const newCounts: { [key: string]: number | null } = {};
      await Promise.all(
        applicationComponents.map(async (comp) => {
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
            <Monitor className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">طبقة التطبيقات</h1>
            <p className="text-gray-600 mt-1 font-saudi">
              إدارة مكونات طبقة التطبيقات في البنية المؤسسية
            </p>
            <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm text-saudi-green-700">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-saudi-green-500 rounded-full mr-2"></div>
                {applicationComponents.length} مكون متاح
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
          applicationComponents.map((comp) => (
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
        {applicationComponents.map((component, index) => (
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
            <h3 className="text-lg font-semibold text-saudi-green-800 font-saudi">نظرة عامة على طبقة التطبيقات</h3>
            <p className="text-saudi-green-600 mt-1 font-saudi">
              تشمل هذه الطبقة جميع التطبيقات وقواعد البيانات والروابط التقنية
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-saudi-green-700">{applicationComponents.length}</div>
            <div className="text-xs text-saudi-green-600">مكون نشط</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsLayer;
