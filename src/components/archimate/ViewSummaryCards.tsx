import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Building2, 
  Database, 
  Server, 
  Shield, 
  Monitor, 
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useArchitectureData } from '@/hooks/useArchitectureData';

export const ViewSummaryCards: React.FC = () => {
  const { data: architectureData } = useArchitectureData('integrated');
  
  // Calculate real counts from data
  const layerCounts = architectureData?.layerCounts || {};
  const totalComponents = architectureData?.components?.length || 0;
  const totalRelationships = architectureData?.relationships?.length || 0;

  const summaryData = [
    {
      title: 'طبقة الأعمال',
      icon: Building2,
      count: layerCounts['BIZ'] || 0,
      status: 'healthy',
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'طبقة التطبيقات',
      icon: Monitor,
      count: layerCounts['APP'] || 0,
      status: 'healthy',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'طبقة التقنية',
      icon: Server,
      count: layerCounts['TECH'] || 0,
      status: 'healthy',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'طبقة البيانات',
      icon: Database,
      count: layerCounts['DATA'] || 0,
      status: 'healthy',
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      title: 'طبقة الأمان',
      icon: Shield,
      count: layerCounts['SEC'] || 0,
      status: 'healthy',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      title: 'إجمالي المكونات',
      icon: TrendingUp,
      count: totalComponents,
      status: 'healthy',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    }
  ];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'critical':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'healthy':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">سليم</Badge>;
    case 'warning':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">تحذير</Badge>;
    case 'critical':
      return <Badge variant="secondary" className="bg-red-100 text-red-800">حرج</Badge>;
    default:
      return null;
  }
};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {summaryData.map((item, index) => (
        <Card key={index} className={`${item.color} hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              {getStatusIcon(item.status)}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
              <p className="text-2xl font-bold text-foreground">{item.count}</p>
              {getStatusBadge(item.status)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};