import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Product } from './types';
import POSTerminal from './POSTerminal';
import InventoryPanel from './InventoryPanel';

const POSInventorySystem = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/pos/products');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: Product[] = await res.json();
      setProducts(data);
      setError(null);
    } catch {
      setError('Could not load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-terminal-pink/20">
            <ShoppingCart className="w-5 h-5 text-terminal-pink" />
          </div>
          <div>
            <h3 className="font-mono font-semibold">POS + Inventory System</h3>
            <p className="text-xs text-muted-foreground">Point of sale with real-time stock management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="tech-pill text-primary">Full-Stack</span>
          <span className="tech-pill text-accent">Stripe</span>
          <span className="tech-pill text-terminal-pink">React</span>
        </div>
      </div>

      {/* Inner Tabs */}
      <Tabs defaultValue="pos" className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="font-mono">
            <TabsTrigger value="pos" className="flex items-center gap-2">
              <ShoppingCart className="w-3.5 h-3.5" />
              POS Terminal
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5" />
              Inventory
            </TabsTrigger>
          </TabsList>
        </div>

        {loading ? (
          <div className="p-12 text-center font-mono text-sm text-muted-foreground animate-pulse">
            Loading products...
          </div>
        ) : error ? (
          <div className="p-12 text-center font-mono text-sm text-red-400">{error}</div>
        ) : (
          <>
            <TabsContent value="pos">
              <POSTerminal products={products} onCheckoutComplete={fetchProducts} />
            </TabsContent>
            <TabsContent value="inventory">
              <InventoryPanel products={products} onProductsChanged={fetchProducts} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </motion.div>
  );
};

export default POSInventorySystem;
