import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, CreditCard, Check, Package } from 'lucide-react';
import { Product, CartItem } from './types';

interface POSTerminalProps {
  products: Product[];
  onStockDeduct: (items: CartItem[]) => void;
}

const POSTerminal = ({ products, onStockDeduct }: POSTerminalProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter(item => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    onStockDeduct(cart);
    setIsProcessing(false);
    setIsComplete(true);
    setTimeout(() => {
      setIsComplete(false);
      setCart([]);
    }, 2000);
  };

  const getStockInCart = (productId: number) =>
    cart.find(i => i.id === productId)?.quantity ?? 0;

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      {/* Products */}
      <div>
        <h4 className="font-mono text-sm text-muted-foreground mb-3">Products</h4>
        <div className="grid grid-cols-2 gap-2">
          {products.map(product => {
            const inCart = getStockInCart(product.id);
            const availableStock = product.stock - inCart;
            const isOutOfStock = availableStock <= 0;
            const isLowStock = product.stock < 10 && product.stock > 0;

            return (
              <motion.button
                key={product.id}
                whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
                whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
                className={`p-3 glass-hover rounded-lg text-left transition-opacity ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className={`text-xs font-mono ${isOutOfStock ? 'text-red-400' : isLowStock ? 'text-amber-400' : 'text-muted-foreground'}`}>
                    {isOutOfStock ? 'Out' : `${availableStock} left`}
                  </span>
                </div>
                <div className="font-mono text-sm">{product.name}</div>
                <div className="text-primary font-bold">${product.price}</div>
              </motion.button>
            );
          })}
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
                        disabled={
                          (products.find(p => p.id === item.id)?.stock ?? 0) - item.quantity <= 0
                        }
                        className="p-1 hover:bg-secondary rounded disabled:opacity-40 disabled:cursor-not-allowed"
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
  );
};

export default POSTerminal;
