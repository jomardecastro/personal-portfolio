import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Plus, User } from 'lucide-react';
import type { TreeNodeData, TreeView, Position } from './types';
import { RANK_COLORS } from './seedData';

interface MLMTreeNodeProps {
  node: TreeNodeData;
  view: TreeView;
  selectedNodeId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onAddFromPlaceholder?: (parentId: string, position: Position | null) => void;
  depth?: number;
  isRoot?: boolean;
}

function EmptyPlaceholder({
  parentId,
  label,
  position,
  onAdd,
}: {
  parentId: string;
  label: string;
  position: Position | null;
  onAdd?: (parentId: string, position: Position | null) => void;
}) {
  return (
    <li className="mlm-tree-node">
      <button
        data-interactive
        onClick={() => onAdd?.(parentId, position)}
        className="flex flex-col items-center justify-center w-[100px] h-[70px] border-2 border-dashed border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors"
      >
        <Plus className="w-4 h-4 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
      </button>
    </li>
  );
}

export default function MLMTreeNode({
  node,
  view,
  selectedNodeId,
  onSelect,
  onToggle,
  onAddFromPlaceholder,
  depth = 0,
  isRoot = false,
}: MLMTreeNodeProps) {
  const { slot, children } = node;
  const isSelected = selectedNodeId === slot.id;
  const hasChildren = children.some((c) => c !== null);
  const rankColor = RANK_COLORS[slot.rank];

  // For binary view, check if children positions are filled
  const isBinary = view === 'binary';

  return (
    <li className={`mlm-tree-node ${isRoot ? 'mlm-tree-root' : ''}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: depth * 0.05 }}
        data-interactive
        onClick={() => onSelect(slot.id)}
        className={`
          relative flex flex-col items-center gap-0.5 px-2 py-1.5
          w-[110px] rounded-lg border-l-4 ${rankColor}
          bg-card/80 backdrop-blur-sm border border-border/50
          cursor-pointer transition-all select-none
          ${isSelected ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : 'hover:bg-card'}
        `}
      >
        {/* Expand/collapse toggle - always show since both views have placeholders */}
        {(
          <button
            data-interactive
            onClick={(e) => {
              e.stopPropagation();
              onToggle(slot.id);
            }}
            className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center hover:bg-secondary"
          >
            {slot.expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}

        {/* Node content */}
        <div className="flex items-center gap-1.5 w-full">
          <User className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-[10px] font-mono font-bold text-primary truncate">
            {slot.slot_code}
          </span>
        </div>

        <div className="text-[9px] text-muted-foreground truncate w-full text-center">
          {slot.owner_name}
        </div>

        <div className="flex items-center gap-1 w-full justify-center">
          <span className="text-[8px] px-1 rounded bg-secondary/80 text-secondary-foreground">
            {slot.rank}
          </span>
          <span className="text-[8px] px-1 rounded bg-primary/10 text-primary">
            {slot.membership}
          </span>
        </div>

        <div className="text-[10px] font-mono text-terminal-green font-bold">
          ${slot.wallet_balance.toFixed(0)}
        </div>

        {view === 'unilevel' ? (
          <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground">
            <span>Group: {slot.group_count}</span>
            {slot.placement_id === null && slot.sponsor_id !== null && (
              <span className="px-1 rounded bg-yellow-500/20 text-yellow-400">Unplaced</span>
            )}
          </div>
        ) : (
          <div className="text-[8px] text-muted-foreground">
            L:{slot.binary_points_left} R:{slot.binary_points_right}
          </div>
        )}
      </motion.div>

      {/* Children */}
      {slot.expanded && (
        <ul>
          {isBinary ? (
            <>
              {children[0] ? (
                <MLMTreeNode
                  node={children[0]}
                  view={view}
                  selectedNodeId={selectedNodeId}
                  onSelect={onSelect}
                  onToggle={onToggle}
                  onAddFromPlaceholder={onAddFromPlaceholder}
                  depth={depth + 1}
                />
              ) : (
                <EmptyPlaceholder
                  parentId={slot.id}
                  label="LEFT"
                  position="LEFT"
                  onAdd={onAddFromPlaceholder}
                />
              )}
              {children[1] ? (
                <MLMTreeNode
                  node={children[1]}
                  view={view}
                  selectedNodeId={selectedNodeId}
                  onSelect={onSelect}
                  onToggle={onToggle}
                  onAddFromPlaceholder={onAddFromPlaceholder}
                  depth={depth + 1}
                />
              ) : (
                <EmptyPlaceholder
                  parentId={slot.id}
                  label="RIGHT"
                  position="RIGHT"
                  onAdd={onAddFromPlaceholder}
                />
              )}
            </>
          ) : (
            <>
              {children.map((child) =>
                child ? (
                  <MLMTreeNode
                    key={child.slot.id}
                    node={child}
                    view={view}
                    selectedNodeId={selectedNodeId}
                    onSelect={onSelect}
                    onToggle={onToggle}
                    onAddFromPlaceholder={onAddFromPlaceholder}
                    depth={depth + 1}
                  />
                ) : null
              )}
              <EmptyPlaceholder
                parentId={slot.id}
                label="+ Recruit"
                position={null}
                onAdd={onAddFromPlaceholder}
              />
            </>
          )}
        </ul>
      )}
    </li>
  );
}
