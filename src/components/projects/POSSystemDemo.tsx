import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, CreditCard, Check, Package } from 'lucide-react';

const products = [
  { id: 1, name: 'Widget Pro', price: 29.99, stock: 45 },
  { id: 2, name: 'Gadget X', price: 49.99, stock: 23 },
  { id: 3, name: 'Super Tool', price: 19.99, stock: 67 },
  { id: 4, name: 'Mega Item', price: 89.99, stock: 12 },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const POSSystemDemo = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const addToCart = (product: typeof products[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter(item => item.quantity > 0);
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsProcessing(false);
    setIsComplete(true);
    setTimeout(() => {
      setIsComplete(false);
      setCart([]);
    }, 2000);
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
            <h3 className="font-mono font-semibold">POS System</h3>
            <p className="text-xs text-muted-foreground">Point of Sale with payment integration</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="tech-pill text-primary">Full-Stack</span>
          <span className="tech-pill text-accent">Stripe</span>
          <span className="tech-pill text-terminal-pink">React</span>
        </div>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Products */}
        <div>
          <h4 className="font-mono text-sm text-muted-foreground mb-3">Products</h4>
          <div className="grid grid-cols-2 gap-2">
            {products.map(product => (
              <motion.button
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(product)}
                className="p-3 glass-hover rounded-lg text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{product.stock} left</span>
                </div>
                <div className="font-mono text-sm">{product.name}</div>
                <div className="text-primary font-bold">${product.price}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div>
          <h4 className="font-mono text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </h4>
          
          <div className="bg-background/30 rounded-lg p-3 min-h-32 mb-4">
            <AnimatePresence>
              {cart.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Click products to add
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-2 bg-secondary/30 rounded"
                    >
                      <span className="font-mono text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-secondary rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-secondary rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-primary ml-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Total & Checkout */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-muted-foreground">Total:</span>
            <span className="text-2xl font-mono font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing || isComplete}
            className={`w-full py-3 font-mono font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
              isComplete
                ? 'bg-accent text-accent-foreground'
                : 'bg-terminal-pink text-white hover:shadow-lg hover:shadow-terminal-pink/20'
            } disabled:opacity-50`}
          >
            {isComplete ? (
              <>
                <Check className="w-4 h-4" />
                Payment Complete!
              </>
            ) : isProcessing ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Process Payment
              </>
            )}
          </button>

          <div className="mt-4 text-center text-xs font-mono text-muted-foreground">
            ⚡ 40% faster processing • Real-time inventory
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default POSSystemDemo;