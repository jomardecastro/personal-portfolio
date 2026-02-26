import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, AlertTriangle, PackageCheck, PackageX } from 'lucide-react';
import { Product } from './types';

interface InventoryPanelProps {
  products: Product[];
  onProductsChanged: () => void;
}

const LOW_STOCK_THRESHOLD = 10;

const StockBadge = ({ stock }: { stock: number }) => {
  if (stock === 0)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-red-500/20 text-red-400">
        <PackageX className="w-3 h-3" /> Out
      </span>
    );
  if (stock < LOW_STOCK_THRESHOLD)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-amber-500/20 text-amber-400">
        <AlertTriangle className="w-3 h-3" /> Low
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-accent/20 text-accent">
      <PackageCheck className="w-3 h-3" /> OK
    </span>
  );
};

const InventoryPanel = ({ products, onProductsChanged }: InventoryPanelProps) => {
  const [restockQty, setRestockQty] = useState<Record<number, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Add product form
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');

  const handleRestock = async (id: number) => {
    const delta = parseInt(restockQty[id] ?? '0', 10);
    if (!delta || delta <= 0) return;
    try {
      const res = await fetch(`/api/pos/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta }),
      });
      if (!res.ok) throw new Error('Restock failed');
      setRestockQty(prev => ({ ...prev, [id]: '' }));
      onProductsChanged();
    } catch {
      // silently ignore — user can retry
    }
  };

  const handleDelete = async (id: number) => {
    if (confirmDelete === id) {
      try {
        const res = await fetch(`/api/pos/products/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        setConfirmDelete(null);
        onProductsChanged();
      } catch {
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(id);
    }
  };

  const handleAddProduct = async () => {
    const name = newName.trim();
    const price = parseFloat(newPrice);
    const stock = parseInt(newStock, 10);
    if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) return;
    try {
      const res = await fetch('/api/pos/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, stock }),
      });
      if (!res.ok) throw new Error('Add failed');
      setNewName('');
      setNewPrice('');
      setNewStock('');
      onProductsChanged();
    } catch {
      // silently ignore — user can retry
    }
  };

  const lowStockCount = products.filter(p => p.stock > 0 && p.stock < LOW_STOCK_THRESHOLD).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="p-6 space-y-6">
      {/* Summary badges */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="flex flex-wrap gap-2">
          {outOfStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
              <PackageX className="w-4 h-4" />
              {outOfStockCount} out of stock
            </div>
          )}
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-mono">
              <AlertTriangle className="w-4 h-4" />
              {lowStockCount} low stock
            </div>
          )}
        </div>
      )}

      {/* Stock Table */}
      <div>
        <h4 className="font-mono text-sm text-muted-foreground mb-3">Stock Levels</h4>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="bg-secondary/30 text-muted-foreground">
                <th className="text-left px-4 py-2">Product</th>
                <th className="text-right px-4 py-2">Price</th>
                <th className="text-right px-4 py-2">Stock</th>
                <th className="text-center px-4 py-2">Status</th>
                <th className="text-center px-4 py-2">Restock</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {products.map(product => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border hover:bg-secondary/10 transition-colors"
                  >
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3 text-right text-primary">${product.price.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-bold ${
                      product.stock === 0 ? 'text-red-400' :
                      product.stock < LOW_STOCK_THRESHOLD ? 'text-amber-400' : ''
                    }`}>
                      {product.stock}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StockBadge stock={product.stock} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-center">
                        <input
                          type="number"
                          min="1"
                          placeholder="qty"
                          value={restockQty[product.id] ?? ''}
                          onChange={e =>
                            setRestockQty(prev => ({ ...prev, [product.id]: e.target.value }))
                          }
                          className="w-16 px-2 py-1 rounded bg-background/60 border border-border text-center text-xs focus:outline-none focus:border-primary"
                        />
                        <button
                          onClick={() => handleRestock(product.id)}
                          className="p-1 rounded hover:bg-accent/20 text-accent transition-colors"
                          title="Restock"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className={`p-1 rounded transition-colors ${
                          confirmDelete === product.id
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'hover:bg-secondary text-muted-foreground hover:text-red-400'
                        }`}
                        title={confirmDelete === product.id ? 'Click again to confirm' : 'Delete product'}
                        onBlur={() => setConfirmDelete(null)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No products. Add one below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Form */}
      <div>
        <h4 className="font-mono text-sm text-muted-foreground mb-3">Add Product</h4>
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-mono">Name</label>
            <input
              type="text"
              placeholder="Product name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="px-3 py-2 rounded-lg bg-background/60 border border-border text-sm font-mono focus:outline-none focus:border-primary w-40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-mono">Price ($)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
              className="px-3 py-2 rounded-lg bg-background/60 border border-border text-sm font-mono focus:outline-none focus:border-primary w-24"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-mono">Initial Stock</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={newStock}
              onChange={e => setNewStock(e.target.value)}
              className="px-3 py-2 rounded-lg bg-background/60 border border-border text-sm font-mono focus:outline-none focus:border-primary w-24"
            />
          </div>
          <button
            onClick={handleAddProduct}
            disabled={!newName.trim() || !newPrice || !newStock}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryPanel;
