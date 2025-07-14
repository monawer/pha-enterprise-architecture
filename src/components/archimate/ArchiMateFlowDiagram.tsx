import React, { useCallback, useEffect, useState } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useArchitectureData } from '@/hooks/useArchitectureData';
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    if (architectureData) {
      const { nodes: flowNodes, edges: flowEdges } = transformToFlowData(
        architectureData,
        viewType,
        searchQuery,
        filterType
      );
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [architectureData, viewType, searchQuery, filterType, setNodes, setEdges]);

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
        onNodesChange={onNodesChange}
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