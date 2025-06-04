
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Network, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface TechNetwork {
  id: string;
  network_type?: string;
  network_role?: string;
  network_location?: string;
  network_connection_type?: string;
  operation_type?: string;
  cost?: number;
  created_at: string;
}

const Networks = () => {
  const [networks, setNetworks] = useState<TechNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNetwork, setEditingNetwork] = useState<TechNetwork | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    network_type: '',
    network_role: '',
    network_location: '',
    network_connection_type: '',
    operation_type: '',
    cost: ''
  });

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    try {
      const { data, error } = await supabase
        .from('tech_networks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNetworks(data || []);
    } catch (error) {
      console.error('Error fetching networks:', error);
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

      if (editingNetwork) {
        const { error } = await supabase
          .from('tech_networks')
          .update(dataToSubmit)
          .eq('id', editingNetwork.id);

        if (error) throw error;
        
        toast({
          title: "تم التحديث",
          description: "تم تحديث الشبكة بنجاح"
        });
      } else {
        const { error } = await supabase
          .from('tech_networks')
          .insert([dataToSubmit]);

        if (error) throw error;
        
        toast({
          title: "تم الإضافة",
          description: "تم إضافة الشبكة بنجاح"
        });
      }

      resetForm();
      fetchNetworks();
    } catch (error) {
      console.error('Error saving network:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ البيانات",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (network: TechNetwork) => {
    setEditingNetwork(network);
    setFormData({
      network_type: network.network_type || '',
      network_role: network.network_role || '',
      network_location: network.network_location || '',
      network_connection_type: network.network_connection_type || '',
      operation_type: network.operation_type || '',
      cost: network.cost?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف الشبكة؟')) {
      try {
        const { error } = await supabase
          .from('tech_networks')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast({
          title: "تم الحذف",
          description: "تم حذف الشبكة بنجاح"
        });
        
        fetchNetworks();
      } catch (error) {
        console.error('Error deleting network:', error);
        toast({
          title: "خطأ",
          description: "حدث خطأ في حذف الشبكة",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      network_type: '',
      network_role: '',
      network_location: '',
      network_connection_type: '',
      operation_type: '',
      cost: ''
    });
    setEditingNetwork(null);
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
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-saudi">
            <Network className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-saudi">الشبكات</h1>
            <p className="text-gray-600 mt-1 font-saudi">إدارة الشبكات والاتصالات</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-saudi-green-600 hover:bg-saudi-green-700 text-white font-saudi"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة شبكة
        </Button>
      </div>

      {showForm && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="font-saudi">
              {editingNetwork ? 'تعديل الشبكة' : 'إضافة شبكة جديدة'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="network_type" className="font-saudi">نوع الشبكة</Label>
                  <Input
                    id="network_type"
                    value={formData.network_type}
                    onChange={(e) => setFormData({...formData, network_type: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="network_role" className="font-saudi">دور الشبكة</Label>
                  <Input
                    id="network_role"
                    value={formData.network_role}
                    onChange={(e) => setFormData({...formData, network_role: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="network_location" className="font-saudi">موقع الشبكة</Label>
                  <Input
                    id="network_location"
                    value={formData.network_location}
                    onChange={(e) => setFormData({...formData, network_location: e.target.value})}
                    className="font-saudi"
                  />
                </div>
                <div>
                  <Label htmlFor="network_connection_type" className="font-saudi">نوع الاتصال</Label>
                  <Input
                    id="network_connection_type"
                    value={formData.network_connection_type}
                    onChange={(e) => setFormData({...formData, network_connection_type: e.target.value})}
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
                  {editingNetwork ? 'تحديث' : 'إضافة'}
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
        {networks.map((network) => (
          <Card key={network.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-saudi">{network.network_type || 'شبكة'}</CardTitle>
                <div className="flex space-x-1 space-x-reverse">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(network)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(network.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {network.network_role && <p className="text-sm text-gray-600 font-saudi">الدور: {network.network_role}</p>}
              {network.network_location && <p className="text-sm text-gray-600 font-saudi">الموقع: {network.network_location}</p>}
              {network.network_connection_type && <p className="text-sm text-gray-600 font-saudi">نوع الاتصال: {network.network_connection_type}</p>}
              {network.operation_type && <p className="text-sm text-gray-600 font-saudi">نوع التشغيل: {network.operation_type}</p>}
              {network.cost && <p className="text-sm text-gray-600 font-saudi">التكلفة: {network.cost.toLocaleString()} ريال</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {networks.length === 0 && (
        <div className="text-center py-12">
          <Network className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 font-saudi">لا توجد شبكات</h3>
          <p className="mt-1 text-sm text-gray-500 font-saudi">ابدأ بإضافة شبكة جديدة</p>
        </div>
      )}
    </div>
  );
};

export default Networks;
