import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Database, 
  Network, 
  Shield, 
  Layers, 
  Smartphone 
} from 'lucide-react';

interface LayerNodeData {
  name: string;
  description?: string;
  code: string;
  componentCount: number;
  layerType: string;
}

interface LayerNodeProps {
  data: LayerNodeData;
}

const getLayerIcon = (layerType: string) => {
  switch (layerType) {
    case 'business':
    case 'biz':
      return <Building2 className="w-5 h-5" />;
    case 'application':
    case 'app':
      return <Smartphone className="w-5 h-5" />;
    case 'technology':
    case 'tech':
      return <Network className="w-5 h-5" />;
    case 'data':
      return <Database className="w-5 h-5" />;
    case 'security':
    case 'sec':
      return <Shield className="w-5 h-5" />;
    default:
      return <Layers className="w-5 h-5" />;
  }
};

const getLayerColor = (layerType: string) => {
  switch (layerType) {
    case 'business':
    case 'biz':
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-700',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: 'text-yellow-600 dark:text-yellow-400'
      };
    case 'application':
    case 'app':
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-700',
        text: 'text-blue-700 dark:text-blue-300',
        icon: 'text-blue-600 dark:text-blue-400'
      };
    case 'technology':
    case 'tech':
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-700',
        text: 'text-green-700 dark:text-green-300',
        icon: 'text-green-600 dark:text-green-400'
      };
    case 'data':
      return {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-200 dark:border-purple-700',
        text: 'text-purple-700 dark:text-purple-300',
        icon: 'text-purple-600 dark:text-purple-400'
      };
    case 'security':
    case 'sec':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-700',
        text: 'text-red-700 dark:text-red-300',
        icon: 'text-red-600 dark:text-red-400'
      };
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-900/20',
        border: 'border-gray-200 dark:border-gray-700',
        text: 'text-gray-700 dark:text-gray-300',
        icon: 'text-gray-600 dark:text-gray-400'
      };
  }
};

export const LayerNode: React.FC<LayerNodeProps> = memo(({ data }) => {
  const colors = getLayerColor(data.layerType);
  const icon = getLayerIcon(data.layerType);

  return (
    <div className={`
      w-[320px] p-4 rounded-xl border-2 shadow-lg 
      ${colors.bg} ${colors.border}
      transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
      animate-fade-in
    `}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 shadow-sm ${colors.icon}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-xl leading-tight ${colors.text}`}>
            {data.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs font-medium">
              {data.code}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {data.componentCount} مكون
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.description}
        </p>
      )}
    </div>
  );
});