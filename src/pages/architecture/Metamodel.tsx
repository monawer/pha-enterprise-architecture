import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Network, 
  Database, 
  FileText, 
  Download,
  BookOpen,
  Layers,
  GitBranch,
  BarChart3
} from 'lucide-react';
import { useMetamodel } from '@/hooks/useMetamodel';
import { MetamodelDiagram } from '@/components/metamodel/MetamodelDiagram';
import { MetamodelStats } from '@/components/metamodel/MetamodelStats';

const Metamodel: React.FC = () => {
  const { data: metamodel, isLoading, error } = useMetamodel();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">خطأ في تحميل بيانات النموذج الفوقي</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">النموذج الفوقي للبنية المؤسسية</h1>
          <p className="text-muted-foreground mb-4">
            نظرة شاملة على تعريفات وهيكل النموذج المعماري للمؤسسة
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            تصدير التعريفات
          </Button>
          <Button variant="outline" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            دليل النموذج
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطبقات</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metamodel?.layers?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              طبقات البنية المؤسسية
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المكونات</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metamodel?.totalComponents || 0}</div>
            <p className="text-xs text-muted-foreground">
              مكونات نشطة في النظام
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أنواع العلاقات</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metamodel?.relationshipTypes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              أنواع العلاقات المعرفة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العلاقات</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metamodel?.totalRelationships || 0}</div>
            <p className="text-xs text-muted-foreground">
              علاقات نشطة بين المكونات
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Metamodel Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            مخطط النموذج الفوقي
          </CardTitle>
          <CardDescription>
            عرض بصري لطبقات البنية المؤسسية والعلاقات بينها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MetamodelDiagram data={metamodel} />
        </CardContent>
      </Card>

      {/* Layer Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Layers Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              تفاصيل الطبقات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metamodel?.layers?.map((layer) => (
              <div key={layer.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{layer.name}</h4>
                  <p className="text-sm text-muted-foreground">{layer.description}</p>
                </div>
                <div className="text-left">
                  <Badge variant="secondary" className="mb-1">
                    {layer.componentCount} مكون
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    ترتيب: {layer.order_num}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Relationship Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              أنواع العلاقات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metamodel?.relationshipTypes?.map((relType, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{relType.type}</h4>
                  <p className="text-sm text-muted-foreground">{relType.description || 'لا يوجد وصف'}</p>
                </div>
                <Badge variant="outline">
                  {relType.count} علاقة
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Statistics Section */}
      <MetamodelStats data={metamodel} />
    </div>
  );
};

export default Metamodel;