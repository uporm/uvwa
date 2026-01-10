import IconFont from '@/components/icon-font';

import { addNode, fetchAppSpec, flowSpecState, initSubscribe } from '@/stores/app-flow.store';

import ActionBar from '@/pages/app/workflow/components/action-bar';
import AttributePanel from '@/pages/app/workflow/components/attribute-panel';
import ContextMenu from '@/pages/app/workflow/components/context-menu';
import { useApp } from '@/pages/app/hooks/useApp';
import { NODE_TYPE, NodeDefineTypes } from '@/pages/app/nodeTypes';
import { App } from '@/types/app.types';
import { CaretRightOutlined, ClockCircleOutlined, LeftOutlined, PicRightOutlined, SafetyOutlined } from '@ant-design/icons';
import {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Badge, Button, Divider, Drawer, Flex, theme, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSnapshot } from 'valtio';
import '../xy-theme.css';
import ZoomBar from './components/zoom-bar';
import RedoBar from '@/pages/app/workflow/components/redo-bar';

const { useToken } = theme;
const { Text } = Typography;

interface AppFlowProps {
  open: boolean;
  app?: App;
  onClose?: () => void;
  onSave?: () => void;
}

const AppFlow: React.FC<AppFlowProps> = memo(({ app, open, onClose, onSave }) => {
  const [loaded, setLoaded] = useState(false);
  const { token } = useToken();
  useEffect(() => {
    if (app?.id) {
      setLoaded(false);
      fetchAppSpec(app?.id).then(() => {
        setLoaded(true);
      });
    }
  }, [app?.id]);

  useEffect(() => {
    const unsubscribe = initSubscribe();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Drawer
      open={open}
      placement={'right'}
      mask={false}
      onClose={onClose}
      closeIcon={<LeftOutlined style={{ fontSize: '20px' }} />}
      styles={{
        wrapper: {
          width: '100vw', // 使用视口宽度确保 100%
        },
        header: { backgroundColor: '#fafafa', padding: '8px' },
        body: { padding: '0px' },
      }}
      destroyOnHidden
      title={
        <Flex align="center" gap={4}>
          <IconFont type="icon-flow" style={{ fontSize: '36px' }} />
          <Flex vertical gap={4}>
            <Flex gap={10} align="end">
              <Text style={{ fontSize: '16px' }}>{app?.name}</Text>
              <Text style={{ fontSize: '12px' }} type="secondary">
                编辑于 {dayjs(app?.updatedTime).format('YYYY-MM-DD HH:mm')}
              </Text>
            </Flex>
            <Text style={{ fontSize: '14px' }} type="secondary">
              {app?.description}
            </Text>
          </Flex>
        </Flex>
      }
      extra={
        <Flex gap={14}>
          <Flex
            align="center"
            style={{
              backgroundColor: token.colorFillQuaternary,
              border: `1px solid ${token.colorSplit}`,
              borderRadius: 10,
              padding: 0,
            }}
          >
            <Button type="text" icon={<CaretRightOutlined />}>
              预览
            </Button>
            <Divider orientation="vertical" size="small" style={{ marginInline: 2 }} />
            <Tooltip placement="bottomLeft" title="运行历史">
              <Button type="text" icon={<PicRightOutlined />} />
            </Tooltip>

            <Divider orientation="vertical" size="small" style={{ marginInline: 2 }} />
            <Badge count={2} color="#faad14">
              <Tooltip placement="bottomLeft" title="检查清单">
                <Button type="text" icon={<SafetyOutlined />} />
              </Tooltip>
            </Badge>
          </Flex>

          <Button type="primary">发布</Button>
          <Tooltip placement="bottomLeft" title="版本历史">
            <Button type="text" icon={<ClockCircleOutlined />} style={{ backgroundColor: token.colorFillQuaternary }} />
          </Tooltip>
        </Flex>
      }
    >
      <ReactFlowProvider>
        <EditFlowContent />
      </ReactFlowProvider>
    </Drawer>
  );
});

const EditFlowContent: React.FC = memo(() => {
  const [contextMenu, setContextMenu] = useState({
    open: false,
    position: { x: 0, y: 0 },
  });

  const { screenToFlowPosition } = useReactFlow();

  const snap = useSnapshot(flowSpecState);
  const {
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDrag,
    onNodeDragStop,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onValidConnection,
    dropNodeIds,
    hoveredNodeId,
  } = useApp();

  const nodeTypes = useMemo(() => {
    return Object.fromEntries(Object.entries(NodeDefineTypes).map(([key, value]) => [key, value.renderComponent]));
  }, []);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({ open: true, position: { x: event.clientX, y: event.clientY } });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu({ open: false, position: { x: 0, y: 0 } });
  }, []);

  const handleAddNode = useCallback(
    (nodeType: string) => {
      const flowPosition = screenToFlowPosition(contextMenu.position);
      addNode(nodeType, flowPosition);
    },
    [screenToFlowPosition, contextMenu.position],
  );

  const handleAddComment = useCallback(() => {
    const position = screenToFlowPosition(contextMenu.position);
    addNode(NODE_TYPE.NOTE, position);
  }, [screenToFlowPosition, contextMenu.position]);

  return (
    <Flex style={{ height: '100%' }}>
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodeTypes={nodeTypes}
        minZoom={0.25}
        maxZoom={2}
        nodes={snap.nodes.map(
          (node: any) =>
            ({
              ...node,
              className: `${node.className} ${dropNodeIds?.includes(node.id) && 'highlight'} ${
                hoveredNodeId === node.id && 'node-hovered'
              }`,
            } as Node),
        )}
        edges={snap.edges.map(
          (edge: any) =>
            ({
              ...edge,
              className: `${edge.className} ${
                hoveredNodeId && (edge.source === hoveredNodeId || edge.target === hoveredNodeId) && 'edge-hovered'
              }`,
            } as Edge),
        )}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={onValidConnection}
        selectionMode={SelectionMode.Partial}
        selectNodesOnDrag={false}
        onContextMenu={handleContextMenu}
      >
        <AttributePanel />
        <ZoomBar />
        <RedoBar />
        <ActionBar />

        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <ContextMenu
        open={contextMenu.open}
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
        onAddNode={handleAddNode}
        onAddComment={handleAddComment}
        // onExportDSL={exportDSL}
        // onImportDSL={importDSL}
      />
    </Flex>
  );
});

export default AppFlow;
