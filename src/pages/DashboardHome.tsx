
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AreaChart, ListOrdered, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/common/LoadingSpinner";

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">لوحة القيادة</h1>
      <p className="mb-4 text-gray-600">ملخص ديناميكي حول أهم مكونات البنية المؤسسية مع إمكانية تصفية سريعة حسب الطبقات.</p>
      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          onClick={() => setSelectedLayer("all")}
          variant={selectedLayer === "all" ? "default" : "outline"}
          className="min-w-[100px]"
        >
          الكل
        </Button>
        {layers.map((l) => (
          <Button
            key={l.key}
            onClick={() => setSelectedLayer(l.key)}
            variant={selectedLayer === l.key ? "default" : "outline"}
            className="min-w-[100px]"
          >
            {l.label}
          </Button>
        ))}
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {layers
            .filter((l) => selectedLayer === "all" || selectedLayer === l.key)
            .map((l) => (
            <Card key={l.key} className={cn("shadow-lg border-l-4", l.color)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-6 h-6" />
                  {l.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <span className="text-4xl font-bold mr-2">{stats[l.key] ?? 0}</span>
                  <span className="text-gray-500">عنصر</span>
                </div>
                <Link to={`/architecture/${l.key}`}>
                  <Button variant="link" className="mt-3 p-0">عرض التفاصيل &rarr;</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AreaChart className="w-5 h-5 text-blue-600" />
              أكثر الجداول نشاطًا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-decimal pl-6">
              {Object.entries(stats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([key, count]) => {
                  const layerDef = layers.find((l) => l.key === key);
                  if (!layerDef) return null;
                  return (
                    <li key={key} className="mb-2">
                      <span className="font-semibold">{layerDef.label}:</span>{" "}
                      <span className="text-blue-700">{count}</span> عنصر
                    </li>
                  );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-green-600" />
              لمحة عن الإحصائيات العامة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-gray-700 font-semibold">
              {layers.map((l) => (
                <li key={l.key}>
                  <span className="mr-2 text-sm">{l.label}:</span>
                  <span className="text-green-600">{stats[l.key] ?? 0}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
