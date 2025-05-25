
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Layers, Plus, Edit, Trash2, Save, X } from "lucide-react";

interface ArchitectureLayer {
  id: string;
  name: string;
  code: string;
  description: string | null;
  order_num: number;
  created_at: string;
  updated_at: string;
}

const ArchitectureLayers = () => {
  const [layers, setLayers] = useState<ArchitectureLayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState<ArchitectureLayer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    order_num: 1
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLayers();
  }, []);

  const fetchLayers = async () => {
    try {
      const { data, error } = await supabase
        .from('architecture_layers')
        .select('*')
        .order('order_num', { ascending: true });

      if (error) {
        console.error('Error fetching layers:', error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "حدث خطأ أثناء تحميل طبقات البنية المؤسسية",
          variant: "destructive",
        });
        return;
      }

      setLayers(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بقاعدة البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      order_num: layers.length + 1
    });
    setEditingLayer(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast({
        title: "بيانات مطلوبة",
        description: "يرجى إدخال اسم الطبقة والرمز",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingLayer) {
        // Update existing layer
        const { error } = await supabase
          .from('architecture_layers')
          .update({
            name: formData.name,
            code: formData.code,
            description: formData.description || null,
            order_num: formData.order_num,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingLayer.id);

        if (error) {
          console.error('Error updating layer:', error);
          toast({
            title: "خطأ في التحديث",
            description: "حدث خطأ أثناء تحديث الطبقة",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث طبقة البنية المؤسسية",
        });
      } else {
        // Create new layer
        const { error } = await supabase
          .from('architecture_layers')
          .insert([{
            name: formData.name,
            code: formData.code,
            description: formData.description || null,
            order_num: formData.order_num
          }]);

        if (error) {
          console.error('Error creating layer:', error);
          toast({
            title: "خطأ في الإنشاء",
            description: "حدث خطأ أثناء إنشاء الطبقة",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "تم الإنشاء بنجاح",
          description: "تم إنشاء طبقة البنية المؤسسية الجديدة",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchLayers();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في العملية",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (layer: ArchitectureLayer) => {
    setEditingLayer(layer);
    setFormData({
      name: layer.name,
      code: layer.code,
      description: layer.description || "",
      order_num: layer.order_num
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (layerId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الطبقة؟")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('architecture_layers')
        .delete()
        .eq('id', layerId);

      if (error) {
        console.error('Error deleting layer:', error);
        toast({
          title: "خطأ في الحذف",
          description: "حدث خطأ أثناء حذف الطبقة",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف طبقة البنية المؤسسية",
      });
      
      fetchLayers();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "خطأ في العملية",
        description: "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Layers className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">طبقات البنية المؤسسية</h1>
            <p className="text-gray-600">إدارة طبقات البنية المؤسسية ومكوناتها</p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة طبقة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingLayer ? "تعديل الطبقة" : "إضافة طبقة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">اسم الطبقة *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="أدخل اسم الطبقة"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="code">رمز الطبقة *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="أدخل رمز الطبقة"
                  required
                />
              </div>

              <div>
                <Label htmlFor="order_num">رقم الترتيب</Label>
                <Input
                  id="order_num"
                  type="number"
                  value={formData.order_num}
                  onChange={(e) => setFormData({ ...formData, order_num: parseInt(e.target.value) || 1 })}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="أدخل وصف الطبقة"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  <X className="w-4 h-4 ml-2" />
                  إلغاء
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 ml-2" />
                  {editingLayer ? "تحديث" : "إضافة"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Layers Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة طبقات البنية المؤسسية</CardTitle>
        </CardHeader>
        <CardContent>
          {layers.length === 0 ? (
            <div className="text-center py-8">
              <Layers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد طبقات مسجلة</p>
              <p className="text-gray-400">ابدأ بإضافة طبقة جديدة للبنية المؤسسية</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الترتيب</TableHead>
                  <TableHead className="text-right">الرمز</TableHead>
                  <TableHead className="text-right">اسم الطبقة</TableHead>
                  <TableHead className="text-right">الوصف</TableHead>
                  <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {layers.map((layer) => (
                  <TableRow key={layer.id}>
                    <TableCell className="font-medium">{layer.order_num}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-mono">
                        {layer.code}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{layer.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {layer.description || "لا يوجد وصف"}
                    </TableCell>
                    <TableCell>
                      {new Date(layer.created_at).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2 space-x-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(layer)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(layer.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchitectureLayers;
