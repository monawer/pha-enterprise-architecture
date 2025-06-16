
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Eye } from "lucide-react";

interface LayerStatsCardProps {
  icon: React.ReactNode;
  label: string;
  count: number | null;
  color: string;
  to?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
}

const LayerStatsCard: React.FC<LayerStatsCardProps> = ({
  icon,
  label,
  count,
  color,
  to,
  trend = { value: '+5.2%', direction: 'up' }
}) => {
  const colorClasses = {
    'bg-green-500': 'from-green-400 to-green-600 shadow-green-200',
    'bg-orange-500': 'from-orange-400 to-orange-600 shadow-orange-200',
    'bg-blue-500': 'from-blue-400 to-blue-600 shadow-blue-200',
    'bg-teal-500': 'from-teal-400 to-teal-600 shadow-teal-200',
    'bg-red-500': 'from-red-400 to-red-600 shadow-red-200',
    'bg-pink-500': 'from-pink-400 to-pink-600 shadow-pink-200',
    'bg-purple-500': 'from-purple-400 to-purple-600 shadow-purple-200',
    'bg-indigo-500': 'from-indigo-400 to-indigo-600 shadow-indigo-200',
  };

  const gradientClass = colorClasses[color as keyof typeof colorClasses] || 'from-gray-400 to-gray-600 shadow-gray-200';

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border-0 shadow-lg hover:-translate-y-1">
      <CardContent className="p-0">
        <div className={`bg-gradient-to-br ${gradientClass} p-6 relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white transform -translate-x-4 translate-y-4"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <div className="text-white w-6 h-6">
                  {icon}
                </div>
              </div>
              <div className="text-white/80 group-hover:text-white transition-colors">
                <Eye className="w-5 h-5" />
              </div>
            </div>
            
            <div className="text-white">
              <div className="text-3xl font-bold mb-1">{count ?? 0}</div>
              <div className="text-white/90 text-sm font-medium">{label}</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <span>عنصر نشط</span>
            </div>
            <div className={`flex items-center text-sm ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${
                trend.direction === 'down' ? 'rotate-180' : ''
              }`} />
              <span>{trend.value}</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${gradientClass.split(' ')[0]} ${gradientClass.split(' ')[1]} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${Math.min((count ?? 0) / 10 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerStatsCard;
