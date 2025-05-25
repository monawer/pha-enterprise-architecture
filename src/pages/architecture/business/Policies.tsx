
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
import { FileText, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Policy {
  id: string;
  policy_name: string;
  policy_description?: string;
  policy_type?: string;
  owning_department?: string;
  policy_status?: string;
  activation_date?: string;
  created_at: string;
}

const Policies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('biz_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في جلب بيانات السياسات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = policies.filter(policy =>
    policy.policy_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (policy.policy_description && policy.policy_description.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <FileText className="w-8 h-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة السياسات</h1>
            <p className="text-gray-600">عرض وإدارة السياسات والقوانين التنظيمية</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 ml-2" />
          إضافة سياسة جديدة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة السياسات ({filteredPolicies.length})</CardTitle>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="البحث في السياسات..."
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
                  <TableHead>اسم السياسة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الجهة المسؤولة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التفعيل</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{policy.policy_name}</p>
                        {policy.policy_description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {policy.policy_description.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {policy.policy_type && (
                        <Badge variant="outline">{policy.policy_type}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{policy.owning_department || '-'}</TableCell>
                    <TableCell>
                      {policy.policy_status && (
                        <Badge variant="secondary">{policy.policy_status}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {policy.activation_date 
                        ? new Date(policy.activation_date).toLocaleDateString('ar-SA')
                        : '-'
                      }
                    </TableCell>
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
          {filteredPolicies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              لا توجد سياسات متاحة
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Policies;
