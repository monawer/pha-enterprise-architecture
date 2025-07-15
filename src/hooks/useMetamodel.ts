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

export interface RelationshipType {
  type: string;
  count: number;
  description?: string;
}

export interface MetamodelData {
  layers: MetamodelLayer[];
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

  // Fetch component counts per layer
  const { data: components, error: componentsError } = await supabase
    .from('architecture_components')
    .select(`
      id,
      layer_id,
      layer:architecture_layers!inner(code, name)
    `);

  if (componentsError) {
    throw new Error(`Error fetching components: ${componentsError.message}`);
  }

  // Fetch relationships and their types
  const { data: relationships, error: relationshipsError } = await supabase
    .from('component_relationships')
    .select('id, relationship_type, description');

  if (relationshipsError) {
    throw new Error(`Error fetching relationships: ${relationshipsError.message}`);
  }

  // Calculate component counts per layer
  const layerCounts = (components || []).reduce((acc, comp) => {
    const layerCode = comp.layer?.code || 'unknown';
    acc[layerCode] = (acc[layerCode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate relationship type counts
  const relationshipTypeCounts = (relationships || []).reduce((acc, rel) => {
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
    totalComponents: components?.length || 0,
    totalRelationships: relationships?.length || 0,
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