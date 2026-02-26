import { useRef } from 'react';
import { Printer, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CartItem } from './types';

interface SalesInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  invoiceNumber: string;
  date: Date;
}

const SalesInvoiceDialog = ({
  open,
  onClose,
  items,
  invoiceNumber,
  date,
}: SalesInvoiceDialogProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePrint = () => {
    const content = invoiceRef.current;
    if (!content) return;

    const win = window.open('', '_blank', 'width=600,height=700');
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
            color: #111;
            padding: 32px;
            max-width: 480px;
            margin: 0 auto;
          }
          .header { text-align: center; margin-bottom: 24px; }
          .header h1 { font-size: 20px; font-weight: bold; letter-spacing: 4px; margin-bottom: 4px; }
          .header p { font-size: 11px; color: #555; }
          .divider { border-top: 1px dashed #999; margin: 12px 0; }
          .meta { margin-bottom: 16px; font-size: 11px; color: #444; }
          .meta div { margin-bottom: 3px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          thead tr { border-bottom: 1px solid #ccc; }
          th { text-align: left; padding: 4px 0; font-size: 11px; text-transform: uppercase; color: #666; }
          th:last-child, td:last-child { text-align: right; }
          td { padding: 6px 0; font-size: 12px; border-bottom: 1px solid #f0f0f0; }
          .total-row { font-weight: bold; font-size: 14px; }
          .total-row td { border-bottom: none; padding-top: 10px; }
          .footer { text-align: center; margin-top: 24px; font-size: 10px; color: #999; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RECEIPT</h1>
          <p>POS System</p>
        </div>
        <div class="divider"></div>
        <div class="meta">
          <div><strong>Invoice:</strong> ${invoiceNumber}</div>
          <div><strong>Date:</strong> ${date.toLocaleDateString()}</div>
          <div><strong>Time:</strong> ${date.toLocaleTimeString()}</div>
        </div>
        <div class="divider"></div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th style="text-align:center">Qty</th>
              <th style="text-align:right">Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                item => `
              <tr>
                <td>${item.name}</td>
                <td style="text-align:center">${item.quantity}</td>
                <td style="text-align:right">$${item.price.toFixed(2)}</td>
                <td style="text-align:right">$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
            <tr class="total-row">
              <td colspan="3">TOTAL</td>
              <td>$${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div class="divider"></div>
        <div class="footer">
          <p>Thank you for your purchase!</p>
          <p style="margin-top:4px">Powered by Dev Playground</p>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md font-mono">
        <DialogHeader>
          <DialogTitle className="text-center font-mono tracking-widest text-lg">
            RECEIPT
          </DialogTitle>
        </DialogHeader>

        <div ref={invoiceRef} className="space-y-4">
          {/* Invoice meta */}
          <div className="flex justify-between text-xs text-muted-foreground border-b border-dashed border-border pb-3">
            <div className="space-y-1">
              <div><span className="text-foreground">Invoice:</span> {invoiceNumber}</div>
              <div><span className="text-foreground">Date:</span> {date.toLocaleDateString()}</div>
              <div><span className="text-foreground">Time:</span> {date.toLocaleTimeString()}</div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
             POS System
            </div>
          </div>

          {/* Line items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left pb-2">Item</th>
                <th className="text-center pb-2">Qty</th>
                <th className="text-right pb-2">Price</th>
                <th className="text-right pb-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-border/40">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center text-muted-foreground">{item.quantity}</td>
                  <td className="py-2 text-right text-muted-foreground">${item.price.toFixed(2)}</td>
                  <td className="py-2 text-right text-primary font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-dashed border-border pt-3">
            <span className="font-bold text-base">TOTAL</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-1 border-t border-dashed border-border">
            Thank you for your purchase!
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-sm hover:opacity-90 transition-opacity"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border font-mono text-sm hover:bg-secondary/50 transition-colors"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesInvoiceDialog;
