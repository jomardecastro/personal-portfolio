import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/pos/products
router.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await prisma.posProduct.findMany({ orderBy: { id: 'asc' } });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/pos/products
router.post('/products', async (req: Request, res: Response) => {
  try {
    const { name, price, stock } = req.body;
    if (!name || price == null || stock == null) {
      res.status(400).json({ error: 'name, price, and stock are required' });
      return;
    }
    const product = await prisma.posProduct.create({
      data: { name, price: parseFloat(price), stock: parseInt(stock, 10) },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PATCH /api/pos/products/:id — increment stock by delta
router.patch('/products/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { delta } = req.body;
    if (delta == null) {
      res.status(400).json({ error: 'delta is required' });
      return;
    }
    const product = await prisma.posProduct.update({
      where: { id },
      data: { stock: { increment: parseInt(delta, 10) } },
    });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/pos/products/:id
router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.posProduct.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// POST /api/pos/checkout — deduct stock for cart items
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const items: { id: number; quantity: number }[] = req.body.items;
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'items array is required' });
      return;
    }
    await prisma.$transaction(
      items.map(item =>
        prisma.posProduct.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );
    const products = await prisma.posProduct.findMany({ orderBy: { id: 'asc' } });
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

// POST /api/pos/reset — reset to seed data
router.post('/reset', async (_req: Request, res: Response) => {
  try {
    await prisma.posProduct.deleteMany();
    await prisma.posProduct.createMany({
      data: [
        { name: 'Widget Pro', price: 29.99, stock: 45 },
        { name: 'Gadget X', price: 49.99, stock: 23 },
        { name: 'Super Tool', price: 19.99, stock: 67 },
        { name: 'Mega Item', price: 89.99, stock: 12 },
      ],
    });
    const products = await prisma.posProduct.findMany({ orderBy: { id: 'asc' } });
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error resetting products:', error);
    res.status(500).json({ error: 'Failed to reset products' });
  }
});

export default router;
