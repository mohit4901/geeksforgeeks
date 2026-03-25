import { useEffect, useMemo, useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from "reactflow";
import "reactflow/dist/style.css";

import {
  Cloud,
  Network,
  Shield,
  HardDrive,
  Server,
  Route,
  Globe,
  Database,
  Trash2,
  Pencil,
  Plus,
  RotateCcw,
  Boxes
} from "lucide-react";

/* -------------------- Theme -------------------- */

const NODE_THEME = {
  vpc: { bg: "#0f172a", border: "#3b82f6", icon: Cloud, label: "VPC" },
  subnet: { bg: "#111827", border: "#38bdf8", icon: Network, label: "Subnet" },
  gateway: { bg: "#172554", border: "#6366f1", icon: Globe, label: "Gateway" },
  route: { bg: "#1e293b", border: "#60a5fa", icon: Route, label: "Route" },
  ec2: { bg: "#1e1b4b", border: "#8b5cf6", icon: Server, label: "EC2" },
  s3: { bg: "#052e16", border: "#22c55e", icon: HardDrive, label: "S3" },
  security: { bg: "#3f1d2e", border: "#f43f5e", icon: Shield, label: "Security" },
  database: { bg: "#3b0764", border: "#c084fc", icon: Database, label: "Database" },
  custom: { bg: "#111827", border: "#f59e0b", icon: Boxes, label: "Custom" }
};

function inferType(label = "") {
  const l = label.toLowerCase();

  if (l.includes("vpc")) return "vpc";
  if (l.includes("subnet")) return "subnet";
  if (l.includes("gateway") || l.includes("igw") || l.includes("nat")) return "gateway";
  if (l.includes("route")) return "route";
  if (l.includes("ec2") || l.includes("instance") || l.includes("server") || l.includes("app")) return "ec2";
  if (l.includes("s3") || l.includes("bucket") || l.includes("storage")) return "s3";
  if (l.includes("security") || l.includes("sg") || l.includes("firewall")) return "security";
  if (l.includes("db") || l.includes("database") || l.includes("rds")) return "database";

  return "custom";
}

/* -------------------- Global Actions -------------------- */

if (!window.__diagramActions) {
  window.__diagramActions = {
    renameNode: () => {},
    deleteNode: () => {}
  };
}

/* -------------------- Custom Node -------------------- */

function AwsNode({ id, data, selected }) {
  const { label, type } = data;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(label);

  const theme = NODE_THEME[type] || NODE_THEME.custom;
  const Icon = theme.icon;

  useEffect(() => {
    setValue(label);
  }, [label]);

  const saveRename = () => {
    const trimmed = value.trim() || "Unnamed Node";
    window.__diagramActions.renameNode(id, trimmed);
    setEditing(false);
  };

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      className="relative min-w-[210px] rounded-2xl border text-white transition-all duration-200"
      style={{
        background: `linear-gradient(180deg, ${theme.bg} 0%, rgba(10,15,25,0.98) 100%)`,
        borderColor: selected ? "#ffffff" : theme.border,
        boxShadow: selected
          ? `0 0 0 2px ${theme.border}, 0 18px 40px rgba(0,0,0,0.42)`
          : "0 14px 34px rgba(0,0,0,0.30)"
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: theme.border, width: 10, height: 10 }}
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: `${theme.border}20`,
                border: `1px solid ${theme.border}`
              }}
            >
              <Icon size={18} color={theme.border} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-1">
                {theme.label}
              </p>

              {editing ? (
                <input
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={saveRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRename();
                    if (e.key === "Escape") {
                      setValue(label);
                      setEditing(false);
                    }
                  }}
                  className="bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-sm outline-none w-[135px]"
                />
              ) : (
                <p className="text-sm font-semibold leading-snug break-words">
                  {label}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-90">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition"
              title="Rename"
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={() => window.__diagramActions.deleteNode(id)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 transition"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <span>Editable</span>
          <span className="uppercase tracking-wider">{type}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: theme.border, width: 10, height: 10 }}
      />
    </div>
  );
}

/* IMPORTANT: stable outside component */
const nodeTypes = { awsNode: AwsNode };

/* -------------------- Parser -------------------- */

function cleanDiagram(diagram = "") {
  return diagram
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        l &&
        !l.startsWith("flowchart") &&
        !l.startsWith("graph") &&
        !l.startsWith("classDef") &&
        !l.startsWith("class ") &&
        !l.startsWith("style ") &&
        !l.startsWith("linkStyle") &&
        !l.startsWith("subgraph") &&
        l !== "end"
    );
}

