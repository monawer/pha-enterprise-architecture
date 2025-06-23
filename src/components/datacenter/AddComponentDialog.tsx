
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, X } from 'lucide-react';
import { useDataCenterComponents } from '@/hooks/useDataCenterComponents';
import { useToast } from '@/hooks/use-toast';

interface AddComponentDialogProps {
  locationId: string;
  onComponentAdded: () => void;
}

const componentTypes = [
  { value: 'physical_server', label: 'خادم فيزيائي' },
  { value: 'virtual_server', label: 'خادم افتراضي' },
  { value: 'network_device', label: 'جهاز شبكة' },
  { value: 'security_device', label: 'جهاز أمني' },
  { value: 'data_center', label: 'مركز بيانات' }
];

const AddComponentDialog: React.FC<AddComponentDialogProps> = ({
  locationId,
  onComponentAdded
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    componentType: '',
    componentName: '',
    status: 'active',
    installationDate: '',
    notes: ''
  });

  const { addComponentToCenter } = useDataCenterComponents();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.componentType || !formData.componentName) {
      toast({
        title: "خطأ في التحقق",
        description: "نوع المكون واسم المكون مطلوبان",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const success = await addComponentToCenter(
        locationId,
        formData.componentType,
        crypto.randomUUID(), // Generate a unique component ID
        formData.componentName,
        {
          status: formData.status,
          installation_date: formData.installationDate || undefined,
          notes: formData.notes || undefined
        }
      );

      if (success) {
        setOpen(false);
        setFormData({
          componentType: '',
          componentName: '',
          status: 'active',
          installationDate: '',
          notes: ''
        });
        onComponentAdded();
      }
    } catch (error) {
      console.error('Error adding component:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      componentType: '',
      componentName: '',
      status: 'active',
      installationDate: '',
      notes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-saudi-green-600 hover:bg-saudi-green-700 text-white font-saudi">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مكون
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-saudi">إضافة مكون جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="componentType" className="font-saudi">نوع المكون *</Label>
            <Select
              value={formData.componentType}
              onValueChange={(value) => setFormData({ ...formData, componentType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع المكون" />
              </SelectTrigger>
              <SelectContent>
                {componentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="componentName" className="font-saudi">اسم المكون *</Label>
            <Input
              id="componentName"
              value={formData.componentName}
              onChange={(e) => setFormData({ ...formData, componentName: e.target.value })}
              placeholder="أدخل اسم المكون"
              required
            />
          </div>

          <div>
            <Label htmlFor="status" className="font-saudi">الحالة</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
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
            <Label htmlFor="installationDate" className="font-saudi">تاريخ التركيب</Label>
            <Input
              id="installationDate"
              type="date"
              value={formData.installationDate}
              onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes" className="font-saudi">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="أدخل أي ملاحظات إضافية"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              disabled={loading}
            >
              <X className="w-4 h-4 ml-2" />
              إلغاء
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 ml-2" />
              {loading ? 'جاري الحفظ...' : 'إضافة'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComponentDialog;
