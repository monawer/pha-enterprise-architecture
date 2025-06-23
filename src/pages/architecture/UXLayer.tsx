
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Users, 
  Smartphone
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/common/LoadingSpinner';

const uxComponents = [
  {
    title: 'المستفيدون',
    description: 'حصر المستفيدين ',
    icon: <Eye className="w-6 h-6" />,
    path: '/architecture/ux/interfaces',
    color: 'bg-blue-500',
    table: 'ux_beneficiaries'
  },
  {
    title: 'الشخصية',
    description: 'إدارة عناصر تجربة المستخدم',
    icon: <Users className="w-6 h-6" />,
    path: '/architecture/ux/experience',
    color: 'bg-green-500',
    table: 'ux_personas'
  },
  {
    title: 'المراحل',
    description: 'إدارة المراحل',
    icon: <Smartphone className="w-6 h-6" />,
    path: '/architecture/ux/mobile-apps',
    color: 'bg-purple-500',
    table: 'ux_stages'
  }
];

const UXLayer = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<{ [key: string]: number | null }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      const newCounts: { [key: string]: number | null } = {};
      await Promise.all(
        uxComponents.map(async (comp) => {
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

  const getTotalCount = () => {
    return Object.values(counts).reduce((total, count) => total + (count || 0), 0);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-saudi-sm border border-gray-100">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-16 h-16 bg-gradient-to-br from-saudi-green-600 to-saudi-green-700 rounded-xl flex items-center justify-center shadow-saudi">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">طبقة تجربة المستخدم</h1>
            <p className="text-gray-600 mt-1 font-saudi">
              إدارة مكونات طبقة تجربة المستخدم في البنية المؤسسية
            </p>
            <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm text-saudi-green-700">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-saudi-green-500 rounded-full mr-2"></div>
                {uxComponents.length} مكون متاح
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                {getTotalCount()} عنصر إجمالي
              </span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uxComponents.map((component, index) => {
            const count = counts[component.table] ?? 0;
            return (
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
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-saudi-green-700">{count}</div>
                      <div className="text-xs text-saudi-green-600 font-saudi">عنصر</div>
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UXLayer;
