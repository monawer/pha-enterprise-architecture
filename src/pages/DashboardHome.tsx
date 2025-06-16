import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AreaChart, ListOrdered, Layers, CalendarDays, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import QuickActions from "@/components/dashboard/QuickActions";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import LayerStatsCard from "@/components/layer/LayerStatsCard";

// 1. تحديد نوع ثابت لأسماء الجداول المسموحة
type LayerTable = 
  | "biz_services"
  | "app_applications"
  | "data_entities"
  | "tech_physical_servers"
  | "sec_devices"
  | "ux_beneficiaries";

interface LayerDef {
  key: string;
  label: string;
  color: string;
  table: LayerTable;
}

const layers: LayerDef[] = [
  { key: "business", label: "طبقة الأعمال", color: "bg-green-500", table: "biz_services" },
  { key: "applications", label: "طبقة التطبيقات", color: "bg-orange-500", table: "app_applications" },
  { key: "data", label: "طبقة البيانات", color: "bg-blue-500", table: "data_entities" },
  { key: "technology", label: "طبقة التقنية", color: "bg-teal-500", table: "tech_physical_servers" },
  { key: "security", label: "طبقة الأمان", color: "bg-red-500", table: "sec_devices" },
  { key: "ux", label: "طبقة تجربة المستخدم", color: "bg-pink-500", table: "ux_beneficiaries" },
];

interface StatsState {
  [key: string]: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<StatsState>({});
  const [loading, setLoading] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("month");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const out: StatsState = {};
      await Promise.all(
        layers.map(async (l) => {
          // 2. l.table صار نوعه LayerTable وبالتالي يقبله .from كمحدد نوعي صحيح
          const { count } = await supabase
            .from(l.table)
            .select("*", { count: "exact", head: true });
          out[l.key] = count ?? 0;
        })
      );
      setStats(out);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const totalComponents = Object.values(stats).reduce((sum, count) => sum + count, 0);
  const activeServices = stats.business ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة القيادة</h1>
              <p className="text-gray-600">نظرة شاملة على البنية المؤسسية ومكوناتها الأساسية</p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                تصفية
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                {timeFilter === "month" ? "هذا الشهر" : "هذا الأسبوع"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Metrics Section */}
        <DashboardMetrics 
          totalComponents={totalComponents}
          activeServices={activeServices}
          monthlyGrowth="+8.3%"
        />

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setSelectedLayer("all")}
              variant={selectedLayer === "all" ? "default" : "outline"}
              size="sm"
              className="min-w-[100px]"
            >
              الكل
            </Button>
            {layers.map((l) => (
              <Button
                key={l.key}
                onClick={() => setSelectedLayer(l.key)}
                variant={selectedLayer === l.key ? "default" : "outline"}
                size="sm"
                className="min-w-[100px]"
              >
                {l.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Layer Stats - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">إحصائيات الطبقات</h2>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {layers
                    .filter((l) => selectedLayer === "all" || selectedLayer === l.key)
                    .map((l) => (
                    <LayerStatsCard
                      key={l.key}
                      icon={<Layers className="w-6 h-6" />}
                      label={l.label}
                      count={stats[l.key] ?? 0}
                      color={l.color}
                      trend={{ value: '+5.2%', direction: 'up' }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Most Active Tables */}
            <Card className="bg-white shadow-md border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AreaChart className="w-5 h-5 text-blue-600" />
                  أكثر الطبقات نشاطًا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(stats)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([key, count], index) => {
                      const layerDef = layers.find((l) => l.key === key);
                      if (!layerDef) return null;
                      return (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${layerDef.color}`}></div>
                            <span className="font-medium text-gray-900">{layerDef.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">{count}</span>
                            <span className="text-sm text-gray-500">عنصر</span>
                          </div>
                        </div>
                      );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <ActivityFeed />
            <QuickActions />
          </div>
        </div>

        {/* Summary Section */}
        <Card className="bg-gradient-to-r from-saudi-green-50 to-green-50 border border-saudi-green-100 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-saudi-green-800">
              <ListOrdered className="w-5 h-5" />
              ملخص الإحصائيات العامة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {layers.map((l) => (
                <div key={l.key} className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-saudi-green-700">{stats[l.key] ?? 0}</div>
                  <div className="text-sm text-gray-600 mt-1">{l.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
