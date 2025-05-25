
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
import { Workflow, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Procedure {
  id: string;
  procedure_name: string;
  procedure_description?: string;
  procedure_type?: string;
  automation_level?: string;
  importance?: string;
  execution_duration?: string;
  beneficiary_type?: string;
  created_at: string;
}

const Procedures = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProcedures();
  }, []);

  const fetchProcedures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_procedures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProcedures(data || []);
    } catch (error) {
      console.error('Error fetching procedures:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات الإجراءات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProcedures = procedures.filter(procedure =>
    procedure.procedure_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (procedure.procedure_description && procedure.procedure_description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <Workflow className="w-8 h-8 text-green-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الإجراءات</h1>
            <p className="text-gray-600">عرض وإدارة الإجراءات والعمليات التشغيلية</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          إضافة إجراء جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الإجراءات ({filteredProcedures.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في الإجراءات..."
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
                  <TableHead>اسم الإجراء</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>مستوى الأتمتة</TableHead>
                  <TableHead>الأهمية</TableHead>
                  <TableHead>مدة التنفيذ</TableHead>
                  <TableHead>نوع المستفيد</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcedures.map((procedure) => (
                  <TableRow key={procedure.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{procedure.procedure_name}</p>
                        {procedure.procedure_description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {procedure.procedure_description.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {procedure.procedure_type && (
                        <Badge variant="outline">{procedure.procedure_type}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {procedure.automation_level && (
                        <Badge variant="secondary">{procedure.automation_level}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{procedure.importance || '-'}</TableCell>
                    <TableCell>{procedure.execution_duration || '-'}</TableCell>
                    <TableCell>{procedure.beneficiary_type || '-'}</TableCell>
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
          {filteredProcedures.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد إجراءات متاحة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Procedures;
