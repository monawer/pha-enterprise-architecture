
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface TechSystem {
  id: string;
  name: string;
  manufacturer?: string;
  version?: string;
  function?: string;
  system_status?: string;
  operation_type?: string;
  cost?: number;
  created_at: string;
}

const Systems = () => {
  const [systems, setSystems] = useState<TechSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSystem, setEditingSystem] = useState<TechSystem | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    version: '',
    function: '',
    system_status: '',
    operation_type: '',
    cost: ''
  });

  useEffect(() => {
    fetchSystems();
  }, []);

  const fetchSystems = async () => {
    try {
      const { data, error } = await supabase
        .from('tech_systems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSystems(data || []);
    } catch (error) {
      console.error('Error fetching systems:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = {
        ...formData,
        cost: formData.cost ? parseFloat(formData.cost) : null
      };

      if (editingSystem) {
        const { error } = await supabase
          .from('tech_systems')
          .update(dataToSubmit)
          .eq('id', editingSystem.id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث النظام بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('tech_systems')
          .insert([dataToSubmit]);

        if (error) throw error;
        
        toast({
          title: "تم الإضافة",
          description: "تم إضافة النظام بنجاح"
        });
      }

      resetForm();
      fetchSystems();
    } catch (error) {
      console.error('Error saving system:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ البيانات",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (system: TechSystem) => {
    setEditingSystem(system);
    setFormData({
      name: system.name || '',
      manufacturer: system.manufacturer || '',
      version: system.version || '',
      function: system.function || '',
      system_status: system.system_status || '',
      operation_type: system.operation_type || '',
      cost: system.cost?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف النظام؟')) {
      try {
        const { error } = await supabase
          .from('tech_systems')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "تم الحذف",
          description: "تم حذف النظام بنجاح"
        });
        
        fetchSystems();
      } catch (error) {
        console.error('Error deleting system:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ في حذف النظام",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      manufacturer: '',
      version: '',
      function: '',
      system_status: '',
      operation_type: '',
      cost: ''
    });
    setEditingSystem(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saudi-green-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-saudi-sm border border-gray-100">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-saudi">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">الأنظمة</h1>
            <p className="text-gray-600 mt-1 font-saudi">إدارة الأنظمة التقنية</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-saudi-green-600 hover:bg-saudi-green-700 text-white font-saudi"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة نظام
        </Button>
      </div>

      {showForm && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="font-saudi">
              {editingSystem ? 'تعديل النظام' : 'إضافة نظام جديد'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-saudi">اسم النظام *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer" className="font-saudi">الشركة المصنعة</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="version" className="font-saudi">الإصدار</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="function" className="font-saudi">الوظيفة</Label>
                  <Input
                    id="function"
                    value={formData.function}
                    onChange={(e) => setFormData({...formData, function: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="system_status" className="font-saudi">حالة النظام</Label>
                  <Input
                    id="system_status"
                    value={formData.system_status}
                    onChange={(e) => setFormData({...formData, system_status: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="operation_type" className="font-saudi">نوع التشغيل</Label>
                  <Input
                    id="operation_type"
                    value={formData.operation_type}
                    onChange={(e) => setFormData({...formData, operation_type: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="cost" className="font-saudi">التكلفة</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="font-saudi"
                  />
                </div>
              </div>
              <div className="flex space-x-2 space-x-reverse">
                <Button type="submit" className="bg-saudi-green-600 hover:bg-saudi-green-700 font-saudi">
                  {editingSystem ? 'تحديث' : 'إضافة'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="font-saudi">
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system) => (
          <Card key={system.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-saudi">{system.name}</CardTitle>
                <div className="flex space-x-1 space-x-reverse">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(system)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(system.id)}
                        className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {system.manufacturer && <p className="text-sm text-gray-600 font-saudi">الشركة: {system.manufacturer}</p>}
              {system.version && <p className="text-sm text-gray-600 font-saudi">الإصدار: {system.version}</p>}
              {system.function && <p className="text-sm text-gray-600 font-saudi">الوظيفة: {system.function}</p>}
              {system.system_status && <p className="text-sm text-gray-600 font-saudi">الحالة: {system.system_status}</p>}
              {system.cost && <p className="text-sm text-gray-600 font-saudi">التكلفة: {system.cost.toLocaleString()} ريال</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {systems.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 font-saudi">لا توجد أنظمة</h3>
          <p className="mt-1 text-sm text-gray-500 font-saudi">ابدأ بإضافة نظام جديد</p>
        </div>
      )}
    </div>
  );
};

export default Systems;
