import { useReducer, useRef, useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Plus, X, RotateCcw, Loader2, Settings } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MLMSlot, TreeView, AddFormDefaults, Position } from './types';
import {
  createSeedData,
  buildUnilevelTree,
  buildBinaryTree,
} from './seedData';
import { useDragScroll } from './useDragScroll';
import MLMTreeNode from './MLMTreeNode';
import AddSlotForm from './AddSlotForm';
import MLMSettingsPanel from './MLMSettingsPanel';

// --- State & Reducer ---

interface MLMState {
  slots: Map<string, MLMSlot>;
  rootId: string;
  activeView: TreeView;
  selectedNodeId: string | null;
  nextId: number;
  showAddForm: boolean;
  addFormDefaults?: AddFormDefaults;
  showSettings: boolean;
}

type Action =
  | { type: 'TOGGLE_EXPAND'; slotId: string }
  | { type: 'SET_VIEW'; view: TreeView }
  | { type: 'SELECT_NODE'; slotId: string | null }
  | { type: 'SHOW_ADD_FORM'; defaults?: AddFormDefaults }
  | { type: 'HIDE_ADD_FORM' }
  | { type: 'LOAD_SLOTS'; slots: MLMSlot[] }
  | { type: 'TOGGLE_SETTINGS' };

function loadSlotsIntoState(state: MLMState, apiSlots: MLMSlot[]): MLMState {
  // Preserve expanded state from current slots
  const prevExpanded = new Map<string, boolean>();
  for (const [id, s] of state.slots) {
    prevExpanded.set(id, s.expanded);
  }

  const slots = new Map<string, MLMSlot>();
  let maxId = 0;
  for (const s of apiSlots) {
    slots.set(s.id, {
      ...s,
      expanded: prevExpanded.get(s.id) ?? true,
    });
    const numId = parseInt(s.id);
    if (!isNaN(numId) && numId > maxId) maxId = numId;
  }
  const root = apiSlots.find((s) => s.sponsor_id === null);
  return {
    ...state,
    slots,
    rootId: root?.id ?? '1',
    nextId: maxId + 1,
    showAddForm: false,
    addFormDefaults: undefined,
  };
}

function reducer(state: MLMState, action: Action): MLMState {
  switch (action.type) {
    case 'LOAD_SLOTS':
      return loadSlotsIntoState(state, action.slots);

    case 'SET_VIEW':
      return { ...state, activeView: action.view, selectedNodeId: null };

    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.slotId };

    case 'SHOW_ADD_FORM':
      return { ...state, showAddForm: true, addFormDefaults: action.defaults };

    case 'HIDE_ADD_FORM':
      return { ...state, showAddForm: false, addFormDefaults: undefined };

    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings };

    case 'TOGGLE_EXPAND': {
      const slot = state.slots.get(action.slotId);
      if (!slot) return state;
      const newSlots = new Map(state.slots);
      newSlots.set(action.slotId, { ...slot, expanded: !slot.expanded });
      return { ...state, slots: newSlots };
    }

    default:
      return state;
  }
}

// --- Component ---

