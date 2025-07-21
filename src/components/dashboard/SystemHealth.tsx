
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, XCircle, Activity, Database, Server, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatus {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastChecked: string;
  icon: React.ReactNode;
}

const SystemHealth: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSystemHealth = async () => {
      setLoading(true);
      try {
        // Simulate health checks - in real app, these would be actual health endpoints
        const checks = [
          { component: 'قاعدة البيانات', icon: <Database className="w-4 h-4" /> },
          { component: 'الخدمات', icon: <Activity className="w-4 h-4" /> },
          { component: 'الخوادم', icon: <Server className="w-4 h-4" /> },
          { component: 'الأمان', icon: <Shield className="w-4 h-4" /> }
        ];

        const healthResults = await Promise.all(
          checks.map(async (check) => {
            // Simulate health check with random status
            const statuses: ('healthy' | 'warning' | 'critical')[] = ['healthy', 'warning', 'critical'];
            const randomStatus = statuses[Math.floor(Math.random() * 3)];
            const uptime = Math.floor(Math.random() * 100) + 90; // 90-100%
            
            return {
              component: check.component,
              status: randomStatus,
              uptime,
              lastChecked: new Date().toLocaleTimeString('ar-SA'),
              icon: check.icon
            };
          })
        );

        setSystemStatus(healthResults);
      } catch (error) {
        console.error('Error checking system health:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSystemHealth();
    
    // Refresh every 30 seconds
    const interval = setInterval(checkSystemHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800">سليم</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">تحذير</Badge>;
      case 'critical':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">خطر</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">حالة النظام</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saudi-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallHealth = systemStatus.filter(s => s.status === 'healthy').length / systemStatus.length * 100;

  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-saudi-green-600" />
          حالة النظام
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Health */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">الحالة العامة</span>
              <span className="text-sm text-gray-600">{overallHealth.toFixed(0)}%</span>
            </div>
            <Progress value={overallHealth} className="h-2" />
          </div>

          {/* Individual Components */}
          <div className="space-y-3">
            {systemStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium text-gray-900">{item.component}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">وقت التشغيل: {item.uptime}%</div>
                    <div className="text-xs text-gray-500">آخر فحص: {item.lastChecked}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">سليم</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">تحذير</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">خطر</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealth;
