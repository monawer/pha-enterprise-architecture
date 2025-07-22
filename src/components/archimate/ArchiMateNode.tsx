import React, { memo, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Database, 
  Server, 
  Shield, 
  Monitor,
  FileText,
  Settings,
  Users,
  Network
} from 'lucide-react';

const getLayerColor = (layer: string) => {
  switch (layer) {
    case 'business':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case 'application':
      return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'technology':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'data':
      return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'security':
      return 'bg-red-100 border-red-300 text-red-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'service':
    case 'capability':
      return Building2;
    case 'application':
    case 'database':
      return Monitor;
    case 'server':
    case 'device':
      return Server;
    case 'data-entity':
    case 'storage':
      return Database;
    case 'security':
      return Shield;
    case 'procedure':
    case 'policy':
      return FileText;
    case 'business-owner':
      return Users;
    case 'network':
      return Network;
    default:
      return Settings;
  }
};

// Helper function to get navigation route based on component type and layer
const getNavigationRoute = (layer: string, type: string, metadata?: Record<string, any>) => {
  const baseRoute = '/architecture';
  
  switch (layer) {
    case 'business':
      switch (type) {
        case 'service':
          return `${baseRoute}/business/services`;
        case 'capability':
          return `${baseRoute}/business/capabilities`;
        case 'procedure':
          return `${baseRoute}/business/procedures`;
        case 'policy':
          return `${baseRoute}/business/policies`;
        case 'business-owner':
          return `${baseRoute}/business/business-owners`;
        default:
          return `${baseRoute}/business`;
      }
    case 'application':
      switch (type) {
        case 'application':
          return `${baseRoute}/applications/apps`;
        case 'database':
          return `${baseRoute}/applications/databases`;
        default:
          return `${baseRoute}/applications`;
      }
    case 'technology':
      switch (type) {
        case 'server':
          return `${baseRoute}/technology/virtual-servers`;
        case 'device':
          return `${baseRoute}/technology/network-devices`;
        case 'network':
          return `${baseRoute}/technology/networks`;
        default:
          return `${baseRoute}/technology`;
      }
    case 'data':
      switch (type) {
        case 'data-entity':
          return `${baseRoute}/data/data-entities`;
        case 'storage':
          return `${baseRoute}/data/data-storage`;
        default:
          return `${baseRoute}/data`;
      }
    case 'security':
      return `${baseRoute}/security/security-devices`;
    default:
      return baseRoute;
  }
};

interface ArchiMateNodeProps {
  data: {
    label: string;
    layer: string;
    type: string;
    status?: string;
    description?: string;
    metadata?: Record<string, any>;
  };
}

export const ArchiMateNode: React.FC<ArchiMateNodeProps> = memo(({ data }) => {
  const navigate = useNavigate();
  const Icon = getTypeIcon(data.type);
  const layerColorClass = getLayerColor(data.layer);

  const handleNodeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const route = getNavigationRoute(data.layer, data.type, data.metadata);
    navigate(route);
  }, [navigate, data.layer, data.type, data.metadata]);

  return (
    <div 
      className={`p-3 rounded-lg border-2 min-w-[150px] shadow-sm hover:shadow-lg transition-all cursor-pointer select-none ${layerColorClass}`}
      onClick={handleNodeClick}
      title={`انقر للانتقال إلى ${data.label}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <div className="flex items-start gap-2">
        <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm leading-tight mb-1">
            {data.label}
          </div>
          {data.description && (
            <div className="text-xs opacity-80 leading-tight">
              {data.description.length > 50 
                ? `${data.description.substring(0, 50)}...` 
                : data.description
              }
            </div>
          )}
          <div className="flex items-center gap-1 mt-2">
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {data.type}
            </Badge>
            {data.status && (
              <Badge 
                variant={data.status === 'active' ? 'default' : 'secondary'} 
                className="text-xs px-1 py-0"
              >
                {data.status}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
});