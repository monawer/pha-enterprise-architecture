
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Activity } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend, icon }) => (
  <Card className="bg-white hover:shadow-lg transition-all duration-300 border-0 shadow-md">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            <span>{change}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${
          trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface DashboardMetricsProps {
  totalComponents: number;
  activeServices: number;
  monthlyGrowth: string;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ 
  totalComponents, 
  activeServices, 
  monthlyGrowth 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="إجمالي المكونات"
        value={totalComponents.toString()}
        change={monthlyGrowth}
        trend="up"
        icon={<Activity className="w-6 h-6" />}
      />
      <MetricCard
        title="الخدمات النشطة"
        value={activeServices.toString()}
        change="+12.5%"
        trend="up"
        icon={<Users className="w-6 h-6" />}
      />
      <MetricCard
        title="معدل الاستخدام"
        value="85%"
        change="+5.2%"
        trend="up"
        icon={<TrendingUp className="w-6 h-6" />}
      />
    </div>
  );
};

export default DashboardMetrics;
