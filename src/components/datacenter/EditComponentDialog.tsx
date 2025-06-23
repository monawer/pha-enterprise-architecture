
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDataCenterLocations } from '@/hooks/useDataCenterLocations';
import { useDataCenterComponents, DataCenterComponent } from '@/hooks/useDataCenterComponents';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditComponentDialogProps {
  component: DataCenterComponent;
  onClose: () => void;
  onSubmit: () => void;
}

const componentTypeLabels = {
  physical_server: 'خادم فيزيائي',
  virtual_server: 'خادم افتراضي',
  network_device: 'جهاز شبكة',
  security_device: 'جهاز أمني',
  data_center: 'مركز بيانات'
};

const EditComponentDialog: React.FC<EditComponentDialogProps> = ({
  component,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    component_name: component.component_name,
    component_type: component.component_type,
    data_center_location_id: component.data_center_location_id,
    status: component.status,
    installation_date: component.installation_date || '',
    notes: component.notes || ''
  });
  const [loading, setLoading] = useState(false);
  const { locations } = useDataCenterLocations();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tech_center_components')
        .update({
          component_name: formData.component_name,
          component_type: formData.component_type,
          data_center_location_id: formData.data_center_location_id,
          status: formData.status,
          installation_date: formData.installation_date || null,
          notes: formData.notes || null
        })
        .eq('id', component.id);

      if (error) throw error;

      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات المكون بنجاح"
      });

      onSubmit();
    } catch (error) {
      console.error('Error updating component:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث بيانات المكون",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-saudi">تعديل بيانات المكون</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="component_name" className="font-saudi">اسم المكون *</Label>
              <Input
                id="component_name"
                value={formData.component_name}
                onChange={(e) => setFormData({...formData, component_name: e.target.value})}
                required
                className="font-saudi"
              />
            </div>
            
            <div>
              <Label htmlFor="component_type" className="font-saudi">نوع المكون *</Label>
              <Select 
                value={formData.component_type} 
                onValueChange={(value) => setFormData({...formData, component_type: value as DataCenterComponent['component_type']})}
              >
                <SelectTrigger className="font-saudi">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical_server">خادم فيزيائي</SelectItem>
                  <SelectItem value="virtual_server">خادم افتراضي</SelectItem>
                  <SelectItem value="network_device">جهاز شبكة</SelectItem>
                  <SelectItem value="security_device">جهاز أمني</SelectItem>
                  <SelectItem value="data_center">مركز بيانات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data_center_location_id" className="font-saudi">مركز البيانات *</Label>
              <Select 
                value={formData.data_center_location_id} 
                onValueChange={(value) => setFormData({...formData, data_center_location_id: value})}
              >
                <SelectTrigger className="font-saudi">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" className="font-saudi">الحالة</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger className="font-saudi">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="maintenance">تحت الصيانة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="installation_date" className="font-saudi">تاريخ التركيب</Label>
              <Input
                id="installation_date"
                type="date"
                value={formData.installation_date}
                onChange={(e) => setFormData({...formData, installation_date: e.target.value})}
                className="font-saudi"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="font-saudi">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="font-saudi"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="font-saudi">
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="bg-saudi-green-600 hover:bg-saudi-green-700 font-saudi">
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditComponentDialog;
