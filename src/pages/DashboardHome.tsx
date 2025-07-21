
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Monitor, Database, Server, Shield, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import QuickActions from '@/components/dashboard/QuickActions';
import SystemHealth from '@/components/dashboard/SystemHealth';
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

        {/* Activity and Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ActivityFeed />
          <QuickActions />
        </div>

        {/* System Health */}
        <div className="mb-8">
          <SystemHealth />
        </div>

        {/* Enhanced Architecture Layers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            طبقات البنية المؤسسية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layersData.map((layer) => (
              <Link key={layer.key} to={layer.path}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group bg-white border-0 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${layer.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <div className="text-white">
                        {layer.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mt-4">
                      {layer.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-3xl font-bold text-gray-900">{layer.count}</span>
                      <span className="text-sm text-gray-600">مكون</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${layer.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(layer.count / 50 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </CardContent>
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
