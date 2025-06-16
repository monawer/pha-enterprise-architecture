
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Plus, Edit, Trash } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  description: string;
  timestamp: string;
  user: string;
}

const ActivityFeed: React.FC = () => {
  // Mock data - في التطبيق الحقيقي سيتم جلب هذه البيانات من الـ API
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'create',
      description: 'تم إضافة خدمة جديدة "إصدار الهوية الرقمية"',
      timestamp: 'منذ دقيقتين',
      user: 'أحمد محمد'
    },
    {
      id: '2',
      type: 'update',
      description: 'تم تحديث إجراء "معالجة الطلبات"',
      timestamp: 'منذ 15 دقيقة',
      user: 'فاطمة العلي'
    },
    {
      id: '3',
      type: 'create',
      description: 'تم إضافة خادم افتراضي جديد',
      timestamp: 'منذ ساعة',
      user: 'محمد السالم'
    },
    {
      id: '4',
      type: 'update',
      description: 'تم تحديث سياسة الأمان',
      timestamp: 'منذ ساعتين',
      user: 'نورا أحمد'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'update':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'delete':
        return <Trash className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-saudi-green-600" />
          الأنشطة الحديثة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 space-x-reverse">
              <div className="flex-shrink-0 p-2 bg-gray-50 rounded-full">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>{activity.user}</span>
                  <span className="mx-2">•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
