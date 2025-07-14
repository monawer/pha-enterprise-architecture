import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ArchitectureComponent {
  id: string;
  name: string;
  description?: string;
  layer_id: string;
  status: string;
  layer: {
    code: string;
    name: string;
  };
}

interface ComponentRelationship {
  id: string;
  source_component_id: string;
  target_component_id: string;
  relationship_type: string;
  description?: string;
}

export interface ArchitectureData {
  components: ArchitectureComponent[];
  relationships: ComponentRelationship[];
  layerCounts: Record<string, number>;
}

const fetchArchitectureData = async (viewType: string): Promise<ArchitectureData> => {
  // Fetch components with layer information
  const { data: components, error: componentsError } = await supabase
    .from('architecture_components')
    .select(`
      id,
      name,
      description,
      layer_id,
      status,
      layer:architecture_layers(code, name)
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
      description
    `);

  if (relationshipsError) {
    throw new Error(`Error fetching relationships: ${relationshipsError.message}`);
  }

  // Calculate layer counts
  const layerCounts = (components || []).reduce((acc, comp) => {
    const layerCode = comp.layer?.code || 'unknown';
    acc[layerCode] = (acc[layerCode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    components: components || [],
    relationships: relationships || [],
    layerCounts
  };
};

export const useArchitectureData = (viewType: string) => {
  return useQuery({
    queryKey: ['architecture-data', viewType],
    queryFn: () => fetchArchitectureData(viewType),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};