import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUpDown } from 'lucide-react';
import { MetamodelData } from '@/hooks/useMetamodel';

interface MetamodelDiagramProps {
  data?: MetamodelData;
}

export const MetamodelDiagram: React.FC<MetamodelDiagramProps> = ({ data }) => {
  if (!data || !data.layers) {
    return (
      <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">لا توجد بيانات لعرضها</p>
      </div>
    );
  }

  const sortedLayers = [...data.layers].sort((a, b) => a.order_num - b.order_num);

  return (
    <div className="space-y-4 p-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">طبقات البنية المؤسسية</h3>
        <p className="text-sm text-muted-foreground">
          مرتبة حسب التسلسل الهرمي من الأعلى إلى الأسفل
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {sortedLayers.map((layer, index) => (
          <React.Fragment key={layer.id}>
            {/* Layer Card */}
            <Card className="w-full max-w-md p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <div className="text-center space-y-2">
                <h4 className="font-semibold text-lg">{layer.name}</h4>
                <p className="text-sm text-muted-foreground">{layer.description}</p>
                <div className="flex justify-center gap-2">
                  <Badge variant="secondary">
                    {layer.componentCount} مكون
                  </Badge>
                  <Badge variant="outline">
                    {layer.code}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Arrow between layers (except for the last one) */}
            {index < sortedLayers.length - 1 && (
              <div className="flex flex-col items-center text-muted-foreground">
                <ArrowDown className="w-6 h-6" />
                <div className="text-xs">يؤثر على</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Relationships Summary */}
      <div className="mt-8 p-4 bg-muted/20 rounded-lg">
        <div className="flex items-center justify-center gap-4 text-sm">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <span>
            <strong>{data.totalRelationships}</strong> علاقة إجمالية بين المكونات
          </span>
          <span className="text-muted-foreground">|</span>
          <span>
            <strong>{data.relationshipTypes.length}</strong> نوع علاقة مختلف
          </span>
        </div>
      </div>
    </div>
  );
};