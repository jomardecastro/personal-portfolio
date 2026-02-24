import { useState, useEffect } from 'react';
import { Plus, X, UserPlus, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { MLMSlot, TreeView, AddSlotPayload, PlaceSlotPayload, AddFormDefaults, Position } from './types';

interface AddSlotFormProps {
  slots: Map<string, MLMSlot>;
  view: TreeView;
  defaults?: AddFormDefaults;
  onAddSlot: (payload: AddSlotPayload) => void | Promise<void>;
  onPlaceSlot: (payload: PlaceSlotPayload) => void | Promise<void>;
  onClose: () => void;
}

export default function AddSlotForm({
  slots,
  view,
  defaults,
  onAddSlot,
  onPlaceSlot,
  onClose,
}: AddSlotFormProps) {
  const [mode, setMode] = useState<'create' | 'place'>(
    view === 'binary' && defaults?.placement_id ? 'place' : 'create'
  );
  const [name, setName] = useState('');
  const [sponsorId, setSponsorId] = useState(defaults?.sponsor_id ?? '');
  const [placementId, setPlacementId] = useState(defaults?.placement_id ?? '');
  const [position, setPosition] = useState<Position>(defaults?.position ?? 'LEFT');
  const [membership, setMembership] = useState('Basic');
  const [selectedUnplacedId, setSelectedUnplacedId] = useState('');

  useEffect(() => {
    if (defaults?.sponsor_id) setSponsorId(defaults.sponsor_id);
    if (defaults?.placement_id) setPlacementId(defaults.placement_id);
    if (defaults?.position) setPosition(defaults.position);
    // If coming from binary placeholder, default to place mode if there are unplaced slots
    if (view === 'binary' && defaults?.placement_id) {
      const hasUnplaced = Array.from(slots.values()).some(
        (s) => s.placement_id === null && s.sponsor_id !== null
      );
      setMode(hasUnplaced ? 'place' : 'create');
    }
  }, [defaults, view, slots]);

  const slotList = Array.from(slots.values());
  const unplacedSlots = slotList.filter(
    (s) => s.placement_id === null && s.sponsor_id !== null
  );

  // For binary placement dropdown, filter to nodes with an open position
  const availablePlacements = slotList.filter((s) => {
    if (s.placement_id === null && s.sponsor_id !== null) return false; // unplaced slots can't be placement parents
    const children = slotList.filter((c) => c.placement_id === s.id);
    const hasLeft = children.some((c) => c.position === 'LEFT');
    const hasRight = children.some((c) => c.position === 'RIGHT');
    return !hasLeft || !hasRight;
  });

  const getAvailablePositions = (pid: string): Position[] => {
    const children = slotList.filter((c) => c.placement_id === pid);
    const positions: Position[] = [];
    if (!children.some((c) => c.position === 'LEFT')) positions.push('LEFT');
    if (!children.some((c) => c.position === 'RIGHT')) positions.push('RIGHT');
    return positions;
  };

  const handleCreateSubmit = () => {
    if (!name.trim() || !sponsorId) return;

    if (view === 'binary') {
      if (!placementId) return;
      onAddSlot({
        owner_name: name.trim(),
        sponsor_id: sponsorId,
        placement_id: placementId,
        position,
        membership: membership as AddSlotPayload['membership'],
      });
    } else {
      // Unilevel: create unplaced slot
      onAddSlot({
        owner_name: name.trim(),
        sponsor_id: sponsorId,
        placement_id: null,
        position: null,
        membership: membership as AddSlotPayload['membership'],
      });
    }

    setName('');
    setSponsorId('');
    setPlacementId('');
    setPosition('LEFT');
  };

  const handlePlaceSubmit = () => {
    if (!selectedUnplacedId || !placementId) return;
    onPlaceSlot({
      slotId: selectedUnplacedId,
      placement_id: placementId,
      position,
    });
    setSelectedUnplacedId('');
    setPlacementId('');
    setPosition('LEFT');
  };

  return (
    <div className="border border-border/50 rounded-lg bg-card/50 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-primary">
          <Plus className="w-3 h-3" />
          {view === 'unilevel' ? 'Add New Slot (Unplaced)' : 'Binary Tree'}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Binary view: toggle between Create and Place modes */}
      {view === 'binary' && (
        <div className="flex gap-1">
          <button
            data-interactive
            onClick={() => setMode('place')}
            className={`flex-1 flex items-center justify-center gap-1.5 h-7 text-xs rounded-md border transition-colors
              ${mode === 'place'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border text-muted-foreground hover:bg-secondary'}
            `}
          >
            <MapPin className="w-3 h-3" />
            Place Existing ({unplacedSlots.length})
          </button>
          <button
            data-interactive
            onClick={() => setMode('create')}
            className={`flex-1 flex items-center justify-center gap-1.5 h-7 text-xs rounded-md border transition-colors
              ${mode === 'create'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background border-border text-muted-foreground hover:bg-secondary'}
            `}
          >
            <UserPlus className="w-3 h-3" />
            Create New
          </button>
        </div>
      )}

      {/* Place existing unplaced slot (binary only) */}
      {view === 'binary' && mode === 'place' ? (
        <div className="space-y-2">
          {unplacedSlots.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-2">
              No unplaced slots. Create slots from the Sponsor Tree first.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Select value={selectedUnplacedId} onValueChange={setSelectedUnplacedId}>
                  <SelectTrigger data-interactive className="h-8 text-xs">
                    <SelectValue placeholder="Select Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {unplacedSlots.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.slot_code} - {s.owner_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={placementId} onValueChange={(v) => {
                  setPlacementId(v);
                  const avail = getAvailablePositions(v);
                  if (avail.length === 1) setPosition(avail[0]);
                }}>
                  <SelectTrigger data-interactive className="h-8 text-xs">
                    <SelectValue placeholder="Placement" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlacements.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.slot_code} - {s.owner_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  {(['LEFT', 'RIGHT'] as Position[]).map((pos) => {
                    const available = placementId
                      ? getAvailablePositions(placementId).includes(pos)
                      : true;
                    return (
                      <button
                        key={pos}
                        data-interactive
                        disabled={!available}
                        onClick={() => setPosition(pos)}
                        className={`flex-1 h-8 text-xs rounded-md border transition-colors
                          ${position === pos
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border text-muted-foreground hover:bg-secondary'}
                          ${!available ? 'opacity-30 cursor-not-allowed' : ''}
                        `}
                      >
                        {pos}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                data-interactive
                onClick={handlePlaceSubmit}
                disabled={!selectedUnplacedId || !placementId}
                className="w-full h-8 text-xs font-mono rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Place Slot
              </button>
            </>
          )}
        </div>
      ) : (
        /* Create new slot form */
        <div className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Input
              data-interactive
              placeholder="Owner Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-xs"
            />

            <Select value={sponsorId} onValueChange={setSponsorId}>
              <SelectTrigger data-interactive className="h-8 text-xs">
                <SelectValue placeholder="Sponsor" />
              </SelectTrigger>
              <SelectContent>
                {slotList.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-xs">
                    {s.slot_code} - {s.owner_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={membership} onValueChange={setMembership}>
              <SelectTrigger data-interactive className="h-8 text-xs">
                <SelectValue placeholder="Membership" />
              </SelectTrigger>
              <SelectContent>
                {['Basic', 'Premium', 'VIP', 'Elite'].map((m) => (
                  <SelectItem key={m} value={m} className="text-xs">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {view === 'binary' && mode === 'create' && (
              <>
                <Select value={placementId} onValueChange={(v) => {
                  setPlacementId(v);
                  const avail = getAvailablePositions(v);
                  if (avail.length === 1) setPosition(avail[0]);
                }}>
                  <SelectTrigger data-interactive className="h-8 text-xs">
                    <SelectValue placeholder="Placement" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlacements.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.slot_code} - {s.owner_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-1">
                  {(['LEFT', 'RIGHT'] as Position[]).map((pos) => {
                    const available = placementId
                      ? getAvailablePositions(placementId).includes(pos)
                      : true;
                    return (
                      <button
                        key={pos}
                        data-interactive
                        disabled={!available}
                        onClick={() => setPosition(pos)}
                        className={`flex-1 h-8 text-xs rounded-md border transition-colors
                          ${position === pos
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border text-muted-foreground hover:bg-secondary'}
                          ${!available ? 'opacity-30 cursor-not-allowed' : ''}
                        `}
                      >
                        {pos}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <button
            data-interactive
            onClick={handleCreateSubmit}
            disabled={!name.trim() || !sponsorId || (view === 'binary' && !placementId)}
            className="w-full h-8 text-xs font-mono rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            + {view === 'unilevel' ? 'Add Slot (Unplaced)' : 'Create & Place Slot'}
          </button>
        </div>
      )}
    </div>
  );
}
