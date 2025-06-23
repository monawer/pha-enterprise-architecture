
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Activity, Tag, DollarSign } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  status?: string;
  importance?: string;
  user_count?: number;
  initial_cost?: number;
  operational_cost?: number;
  capital_cost?: number;
  app_type?: string;
}

interface ApplicationsSummaryProps {
  applications: Application[];
}

const ApplicationsSummary: React.FC<ApplicationsSummaryProps> = ({ applications }) => {
  const totalApplications = applications.length;
  
  // إحصائيات الحالة
  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status || 'غير محدد';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeApps = statusCounts['active'] || 0;
  const inactiveApps = statusCounts['inactive'] || 0;

  // إحصائيات الأهمية
  const importanceCounts = applications.reduce((acc, app) => {
    const importance = app.importance || 'غير محدد';
    acc[importance] = (acc[importance] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const criticalApps = importanceCounts['critical'] || 0;
  const highImportanceApps = importanceCounts['high'] || 0;

  // إحصائيات المستخدمين
  const totalUsers = applications.reduce((sum, app) => sum + (app.user_count || 0), 0);
  const appsWithUserData = applications.filter(app => app.user_count && app.user_count > 0).length;

  // إحصائيات التكاليف
  const totalCosts = applications.reduce((sum, app) => {
    const initial = app.initial_cost || 0;
    const operational = app.operational_cost || 0;
    const capital = app.capital_cost || 0;
    return sum + initial + operational + capital;
  }, 0);

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '0 ريال';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            إجمالي التطبيقات
          </CardTitle>
          <Code className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{totalApplications}</div>
          <p className="text-xs text-blue-600 mt-1">
            تطبيق مسجل في النظام
          </p>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            التطبيقات النشطة
          </CardTitle>
          <Activity className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{activeApps}</div>
          <p className="text-xs text-green-600 mt-1">
            غير نشط: {inactiveApps} | النسبة: {totalApplications > 0 ? Math.round((activeApps / totalApplications) * 100) : 0}%
          </p>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">
            التطبيقات الحرجة
          </CardTitle>
          <Tag className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{criticalApps}</div>
          <p className="text-xs text-red-600 mt-1">
            عالية الأهمية: {highImportanceApps} | المجموع: {criticalApps + highImportanceApps}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">
            إجمالي المستخدمين
          </CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">
            {totalUsers > 0 ? totalUsers.toLocaleString('ar-SA') : '0'}
          </div>
          <p className="text-xs text-purple-600 mt-1">
            {appsWithUserData} تطبيق لديه بيانات مستخدمين
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsSummary;
