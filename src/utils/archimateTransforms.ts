import { Node, Edge } from '@xyflow/react';
import { ArchitectureData } from '@/hooks/useArchitectureData';

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

// ArchiMate layout algorithms
const calculateLayerPosition = (layer: string, index: number, total: number) => {
  const layerHeight = 150;
  const layerOrder = {
    'business': 0,
    'application': 1,
    'technology': 2,
    'data': 3,
    'security': 4
  };
  
  const y = (layerOrder[layer as keyof typeof layerOrder] || 5) * layerHeight;
  const x = (index * 200) - ((total - 1) * 100);
  
  return { x, y };
};

// Filter components based on view type
const filterComponentsByView = (
  components: any[], 
  viewType: string, 
  searchQuery: string, 
  filterType: string
) => {
  let filtered = components;

  // Filter by view type (layer)
  if (viewType !== 'integrated') {
    filtered = filtered.filter(comp => comp.layer?.code === viewType);
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(comp => 
      comp.name.toLowerCase().includes(query) ||
      comp.description?.toLowerCase().includes(query)
    );
  }

  // Filter by type
  if (filterType !== 'all') {
    filtered = filtered.filter(comp => {
      switch (filterType) {
        case 'active':
          return comp.status === 'active';
        case 'planned':
          return comp.status === 'planned';
        case 'deprecated':
          return comp.status === 'deprecated';
        default:
          return true;
      }
    });
  }

  return filtered;
};

// Transform architecture data to React Flow format
export const transformToFlowData = (
  data: ArchitectureData,
  viewType: string,
  searchQuery: string = '',
  filterType: string = 'all'
): FlowData => {
  const filteredComponents = filterComponentsByView(
    data.components, 
    viewType, 
    searchQuery, 
    filterType
  );

  // Group components by layer for better layout
  const componentsByLayer = filteredComponents.reduce((acc, comp) => {
    const layerCode = comp.layer?.code || 'unknown';
    if (!acc[layerCode]) acc[layerCode] = [];
    acc[layerCode].push(comp);
    return acc;
  }, {} as Record<string, any[]>);

  // Create nodes with proper positioning
  const nodes: Node[] = [];
  Object.entries(componentsByLayer).forEach(([layerCode, components]) => {
    (components as any[]).forEach((comp, index) => {
      const position = calculateLayerPosition(layerCode, index, (components as any[]).length);
      
      nodes.push({
        id: comp.id,
        type: 'archimate',
        position,
        data: {
          label: comp.name,
          layer: layerCode,
          type: determineComponentType(comp, layerCode),
          status: comp.status,
          description: comp.description,
          metadata: comp
        },
        draggable: true,
        selectable: true,
      });
    });
  });

  // Create edges from relationships
  const componentIds = new Set(nodes.map(n => n.id));
  const edges: Edge[] = data.relationships
    .filter(rel => 
      componentIds.has(rel.source_component_id) && 
      componentIds.has(rel.target_component_id)
    )
    .map(rel => ({
      id: rel.id,
      source: rel.source_component_id,
      target: rel.target_component_id,
      type: 'smoothstep',
      label: rel.relationship_type,
      style: {
        stroke: getRelationshipColor(rel.relationship_type),
        strokeWidth: 2,
      },
      labelStyle: {
        fontSize: 12,
        fontWeight: 500,
      },
      data: {
        description: rel.description,
        type: rel.relationship_type
      }
    }));

  return { nodes, edges };
};

// Determine component type based on layer and data
const determineComponentType = (component: any, layer: string): string => {
  switch (layer) {
    case 'business':
      if (component.name.includes('خدمة') || component.name.includes('Service')) return 'service';
      if (component.name.includes('إجراء') || component.name.includes('Procedure')) return 'procedure';
      if (component.name.includes('سياسة') || component.name.includes('Policy')) return 'policy';
      if (component.name.includes('قدرة') || component.name.includes('Capability')) return 'capability';
      return 'business-function';
    
    case 'application':
      if (component.name.includes('تطبيق') || component.name.includes('Application')) return 'application';
      if (component.name.includes('قاعدة') || component.name.includes('Database')) return 'database';
      return 'application-component';
    
    case 'technology':
      if (component.name.includes('خادم') || component.name.includes('Server')) return 'server';
      if (component.name.includes('شبكة') || component.name.includes('Network')) return 'network';
      if (component.name.includes('جهاز') || component.name.includes('Device')) return 'device';
      return 'technology-component';
    
    case 'data':
      if (component.name.includes('كيان') || component.name.includes('Entity')) return 'data-entity';
      if (component.name.includes('تخزين') || component.name.includes('Storage')) return 'storage';
      return 'data-object';
    
    case 'security':
      return 'security-component';
    
    default:
      return 'generic';
  }
};

// Get relationship color based on type
const getRelationshipColor = (type: string): string => {
  switch (type) {
    case 'serves':
    case 'يخدم':
      return 'hsl(var(--primary))';
    case 'uses':
    case 'يستخدم':
      return 'hsl(var(--secondary))';
    case 'depends':
    case 'يعتمد':
      return 'hsl(var(--destructive))';
    case 'flows':
    case 'يتدفق':
      return 'hsl(var(--accent))';
    default:
      return 'hsl(var(--muted-foreground))';
  }
};