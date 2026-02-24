import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Product, CartItem } from './types';
import { initialProducts } from './seedData';
import POSTerminal from './POSTerminal';
import InventoryPanel from './InventoryPanel';

const POSInventorySystem = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleStockDeduct = (items: CartItem[]) => {
    setProducts(prev =>
      prev.map(product => {
        const sold = items.find(i => i.id === product.id);
        if (!sold) return product;
        return { ...product, stock: Math.max(0, product.stock - sold.quantity) };
      })
    );
  };

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

        <TabsContent value="pos">
          <POSTerminal products={products} onStockDeduct={handleStockDeduct} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryPanel products={products} setProducts={setProducts} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default POSInventorySystem;
