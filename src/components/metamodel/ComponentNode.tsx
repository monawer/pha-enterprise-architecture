import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Database, 
  Network, 
  Shield, 
  Layers, 
  Smartphone,
  FileText,
  Settings
} from 'lucide-react';
import { MetamodelComponent } from '@/hooks/useMetamodel';

interface ComponentNodeProps {
  data: MetamodelComponent & {
    layerType: string;
  };
}

const getComponentIcon = (layerType: string) => {
  switch (layerType) {
    case 'business':
    case 'biz':
      return <Building2 className="w-4 h-4" />;
    case 'application':
    case 'app':
      return <Smartphone className="w-4 h-4" />;
    case 'technology':
    case 'tech':
      return <Network className="w-4 h-4" />;
    case 'data':
      return <Database className="w-4 h-4" />;
    case 'security':
    case 'sec':
      return <Shield className="w-4 h-4" />;
    default:
      return <Settings className="w-4 h-4" />;
  }
};

const getComponentColor = (layerType: string) => {
  switch (layerType) {
    case 'business':
    case 'biz':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-300 dark:border-yellow-600',
        text: 'text-yellow-800 dark:text-yellow-200'
      };
    case 'application':
    case 'app':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-300 dark:border-blue-600',
        text: 'text-blue-800 dark:text-blue-200'
      };
    case 'technology':
    case 'tech':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-300 dark:border-green-600',
        text: 'text-green-800 dark:text-green-200'
      };
    case 'data':
      return {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        border: 'border-purple-300 dark:border-purple-600',
        text: 'text-purple-800 dark:text-purple-200'
      };
    case 'security':
    case 'sec':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-300 dark:border-red-600',
        text: 'text-red-800 dark:text-red-200'
      };
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        border: 'border-gray-300 dark:border-gray-600',
        text: 'text-gray-800 dark:text-gray-200'
      };
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'planned':
      return 'bg-yellow-500';
    case 'deprecated':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const ComponentNode: React.FC<ComponentNodeProps> = memo(({ data }) => {
  const colors = getComponentColor(data.layerType);
  const icon = getComponentIcon(data.layerType);

  return (
    <div className={`
      min-w-[200px] max-w-[250px] p-3 rounded-md border-2 shadow-md 
      ${colors.bg} ${colors.border}
      transition-all duration-200 hover:shadow-lg hover:scale-105
    `}>
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 border border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 border border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 border border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 border border-white"
      />

      {/* Content */}
      <div className="flex items-start gap-2">
        <div className={`p-1.5 rounded ${colors.text} bg-white/80 dark:bg-gray-800/80`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm leading-tight ${colors.text} truncate`}>
            {data.name}
          </h4>
          {data.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {data.description}
            </p>
          )}
          <div className="flex items-center gap-1 mt-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(data.status)}`} />
            <Badge variant="outline" className="text-xs">
              {data.layer_code}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
});