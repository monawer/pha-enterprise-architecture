
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
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-900">الإجراءات السريعة</h3>
      </div>
      <nav className="p-6">
        <div className="flex flex-wrap gap-4 justify-center">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className="flex items-center gap-3 px-6 py-3 hover:shadow-md transition-all duration-200 min-w-[200px]"
              onClick={() => navigate(action.path)}
            >
              <div className={`p-2 rounded-lg text-white ${action.color}`}>
                {action.icon}
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{action.title}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default QuickActions;
