
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ApplicationTypeData {
  type: string;
  count: number;
  color: string;
}

interface LayerData {
  layer: string;
  count: number;
}

interface GrowthData {
  month: string;
  services: number;
  beneficiaries: number;
}

const DashboardCharts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [applicationTypes, setApplicationTypes] = useState<ApplicationTypeData[]>([]);
  const [layersData, setLayersData] = useState<LayerData[]>([]);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);

  useEffect(() => {
    const fetchChartsData = async () => {
      setLoading(true);
      try {
        // Fetch application types distribution
        const { data: apps } = await supabase
          .from('app_applications')
          .select('app_type');

        // Count applications by type
        const typeCounts = apps?.reduce((acc: any, app) => {
          const type = app.app_type || 'غير محدد';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        const appTypesData = Object.entries(typeCounts || {}).map(([type, count], index) => ({
          type,
          count: count as number,
          color: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 5]
        }));

        setApplicationTypes(appTypesData);

        // Fetch layers data
        const layers = [
          { layer: 'الأعمال', table: 'biz_services' },
          { layer: 'التطبيقات', table: 'app_applications' },
          { layer: 'البيانات', table: 'data_entities' },
          { layer: 'التقنية', table: 'tech_network_devices' },
          { layer: 'الأمان', table: 'sec_devices' }
        ];

        const layersResults = await Promise.all(
          layers.map(async (layer) => {
            const { count } = await supabase
              .from(layer.table as any)
              .select('*', { count: 'exact', head: true });
            return { layer: layer.layer, count: count || 0 };
          })
        );

        setLayersData(layersResults);

        // Mock growth data (in real app, this would come from historical data)
        const mockGrowthData = [
          { month: 'يناير', services: 85, beneficiaries: 12000 },
          { month: 'فبراير', services: 88, beneficiaries: 13500 },
          { month: 'مارس', services: 92, beneficiaries: 15000 },
          { month: 'أبريل', services: 95, beneficiaries: 16200 },
          { month: 'مايو', services: 98, beneficiaries: 17800 },
          { month: 'يونيو', services: 102, beneficiaries: 18500 }
        ];

        setGrowthData(mockGrowthData);
      } catch (error) {
        console.error('Error fetching charts data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartsData();
  }, []);

  const chartConfig = {
    services: {
      label: "الخدمات",
      color: "hsl(var(--saudi-green-600))",
    },
    beneficiaries: {
      label: "المستفيدون",
      color: "hsl(var(--saudi-green-400))",
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-80 flex items-center justify-center">
            <LoadingSpinner />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Applications Distribution Pie Chart */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            توزيع التطبيقات حسب النوع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <PieChart>
              <Pie
                data={applicationTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="count"
                label={({ type, count }) => `${type}: ${count}`}
              >
                {applicationTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Layers Distribution Bar Chart */}
      <Card className="bg-white shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            توزيع المكونات حسب الطبقات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={layersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="layer" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--saudi-green-500))" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Growth Line Chart */}
      <Card className="bg-white shadow-md border-0 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            نمو الخدمات والمستفيدين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="services"
                stroke="hsl(var(--saudi-green-600))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="beneficiaries"
                stroke="hsl(var(--saudi-green-400))"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