function buildFlowFromDiagram(diagram = "") {
  const nodes = [];
  const edges = [];
  const added = new Set();

  const lines = cleanDiagram(diagram);

  let x = 100;
  let y = 80;
  const spacingX = 290;
  const spacingY = 180;

  function pushNode(id, label) {
    if (!added.has(id)) {
      nodes.push({
        id,
        type: "awsNode",
        position: { x, y },
        data: {
          label,
          type: inferType(label)
        }
      });

      added.add(id);

      x += spacingX;
      if (x > 980) {
        x = 100;
        y += spacingY;
      }
    }
  }

  lines.forEach((line) => {
    let nodeMatch = line.match(/^([A-Za-z0-9_]+)\["(.+?)"\]$/);
    if (!nodeMatch) nodeMatch = line.match(/^([A-Za-z0-9_]+)\[(.+?)\]$/);
    if (!nodeMatch) nodeMatch = line.match(/^([A-Za-z0-9_]+)\("(.+?)"\)$/);
    if (!nodeMatch) nodeMatch = line.match(/^([A-Za-z0-9_]+)\((.+?)\)$/);

    const edgeMatch = line.match(/^([A-Za-z0-9_]+)\s*-->\s*([A-Za-z0-9_]+)$/);

    if (nodeMatch) {
      const id = nodeMatch[1];
      const label = nodeMatch[2].replace(/\\n/g, " ");
      pushNode(id, label);
    }

    if (edgeMatch) {
      const source = edgeMatch[1];
      const target = edgeMatch[2];

      if (!added.has(source)) pushNode(source, source);
      if (!added.has(target)) pushNode(target, target);

      edges.push({
        id: `${source}-${target}`,
        source,
        target,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: {
          stroke: "#94a3b8",
          strokeWidth: 2.2
        }
      });
    }
  });

  if (!nodes.length) {
    nodes.push({
      id: "fallback",
      type: "awsNode",
      position: { x: 240, y: 120 },
      data: {
        label: "Architecture Unavailable",
        type: "custom"
      }
    });
  }

  return { nodes, edges };
}

/* -------------------- Component -------------------- */

export default function Diagram({ diagram }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const initialFlow = useMemo(() => buildFlowFromDiagram(diagram), [diagram]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialFlow.edges);

  useEffect(() => {
    const flow = buildFlowFromDiagram(diagram);
    setNodes(flow.nodes);
    setEdges(flow.edges);
    setSelectedNodeId(null);
  }, [diagram, setNodes, setEdges]);

  const handleRenameNode = useCallback((id, newLabel) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
                type: inferType(newLabel)
              }
            }
          : node
      )
    );
  }, [setNodes]);

  const handleDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNodeId((curr) => (curr === id ? null : curr));
  }, [setNodes, setEdges]);

  useEffect(() => {
    window.__diagramActions.renameNode = handleRenameNode;
    window.__diagramActions.deleteNode = handleDeleteNode;
  }, [handleRenameNode, handleDeleteNode]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "#94a3b8", strokeWidth: 2.2 }
          },
          eds
        )
      ),
    [setEdges]
  );

  const addCustomNode = (type = "custom") => {
    const id = `${type}-${Date.now()}`;
    const defaultLabel = {
      vpc: "New VPC",
      subnet: "New Subnet",
      gateway: "New Gateway",
      route: "New Route",
      ec2: "App Server",
      s3: "Storage Bucket",
      security: "Security Group",
      database: "Database",
      custom: "Custom Node"
    }[type];

    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "awsNode",
        position: { x: 320, y: 320 },
        data: {
          label: defaultLabel,
          type
        }
      }
    ]);

    setShowAddMenu(false);
  };

  const resetLayout = () => {
    const flow = buildFlowFromDiagram(diagram);
    setNodes(flow.nodes);
    setEdges(flow.edges);
    setSelectedNodeId(null);
  };

  const deleteSelected = () => {
    if (selectedNodeId) handleDeleteNode(selectedNodeId);
  };

  return (
    <div className="h-full rounded-2xl bg-[#0b1220]/95 border border-white/10 shadow-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-[#0f172a]">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Cloud Architecture Diagram
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive infrastructure topology editor
          </p>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowAddMenu((v) => !v)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
          >
            <Plus size={14} />
            Add Node
          </button>

          <button
            onClick={resetLayout}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-white flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            onClick={deleteSelected}
            disabled={!selectedNodeId}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-red-500/20 text-white flex items-center gap-2 disabled:opacity-40"
          >
            <Trash2 size={14} />
            Delete
          </button>

          {showAddMenu && (
            <div className="absolute right-0 top-12 z-20 w-52 rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl p-2 space-y-1">
              {[
                ["vpc", "VPC"],
                ["subnet", "Subnet"],
                ["gateway", "Gateway"],
                ["route", "Route"],
                ["ec2", "EC2"],
                ["s3", "S3 Bucket"],
                ["security", "Security Group"],
                ["database", "Database"],
                ["custom", "Custom"]
              ].map(([type, label]) => (
                <button
                  key={type}
                  onClick={() => addCustomNode(type)}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm text-white hover:bg-white/5 transition"
                >
                  + {label}
                </button>
              ))}
            </div>
          )}

          <span className="text-[11px] tracking-wide uppercase text-indigo-400 font-medium">
            Editable Diagram
          </span>
        </div>
      </div>

      <div className="h-[calc(100%-72px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          fitView
        >
          <MiniMap
            pannable
            zoomable
            nodeColor={(node) => {
              const theme = NODE_THEME[node.data?.type] || NODE_THEME.custom;
              return theme.border;
            }}
            maskColor="rgba(11,18,32,0.65)"
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          />
          <Controls />
          <Background gap={22} size={1} color="#1e293b" />
        </ReactFlow>
      </div>
    </div>
  );
}