export default function MLMGenealogyTree() {
  const seed = useMemo(() => createSeedData(), []);
  const [state, dispatch] = useReducer(reducer, {
    slots: seed.slots,
    rootId: seed.rootId,
    activeView: 'unilevel',
    selectedNodeId: null,
    nextId: seed.nextId,
    showAddForm: false,
    showSettings: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch slots from API on mount
  useEffect(() => {
    fetch('/api/mlm/slots')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          dispatch({ type: 'LOAD_SLOTS', slots: data });
        }
      })
      .catch(() => {
        // API unavailable — keep using seed data
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/mlm/reset', { method: 'POST' });
      const data = await res.json();
      if (data.slots) {
        dispatch({ type: 'LOAD_SLOTS', slots: data.slots });
      }
    } catch {
      // Fallback to local seed
      const fresh = createSeedData();
      dispatch({ type: 'LOAD_SLOTS', slots: Array.from(fresh.slots.values()) });
    }
    setIsResetting(false);
  };

  const canvasRef = useRef<HTMLDivElement>(null);
  useDragScroll(canvasRef);

  const tree = useMemo(() => {
    if (state.activeView === 'unilevel') {
      return buildUnilevelTree(state.slots, state.rootId);
    }
    return buildBinaryTree(state.slots, state.rootId);
  }, [state.slots, state.rootId, state.activeView]);

  const selectedSlot = state.selectedNodeId
    ? state.slots.get(state.selectedNodeId)
    : null;

  // Stats
  const totalSlots = state.slots.size;
  const totalCommissions = Array.from(state.slots.values()).reduce(
    (sum, s) => sum + s.total_earned,
    0
  );
  const unplacedCount = Array.from(state.slots.values()).filter(
    (s) => s.placement_id === null && s.sponsor_id !== null
  ).length;
  const maxDepth = (() => {
    let max = 0;
    const visit = (id: string, depth: number) => {
      if (depth > max) max = depth;
      for (const s of state.slots.values()) {
        if (
          state.activeView === 'unilevel'
            ? s.sponsor_id === id
            : s.placement_id === id
        ) {
          visit(s.id, depth + 1);
        }
      }
    };
    visit(state.rootId, 1);
    return max;
  })();

  const handleAddFromPlaceholder = (parentId: string, position: Position | null) => {
    if (state.activeView === 'unilevel') {
      // Unilevel: pre-fill sponsor
      dispatch({
        type: 'SHOW_ADD_FORM',
        defaults: { sponsor_id: parentId },
      });
    } else {
      // Binary: pre-fill placement + position
      dispatch({
        type: 'SHOW_ADD_FORM',
        defaults: { placement_id: parentId, position: position ?? undefined },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Network className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-sm">MLM Genealogy Simulator</h3>
              <p className="text-xs text-muted-foreground">
                Interactive network visualization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              data-interactive
              onClick={handleReset}
              disabled={isResetting}
              className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50"
              title="Reset to seed data"
            >
              {isResetting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RotateCcw className="w-3 h-3" />
              )}
              Reset
            </button>
            {['Node.js', 'PostgreSQL', 'Prisma'].map((tech) => (
              <span
                key={tech}
                className="tech-pill text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + Add button */}
      <div className="px-4 pt-3 flex items-center justify-between flex-wrap gap-2">
        <Tabs
          value={state.activeView}
          onValueChange={(v) => dispatch({ type: 'SET_VIEW', view: v as TreeView })}
        >
          <TabsList className="h-8">
            <TabsTrigger value="unilevel" className="text-xs px-3 h-6" data-interactive>
              Sponsor Tree
            </TabsTrigger>
            <TabsTrigger value="binary" className="text-xs px-3 h-6" data-interactive>
              Binary Tree
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <button
            data-interactive
            onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
            className={`flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-md transition-colors ${
              state.showSettings
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <Settings className="w-3 h-3" />
            Settings
          </button>
          <button
            data-interactive
            onClick={() =>
              state.showAddForm
                ? dispatch({ type: 'HIDE_ADD_FORM' })
                : dispatch({ type: 'SHOW_ADD_FORM' })
            }
            className="flex items-center gap-1 text-xs font-mono px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {state.showAddForm ? (
              <>
                <X className="w-3 h-3" /> Close
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Add Slot
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 py-2 flex items-center gap-4 flex-wrap text-xs font-mono text-muted-foreground">
        <span>
          Slots: <span className="text-foreground">{totalSlots}</span>
        </span>
        <span>
          Commissions: <span className="text-terminal-green">${totalCommissions.toFixed(0)}</span>
        </span>
        <span>
          Depth: <span className="text-foreground">{maxDepth}</span>
        </span>
        <span>
          Unplaced: <span className={unplacedCount > 0 ? 'text-yellow-400' : 'text-foreground'}>{unplacedCount}</span>
        </span>
      </div>

      {/* Add Slot Form */}
      <AnimatePresence>
        {state.showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 overflow-hidden"
          >
            <AddSlotForm
              slots={state.slots}
              view={state.activeView}
              defaults={state.addFormDefaults}
              onAddSlot={async (payload) => {
                try {
                  const res = await fetch('/api/mlm/slots', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  const slots = await res.json();
                  if (Array.isArray(slots)) {
                    dispatch({ type: 'LOAD_SLOTS', slots });
                  }
                } catch {
                  // API unavailable — close form
                  dispatch({ type: 'HIDE_ADD_FORM' });
                }
              }}
              onPlaceSlot={async (payload) => {
                try {
                  const res = await fetch(`/api/mlm/slots/${payload.slotId}/place`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      placement_id: payload.placement_id,
                      position: payload.position,
                    }),
                  });
                  const slots = await res.json();
                  if (Array.isArray(slots)) {
                    dispatch({ type: 'LOAD_SLOTS', slots });
                  }
                } catch {
                  dispatch({ type: 'HIDE_ADD_FORM' });
                }
              }}
              onClose={() => dispatch({ type: 'HIDE_ADD_FORM' })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {state.showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 overflow-hidden"
          >
            <MLMSettingsPanel view={state.activeView} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draggable Tree Canvas */}
      <div
        ref={canvasRef}
        className="relative overflow-hidden mx-4 my-3 rounded-lg border border-border/30 bg-background/30"
        style={{ height: '450px' }}
      >
        <div
          className="min-w-[2000px] min-h-[1500px] flex justify-center"
          style={{ paddingTop: '40px', paddingBottom: '200px' }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
          {tree && !isLoading && (
            <ul className="mlm-tree">
              <MLMTreeNode
                node={tree}
                view={state.activeView}
                selectedNodeId={state.selectedNodeId}
                onSelect={(id) => dispatch({ type: 'SELECT_NODE', slotId: id })}
                onToggle={(id) => dispatch({ type: 'TOGGLE_EXPAND', slotId: id })}
                onAddFromPlaceholder={handleAddFromPlaceholder}
                isRoot
              />
            </ul>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedSlot && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50"
          >
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <span className="text-muted-foreground">Slot Code</span>
                <div className="text-primary font-bold">{selectedSlot.slot_code}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Owner</span>
                <div>{selectedSlot.owner_name}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Rank</span>
                <div>{selectedSlot.rank}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Membership</span>
                <div>{selectedSlot.membership}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Wallet</span>
                <div className="text-terminal-green">${selectedSlot.wallet_balance.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Total Earned</span>
                <div>${selectedSlot.total_earned.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Personal / Group</span>
                <div>
                  {selectedSlot.personal_count} / {selectedSlot.group_count}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Binary L/R</span>
                <div>
                  {selectedSlot.binary_points_left} / {selectedSlot.binary_points_right}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Placed</span>
                <div className={selectedSlot.placement_id ? 'text-terminal-green' : 'text-yellow-400'}>
                  {selectedSlot.placement_id
                    ? `Yes (${selectedSlot.position})`
                    : selectedSlot.sponsor_id === null ? 'Root' : 'No'}
                </div>
              </div>
              <div className="col-span-2 md:col-span-4 flex justify-end">
                <button
                  data-interactive
                  onClick={() => dispatch({ type: 'SELECT_NODE', slotId: null })}
                  className="text-muted-foreground hover:text-foreground text-[10px]"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
