import { Node, Edge } from '@xyflow/react';
import { ArchitectureData } from '@/hooks/useArchitectureData';

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

// ArchiMate layout algorithms
const calculateLayerPosition = (layer: string, index: number, total: number) => {
  const layerHeight = 180;
  const layerOrder: Record<string, number> = {
    'BIZ': 0,
    'APP': 1,
    'TECH': 2,
    'DATA': 3,
    'SEC': 4,
    'UX': 5
  };
  
  const y = (layerOrder[layer] || 6) * layerHeight;
  const x = (index * 250) - ((total - 1) * 125);
  
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

  // Filter by view type (layer) - map the view types to layer codes
  if (viewType !== 'integrated') {
    const layerMapping: Record<string, string> = {
      'business': 'BIZ',
      'application': 'APP', 
      'technology': 'TECH',
      'data': 'DATA',
      'security': 'SEC'
    };
    
    const layerCode = layerMapping[viewType];
    if (layerCode) {
      filtered = filtered.filter(comp => comp.layer?.code === layerCode);
    }
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
  const name = component.name?.toLowerCase() || '';
  
  switch (layer) {
    case 'BIZ':
      if (name.includes('خدمة') || name.includes('service')) return 'service';
      if (name.includes('إجراء') || name.includes('procedure')) return 'procedure';
      if (name.includes('سياسة') || name.includes('policy')) return 'policy';
      if (name.includes('قدرة') || name.includes('capability')) return 'capability';
      return 'business-function';
    
    case 'APP':
      if (name.includes('تطبيق') || name.includes('application')) return 'application';
      if (name.includes('قاعدة') || name.includes('database')) return 'database';
      if (name.includes('رابط') || name.includes('link')) return 'technical-link';
      return 'application-component';
    
    case 'TECH':
      if (name.includes('خادم') || name.includes('server')) return 'server';
      if (name.includes('شبكة') || name.includes('network')) return 'network';
      if (name.includes('جهاز') || name.includes('device')) return 'device';
      return 'technology-component';
    
    case 'DATA':
      if (name.includes('كيان') || name.includes('entity')) return 'data-entity';
      if (name.includes('تخزين') || name.includes('storage')) return 'storage';
      return 'data-object';
    
    case 'SEC':
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