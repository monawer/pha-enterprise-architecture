
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Capability {
  id: string;
  capability_name: string;
  capability_description?: string;
  capability_classification?: string;
  capability_owner?: string;
  task_code?: string;
  created_at: string;
}

const Capabilities = () => {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchCapabilities();
  }, []);

  const fetchCapabilities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_capabilities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCapabilities(data || []);
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات القدرات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCapabilities = capabilities.filter(capability =>
    capability.capability_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (capability.capability_description && capability.capability_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Settings className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة القدرات</h1>
            <p className="text-gray-600">عرض وإدارة القدرات المؤسسية</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          إضافة قدرة جديدة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة القدرات ({filteredCapabilities.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في القدرات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم القدرة</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>المالك</TableHead>
                  <TableHead>رمز المهمة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCapabilities.map((capability) => (
                  <TableRow key={capability.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{capability.capability_name}</p>
                        {capability.capability_description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {capability.capability_description.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {capability.capability_classification && (
                        <Badge variant="outline">{capability.capability_classification}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{capability.capability_owner || '-'}</TableCell>
                    <TableCell>{capability.task_code || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCapabilities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد قدرات متاحة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Capabilities;
