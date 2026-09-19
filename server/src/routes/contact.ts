import { Router, Request, Response } from 'express';
import { Resend } from 'resend';
import prisma from '../lib/prisma';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

// Form input goes into an HTML email, so it must not be able to inject markup.
const escapeHtml = (value: string) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

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

    // Send email notification. The sender is NOT the inbox it lands in: mail
    // from connect@ to connect@ (then forwarded) reads as spoofing and went to spam.
    if (process.env.RESEND_API_KEY) {
      const { error: sendError } = await resend.emails.send({
        from: 'Portfolio Contact <forms@jdecastro.dev>',
        to: 'connect@jdecastro.dev',
        // Reply goes straight to the visitor. Skipped when the address is not
        // plausible, because Resend rejects the whole email on a bad reply-to.
        ...(EMAIL_RE.test(email) ? { replyTo: email } : {}),
        subject: `New message from ${email}`,
        html: `
          <h2>New contact form submission</h2>
          <p><strong>From:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `,
      });
      // The SDK returns API errors instead of throwing. The message is already
      // saved, so the visitor still gets a success; this is for the server log.
      if (sendError) {
        console.error('Resend rejected the contact notification:', sendError);
      }
    }

    res.status(201).json({ success: true, id: contact.id });
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

export default router;
