
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Server, 
  Network, 
  HardDrive, 
  Cpu, 
  Monitor,
  Database
} from 'lucide-react';

const TechnologyLayer = () => {
  const navigate = useNavigate();

  const techComponents = [
    {
      title: 'الخوادم المادية',
      description: 'إدارة الخوادم المادية والبنية التحتية',
      icon: Server,
      path: '/architecture/technology/physical-servers',
      color: 'bg-blue-500'
    },
    {
      title: 'الخوادم الافتراضية', 
      description: 'إدارة الخوادم الافتراضية والموارد المحدودة',
      icon: Monitor,
      path: '/architecture/technology/virtual-servers',
      color: 'bg-green-500'
    },
    {
      title: 'أجهزة الشبكة',
      description: 'إدارة أجهزة الشبكة والاتصالات',
      icon: Network,
      path: '/architecture/technology/network-devices',
      color: 'bg-purple-500'
    },
    {
      title: 'الشبكات',
      description: 'إدارة الشبكات والاتصالات',
      icon: Cpu,
      path: '/architecture/technology/networks',
      color: 'bg-orange-500'
    },
    {
      title: 'مراكز البيانات',
      description: 'إدارة مراكز البيانات والمواقع',
      icon: HardDrive,
      path: '/architecture/technology/data-centers',
      color: 'bg-red-500'
    },
    {
      title: 'التراخيص',
      description: 'إدارة التراخيص والبرامج',
      icon: Database,
      path: '/architecture/technology/licenses',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">طبقة التقنية</h1>
          <p className="text-gray-600 mt-2">
            إدارة مكونات البنية التحتية التقنية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techComponents.map((component) => {
          const Icon = component.icon;
          return (
            <Card 
              key={component.path} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(component.path)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className={`p-2 rounded-lg ${component.color} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{component.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{component.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(component.path);
                  }}
                >
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TechnologyLayer;
