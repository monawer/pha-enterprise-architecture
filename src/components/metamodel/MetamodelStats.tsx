import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { MetamodelData } from '@/hooks/useMetamodel';

interface MetamodelStatsProps {
  data?: MetamodelData;
}

export const MetamodelStats: React.FC<MetamodelStatsProps> = ({ data }) => {
  if (!data) return null;

  const maxComponents = Math.max(...data.layers.map(layer => layer.componentCount));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Layer Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            توزيع المكونات حسب الطبقة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.layers.map((layer) => (
            <div key={layer.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{layer.name}</span>
                <span className="text-muted-foreground">
                  {layer.componentCount} مكون ({maxComponents > 0 ? Math.round((layer.componentCount / data.totalComponents) * 100) : 0}%)
                </span>
              </div>
              <Progress 
                value={maxComponents > 0 ? (layer.componentCount / maxComponents) * 100 : 0} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Relationship Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            تحليل العلاقات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.relationshipTypes.map((relType, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{relType.type}</span>
                <span className="text-muted-foreground">
                  {relType.count} علاقة ({data.totalRelationships > 0 ? Math.round((relType.count / data.totalRelationships) * 100) : 0}%)
                </span>
              </div>
              <Progress 
                value={data.totalRelationships > 0 ? (relType.count / data.totalRelationships) * 100 : 0} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Model Health */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            صحة النموذج
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {data.layers.filter(l => l.componentCount > 0).length}/{data.layers.length}
              </div>
              <p className="text-sm text-muted-foreground">طبقات بها مكونات</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {data.totalRelationships > 0 ? (data.totalRelationships / data.totalComponents).toFixed(1) : '0'}
              </div>
              <p className="text-sm text-muted-foreground">متوسط العلاقات لكل مكون</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-purple-600">
                {data.relationshipTypes.length}
              </div>
              <p className="text-sm text-muted-foreground">أنواع العلاقات المستخدمة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};