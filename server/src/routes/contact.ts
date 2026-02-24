import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// POST /api/contact — save contact message
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      res.status(400).json({ error: 'email and message are required' });
      return;
    }

    const contact = await prisma.contactMessage.create({
      data: { email, message },
    });

    res.status(201).json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;
