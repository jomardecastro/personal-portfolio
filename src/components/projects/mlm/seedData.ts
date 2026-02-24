import type { MLMSlot, TreeNodeData, RankName, MembershipName } from './types';

export function generateSlotCode(name: string, counter: number): string {
  const clean = name.replace(/\s+/g, '').toUpperCase().slice(0, 6);
  return `${clean}${String(counter).padStart(4, '0')}`;
}

export function computeRank(groupCount: number): RankName {
  if (groupCount >= 50) return 'Diamond';
  if (groupCount >= 30) return 'Platinum';
  if (groupCount >= 15) return 'Gold';
  if (groupCount >= 7) return 'Silver';
  if (groupCount >= 3) return 'Bronze';
  return 'Starter';
}

export const RANK_COLORS: Record<RankName, string> = {
  Starter: 'border-gray-500',
  Bronze: 'border-amber-600',
  Silver: 'border-slate-400',
  Gold: 'border-yellow-400',
  Platinum: 'border-purple-400',
  Diamond: 'border-cyan-400',
};

const COMMISSION_RATES = [10, 5, 3, 2, 1]; // per level (1-5)
const PV_PER_ENTRY = 100;

export function processUnilevelCommission(
  slots: Map<string, MLMSlot>,
  newSlotId: string
): Map<string, MLMSlot> {
  const newSlot = slots.get(newSlotId)!;
  let currentId = newSlot.sponsor_id;
  let level = 0;

  while (currentId && level < 5) {
    const upline = { ...slots.get(currentId)! };
    upline.group_count += 1;
    upline.group_pv += PV_PER_ENTRY;

    if (level === 0) {
      upline.personal_count += 1;
    }

    const commission = COMMISSION_RATES[level] ?? 0;
    upline.wallet_balance += commission;
    upline.total_earned += commission;
    upline.rank = computeRank(upline.group_count);

    slots.set(currentId, upline);
    currentId = upline.sponsor_id;
    level++;
  }

  return slots;
}

export function processBinaryPoints(
  slots: Map<string, MLMSlot>,
  newSlotId: string
): Map<string, MLMSlot> {
  const newSlot = slots.get(newSlotId)!;
  let currentId = newSlot.placement_id;
  let childId = newSlotId;

  while (currentId) {
    const ancestor = { ...slots.get(currentId)! };
    const child = slots.get(childId)!;

    if (child.placement_id === currentId) {
      if (child.position === 'LEFT') {
        ancestor.binary_points_left += PV_PER_ENTRY;
      } else {
        ancestor.binary_points_right += PV_PER_ENTRY;
      }
    } else {
      // Inherited side from deeper: find which direct child leads to this path
      const side = findSideOfDescendant(slots, currentId, childId);
      if (side === 'LEFT') {
        ancestor.binary_points_left += PV_PER_ENTRY;
      } else {
        ancestor.binary_points_right += PV_PER_ENTRY;
      }
    }

    slots.set(currentId, ancestor);
    childId = currentId;
    currentId = ancestor.placement_id;
  }

  return slots;
}

function findSideOfDescendant(
  slots: Map<string, MLMSlot>,
  ancestorId: string,
  descendantId: string
): 'LEFT' | 'RIGHT' {
  let current = slots.get(descendantId)!;
  while (current.placement_id !== ancestorId) {
    current = slots.get(current.placement_id!)!;
  }
  return current.position!;
}

export function buildUnilevelTree(
  slots: Map<string, MLMSlot>,
  rootId: string
): TreeNodeData | null {
  const root = slots.get(rootId);
  if (!root) return null;

  const children: TreeNodeData[] = [];
  if (root.expanded) {
    for (const slot of slots.values()) {
      if (slot.sponsor_id === rootId) {
        const child = buildUnilevelTree(slots, slot.id);
        if (child) children.push(child);
      }
    }
  }

  return { slot: root, children };
}

export function buildBinaryTree(
  slots: Map<string, MLMSlot>,
  rootId: string
): TreeNodeData | null {
  const root = slots.get(rootId);
  if (!root) return null;

  const children: TreeNodeData[] = [];
  if (root.expanded) {
    let leftChild: MLMSlot | undefined;
    let rightChild: MLMSlot | undefined;

    for (const slot of slots.values()) {
      if (slot.placement_id === rootId && slot.position === 'LEFT') leftChild = slot;
      if (slot.placement_id === rootId && slot.position === 'RIGHT') rightChild = slot;
    }

    // Always push left then right for binary (including nulls for placeholders)
    const leftNode = leftChild ? buildBinaryTree(slots, leftChild.id) : null;
    const rightNode = rightChild ? buildBinaryTree(slots, rightChild.id) : null;
    children.push(leftNode as TreeNodeData, rightNode as TreeNodeData);
  }

  return { slot: root, children };
}

function makeSlot(
  id: string,
  name: string,
  counter: number,
  sponsorId: string | null,
  placementId: string | null,
  position: 'LEFT' | 'RIGHT' | null,
  membership: MembershipName,
  overrides: Partial<MLMSlot> = {}
): MLMSlot {
  return {
    id,
    slot_code: generateSlotCode(name, counter),
    owner_name: name,
    sponsor_id: sponsorId,
    placement_id: placementId,
    position,
    wallet_balance: 0,
    total_earned: 0,
    rank: 'Starter',
    membership,
    personal_count: 0,
    group_count: 0,
    personal_pv: PV_PER_ENTRY,
    group_pv: 0,
    binary_points_left: 0,
    binary_points_right: 0,
    expanded: true,
    ...overrides,
  };
}

export function createSeedData(): { slots: Map<string, MLMSlot>; rootId: string; nextId: number } {
  const slots = new Map<string, MLMSlot>();

  slots.set('1', makeSlot('1', 'Admin', 1, null, null, null, 'Elite'));

  return { slots, rootId: '1', nextId: 2 };
}
