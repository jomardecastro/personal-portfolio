import { Router, Request, Response } from 'express';
import { Resend } from 'resend';
import prisma from '../lib/prisma';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact — save contact message and send email notification
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

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Portfolio Contact <connect@jdecastro.dev>',
        to: 'connect@jdecastro.dev',
        subject: `New message from ${email}`,
        html: `
          <h2>New contact form submission</h2>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
    }

    res.status(201).json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;
