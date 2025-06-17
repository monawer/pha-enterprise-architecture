
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Database, 
  Settings as SettingsIcon, 
  Building, 
  Monitor, 
  Server, 
  Shield, 
  FileText,
  Layers,
  Network,
  HardDrive,
  Briefcase,
  Tags
} from 'lucide-react';

interface SettingsCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const settingsCards: SettingsCard[] = [
    {
      title: 'إدارة المستخدمين',
      description: 'إدارة المستخدمين والصلاحيات',
      icon: <Users className="w-6 h-6" />,
      path: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'الإدارات والأقسام',
      description: 'إدارة الإدارات والأقسام في المؤسسة',
      icon: <Building className="w-6 h-6" />,
      path: '/admin/references/departments',
      color: 'bg-green-500'
    },
    {
      title: 'أنواع التطبيقات',
      description: 'إدارة تصنيفات التطبيقات',
      icon: <Monitor className="w-6 h-6" />,
      path: '/admin/references/app-types',
      color: 'bg-orange-500'
    },
    {
      title: 'حالات التطبيقات',
      description: 'إدارة حالات التطبيقات المختلفة',
      icon: <SettingsIcon className="w-6 h-6" />,
      path: '/admin/references/app-status',
      color: 'bg-purple-500'
    },
    {
      title: 'التقنيات',
      description: 'إدارة التقنيات والأدوات المستخدمة',
      icon: <Server className="w-6 h-6" />,
      path: '/admin/references/technologies',
      color: 'bg-teal-500'
    },
    {
      title: 'أنواع الخدمات',
      description: 'إدارة تصنيفات الخدمات المقدمة',
      icon: <Briefcase className="w-6 h-6" />,
      path: '/admin/references/service-types',
      color: 'bg-indigo-500'
    },
    {
      title: 'أنواع القنوات',
      description: 'إدارة قنوات تقديم الخدمات',
      icon: <Network className="w-6 h-6" />,
      path: '/admin/references/channel-types',
      color: 'bg-pink-500'
    },
    {
      title: 'تصنيفات البيانات',
      description: 'إدارة مستويات تصنيف البيانات الأمنية',
      icon: <Shield className="w-6 h-6" />,
      path: '/admin/references/data-classifications',
      color: 'bg-red-500'
    },
    {
      title: 'أنواع الاتصالات',
      description: 'إدارة أنواع الاتصالات والتكامل',
      icon: <Layers className="w-6 h-6" />,
      path: '/admin/references/connection-types',
      color: 'bg-cyan-500'
    },
    {
      title: 'صيغ البيانات',
      description: 'إدارة صيغ وأنواع البيانات',
      icon: <FileText className="w-6 h-6" />,
      path: '/admin/references/data-formats',
      color: 'bg-yellow-500'
    },
    {
      title: 'منصات التكامل',
      description: 'إدارة منصات التكامل بين الأنظمة',
      icon: <HardDrive className="w-6 h-6" />,
      path: '/admin/references/integration-platforms',
      color: 'bg-emerald-500'
    },
    {
      title: 'أنواع السياسات',
      description: 'إدارة تصنيفات السياسات',
      icon: <FileText className="w-6 h-6" />,
      path: '/admin/references/policy-types',
      color: 'bg-violet-500'
    },
    {
      title: 'أنواع الإجراءات',
      description: 'إدارة تصنيفات الإجراءات',
      icon: <Tags className="w-6 h-6" />,
      path: '/admin/references/procedure-types',
      color: 'bg-rose-500'
    },
    {
      title: 'مستويات الأتمتة',
      description: 'إدارة مستويات الأتمتة',
      icon: <SettingsIcon className="w-6 h-6" />,
      path: '/admin/references/automation-levels',
      color: 'bg-slate-500'
    },
    {
      title: 'أنواع العمليات',
      description: 'إدارة تصنيفات العمليات',
      icon: <Database className="w-6 h-6" />,
      path: '/admin/references/operation-types',
      color: 'bg-amber-500'
    },
    {
      title: 'الشركات المصنعة',
      description: 'إدارة بيانات الشركات المصنعة',
      icon: <Building className="w-6 h-6" />,
      path: '/admin/references/manufacturers',
      color: 'bg-lime-500'
    },
    {
      title: 'وظائف الأمان',
      description: 'إدارة وظائف الأمان المختلفة',
      icon: <Shield className="w-6 h-6" />,
      path: '/admin/references/security-functions',
      color: 'bg-fuchsia-500'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
        <p className="text-gray-600">إدارة إعدادات النظام وجداول التعريفات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {settingsCards.map((card, index) => (
          <Card 
            key={index}
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            onClick={() => navigate(card.path)}
          >
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Settings;
