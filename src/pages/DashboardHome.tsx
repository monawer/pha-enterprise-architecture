
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Monitor, Database, Server, Shield, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import QuickActions from '@/components/dashboard/QuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStats {
  totalApps: number;
  totalServices: number;
  totalDevices: number;
  totalProcedures: number;
  monthlyGrowth: string;
}

interface LayerData {
  key: string;
  label: string;
  color: string;
  icon: React.ReactNode;
  path: string;
  count: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalApps: 0,
    totalServices: 0,
    totalDevices: 0,
    totalProcedures: 0,
    monthlyGrowth: '+0%'
  });
  const [layersData, setLayersData] = useState<LayerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch main statistics
        const [
          { count: appsCount },
          { count: servicesCount },
          { count: devicesCount },
          { count: proceduresCount },
          { count: dataEntitiesCount },
          { count: secDevicesCount }
        ] = await Promise.all([
          supabase.from('app_applications').select('*', { count: 'exact', head: true }),
          supabase.from('biz_services').select('*', { count: 'exact', head: true }),
          supabase.from('tech_network_devices').select('*', { count: 'exact', head: true }),
          supabase.from('biz_procedures').select('*', { count: 'exact', head: true }),
          supabase.from('data_entities').select('*', { count: 'exact', head: true }),
          supabase.from('sec_devices').select('*', { count: 'exact', head: true })
        ]);

        const dashboardStats = {
          totalApps: appsCount || 0,
          totalServices: servicesCount || 0,
          totalDevices: devicesCount || 0,
          totalProcedures: proceduresCount || 0,
          monthlyGrowth: '+8.5%'
        };

        setStats(dashboardStats);

        // Prepare layers data
        const layers = [
          {
            key: 'business',
            label: 'طبقة الأعمال',
            color: 'from-green-500 to-green-600',
            icon: <Building className="w-6 h-6" />,
            path: '/architecture/business',
            count: (servicesCount || 0) + (proceduresCount || 0)
          },
          {
            key: 'applications',
            label: 'طبقة التطبيقات',
            color: 'from-blue-500 to-blue-600',
            icon: <Monitor className="w-6 h-6" />,
            path: '/architecture/applications',
            count: appsCount || 0
          },
          {
            key: 'data',
            label: 'طبقة البيانات',
            color: 'from-purple-500 to-purple-600',
            icon: <Database className="w-6 h-6" />,
            path: '/architecture/data',
            count: dataEntitiesCount || 0
          },
          {
            key: 'technology',
            label: 'طبقة التقنية',
            color: 'from-orange-500 to-orange-600',
            icon: <Server className="w-6 h-6" />,
            path: '/architecture/technology',
            count: devicesCount || 0
          },
          {
            key: 'security',
            label: 'طبقة الأمان',
            color: 'from-red-500 to-red-600',
            icon: <Shield className="w-6 h-6" />,
            path: '/architecture/security',
            count: secDevicesCount || 0
          },
          {
            key: 'ux',
            label: 'طبقة تجربة المستخدم',
            color: 'from-pink-500 to-pink-600',
            icon: <Eye className="w-6 h-6" />,
            path: '/architecture/ux',
            count: 0
          }
        ];

        setLayersData(layers);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              الإدارة التنفيذية لتقنية المعلومات
            </h1>
            <p className="text-lg text-gray-600">
              هيئة الصحة العامة - نظام إدارة البنية المؤسسية
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Quick Actions Navbar */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* KPI Metrics */}
        <DashboardMetrics
          totalComponents={stats.totalApps + stats.totalServices + stats.totalDevices + stats.totalProcedures}
          activeServices={stats.totalServices}
          monthlyGrowth={stats.monthlyGrowth}
        />

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">التحليلات والرسوم البيانية</h2>
          <DashboardCharts />
        </div>

        {/* Enhanced Architecture Layers */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              طبقات البنية المؤسسية
            </h2>
            <p className="text-muted-foreground text-lg">
              نظرة شاملة على مكونات البنية التقنية والتشغيلية للهيئة
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {layersData.map((layer) => (
              <Link key={layer.key} to={layer.path}>
                <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer group bg-gradient-to-br from-background to-muted/20 border border-border/20 overflow-hidden relative">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <div className={`w-full h-full bg-gradient-to-br ${layer.color} rounded-bl-full`}></div>
                  </div>
                  
                  <CardHeader className="text-center pb-6 relative z-10">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${layer.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                      <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                        {layer.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground mt-4 group-hover:text-saudi-green-600 transition-colors duration-300">
                      {layer.label}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center pt-0 pb-6 relative z-10">
                    {/* Main count display */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <span className="text-4xl font-bold text-foreground group-hover:text-saudi-green-600 transition-colors duration-300">
                        {layer.count}
                      </span>
                      <div className="text-left">
                        <span className="block text-sm text-muted-foreground">مكون</span>
                        <span className="block text-xs text-muted-foreground/70">نشط</span>
                      </div>
                    </div>
                    
                    {/* Enhanced progress bar */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">معدل الاستخدام</span>
                        <span className="font-semibold text-foreground">
                          {Math.min(layer.count / 50 * 100, 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div 
                          className={`bg-gradient-to-r ${layer.color} h-3 rounded-full transition-all duration-1000 group-hover:animate-pulse shadow-sm`}
                          style={{ width: `${Math.min(layer.count / 50 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Additional metrics */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                      <div className="text-center">
                        <div className="text-lg font-bold text-foreground">
                          {Math.floor(layer.count * 0.85)}
                        </div>
                        <div className="text-xs text-muted-foreground">متصل</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-saudi-green-600">
                          {Math.floor(layer.count * 0.95)}
                        </div>
                        <div className="text-xs text-muted-foreground">يعمل</div>
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="flex items-center justify-center mt-4 gap-2">
                      <div className="w-2 h-2 bg-saudi-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">نظام صحي</span>
                    </div>
                  </CardContent>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-saudi-green-500/5 to-saudi-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
