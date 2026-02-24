import prisma from './lib/prisma';

async function main() {
  const count = await prisma.mLMSlot.count();
  if (count === 0) {
    console.log('Database empty, running seed...');
    // Inline seed to avoid ts-node dependency in production
    const generateSlotCode = (name: string, counter: number) => {
      const clean = name.replace(/\s+/g, '').toUpperCase().slice(0, 6);
      return `${clean}${String(counter).padStart(4, '0')}`;
    };

    const seeds = [
      { id: '1', owner_name: 'Admin', sponsor_id: null, placement_id: null, position: null, membership: 'Elite', wallet_balance: 150, total_earned: 150, personal_count: 3, group_count: 7, personal_pv: 100, group_pv: 700, rank: 'Silver', binary_points_left: 400, binary_points_right: 300 },
      { id: '2', owner_name: 'John Doe', sponsor_id: '1', placement_id: '1', position: 'LEFT', membership: 'Premium', wallet_balance: 45, total_earned: 45, personal_count: 2, group_count: 3, personal_pv: 100, group_pv: 300, rank: 'Bronze', binary_points_left: 100, binary_points_right: 100 },
      { id: '3', owner_name: 'Jane Smith', sponsor_id: '1', placement_id: '1', position: 'RIGHT', membership: 'VIP', wallet_balance: 30, total_earned: 30, personal_count: 1, group_count: 2, personal_pv: 100, group_pv: 200, rank: 'Starter', binary_points_left: 100, binary_points_right: 0 },
      { id: '4', owner_name: 'Mark Lee', sponsor_id: '1', placement_id: '2', position: 'RIGHT', membership: 'Basic', wallet_balance: 10, total_earned: 10, personal_count: 0, group_count: 0, personal_pv: 100, group_pv: 0, rank: 'Starter', binary_points_left: 0, binary_points_right: 0 },
      { id: '5', owner_name: 'Alice Wang', sponsor_id: '2', placement_id: '2', position: 'LEFT', membership: 'Premium', wallet_balance: 15, total_earned: 15, personal_count: 1, group_count: 1, personal_pv: 100, group_pv: 100, rank: 'Starter', binary_points_left: 100, binary_points_right: 0 },
      { id: '6', owner_name: 'Bob Cruz', sponsor_id: '2', placement_id: '3', position: 'LEFT', membership: 'Basic', wallet_balance: 5, total_earned: 5, personal_count: 0, group_count: 0, personal_pv: 100, group_pv: 0, rank: 'Starter', binary_points_left: 0, binary_points_right: 0 },
      { id: '7', owner_name: 'Clara Tan', sponsor_id: '3', placement_id: '5', position: 'LEFT', membership: 'Premium', wallet_balance: 0, total_earned: 0, personal_count: 0, group_count: 0, personal_pv: 100, group_pv: 0, rank: 'Starter', binary_points_left: 0, binary_points_right: 0 },
      { id: '8', owner_name: 'David Kim', sponsor_id: '5', placement_id: '7', position: 'LEFT', membership: 'Basic', wallet_balance: 0, total_earned: 0, personal_count: 0, group_count: 0, personal_pv: 100, group_pv: 0, rank: 'Starter', binary_points_left: 0, binary_points_right: 0 },
    ];

    for (const seed of seeds) {
      await prisma.mLMSlot.create({
        data: {
          ...seed,
          slot_code: generateSlotCode(seed.owner_name, parseInt(seed.id)),
        },
      });
    }
    console.log('Seeded 8 MLM slots');
  } else {
    console.log(`Database has ${count} slots, skipping seed`);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Seed check failed:', e);
  process.exit(1);
});
