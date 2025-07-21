
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
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Applications Distribution Pie Chart */}
      <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-saudi-green-500 to-saudi-green-600 rounded-full"></div>
            توزيع التطبيقات حسب النوع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  innerRadius={40}
                  dataKey="count"
                  label={({ type, count, percent }) => `${(percent * 100).toFixed(0)}%`}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {applicationTypes.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke="white" 
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background p-3 border border-border rounded-lg shadow-lg">
                          <p className="font-semibold text-foreground">{data.type}</p>
                          <p className="text-muted-foreground">العدد: {data.count}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            {applicationTypes.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-muted-foreground">{item.type}</span>
                </div>
                <span className="font-semibold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Layers Distribution Bar Chart */}
      <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-saudi-green-500 to-saudi-green-600 rounded-full"></div>
            توزيع المكونات حسب الطبقات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={layersData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--saudi-green-500))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--saudi-green-600))" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="layer" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background p-3 border border-border rounded-lg shadow-lg">
                          <p className="font-semibold text-foreground">{label}</p>
                          <p className="text-muted-foreground">المكونات: {payload[0].value}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationBegin={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Growth Line Chart */}
      <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300 xl:col-span-1 lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-saudi-green-500 to-saudi-green-600 rounded-full"></div>
            نمو الخدمات والمستفيدين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="servicesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--saudi-green-600))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--saudi-green-600))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="beneficiariesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--saudi-green-400))" stopOpacity={1}/>
                    <stop offset="100%" stopColor="hsl(var(--saudi-green-400))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background p-3 border border-border rounded-lg shadow-lg">
                          <p className="font-semibold text-foreground mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: entry.color }}
                              ></div>
                              <span className="text-muted-foreground">{entry.name === 'services' ? 'الخدمات' : 'المستفيدون'}: </span>
                              <span className="font-semibold text-foreground">{entry.value?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="services"
                  stroke="hsl(var(--saudi-green-600))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--saudi-green-600))", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "hsl(var(--saudi-green-600))", strokeWidth: 2 }}
                  animationDuration={1500}
                  animationBegin={400}
                />
                <Line
                  type="monotone"
                  dataKey="beneficiaries"
                  stroke="hsl(var(--saudi-green-400))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--saudi-green-400))", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "hsl(var(--saudi-green-400))", strokeWidth: 2 }}
                  animationDuration={1500}
                  animationBegin={600}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
