
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  Server, 
  Settings
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from '@/components/common/LoadingSpinner';

const securityComponents = [
  {
    title: 'أجهزة الأمان',
    description: 'إدارة أجهزة الأمان والحماية',
    icon: <Shield className="w-6 h-6" />,
    path: '/architecture/security/devices',
    color: 'bg-red-500',
    table: 'sec_devices'
  },
  {
    title: 'خدمات الأمان',
    description: 'إدارة خدمات الأمان السيبراني',
    icon: <Server className="w-6 h-6" />,
    path: '/architecture/security/services',
    color: 'bg-orange-500',
    table: 'sec_services'
  },
  {
    title: 'برامج الأمان',
    description: 'إدارة برامج الحماية والأمان',
    icon: <Settings className="w-6 h-6" />,
    path: '/architecture/security/software',
    color: 'bg-purple-500',
    table: 'sec_software'
  }
];

const SecurityLayer = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState<{ [key: string]: number | null }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      setLoading(true);
      const newCounts: { [key: string]: number | null } = {};
      await Promise.all(
        securityComponents.map(async (comp) => {
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

  const colorClasses = {
    'bg-green-500': 'from-green-400 to-green-600 shadow-green-200',
    'bg-orange-500': 'from-orange-400 to-orange-600 shadow-orange-200',
    'bg-blue-500': 'from-blue-400 to-blue-600 shadow-blue-200',
    'bg-teal-500': 'from-teal-400 to-teal-600 shadow-teal-200',
    'bg-red-500': 'from-red-400 to-red-600 shadow-red-200',
    'bg-pink-500': 'from-pink-400 to-pink-600 shadow-pink-200',
    'bg-purple-500': 'from-purple-400 to-purple-600 shadow-purple-200',
    'bg-indigo-500': 'from-indigo-400 to-indigo-600 shadow-indigo-200',
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-saudi-sm border border-gray-100">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-16 h-16 bg-gradient-to-br from-saudi-green-600 to-saudi-green-700 rounded-xl flex items-center justify-center shadow-saudi">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">طبقة الأمان</h1>
            <p className="text-gray-600 mt-1 font-saudi">
              إدارة مكونات طبقة الأمان في البنية المؤسسية
            </p>
            <div className="flex items-center mt-2 space-x-4 space-x-reverse text-sm text-saudi-green-700">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-saudi-green-500 rounded-full mr-2"></div>
                {securityComponents.length} مكون متاح
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
          {securityComponents.map((component, index) => {
            const count = counts[component.table] ?? 0;
            const gradientClass = colorClasses[component.color as keyof typeof colorClasses] || 'from-gray-400 to-gray-600 shadow-gray-200';
            
            return (
              <Link 
                key={component.path} 
                to={component.path}
                className="block group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-0 shadow-lg hover:-translate-y-1 rounded-lg overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
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
                          {component.icon}
                        </div>
                      </div>
                      <div className="text-white text-right">
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-white/90 text-sm">عنصر</div>
                      </div>
                    </div>
                    
                    <div className="text-white text-center mb-4">
                      <div className="text-white/90 text-lg font-medium">{component.title}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white">
                  <p className="text-gray-600 text-sm leading-relaxed font-saudi text-center">
                    {component.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(count / 10 * 100, 100)}%` }}
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
  );
};

export default SecurityLayer;
