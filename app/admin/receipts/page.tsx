'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Printer,
  MessageCircle,
  Plus,
  Trash2,
  Copy,
  CheckCircle,
  Sparkles,
  FileText,
  User,
  ShoppingBag,
  IndianRupee,
  Calendar,
  Share2,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';

interface ReceiptItem {
  id: string;
  name: string;
  specs?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function AdminReceiptsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [selectedSource, setSelectedSource] = useState<string>('custom');

  // Receipt Details
  const [docType, setDocType] = useState<'INVOICE' | 'ADVANCE_RECEIPT' | 'QUOTATION' | 'DELIVERY_RECEIPT'>('INVOICE');
  const [receiptNumber, setReceiptNumber] = useState(`SNZ-REC-${Math.floor(10000 + Math.random() * 90000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedDelivery, setEstimatedDelivery] = useState('3-5 Business Days');

  // Customer Info
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Line Items (Prices manually adjustable by admin!)
  const [items, setItems] = useState<ReceiptItem[]>([
    {
      id: '1',
      name: 'Custom 3D Printing Service',
      specs: 'Material: PLA+ • Layer Height: 0.16mm • Infill: 25%',
      quantity: 1,
      unitPrice: 450,
      total: 450,
    },
  ]);

  // Financials
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string>('PAID_IN_FULL');
  const [paymentMode, setPaymentMode] = useState<string>('UPI / Online');
  const [upiId, setUpiId] = useState('918761053230@upi');

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [copied, setCopied] = useState(false);

  // Fetch orders and custom requests for quick-import
  useEffect(() => {
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {});

    fetch('/api/admin/custom-requests')
      .then((res) => res.json())
      .then((data) => setCustomRequests(data.requests || []))
      .catch(() => {});
  }, []);

  // Quick import from selected order or custom request
  const handleImportOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;

    setReceiptNumber(`${ord.id}-REC`);
    setCustomerName(ord.customerName || '');
    setWhatsapp(ord.whatsapp || '');
    setEmail(ord.email || '');
    setAddress(ord.address || '');
    setCity(ord.city || '');
    setState(ord.state || '');
    setPincode(ord.pincode || '');
    setCustomerNotes(ord.orderNotes || '');
    setDiscountAmount(ord.discountAmount || 0);

    let parsedItems: any[] = [];
    try {
      parsedItems = typeof ord.items === 'string' ? JSON.parse(ord.items) : ord.items;
    } catch (e) {}

    if (Array.isArray(parsedItems) && parsedItems.length > 0) {
      const mapped: ReceiptItem[] = parsedItems.map((it, idx) => {
        const qty = Number(it.quantity) || 1;
        const price = Number(it.price) || 0;
        const specsArr = [];
        if (it.color) specsArr.push(`Color: ${it.color}`);
        if (it.size) specsArr.push(`Size: ${it.size}`);
        if (it.personalizedText) specsArr.push(`Custom Text: "${it.personalizedText}"`);
        return {
          id: String(idx + 1),
          name: it.name || '3D Printed Product',
          specs: specsArr.join(' • '),
          quantity: qty,
          unitPrice: price,
          total: qty * price,
        };
      });
      setItems(mapped);
    }
  };

  const handleImportCustomRequest = (reqId: string) => {
    const req = customRequests.find((r) => r.id === reqId);
    if (!req) return;

    setDocType('QUOTATION');
    setReceiptNumber(`${req.id}-QUOTE`);
    setCustomerName(req.customerName || '');
    setWhatsapp(req.whatsapp || '');
    setEmail(req.email || '');
    setCustomerNotes(`Custom Request Specifications: ${req.additionalNotes || 'N/A'}`);

    const qty = Number(req.quantity) || 1;
    setItems([
      {
        id: '1',
        name: `Custom 3D Print - ${req.productType || 'Model Manufacturing'}`,
        specs: `Material: ${req.materialPreference || 'PLA+'} • Color: ${req.colorPreference || 'Default'} ${req.dimensions ? `• Dims: ${req.dimensions}` : ''}`,
        quantity: qty,
        unitPrice: 500, // Default base quote price, easily edited by admin!
        total: qty * 500,
      },
    ]);
  };

  // Line item manipulation
  const updateItem = (index: number, field: keyof ReceiptItem, val: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: val };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = Number(field === 'quantity' ? val : current.quantity) || 0;
      const p = Number(field === 'unitPrice' ? val : current.unitPrice) || 0;
      current.total = q * p;
    }
    updated[index] = current;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: String(Date.now()),
        name: 'Custom 3D Printing Item',
        specs: 'PLA+ / PETG High Detail',
        quantity: 1,
        unitPrice: 350,
        total: 350,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const taxAmount = (subtotal * (Number(taxPercent) || 0)) / 100;
  const grandTotal = Math.max(0, subtotal - (Number(discountAmount) || 0) + (Number(shippingFee) || 0) + taxAmount);
  const balanceDue = Math.max(0, grandTotal - (Number(advancePaid) || 0));

  const docTitleMap = {
    INVOICE: 'TAX INVOICE / RECEIPT',
    ADVANCE_RECEIPT: 'ADVANCE PAYMENT RECEIPT',
    QUOTATION: 'CUSTOM 3D PRINTING QUOTATION',
    DELIVERY_RECEIPT: 'DELIVERY CHALLAN & RECEIPT',
  };

  // WhatsApp Message Generator
  const generateWhatsAppMessage = () => {
    let itemLines = '';
    items.forEach((it, idx) => {
      itemLines += `${idx + 1}. *${it.name}*\n`;
      itemLines += `   Qty: ${it.quantity} | Unit Price: Rs. ${it.unitPrice} | Total: Rs. ${it.total}\n`;
      if (it.specs) itemLines += `   Specs: ${it.specs}\n`;
    });

    const msg = `*SenAZ 3D PRINTS - ${docTitleMap[docType]}*
Ref: *${receiptNumber}*
Date: ${issueDate}

*Billed To:*
Customer: ${customerName || 'Customer'}
Phone: ${whatsapp || 'N/A'}
Address: ${address ? `${address}, ${city} - ${pincode}` : 'Standard Delivery'}

*ITEMS & PRICING BREAKDOWN:*
${itemLines}
*FINANCIAL SUMMARY:*
• Subtotal: Rs. ${subtotal}
${discountAmount > 0 ? `• Negotiated Discount: -Rs. ${discountAmount}\n` : ''}• Shipping / Delivery: ${shippingFee > 0 ? `Rs. ${shippingFee}` : 'FREE'}
*• GRAND TOTAL: Rs. ${grandTotal}*
${advancePaid > 0 ? `• Advance Received: Rs. ${advancePaid}\n• *BALANCE PAYABLE:* Rs. ${balanceDue}\n` : ''}• Payment Status: *${paymentStatus.replace(/_/g, ' ')}*
• Payment Mode: ${paymentMode} (UPI: ${upiId})

*Estimated Delivery:* ${estimatedDelivery}
Thank you for choosing SenAZ 3D PRINTS!`;

    return msg;
  };

  const handleSendWhatsApp = () => {
    const cleanNumber = (whatsapp || '').replace(/[^0-9]/g, '');
    const num = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const url = `https://wa.me/${num || '918761053230'}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
    window.open(url, '_blank');
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar (Hidden during Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-tech-accent" />
            <span>Receipt & Quotation Generator</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Generate custom invoices, adjust negotiated prices manually, and print or share directly on WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold border transition-all ${
              activeTab === 'preview'
                ? 'bg-tech-accent text-tech-bg border-tech-accent'
                : 'bg-tech-card border-tech-border text-slate-300 hover:text-white'
            }`}
          >
            {activeTab === 'preview' ? 'Edit Details' : '📄 Preview Receipt'}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-tech-card hover:bg-tech-border text-slate-200 hover:text-white border border-tech-border text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-tech-accent" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/40"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Send WhatsApp</span>
          </button>
        </div>
      </div>

      {/* QUICK IMPORT BAR (Hidden during Print) */}
      <div className="print:hidden p-4 rounded-xl bg-tech-card border border-tech-border space-y-3">
        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-tech-accent" />
          <span>Quick Pre-Fill From Orders or Custom Requests:</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Import from Recent Store Order:</label>
            <select
              onChange={(e) => {
                if (e.target.value) handleImportOrder(e.target.value);
              }}
              defaultValue=""
              className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
            >
              <option value="">Select an order to pre-fill...</option>
              {orders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  {ord.id} - {ord.customerName} (₹{ord.totalAmount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Import from Custom 3D Request:</label>
            <select
              onChange={(e) => {
                if (e.target.value) handleImportCustomRequest(e.target.value);
              }}
              defaultValue=""
              className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
            >
              <option value="">Select custom request to pre-fill...</option>
              {customRequests.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.id} - {req.customerName} ({req.productType})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* EDITOR FORM (Visible when in Editor Mode) */}
      {activeTab === 'editor' && (
        <div className="print:hidden space-y-6">
          {/* Section 1: Document Settings */}
          <div className="p-5 rounded-2xl bg-tech-card border border-tech-border space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <FileText className="w-4 h-4 text-tech-accent" />
              <span>1. Document & Invoice Settings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e: any) => setDocType(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                >
                  <option value="INVOICE">Tax Invoice / Receipt</option>
                  <option value="ADVANCE_RECEIPT">Advance Payment Receipt</option>
                  <option value="QUOTATION">Custom Print Quotation</option>
                  <option value="DELIVERY_RECEIPT">Delivery Challan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Receipt / Invoice No.</label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Estimated Delivery</label>
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="3-5 Business Days"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Customer Information */}
          <div className="p-5 rounded-2xl bg-tech-card border border-tech-border space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <User className="w-4 h-4 text-tech-accent" />
              <span>2. Customer & Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Milanjyoti Ray"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">WhatsApp / Phone *</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="918761053230"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Street / Locality"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">City & State</label>
                <input
                  type="text"
                  value={city ? `${city}, ${state}` : state}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setCity(parts[0]?.trim() || '');
                    if (parts[1]) setState(parts[1]?.trim() || '');
                  }}
                  placeholder="Guwahati, Assam"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="783335"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Editable Line Items Table (MANUAL NEGOTIATION READY!) */}
          <div className="p-5 rounded-2xl bg-tech-card border border-tech-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-tech-accent" />
                  <span>3. Line Items & Negotiated Pricing (Manually Editable)</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  You can edit the unit price for any item to match custom negotiations. Untouched values remain as-is.
                </p>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1.5 rounded-lg bg-tech-bg hover:bg-tech-border border border-tech-border text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-tech-accent" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-slate-300">
                <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
                  <tr>
                    <th className="p-3 w-1/3">Item Name & Description</th>
                    <th className="p-3">Material / Custom Specs</th>
                    <th className="p-3 w-20">Qty</th>
                    <th className="p-3 w-32">Unit Price (₹)</th>
                    <th className="p-3 w-28">Total (₹)</th>
                    <th className="p-3 w-12 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tech-border">
                  {items.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(idx, 'name', e.target.value)}
                          placeholder="Item name"
                          className="w-full bg-tech-bg border border-tech-border rounded px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-tech-accent"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.specs || ''}
                          onChange={(e) => updateItem(idx, 'specs', e.target.value)}
                          placeholder="e.g. PLA+ Dual Tone Red"
                          className="w-full bg-tech-bg border border-tech-border rounded px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-tech-accent text-[11px]"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full bg-tech-bg border border-tech-border rounded px-2.5 py-1.5 text-white font-bold focus:outline-none focus:border-tech-accent text-center"
                        />
                      </td>
                      <td className="p-3">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1.5 text-slate-400">₹</span>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={item.unitPrice}
                            onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full bg-tech-bg border border-tech-border rounded pl-6 pr-2 py-1.5 text-tech-accent font-bold focus:outline-none focus:border-tech-accent"
                          />
                        </div>
                      </td>
                      <td className="p-3 font-bold text-white">
                        ₹{item.total}
                      </td>
                      <td className="p-3 text-right">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="p-1 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Negotiation Overrides & Payment Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-tech-card border border-tech-border space-y-4">
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-tech-accent" />
                <span>4. Payment & Banking Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-300 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  >
                    <option value="PAID_IN_FULL">Fully Paid</option>
                    <option value="PARTIALLY_PAID">Advance Received (Partial)</option>
                    <option value="UNPAID">Pending / Unpaid Quote</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    placeholder="UPI / GPay / NetBanking"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">UPI ID for Payment</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Advance Amount Received (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-tech-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 text-xs font-mono">Customer Notes / Print Instructions</label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Infill 30% gyroid, bubble-wrapped double boxed package"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                />
              </div>
            </div>

            {/* Total Math Summary */}
            <div className="p-5 rounded-2xl bg-tech-card border border-tech-border space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold text-white font-sans">Final Financial Breakdown</h3>

              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({items.length} items):</span>
                  <span className="font-bold text-white">₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">Negotiated Discount (₹):</span>
                  <input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-28 bg-tech-bg border border-tech-border rounded px-2.5 py-1 text-right text-emerald-400 font-bold focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">Shipping / Delivery Fee (₹):</span>
                  <input
                    type="number"
                    min={0}
                    value={shippingFee}
                    onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                    className="w-28 bg-tech-bg border border-tech-border rounded px-2.5 py-1 text-right text-white font-bold focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div className="pt-2 border-t border-tech-border flex justify-between text-sm font-bold text-white">
                  <span>Grand Total Payable:</span>
                  <span className="text-tech-accent text-base">₹{grandTotal}</span>
                </div>

                {advancePaid > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                    <span>Advance Received:</span>
                    <span>-₹{advancePaid}</span>
                  </div>
                )}

                <div className="flex justify-between text-amber-400 font-bold pt-1 border-t border-dashed border-tech-border">
                  <span>Balance Due on Dispatch/Delivery:</span>
                  <span className="text-base">₹{balanceDue}</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="flex-1 py-2.5 rounded-xl bg-tech-accent text-tech-bg font-bold text-xs hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View & Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-3.5 py-2.5 rounded-xl bg-tech-bg hover:bg-tech-border border border-tech-border text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE OFFICIAL RECEIPT VIEW */}
      {(activeTab === 'preview' || true) && (
        <div className={`${activeTab !== 'preview' ? 'hidden print:block' : 'block'} space-y-4`}>
          {/* Printable Container */}
          <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-slate-200 font-sans print:border-none print:shadow-none print:p-0 print:m-0">
            
            {/* Header with Branding */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  SenAZ <span className="text-cyan-600">3D PRINTS</span>
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-0.5 font-semibold">
                  Micro-Manufacturing • Rapid Prototyping • Custom FDM 3D Printing
                </p>
                <div className="mt-2 text-xs text-slate-600 space-y-0.5 font-mono">
                  <p>📍 Kaldoba Pt 1, Agomoni, Dhubri, Assam - 783335</p>
                  <p>📞 WhatsApp: +91 87610 53230 | 🌐 senaz3dprints.in</p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded">
                  {docTitleMap[docType]}
                </span>
                <p className="text-xs font-mono text-slate-500 pt-1">
                  <strong>Ref / Receipt No:</strong> <span className="text-slate-900 font-bold">{receiptNumber}</span>
                </p>
                <p className="text-xs font-mono text-slate-500">
                  <strong>Date:</strong> {issueDate}
                </p>
              </div>
            </div>

            {/* Billed To / Shipping Info */}
            <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
              <div>
                <span className="font-mono text-slate-400 uppercase tracking-wider font-bold block mb-1">
                  Billed & Shipped To:
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{customerName || 'Valued Customer'}</h3>
                {address && <p className="text-slate-600 mt-0.5">{address}</p>}
                {(city || state || pincode) && (
                  <p className="text-slate-600">
                    {city ? `${city}, ` : ''}{state ? `${state} ` : ''}{pincode ? `- ${pincode}` : ''}
                  </p>
                )}
                <p className="text-slate-600 mt-1 font-mono">
                  <strong>Phone/WhatsApp:</strong> {whatsapp || 'N/A'}
                </p>
                {email && <p className="text-slate-600 font-mono"><strong>Email:</strong> {email}</p>}
              </div>

              <div className="text-right space-y-1 font-mono">
                <span className="text-slate-400 uppercase tracking-wider font-bold block mb-1">
                  Order & Production Specs:
                </span>
                <p className="text-slate-700">
                  <strong>Status:</strong>{' '}
                  <span className="font-bold text-emerald-700">{paymentStatus.replace(/_/g, ' ')}</span>
                </p>
                <p className="text-slate-700">
                  <strong>Payment Mode:</strong> {paymentMode}
                </p>
                <p className="text-slate-700">
                  <strong>Est. Dispatch:</strong> {estimatedDelivery}
                </p>
                {customerNotes && (
                  <p className="text-[11px] text-slate-500 pt-1 italic">
                    Note: "{customerNotes}"
                  </p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="py-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-900 font-mono uppercase">
                    <th className="py-2.5 font-bold">#</th>
                    <th className="py-2.5 font-bold">Item & Description</th>
                    <th className="py-2.5 font-bold">3D Specifications / Notes</th>
                    <th className="py-2.5 text-center font-bold">Qty</th>
                    <th className="py-2.5 text-right font-bold">Unit Price</th>
                    <th className="py-2.5 text-right font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((it, idx) => (
                    <tr key={idx} className="py-2">
                      <td className="py-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-3">
                        <span className="font-bold text-slate-900 block">{it.name}</span>
                      </td>
                      <td className="py-3 text-slate-600 font-mono text-[11px]">
                        {it.specs || 'Standard Precision FDM'}
                      </td>
                      <td className="py-3 text-center font-mono font-bold text-slate-900">
                        {it.quantity}
                      </td>
                      <td className="py-3 text-right font-mono text-slate-700">
                        ₹{it.unitPrice}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-slate-900">
                        ₹{it.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & Payment Block */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-900">
              <div className="space-y-2 text-xs font-mono">
                <span className="font-bold text-slate-900 block">Payment & Bank Details:</span>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-[11px]">
                  <p><strong>UPI ID:</strong> <span className="font-bold text-cyan-700">{upiId}</span></p>
                  <p><strong>Beneficiary:</strong> SenAZ 3D PRINTS</p>
                  <p className="text-slate-500 pt-1">
                    Please share payment screenshot on WhatsApp (+91 87610 53230) for instant production scheduling.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount Applied:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping & Handling:</span>
                  <span className="font-bold text-slate-900">
                    {shippingFee > 0 ? `₹${shippingFee}` : 'FREE'}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                  <span>Grand Total:</span>
                  <span className="text-base text-cyan-700">₹{grandTotal}</span>
                </div>

                {advancePaid > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Advance Paid:</span>
                    <span>-₹{advancePaid}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-dashed border-slate-300">
                  <span>Balance Due:</span>
                  <span>₹{balanceDue}</span>
                </div>
              </div>
            </div>

            {/* Footer Terms */}
            <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] font-mono text-slate-400 space-y-1">
              <p>Thank you for choosing SenAZ 3D PRINTS. All custom prints are inspected for dimensional accuracy and structural integrity.</p>
              <p>© {new Date().getFullYear()} SenAZ 3D PRINTS • senaz3dprints.in • Kaldoba, Agomoni, Assam</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
