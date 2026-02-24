import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  generateSlotCode,
  processUnilevelCommission,
  processBinaryPoints,
} from '../lib/mlm-logic';

const router = Router();

async function getAllSlots() {
  return prisma.mLMSlot.findMany({ orderBy: { id: 'asc' } });
}

// GET /api/mlm/slots
router.get('/slots', async (_req: Request, res: Response) => {
  try {
    res.json(await getAllSlots());
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// GET /api/mlm/slots/:id
router.get('/slots/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const slot = await prisma.mLMSlot.findUnique({ where: { id } });
    if (!slot) { res.status(404).json({ error: 'Slot not found' }); return; }
    res.json(slot);
  } catch (error) {
    console.error('Error fetching slot:', error);
    res.status(500).json({ error: 'Failed to fetch slot' });
  }
});

// POST /api/mlm/slots — create + process commissions + binary points
router.post('/slots', async (req: Request, res: Response) => {
  try {
    const { owner_name, sponsor_id, placement_id, position, membership } = req.body;

    if (!owner_name || !sponsor_id) {
      res.status(400).json({ error: 'owner_name and sponsor_id are required' });
      return;
    }

    const allSlots = await getAllSlots();
    const maxId = allSlots.reduce((max, s) => {
      const num = parseInt(s.id);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = String(maxId + 1);

    const newSlot = await prisma.mLMSlot.create({
      data: {
        id: nextId,
        slot_code: generateSlotCode(owner_name, maxId + 1),
        owner_name,
        sponsor_id,
        placement_id: placement_id || null,
        position: position || null,
        membership: membership || 'Basic',
        personal_pv: 100,
      },
    });

    // Re-fetch to include new slot for processing
    const slotsAfterCreate = await getAllSlots();

    // Process unilevel commissions up the sponsor chain
    const unilevelUpdates = processUnilevelCommission(slotsAfterCreate, newSlot);

    // Process binary points up the placement chain
    let binaryUpdates = new Map<string, Record<string, unknown>>();
    if (placement_id) {
      const setting = await prisma.mLMSetting.findUnique({ where: { key: 'strong_leg_retention' } });
      const strongLegRetention = setting?.value !== 'false';
      binaryUpdates = processBinaryPoints(slotsAfterCreate, newSlot, strongLegRetention);
    }

    // Merge and persist all upline changes
    const merged = new Map<string, Record<string, unknown>>();
    for (const [id, fields] of unilevelUpdates) {
      merged.set(id, { ...(merged.get(id) || {}), ...fields });
    }
    for (const [id, fields] of binaryUpdates) {
      merged.set(id, { ...(merged.get(id) || {}), ...fields });
    }
    for (const [id, data] of merged) {
      await prisma.mLMSlot.update({ where: { id }, data });
    }

    res.status(201).json(await getAllSlots());
  } catch (error) {
    console.error('Error creating slot:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Failed to create slot', detail: message });
  }
});

// PUT /api/mlm/slots/:id/place — place unplaced slot + process binary points
router.put('/slots/:id/place', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { placement_id, position } = req.body;

    if (!placement_id || !position) {
      res.status(400).json({ error: 'placement_id and position are required' });
      return;
    }

    const updatedSlot = await prisma.mLMSlot.update({
      where: { id },
      data: { placement_id, position },
    });

    const allSlots = await getAllSlots();
    const setting = await prisma.mLMSetting.findUnique({ where: { key: 'strong_leg_retention' } });
    const strongLegRetention = setting?.value !== 'false';
    const binaryUpdates = processBinaryPoints(allSlots, updatedSlot, strongLegRetention);
    for (const [slotId, data] of binaryUpdates) {
      await prisma.mLMSlot.update({ where: { id: slotId }, data });
    }

    res.json(await getAllSlots());
  } catch (error) {
    console.error('Error placing slot:', error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'Failed to place slot', detail: message });
  }
});

// PUT /api/mlm/slots/:id — generic update
router.put('/slots/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const slot = await prisma.mLMSlot.update({ where: { id }, data: req.body });
    res.json(slot);
  } catch (error) {
    console.error('Error updating slot:', error);
    res.status(500).json({ error: 'Failed to update slot' });
  }
});

// DELETE /api/mlm/slots/:id
router.delete('/slots/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.mLMSlot.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ error: 'Failed to delete slot' });
  }
});

// POST /api/mlm/reset — reset to seed data
router.post('/reset', async (_req: Request, res: Response) => {
  try {
    await prisma.mLMSlot.deleteMany();

    await prisma.mLMSlot.create({
      data: {
        id: '1',
        slot_code: generateSlotCode('Admin', 1),
        owner_name: 'Admin',
        sponsor_id: null,
        placement_id: null,
        position: null,
        membership: 'Elite',
        personal_pv: 100,
      },
    });

    res.json({ message: 'Reset complete', slots: await getAllSlots() });
  } catch (error) {
    console.error('Error resetting data:', error);
    res.status(500).json({ error: 'Failed to reset data' });
  }
});

// GET /api/mlm/settings — fetch all settings as { key: value }
router.get('/settings', async (_req: Request, res: Response) => {
  try {
    const rows = await prisma.mLMSetting.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/mlm/settings — upsert settings from { key: value, ... } body
router.put('/settings', async (req: Request, res: Response) => {
  try {
    const entries = Object.entries(req.body) as [string, string][];
    for (const [key, value] of entries) {
      await prisma.mLMSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }
    const rows = await prisma.mLMSetting.findMany();
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
