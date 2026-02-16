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
  placement_id: string;
  position: Position;
  membership: MembershipName;
}

export interface AddFormDefaults {
  placement_id?: string;
  position?: Position;
}
