export type RankName = 'Starter' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
export type MembershipName = 'Basic' | 'Premium' | 'VIP' | 'Elite';
export type TreeView = 'unilevel' | 'binary';
export type Position = 'LEFT' | 'RIGHT';

export interface MLMSlot {
  id: string;
  slot_code: string;
  owner_name: string;

  // Relationships
  sponsor_id: string | null;
  placement_id: string | null;
  position: Position | null;

  // Financial
  wallet_balance: number;
  total_earned: number;

  // Rank & membership
  rank: RankName;
  membership: MembershipName;

  // Counts
  personal_count: number;
  group_count: number;

  // Points
  personal_pv: number;
  group_pv: number;
  binary_points_left: number;
  binary_points_right: number;

  // UI state
  expanded: boolean;
}

export interface TreeNodeData {
  slot: MLMSlot;
  children: TreeNodeData[];
}

export interface AddSlotPayload {
  owner_name: string;
  sponsor_id: string;
  placement_id: string | null;
  position: Position | null;
  membership: MembershipName;
}

export interface PlaceSlotPayload {
  slotId: string;
  placement_id: string;
  position: Position;
}

export interface AddFormDefaults {
  sponsor_id?: string;
  placement_id?: string;
  position?: Position;
}

export interface MLMSettings {
  direct_bonus: number;
  indirect_bonus: number;
  pairing_bonus: number;
  strong_leg_retention: boolean;
  fifth_pair_reward: 'money' | 'voucher';
  max_pairs_per_day: number;
}

export const DEFAULT_MLM_SETTINGS: MLMSettings = {
  direct_bonus: 10,
  indirect_bonus: 5,
  pairing_bonus: 100,
  strong_leg_retention: true,
  fifth_pair_reward: 'money',
  max_pairs_per_day: 10,
};
