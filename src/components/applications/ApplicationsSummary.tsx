
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Activity, Tag } from 'lucide-react';

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
  
  // إحصائيات النوع
  const typeCounts = applications.reduce((acc, app) => {
    const type = app.app_type || 'غير محدد';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonType = Object.entries(typeCounts).reduce((a, b) => 
    typeCounts[a[0]] > typeCounts[b[0]] ? a : b, ['غير محدد', 0]
  );

  // إحصائيات التصنيف (الأهمية)
  const importanceCounts = applications.reduce((acc, app) => {
    const importance = app.importance || 'غير محدد';
    acc[importance] = (acc[importance] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const criticalApps = importanceCounts['critical'] || 0;
  const highImportanceApps = importanceCounts['high'] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">
            الإجمالي
          </CardTitle>
          <Code className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{totalApplications}</div>
          <p className="text-xs text-blue-600 mt-1">
            إجمالي التطبيقات المسجلة
          </p>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            النوع
          </CardTitle>
          <Activity className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{mostCommonType[1]}</div>
          <p className="text-xs text-green-600 mt-1">
            {mostCommonType[0]} (الأكثر شيوعاً)
          </p>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">
            التصنيف
          </CardTitle>
          <Tag className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{criticalApps}</div>
          <p className="text-xs text-red-600 mt-1">
            حرجة | عالية: {highImportanceApps}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsSummary;
