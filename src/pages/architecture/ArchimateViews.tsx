import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Database, 
  Server, 
  Shield, 
  Monitor, 
  FileText,
  Download,
  Filter,
  Search,
  Layers
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArchiMateFlowDiagram } from '@/components/archimate/ArchiMateFlowDiagram';
import { ViewSummaryCards } from '@/components/archimate/ViewSummaryCards';
import { useToast } from '@/hooks/use-toast';
import { exportToPDF, exportToPNG } from '@/utils/exportUtils';

const viewTypes = [
  { 
    id: 'business', 
    name: 'منظر الأعمال', 
    icon: Building2, 
    color: 'bg-yellow-100 text-yellow-800',
    description: 'الخدمات، الإجراءات، السياسات والقدرات المؤسسية'
  },
  { 
    id: 'application', 
    name: 'منظر التطبيقات', 
    icon: Monitor, 
    color: 'bg-blue-100 text-blue-800',
    description: 'التطبيقات، قواعد البيانات والروابط التقنية'
  },
  { 
    id: 'technology', 
    name: 'منظر التقنية', 
    icon: Server, 
    color: 'bg-green-100 text-green-800',
    description: 'الخوادم، الشبكات ومراكز البيانات'
  },
  { 
    id: 'data', 
    name: 'منظر البيانات', 
    icon: Database, 
    color: 'bg-orange-100 text-orange-800',
    description: 'كيانات البيانات، التخزين والتصنيفات'
  },
  { 
    id: 'security', 
    name: 'منظر الأمان', 
    icon: Shield, 
    color: 'bg-red-100 text-red-800',
    description: 'أجهزة الأمان، البرمجيات والخدمات الأمنية'
  },
  { 
    id: 'integrated', 
    name: 'المنظر المتكامل', 
    icon: Layers, 
    color: 'bg-purple-100 text-purple-800',
    description: 'رؤية شاملة عبر جميع الطبقات المعمارية'
  }
];

const ArchimateViews: React.FC = () => {
  const [selectedView, setSelectedView] = useState('business');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const diagramExportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExport = async (format: 'pdf' | 'png') => {
    if (!diagramExportRef.current) {
      toast({
        title: "خطأ في التصدير",
        description: "لا يمكن العثور على المحتوى للتصدير",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "جاري التصدير...",
        description: `يتم تحضير ملف ${format.toUpperCase()}`,
      });

      if (format === 'pdf') {
        await exportToPDF(diagramExportRef.current, `المناظر_المؤسسية_${selectedView}_${new Date().toISOString().split('T')[0]}`);
      } else {
        await exportToPNG(diagramExportRef.current, `المناظر_المؤسسية_${selectedView}_${new Date().toISOString().split('T')[0]}`);
      }

      toast({
        title: "تم التصدير بنجاح",
        description: `تم حفظ الملف بصيغة ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير المحتوى",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              المناظر العامة والمناظر الخاصة
            </h1>
            <p className="text-muted-foreground">
              تصور شامل للبنية المؤسسية وفقاً لمعايير ArchiMate
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <Download className="w-4 h-4 ml-2" />
              تصدير PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('png')}>
              <Download className="w-4 h-4 ml-2" />
              تصدير صورة
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <ViewSummaryCards />

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المكونات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المكونات</SelectItem>
                <SelectItem value="active">المكونات النشطة</SelectItem>
                <SelectItem value="planned">المكونات المخططة</SelectItem>
                <SelectItem value="deprecated">المكونات المهجورة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Selection Tabs */}
        <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
            {viewTypes.map((view) => (
              <TabsTrigger key={view.id} value={view.id} className="flex items-center gap-2">
                <view.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{view.name.split(' ')[1]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {viewTypes.map((view) => (
            <TabsContent key={view.id} value={view.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <view.icon className="w-6 h-6" />
                      <div>
                        <CardTitle>{view.name}</CardTitle>
                        <CardDescription>{view.description}</CardDescription>
                      </div>
                    </div>
                    <Badge className={view.color}>{view.name}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ArchiMateFlowDiagram 
                    viewType={view.id}
                    searchQuery={searchQuery}
                    filterType={filterType}
                    exportRef={diagramExportRef}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ArchimateViews;