import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, StickyNote, Square, Minus, Type, ZoomIn, ZoomOut, Maximize2, Layers, ArrowLeft } from 'lucide-react';
import { cn } from '@/utils';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import type { CanvasNode } from '@/types';

type Tool = 'select' | 'sticky' | 'shape' | 'connector' | 'text';

const TOOLS: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)' },
  { id: 'sticky', icon: StickyNote, label: 'Sticky Note (S)' },
  { id: 'shape', icon: Square, label: 'Shape (R)' },
  { id: 'connector', icon: Minus, label: 'Connector (C)' },
  { id: 'text', icon: Type, label: 'Text (T)' },
];

const STICKY_COLORS = ['#fef9c3', '#dbeafe', '#dcfce7', '#fce7f3', '#ede9fe', '#ffedd5'];

// --- Nodes ---
const StickyNoteNode: React.FC<{ node: CanvasNode; zoom: number; onDragEnd: (id: string, x: number, y: number) => void; onSelect: (id: string) => void; selected: boolean }> = ({ node, zoom, onDragEnd, onSelect, selected }) => (
  <motion.div
    drag dragMomentum={false}
    onDragEnd={(_, info) => onDragEnd(node.id, node.x + info.offset.x / zoom, node.y + info.offset.y / zoom)}
    onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
    className={cn('absolute cursor-grab active:cursor-grabbing rounded-xl shadow-md hover:shadow-lg transition-shadow', selected && 'ring-2 ring-[#8b5a46] ring-offset-1')}
    style={{ left: node.x, top: node.y, width: node.w, height: node.h, background: node.color, zIndex: selected ? 10 : 1 }}
    whileHover={{ scale: 1.01 }}
  >
    <div className="p-4 h-full">
      <textarea 
        className="w-full h-full bg-transparent resize-none outline-none text-sm text-gray-800 font-medium leading-relaxed" 
        defaultValue={node.content} 
        onMouseDown={e => e.stopPropagation()}
      />
    </div>
  </motion.div>
);

