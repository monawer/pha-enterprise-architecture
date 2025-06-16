
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'إضافة خدمة جديدة',
      description: 'إنشاء خدمة جديدة في النظام',
      icon: <Plus className="w-5 h-5" />,
      path: '/architecture/business/services',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'إنشاء تقرير',
      description: 'إنشاء تقرير تحليلي جديد',
      icon: <FileText className="w-5 h-5" />,
      path: '/reports',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'إعدادات النظام',
      description: 'إدارة إعدادات المنصة',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'لوحة التحليلات',
      description: 'عرض التحليلات المتقدمة',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/analytics',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900">الإجراءات السريعة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex items-start space-x-3 space-x-reverse hover:shadow-md transition-all duration-200"
              onClick={() => navigate(action.path)}
            >
              <div className={`p-2 rounded-lg text-white ${action.color}`}>
                {action.icon}
              </div>
              <div className="text-right flex-1">
                <div className="font-medium text-gray-900">{action.title}</div>
                <div className="text-sm text-gray-500 mt-1">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
