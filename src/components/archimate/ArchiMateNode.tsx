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

// Helper function to get navigation route based on component data
const getNavigationRoute = (data: any) => {
  const { metadata } = data;
  
  if (!metadata || !metadata.id) {
    return null;
  }

  // Determine the route based on the metadata content
  // Check for specific entity types based on table structure
  
  // Business layer entities
  if (metadata.service_name || metadata.service_code) {
    return `/architecture/business/services?view=${metadata.id}`;
  }
  if (metadata.capability_name || metadata.task_code) {
    return `/architecture/business/capabilities?view=${metadata.id}`;
  }
  if (metadata.procedure_name || metadata.procedure_code) {
    return `/architecture/business/procedures?view=${metadata.id}`;
  }
  if (metadata.policy_name || metadata.policy_code) {
    return `/architecture/business/policies?view=${metadata.id}`;
  }
  if (metadata.title && metadata.job_description) {
    return `/architecture/business/business-owners?view=${metadata.id}`;
  }
  if (metadata.form_name || metadata.form_code) {
    return `/architecture/business/forms?view=${metadata.id}`;
  }
  if (metadata.branch_name || metadata.branch_code) {
    return `/architecture/business/branches?view=${metadata.id}`;
  }
  
  // Application layer entities
  if (metadata.app_type || metadata.development_type || metadata.authentication_type) {
    return `/architecture/applications/apps?view=${metadata.id}`;
  }
  if (metadata.database_name || metadata.database_environment_type) {
    return `/architecture/applications/databases?view=${metadata.id}`;
  }
  if (metadata.connection_type || metadata.integration_platform) {
    return `/architecture/applications/technical-links?view=${metadata.id}`;
  }
  
  // Data layer entities
  if (metadata.entity_name_ar || metadata.entity_name_en || metadata.data_classification) {
    return `/architecture/data/data-entities?view=${metadata.id}`;
  }
  if (metadata.type && metadata.structure) {
    return `/architecture/data/data-storage?view=${metadata.id}`;
  }
  
  // Technology layer entities
  if (metadata.host_name && metadata.network_segment) {
    return `/architecture/technology/network-devices?view=${metadata.id}`;
  }
  if (metadata.host_name && metadata.manufacturer) {
    return `/architecture/technology/virtual-servers?view=${metadata.id}`;
  }
  
  // Security layer entities
  if (metadata.function || metadata.firmware_version) {
    return `/architecture/security/security-devices?view=${metadata.id}`;
  }
  
  // Default fallback - go to the layer page
  switch (data.layer) {
    case 'BIZ':
      return '/architecture/business';
    case 'APP':
      return '/architecture/applications';
    case 'TECH':
      return '/architecture/technology';
    case 'DATA':
      return '/architecture/data';
    case 'SEC':
      return '/architecture/security';
    default:
      return '/architecture';
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
    const route = getNavigationRoute(data);
    if (route) {
      navigate(route);
    }
  }, [navigate, data]);

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