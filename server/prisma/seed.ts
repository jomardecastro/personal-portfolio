import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlotCode(name: string, counter: number): string {
  const clean = name.replace(/\s+/g, '').toUpperCase().slice(0, 6);
  return `${clean}${String(counter).padStart(4, '0')}`;
}

async function main() {
  // Clear existing data
  await prisma.mLMSlot.deleteMany();
  await prisma.contactMessage.deleteMany();

  // Seed MLM slots (matches frontend seedData.ts)
  const slots = [
    {
      id: '1',
      slot_code: generateSlotCode('Admin', 1),
      owner_name: 'Admin',
      sponsor_id: null,
      placement_id: null,
      position: null,
      membership: 'Elite',
      wallet_balance: 150,
      total_earned: 150,
      personal_count: 3,
      group_count: 7,
      personal_pv: 100,
      group_pv: 700,
      rank: 'Silver',
      binary_points_left: 400,
      binary_points_right: 300,
    },
    {
      id: '2',
      slot_code: generateSlotCode('John Doe', 2),
      owner_name: 'John Doe',
      sponsor_id: '1',
      placement_id: '1',
      position: 'LEFT',
      membership: 'Premium',
      wallet_balance: 45,
      total_earned: 45,
      personal_count: 2,
      group_count: 3,
      personal_pv: 100,
      group_pv: 300,
      rank: 'Bronze',
      binary_points_left: 100,
      binary_points_right: 100,
    },
    {
      id: '3',
      slot_code: generateSlotCode('Jane Smith', 3),
      owner_name: 'Jane Smith',
      sponsor_id: '1',
      placement_id: '1',
      position: 'RIGHT',
      membership: 'VIP',
      wallet_balance: 30,
      total_earned: 30,
      personal_count: 1,
      group_count: 2,
      personal_pv: 100,
      group_pv: 200,
      rank: 'Starter',
      binary_points_left: 100,
      binary_points_right: 0,
    },
    {
      id: '4',
      slot_code: generateSlotCode('Mark Lee', 4),
      owner_name: 'Mark Lee',
      sponsor_id: '1',
      placement_id: '2',
      position: 'RIGHT',
      membership: 'Basic',
      wallet_balance: 10,
      total_earned: 10,
      personal_count: 0,
      group_count: 0,
      personal_pv: 100,
      group_pv: 0,
      rank: 'Starter',
      binary_points_left: 0,
      binary_points_right: 0,
    },
    {
      id: '5',
      slot_code: generateSlotCode('Alice Wang', 5),
      owner_name: 'Alice Wang',
      sponsor_id: '2',
      placement_id: '2',
      position: 'LEFT',
      membership: 'Premium',
      wallet_balance: 15,
      total_earned: 15,
      personal_count: 1,
      group_count: 1,
      personal_pv: 100,
      group_pv: 100,
      rank: 'Starter',
      binary_points_left: 100,
      binary_points_right: 0,
    },
    {
      id: '6',
      slot_code: generateSlotCode('Bob Cruz', 6),
      owner_name: 'Bob Cruz',
      sponsor_id: '2',
      placement_id: '3',
      position: 'LEFT',
      membership: 'Basic',
      wallet_balance: 5,
      total_earned: 5,
      personal_count: 0,
      group_count: 0,
      personal_pv: 100,
      group_pv: 0,
      rank: 'Starter',
      binary_points_left: 0,
      binary_points_right: 0,
    },
    {
      id: '7',
      slot_code: generateSlotCode('Clara Tan', 7),
      owner_name: 'Clara Tan',
      sponsor_id: '3',
      placement_id: '5',
      position: 'LEFT',
      membership: 'Premium',
      wallet_balance: 0,
      total_earned: 0,
      personal_count: 0,
      group_count: 0,
      personal_pv: 100,
      group_pv: 0,
      rank: 'Starter',
      binary_points_left: 0,
      binary_points_right: 0,
    },
    {
      id: '8',
      slot_code: generateSlotCode('David Kim', 8),
      owner_name: 'David Kim',
      sponsor_id: '5',
      placement_id: '7',
      position: 'LEFT',
      membership: 'Basic',
      wallet_balance: 0,
      total_earned: 0,
      personal_count: 0,
      group_count: 0,
      personal_pv: 100,
      group_pv: 0,
      rank: 'Starter',
      binary_points_left: 0,
      binary_points_right: 0,
    },
  ];

  // Insert in order to respect foreign key constraints
  for (const slot of slots) {
    await prisma.mLMSlot.create({ data: slot });
  }

  console.log('Seeded 8 MLM slots');

  // Clear and seed POS products
  await prisma.posProduct.deleteMany();
  await prisma.posProduct.createMany({
    data: [
      { name: 'Widget Pro', price: 29.99, stock: 45 },
      { name: 'Gadget X', price: 49.99, stock: 23 },
      { name: 'Super Tool', price: 19.99, stock: 67 },
      { name: 'Mega Item', price: 89.99, stock: 12 },
    ],
  });

  console.log('Seeded 4 POS products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
