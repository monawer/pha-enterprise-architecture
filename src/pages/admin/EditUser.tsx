
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UserForm from '@/components/forms/UserForm';
import { Loader2, AlertCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  department: string | null;
  is_active: boolean;
}

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError('معرف المستخدم غير صحيح');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, department, is_active')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('لم يتم العثور على المستخدم');

        setUser(data);
      } catch (error: any) {
        console.error('Error fetching user:', error);
        setError(error.message || 'حدث خطأ في تحميل بيانات المستخدم');
        toast({
          title: "خطأ",
          description: "لم يتم العثور على المستخدم",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, toast]);

  const handleSave = () => {
    navigate('/admin/users');
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-green-700 text-lg">جاري تحميل بيانات المستخدم...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">خطأ في تحميل المستخدم</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              العودة إلى قائمة المستخدمين
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <UserForm
      user={user}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default EditUser;
