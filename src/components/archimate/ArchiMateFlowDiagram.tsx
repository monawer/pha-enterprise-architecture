import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useArchitectureData } from '@/hooks/useArchitectureData';
import { useNodePositions } from '@/hooks/useNodePositions';
import { ArchiMateNode } from './ArchiMateNode';
import { transformToFlowData } from '@/utils/archimateTransforms';

const nodeTypes = {
  archimate: ArchiMateNode,
};

interface ArchiMateFlowDiagramProps {
  viewType: string;
  searchQuery: string;
  filterType: string;
}

export const ArchiMateFlowDiagram: React.FC<ArchiMateFlowDiagramProps> = ({
  viewType,
  searchQuery,
  filterType
}) => {
  const { data: architectureData, isLoading, error } = useArchitectureData(viewType);
  const { positions, savePosition } = useNodePositions(viewType);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Handle node changes with position saving
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    
    // Save positions when nodes are moved
    changes.forEach((change) => {
      if (change.type === 'position' && change.position && change.dragging === false) {
        // Clear any existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        
        // Debounce the save operation
        saveTimeoutRef.current = setTimeout(() => {
          savePosition(change.id, change.position!.x, change.position!.y);
        }, 1000); // Save after 1 second of no movement
      }
    });
  }, [onNodesChange, savePosition]);

  useEffect(() => {
    if (architectureData && positions) {
      const { nodes: flowNodes, edges: flowEdges } = transformToFlowData(
        architectureData,
        viewType,
        searchQuery,
        filterType,
        positions
      );
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [architectureData, viewType, searchQuery, filterType, positions, setNodes, setEdges]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>حدث خطأ في تحميل البيانات</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-[600px] bg-background border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="top-right"
        className="bg-background"
      >
        <Controls />
        <MiniMap 
          className="bg-card border rounded"
          nodeColor={(node) => {
            switch (node.data?.layer) {
              case 'business': return '#FFFF99';
              case 'application': return '#B3D9FF';
              case 'technology': return '#C8E6C9';
              case 'data': return '#FFE0B2';
              case 'security': return '#FFCDD2';
              default: return '#E0E0E0';
            }
          }}
        />
        <Background 
          gap={12} 
          size={1} 
          className="opacity-50"
        />
      </ReactFlow>
    </div>
  );
};