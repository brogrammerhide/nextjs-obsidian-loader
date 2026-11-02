"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { GraphData, GraphNode } from "@/types/note";

interface InteractiveGraphProps {
  data: GraphData;
  height?: number;
}

export default function InteractiveGraph({
  data,
  height = 500,
}: InteractiveGraphProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Compute 2D coordinates for nodes arranged radially / with organic offset
  const positionedNodes = useMemo(() => {
    const width = 800;
    const centerY = height / 2;
    const centerX = width / 2;
    const count = data.nodes.length;

    if (count === 0) return [];
    if (count === 1) {
      return [{ ...data.nodes[0], x: centerX, y: centerY }];
    }

    const radius = Math.min(centerX, centerY) * 0.65;
    return data.nodes.map((node, index) => {
      const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
      // Slight organic jitter based on string hash
      const jitter = ((node.title.charCodeAt(0) % 5) - 2) * 15;
      const x = centerX + Math.cos(angle) * (radius + jitter);
      const y = centerY + Math.sin(angle) * (radius + jitter);
      return { ...node, x, y };
    });
  }, [data.nodes, height]);

  // Fast map from node id to positioned node
  const nodeMap = useMemo(() => {
    const map = new Map<string, (typeof positionedNodes)[0]>();
    positionedNodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [positionedNodes]);

  // Determine active connections for hovered node
  const activeLinkSet = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const set = new Set<string>();
    data.links.forEach((l) => {
      if (l.source === hoveredNodeId || l.target === hoveredNodeId) {
        set.add(`${l.source}->${l.target}`);
        set.add(`${l.target}->${l.source}`);
      }
    });
    return set;
  }, [hoveredNodeId, data.links]);

  const hoveredNode = hoveredNodeId ? nodeMap.get(hoveredNodeId) : null;

  return (
    <div className="relative w-full rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      {/* Hover Info Tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-purple-500/40 rounded-xl px-4 py-3 shadow-xl pointer-events-none animate-in fade-in duration-200">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
            Note Node
          </p>
          <p className="text-base font-bold text-slate-100">{hoveredNode.title}</p>
          <p className="text-xs text-slate-400 mt-1">
            🔗 {hoveredNode.connections} connection{hoveredNode.connections === 1 ? "" : "s"}
          </p>
          {hoveredNode.tags?.length > 0 && (
            <div className="flex gap-1 mt-2">
              {hoveredNode.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Help / Controls overlay */}
      <div className="absolute bottom-4 right-4 z-20 text-[11px] text-slate-500 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 pointer-events-none">
        Hover to explore connections • Click node to open note
      </div>

      <svg
        viewBox={`0 0 800 ${height}`}
        className="w-full h-auto cursor-grab active:cursor-grabbing select-none"
        style={{ minHeight: `${height}px` }}
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Links */}
        <g className="links">
          {data.links.map((link, idx) => {
            const sourceNode = nodeMap.get(link.source);
            const targetNode = nodeMap.get(link.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted =
              hoveredNodeId &&
              (link.source === hoveredNodeId || link.target === hoveredNodeId);

            return (
              <line
                key={`link-${idx}`}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHighlighted ? "#c084fc" : "#475569"}
                strokeWidth={isHighlighted ? 2.5 : 1.2}
                strokeOpacity={
                  hoveredNodeId ? (isHighlighted ? 1 : 0.15) : 0.6
                }
                strokeDasharray={isHighlighted ? "none" : "4 2"}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g className="nodes">
          {positionedNodes.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const isConnected =
              hoveredNodeId &&
              (hoveredNodeId === node.id ||
                activeLinkSet.has(`${hoveredNodeId}->${node.id}`) ||
                activeLinkSet.has(`${node.id}->${hoveredNodeId}`));

            const radius = 12 + Math.min(node.connections * 3, 16);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Glow ring */}
                {isHovered && (
                  <circle
                    r={radius + 14}
                    fill="url(#nodeGlow)"
                    className="animate-pulse"
                  />
                )}

                {/* Node Outer Ring */}
                <circle
                  r={radius}
                  fill={isHovered ? "#7c3aed" : "#1e1b4b"}
                  stroke={
                    isHovered
                      ? "#e9d5ff"
                      : isConnected
                      ? "#a855f7"
                      : "#4f46e5"
                  }
                  strokeWidth={isHovered ? 3 : 1.5}
                  opacity={hoveredNodeId && !isConnected ? 0.3 : 1}
                  className="transition-all duration-200"
                />

                {/* Node Core */}
                <circle
                  r={radius * 0.4}
                  fill={isHovered ? "#ffffff" : "#a855f7"}
                  opacity={hoveredNodeId && !isConnected ? 0.3 : 1}
                />

                {/* Node Label */}
                <text
                  dy={radius + 16}
                  textAnchor="middle"
                  fill={isHovered ? "#f1f5f9" : "#94a3b8"}
                  fontSize={12}
                  fontWeight={isHovered ? "bold" : "normal"}
                  opacity={hoveredNodeId && !isConnected ? 0.2 : 1}
                  className="pointer-events-none transition-all duration-200"
                >
                  {node.title}
                </text>

                {/* Click target link */}
                <Link href={`/notes/${node.slug}`} className="opacity-0">
                  <circle r={radius + 10} fill="transparent" />
                </Link>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
