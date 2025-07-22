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

interface ServiceByBeneficiaryData {
  beneficiary_type: string;
  count: number;
}

interface ServiceByOwnerData {
  owning_department: string;
  count: number;
}

interface ServerData {
  type: string;
  count: number;
}

const DashboardCharts: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [applicationTypes, setApplicationTypes] = useState<ApplicationTypeData[]>([]);
  const [layersData, setLayersData] = useState<LayerData[]>([]);
  const [servicesByBeneficiary, setServicesByBeneficiary] = useState<ServiceByBeneficiaryData[]>([]);
  const [servicesByOwner, setServicesByOwner] = useState<ServiceByOwnerData[]>([]);
  const [serversData, setServersData] = useState<ServerData[]>([]);

  useEffect(() => {
    const fetchChartsData = async () => {
      setLoading(true);
      try {
        // Fetch application types distribution
        const { data: apps } = await supabase
          .from('app_applications')
          .select('app_type');

        // Count applications by type with data cleaning
        const typeCounts = apps?.reduce((acc: any, app) => {
          const type = (app.app_type || 'غير محدد').trim();
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

        // Fetch services by beneficiary type with improved data cleaning
        const { data: servicesBeneficiary } = await supabase
          .from('biz_services')
          .select('beneficiary_type');

        const beneficiaryGroups = servicesBeneficiary?.reduce((acc: any, service) => {
          // Clean and normalize the beneficiary type
          const rawType = service.beneficiary_type || 'غير محدد';
          const cleanType = rawType.trim().replace(/\s+/g, ' '); // Remove extra spaces and normalize
          acc[cleanType] = (acc[cleanType] || 0) + 1;
          return acc;
        }, {});

        const servicesByBeneficiaryData = Object.entries(beneficiaryGroups || {}).map(([type, count]) => ({
          beneficiary_type: type,
          count: count as number
        }));

        setServicesByBeneficiary(servicesByBeneficiaryData);

        // Fetch services by owning department with data cleaning
        const { data: servicesOwner } = await supabase
          .from('biz_services')
          .select('owning_department');

        const ownerGroups = servicesOwner?.reduce((acc: any, service) => {
          const dept = (service.owning_department || 'غير محدد').trim();
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {});

        const servicesByOwnerData = Object.entries(ownerGroups || {})
          .map(([dept, count]) => ({
            owning_department: dept,
            count: count as number
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8); // أهم 8 أقسام

        setServicesByOwner(servicesByOwnerData);

        // Fetch servers data
        const [
          { count: physicalServers },
          { count: virtualServers }
        ] = await Promise.all([
          supabase.from('tech_physical_servers').select('*', { count: 'exact', head: true }),
          supabase.from('tech_virtual_servers').select('*', { count: 'exact', head: true })
        ]);

        const serversChartData = [
          { type: 'السيرفرات الفيزيائية', count: physicalServers || 0 },
          { type: 'السيرفرات الافتراضية', count: virtualServers || 0 }
        ];

        setServersData(serversChartData);
      } catch (error) {
        console.error('Error fetching charts data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartsData();
  }, []);

  const chartConfig = {
    applications: {
      label: "التطبيقات",
      color: "hsl(var(--saudi-green-600))",
    },
    services: {
      label: "الخدمات",
      color: "hsl(var(--saudi-green-500))",
    },
    servers: {
      label: "السيرفرات", 
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
      <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300">{/* Applications Distribution Pie Chart */}
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

{/* Layers Distribution Pie Chart */}
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
              <PieChart>
                <Pie
                  data={layersData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  innerRadius={40}
                  dataKey="count"
                  label={({ layer, count, percent }) => `${(percent * 100).toFixed(0)}%`}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {layersData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 5]} 
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
                          <p className="font-semibold text-foreground">{data.layer}</p>
                          <p className="text-muted-foreground">المكونات: {data.count}</p>
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
            {layersData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 5] }}
                  ></div>
                  <span className="text-muted-foreground">{item.layer}</span>
                </div>
                <span className="font-semibold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services by Beneficiary Type Chart */}
      <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-saudi-green-500 to-saudi-green-600 rounded-full"></div>
            توزيع الخدمات حسب المستفيد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesByBeneficiary}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  innerRadius={40}
                  dataKey="count"
                  label={({ beneficiary_type, count, percent }) => `${(percent * 100).toFixed(0)}%`}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {servicesByBeneficiary.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#059669', '#0891b2', '#7c3aed', '#dc2626', '#ea580c'][index % 5]} 
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
                          <p className="font-semibold text-foreground">{data.beneficiary_type}</p>
                          <p className="text-muted-foreground">عدد الخدمات: {data.count}</p>
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
            {servicesByBeneficiary.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: ['#059669', '#0891b2', '#7c3aed', '#dc2626'][index % 4] }}
                  ></div>
                  <span className="text-muted-foreground">{item.beneficiary_type}</span>
                </div>
                <span className="font-semibold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

{/* Services by Owner Department Chart */}
      <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-saudi-green-500 to-saudi-green-600 rounded-full"></div>
            توزيع الخدمات حسب المالك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={servicesByOwner}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  innerRadius={40}
                  dataKey="count"
                  label={({ owning_department, count, percent }) => `${(percent * 100).toFixed(0)}%`}
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {servicesByOwner.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={['#059669', '#0891b2', '#7c3aed', '#dc2626', '#ea580c', '#16a34a', '#0284c7', '#9333ea'][index % 8]} 
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
                          <p className="font-semibold text-foreground">{data.owning_department}</p>
                          <p className="text-muted-foreground">عدد الخدمات: {data.count}</p>
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
            {servicesByOwner.slice(0, 6).map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: ['#059669', '#0891b2', '#7c3aed', '#dc2626', '#ea580c', '#16a34a'][index % 6] }}
                  ></div>
                  <span className="text-muted-foreground">{item.owning_department}</span>
                </div>
                <span className="font-semibold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Servers Distribution Chart */}
      <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg border border-border/20 hover:shadow-xl transition-all duration-300 lg:col-span-2 xl:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-saudi-green-500 to-saudi-green-600 rounded-full"></div>
            توزيع السيرفرات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serversData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={45}
                    dataKey="count"
                    label={({ type, count, percent }) => `${(percent * 100).toFixed(0)}%`}
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {serversData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#059669' : '#0891b2'} 
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
            <div className="flex flex-col justify-center space-y-6">
              {serversData.map((server, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: index === 0 ? '#059669' : '#0891b2' }}
                    ></div>
                    <span className="font-medium text-foreground">{server.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">{server.count}</div>
                    <div className="text-sm text-muted-foreground">سيرفر</div>
                  </div>
                </div>
              ))}
              <div className="p-4 bg-gradient-to-r from-saudi-green-500/20 to-saudi-green-600/20 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {serversData.reduce((total, server) => total + server.count, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">إجمالي السيرفرات</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
