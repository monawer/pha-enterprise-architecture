
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Activity, DollarSign, Users } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  status?: string;
  importance?: string;
  user_count?: number;
  initial_cost?: number;
  operational_cost?: number;
  capital_cost?: number;
}

interface ApplicationsSummaryProps {
  applications: Application[];
}

const ApplicationsSummary: React.FC<ApplicationsSummaryProps> = ({ applications }) => {
  const totalApplications = applications.length;
  
  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status || 'غير محدد';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeApps = statusCounts['active'] || 0;
  const inactiveApps = statusCounts['inactive'] || 0;

  const importanceCounts = applications.reduce((acc, app) => {
    const importance = app.importance || 'غير محدد';
    acc[importance] = (acc[importance] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const criticalApps = importanceCounts['critical'] || 0;
  const highImportanceApps = importanceCounts['high'] || 0;

  const totalUsers = applications.reduce((sum, app) => sum + (app.user_count || 0), 0);

  const totalCosts = applications.reduce((sum, app) => {
    const initialCost = app.initial_cost || 0;
    const operationalCost = app.operational_cost || 0;
    const capitalCost = app.capital_cost || 0;
    return sum + initialCost + operationalCost + capitalCost;
  }, 0);

  const formatCurrency = (amount: number) => {
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
            نشط: {activeApps} | غير نشط: {inactiveApps}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">
            التطبيقات الحرجة
          </CardTitle>
          <Activity className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{criticalApps}</div>
          <p className="text-xs text-red-600 mt-1">
            عالية الأهمية: {highImportanceApps}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            إجمالي المستخدمين
          </CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">
            {totalUsers.toLocaleString('ar-SA')}
          </div>
          <p className="text-xs text-green-600 mt-1">
            عبر جميع التطبيقات
          </p>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-800">
            إجمالي التكاليف
          </CardTitle>
          <DollarSign className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-900">
            {formatCurrency(totalCosts)}
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            جميع أنواع التكاليف
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsSummary;
