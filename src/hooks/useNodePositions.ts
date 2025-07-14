import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NodePosition {
  id: string;
  component_id: string;
  view_type: string;
  x_position: number;
  y_position: number;
  user_id?: string;
}

interface SavePositionData {
  component_id: string;
  view_type: string;
  x_position: number;
  y_position: number;
}

const fetchNodePositions = async (viewType: string): Promise<NodePosition[]> => {
  const { data, error } = await supabase
    .from('archimate_node_positions')
    .select('*')
    .eq('view_type', viewType);

  if (error) {
    throw new Error(`Error fetching node positions: ${error.message}`);
  }

  return data || [];
};

const saveNodePosition = async (positionData: SavePositionData): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from('archimate_node_positions')
    .upsert({
      ...positionData,
      user_id: user?.id || null
    }, {
      onConflict: 'component_id,view_type,user_id'
    });

  if (error) {
    throw new Error(`Error saving node position: ${error.message}`);
  }
};

export const useNodePositions = (viewType: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: positions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['node-positions', viewType],
    queryFn: () => fetchNodePositions(viewType),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const savePositionMutation = useMutation({
    mutationFn: saveNodePosition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['node-positions', viewType] });
    },
    onError: (error) => {
      toast({
        title: "خطأ في حفظ الموضع",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getNodePosition = (componentId: string) => {
    return positions.find(p => p.component_id === componentId);
  };

  const savePosition = (componentId: string, x: number, y: number) => {
    savePositionMutation.mutate({
      component_id: componentId,
      view_type: viewType,
      x_position: x,
      y_position: y
    });
  };

  return {
    positions,
    isLoading,
    error,
    getNodePosition,
    savePosition,
    isSaving: savePositionMutation.isPending
  };
};