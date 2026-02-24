import type { MLMSlot } from '@prisma/client';

const COMMISSION_RATES = [10, 5, 3, 2, 1]; // per level (1-5)
const PV_PER_ENTRY = 100;
const PAIR_COMMISSION = 10; // earned per matched pair (100 PV each side)

type RankName = 'Starter' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export function computeRank(groupCount: number): RankName {
  if (groupCount >= 50) return 'Diamond';
  if (groupCount >= 30) return 'Platinum';
  if (groupCount >= 15) return 'Gold';
  if (groupCount >= 7) return 'Silver';
  if (groupCount >= 3) return 'Bronze';
  return 'Starter';
}

export function generateSlotCode(name: string, counter: number): string {
  const clean = name.replace(/\s+/g, '').toUpperCase().slice(0, 6);
  return `${clean}${String(counter).padStart(4, '0')}`;
}

/**
 * Process unilevel commissions up 5 levels from the new slot's sponsor.
 * Returns a map of slot IDs to their updated fields.
 */
export function processUnilevelCommission(
  allSlots: MLMSlot[],
  newSlot: MLMSlot
): Map<string, Partial<MLMSlot>> {
  const updates = new Map<string, Partial<MLMSlot>>();
  const slotMap = new Map(allSlots.map((s) => [s.id, { ...s }]));

  let currentId = newSlot.sponsor_id;
  let level = 0;

  while (currentId && level < 5) {
    const upline = slotMap.get(currentId);
    if (!upline) break;

    const newGroupCount = upline.group_count + 1;
    const newGroupPv = upline.group_pv + PV_PER_ENTRY;
    const newPersonalCount = level === 0 ? upline.personal_count + 1 : upline.personal_count;
    const commission = COMMISSION_RATES[level] ?? 0;
    const newWallet = upline.wallet_balance + commission;
    const newTotalEarned = upline.total_earned + commission;
    const newRank = computeRank(newGroupCount);

    updates.set(currentId, {
      group_count: newGroupCount,
      group_pv: newGroupPv,
      personal_count: newPersonalCount,
      wallet_balance: newWallet,
      total_earned: newTotalEarned,
      rank: newRank,
    });

    // Update the local copy so cascading levels see the updated values
    slotMap.set(currentId, {
      ...upline,
      group_count: newGroupCount,
      group_pv: newGroupPv,
      personal_count: newPersonalCount,
      wallet_balance: newWallet,
      total_earned: newTotalEarned,
      rank: newRank,
    });

    currentId = upline.sponsor_id;
    level++;
  }

  return updates;
}

/**
 * Process binary points up the placement tree from the new slot.
 * Returns a map of slot IDs to their updated binary point fields.
 */
export function processBinaryPoints(
  allSlots: MLMSlot[],
  newSlot: MLMSlot,
  strongLegRetention: boolean = true
): Map<string, Partial<MLMSlot>> {
  const updates = new Map<string, Partial<MLMSlot>>();
  const slotMap = new Map(allSlots.map((s) => [s.id, { ...s }]));

  let currentId = newSlot.placement_id;
  let childId = newSlot.id;

  while (currentId) {
    const ancestor = slotMap.get(currentId);
    if (!ancestor) break;

    const side = findSideOfDescendant(slotMap, currentId, childId);

    let newLeft = ancestor.binary_points_left;
    let newRight = ancestor.binary_points_right;

    if (side === 'LEFT') {
      newLeft += PV_PER_ENTRY;
    } else {
      newRight += PV_PER_ENTRY;
    }

    // Pair and consume matched points
    const pairs = Math.min(Math.floor(newLeft / PV_PER_ENTRY), Math.floor(newRight / PV_PER_ENTRY));
    const pairEarnings = pairs * PAIR_COMMISSION;
    if (pairs > 0) {
      if (strongLegRetention) {
        // Keep the stronger leg's excess as carry-over
        newLeft -= pairs * PV_PER_ENTRY;
        newRight -= pairs * PV_PER_ENTRY;
      } else {
        // Flush both sides to zero
        newLeft = 0;
        newRight = 0;
      }
    }

    const newWallet = ancestor.wallet_balance + pairEarnings;
    const newTotalEarned = ancestor.total_earned + pairEarnings;

    // Merge with existing updates for this slot
    const existing = updates.get(currentId) || {};
    updates.set(currentId, {
      ...existing,
      binary_points_left: newLeft,
      binary_points_right: newRight,
      wallet_balance: newWallet,
      total_earned: newTotalEarned,
    });

    slotMap.set(currentId, {
      ...ancestor,
      binary_points_left: newLeft,
      binary_points_right: newRight,
      wallet_balance: newWallet,
      total_earned: newTotalEarned,
    });

    childId = currentId;
    currentId = ancestor.placement_id;
  }

  return updates;
}

function findSideOfDescendant(
  slotMap: Map<string, MLMSlot>,
  ancestorId: string,
  descendantId: string
): 'LEFT' | 'RIGHT' {
  let current = slotMap.get(descendantId)!;
  while (current.placement_id !== ancestorId) {
    current = slotMap.get(current.placement_id!)!;
  }
  return current.position as 'LEFT' | 'RIGHT';
}
