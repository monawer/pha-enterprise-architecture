
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LayerStatsCardProps {
  icon: React.ReactNode;
  label: string;
  count: number | null;
  color: string;
  to?: string;
}

const LayerStatsCard: React.FC<LayerStatsCardProps> = ({
  icon,
  label,
  count,
  color,
  to,
}) => (
  <Card className={`shadow border-l-4 ${color} mb-4`}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center">
        <span className="text-3xl font-bold mr-2">{count ?? 0}</span>
        <span className="text-gray-500">عنصر</span>
      </div>
    </CardContent>
  </Card>
);

export default LayerStatsCard;