const ShapeNode: React.FC<{ node: CanvasNode; zoom: number; onDragEnd: (id: string, x: number, y: number) => void; onSelect: (id: string) => void; selected: boolean }> = ({ node, zoom, onDragEnd, onSelect, selected }) => {
  const shapeClass = node.shape === 'circle' ? 'rounded-full' : node.shape === 'diamond' ? '' : 'rounded-xl';
  return (
    <motion.div
      drag dragMomentum={false}
      onDragEnd={(_, info) => onDragEnd(node.id, node.x + info.offset.x / zoom, node.y + info.offset.y / zoom)}
      onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
      className={cn('absolute cursor-grab active:cursor-grabbing border-2 border-current flex items-center justify-center shadow-sm hover:shadow-md transition-shadow', shapeClass, selected && 'ring-2 ring-[#8b5a46] ring-offset-1')}
      style={{ left: node.x, top: node.y, width: node.w, height: node.h, background: node.color, transform: node.shape === 'diamond' ? 'rotate(45deg)' : undefined, zIndex: selected ? 10 : 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div style={{ transform: node.shape === 'diamond' ? 'rotate(-45deg)' : undefined }} className="w-full h-full p-2 flex items-center justify-center">
        <textarea 
          className="w-full h-full bg-transparent resize-none outline-none text-sm font-semibold text-gray-800 text-center flex items-center" 
          defaultValue={node.content} 
          onMouseDown={e => e.stopPropagation()}
          style={{ lineHeight: `${node.h ? node.h - 16 : 64}px` }}
        />
      </div>
    </motion.div>
  );
};

const TextNode: React.FC<{ node: CanvasNode; zoom: number; onDragEnd: (id: string, x: number, y: number) => void; onSelect: (id: string) => void; selected: boolean }> = ({ node, zoom, onDragEnd, onSelect, selected }) => (
  <motion.div
    drag dragMomentum={false}
    onDragEnd={(_, info) => onDragEnd(node.id, node.x + info.offset.x / zoom, node.y + info.offset.y / zoom)}
    onClick={(e) => { e.stopPropagation(); onSelect(node.id); }}
    className={cn('absolute cursor-grab active:cursor-grabbing', selected && 'ring-2 ring-[#8b5a46] ring-offset-2 rounded-lg')}
    style={{ left: node.x, top: node.y, width: node.w, zIndex: selected ? 10 : 1 }}
  >
    <textarea 
      className="w-full bg-transparent resize-none outline-none text-base font-bold text-gray-800" 
      defaultValue={node.content} 
      onMouseDown={e => e.stopPropagation()}
    />
  </motion.div>
);

export const CanvasView: React.FC = () => {
  const { canvasNodes, updateCanvasNode, addCanvasNode, setWorkspaceSubView } = useWorkspaceStore();
  const [tool, setTool] = useState<Tool>('select');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stickyColorIdx, setStickyColorIdx] = useState(0);
  
  // Connection state
  const [connections, setConnections] = useState<{from: string, to: string}[]>([]);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({x: 0, y: 0});

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = useCallback((id: string, x: number, y: number) => {
    updateCanvasNode(id, { x, y });
  }, [updateCanvasNode]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      setZoom(z => Math.min(3, Math.max(0.25, z - e.deltaY * 0.005)));
    } else {
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  const getNodeCenter = (id: string) => {
    const n = canvasNodes.find(n => n.id === id);
    if (!n) return {x: 0, y: 0};
    return { x: n.x + (n.w || 100)/2, y: n.y + (n.h || 100)/2 };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked on a node when in connector mode
    if (tool === 'connector') {
      const clickedNode = canvasNodes.slice().reverse().find(n => 
        x >= n.x && x <= n.x + (n.w||0) && y >= n.y && y <= n.y + (n.h||0)
      );
      if (clickedNode) {
        setConnectingFrom(clickedNode.id);
        setMousePos({x, y});
        return;
      }
    }

    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset.canvas) {
      if (tool === 'select') {
        setSelectedId(null);
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      } else if (tool === 'sticky') {
        addCanvasNode({
          id: `cn${Date.now()}`, type: 'sticky', x, y, w: 200, h: 160,
          content: 'New note...', color: STICKY_COLORS[stickyColorIdx % STICKY_COLORS.length],
        });
        setStickyColorIdx(i => i + 1);
        setTool('select');
      } else if (tool === 'shape') {
        addCanvasNode({
          id: `cn${Date.now()}`, type: 'shape', x, y, w: 160, h: 80,
          content: 'Process', color: '#ede9fe', shape: 'rect',
        });
        setTool('select');
      } else if (tool === 'text') {
        addCanvasNode({
          id: `cn${Date.now()}`, type: 'text', x, y, w: 200, h: 40,
          content: 'Title Text', color: '#0a0a0a',
        });
        setTool('select');
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
    if (connectingFrom) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      setMousePos({x, y});
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPanning(false);
    
    if (connectingFrom) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;
      
      const targetNode = canvasNodes.slice().reverse().find(n => 
        n.id !== connectingFrom && x >= n.x && x <= n.x + (n.w||0) && y >= n.y && y <= n.y + (n.h||0)
      );

      if (targetNode) {
        setConnections([...connections, {from: connectingFrom, to: targetNode.id}]);
      }
      setConnectingFrom(null);
      setTool('select');
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-[#fafaf9]">
      
      {/* Header Overlay (Matching Notes/Table style) */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 md:px-8 py-5 pointer-events-none">
        <div className="pointer-events-auto w-fit">
          <button
            onClick={() => setWorkspaceSubView('dashboard')}
            className="flex items-center gap-2 text-sm font-medium text-stone-600 bg-white shadow-sm border border-stone-200 hover:bg-stone-50 px-4 py-2 rounded-full transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-1" style={{textShadow: '0 2px 10px white'}}>
            Untitled Canvas
          </h1>
          <p className="text-stone-500 text-lg font-medium" style={{textShadow: '0 1px 4px white'}}>
            Infinite space for your ideas
          </p>
        </div>
      </div>

      {/* Vertical Toolbar on Left */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2 z-20 flex flex-col items-center bg-white rounded-2xl shadow-lg border border-stone-200 px-2 py-3 gap-2">
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            title={label}
            onClick={() => setTool(id)}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
              tool === id ? 'bg-[#8b5a46] text-white shadow-md' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
            )}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className={cn('flex-1 overflow-hidden canvas-surface', tool === 'sticky' || tool === 'shape' || tool === 'text' ? 'cursor-crosshair' : tool === 'connector' ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-default')}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        data-canvas="true"
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', position: 'absolute', inset: 0 }}>
          
          {/* Render Connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible', zIndex: 0 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#8b5a46" />
              </marker>
            </defs>
            {connections.map((conn, i) => {
              const start = getNodeCenter(conn.from);
              const end = getNodeCenter(conn.to);
              return (
                <line key={i} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#8b5a46" strokeWidth={2} markerEnd="url(#arrowhead)" />
              );
            })}
            {/* Active connecting line */}
            {connectingFrom && (
              <line x1={getNodeCenter(connectingFrom).x} y1={getNodeCenter(connectingFrom).y} x2={mousePos.x} y2={mousePos.y} stroke="#8b5a46" strokeWidth={2} strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
            )}
          </svg>

          {/* Render Nodes */}
          {canvasNodes.map(node => {
            if (node.type === 'sticky') return <StickyNoteNode key={node.id} node={node} zoom={zoom} onDragEnd={handleDragEnd} onSelect={setSelectedId} selected={selectedId === node.id} />;
            if (node.type === 'shape') return <ShapeNode key={node.id} node={node} zoom={zoom} onDragEnd={handleDragEnd} onSelect={setSelectedId} selected={selectedId === node.id} />;
            if (node.type === 'text') return <TextNode key={node.id} node={node} zoom={zoom} onDragEnd={handleDragEnd} onSelect={setSelectedId} selected={selectedId === node.id} />;
            return null;
          })}
        </div>
      </div>

      {/* Zoom Controls (Bottom Left, moved right slightly to avoid toolbar) */}
      <div className="absolute bottom-6 left-24 z-20 flex items-center bg-white rounded-xl shadow-md border border-stone-200 px-2 py-1.5 gap-1">
        <button onClick={() => setZoom(z => Math.max(0.25, z - 0.1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-all"><ZoomOut size={16} /></button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="px-3 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-stone-700 hover:bg-stone-100 transition-all min-w-[60px]">{Math.round(zoom * 100)}%</button>
        <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-all"><ZoomIn size={16} /></button>
        <div className="w-px h-5 bg-stone-200 mx-1" />
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-all"><Maximize2 size={16} /></button>
      </div>

      {/* Minimap (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 w-40 h-28 bg-white rounded-xl border border-stone-200 shadow-md overflow-hidden">
        <div className="absolute inset-0 canvas-surface opacity-50" />
        <div className="absolute inset-1 rounded-lg overflow-hidden" style={{ transform: 'scale(0.12)', transformOrigin: '0 0', width: '800%', height: '800%', pointerEvents: 'none' }}>
          {canvasNodes.map(n => (
            <div key={n.id} className="absolute rounded-md opacity-60" style={{ left: n.x, top: n.y, width: n.w, height: n.h, background: n.color ?? '#e5e7eb' }} />
          ))}
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-white/80 px-2 py-1 rounded-md">
          <Layers size={12} className="text-stone-500" />
          <span className="text-[10px] text-stone-600 font-bold">{canvasNodes.length} objects</span>
        </div>
      </div>
    </div>
  );
};
