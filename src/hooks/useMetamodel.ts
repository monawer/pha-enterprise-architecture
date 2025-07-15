import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MetamodelLayer {
  id: string;
  name: string;
  description?: string;
  code: string;
  order_num: number;
  componentCount: number;
}

export interface MetamodelComponent {
  id: string;
  name: string;
  description?: string;
  layer_id: string;
  layer_code: string;
  layer_name: string;
  status: string;
}

export interface RelationshipType {
  type: string;
  count: number;
  description?: string;
}

export interface ComponentRelationship {
  id: string;
  source_component_id: string;
  target_component_id: string;
  relationship_type: string;
  description?: string;
  source_component: MetamodelComponent;
  target_component: MetamodelComponent;
}

export interface MetamodelData {
  layers: MetamodelLayer[];
  components: MetamodelComponent[];
  relationships: ComponentRelationship[];
  totalComponents: number;
  totalRelationships: number;
  relationshipTypes: RelationshipType[];
  layerCounts: Record<string, number>;
}

const fetchMetamodelData = async (): Promise<MetamodelData> => {
  // Fetch layers with component counts
  const { data: layers, error: layersError } = await supabase
    .from('architecture_layers')
    .select(`
      id,
      name,
      description,
      code,
      order_num
    `)
    .order('order_num');

  if (layersError) {
    throw new Error(`Error fetching layers: ${layersError.message}`);
  }

  // Fetch components with layer information
  const { data: components, error: componentsError } = await supabase
    .from('architecture_components')
    .select(`
      id,
      name,
      description,
      layer_id,
      status,
      layer:architecture_layers!inner(code, name)
    `)
    .order('name');

  if (componentsError) {
    throw new Error(`Error fetching components: ${componentsError.message}`);
  }

  // Fetch relationships with component details
  const { data: relationships, error: relationshipsError } = await supabase
    .from('component_relationships')
    .select(`
      id,
      source_component_id,
      target_component_id,
      relationship_type,
      description,
      source_component:architecture_components!source_component_id(
        id, name, description, layer_id, status,
        layer:architecture_layers!inner(code, name)
      ),
      target_component:architecture_components!target_component_id(
        id, name, description, layer_id, status,
        layer:architecture_layers!inner(code, name)
      )
    `);

  if (relationshipsError) {
    throw new Error(`Error fetching relationships: ${relationshipsError.message}`);
  }

  // Process components data
  const processedComponents: MetamodelComponent[] = (components || []).map(comp => ({
    id: comp.id,
    name: comp.name,
    description: comp.description,
    layer_id: comp.layer_id,
    layer_code: comp.layer?.code || 'unknown',
    layer_name: comp.layer?.name || 'Unknown Layer',
    status: comp.status
  }));

  // Process relationships data
  const processedRelationships: ComponentRelationship[] = (relationships || [])
    .filter(rel => rel.source_component && rel.target_component)
    .map(rel => ({
      id: rel.id,
      source_component_id: rel.source_component_id,
      target_component_id: rel.target_component_id,
      relationship_type: rel.relationship_type,
      description: rel.description,
      source_component: {
        id: rel.source_component.id,
        name: rel.source_component.name,
        description: rel.source_component.description,
        layer_id: rel.source_component.layer_id,
        layer_code: rel.source_component.layer?.code || 'unknown',
        layer_name: rel.source_component.layer?.name || 'Unknown Layer',
        status: rel.source_component.status
      },
      target_component: {
        id: rel.target_component.id,
        name: rel.target_component.name,
        description: rel.target_component.description,
        layer_id: rel.target_component.layer_id,
        layer_code: rel.target_component.layer?.code || 'unknown',
        layer_name: rel.target_component.layer?.name || 'Unknown Layer',
        status: rel.target_component.status
      }
    }));

  // Calculate layer counts
  const layerCounts = processedComponents.reduce((acc, comp) => {
    const layerCode = comp.layer_code;
    acc[layerCode] = (acc[layerCode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate relationship type counts
  const relationshipTypeCounts = processedRelationships.reduce((acc, rel) => {
    const type = rel.relationship_type;
    const existing = acc.find(item => item.type === type);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ 
        type, 
        count: 1, 
        description: rel.description 
      });
    }
    return acc;
  }, [] as RelationshipType[]);

  // Add component counts to layers
  const layersWithCounts: MetamodelLayer[] = (layers || []).map(layer => ({
    ...layer,
    componentCount: layerCounts[layer.code] || 0
  }));

  return {
    layers: layersWithCounts,
    components: processedComponents,
    relationships: processedRelationships,
    totalComponents: processedComponents.length,
    totalRelationships: processedRelationships.length,
    relationshipTypes: relationshipTypeCounts,
    layerCounts
  };
};

export const useMetamodel = () => {
  return useQuery({
    queryKey: ['metamodel'],
    queryFn: fetchMetamodelData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};