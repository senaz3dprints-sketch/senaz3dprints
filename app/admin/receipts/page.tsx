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
  Building2,
  Save,
  Search,
  Edit,
  Layers,
  Check,
} from 'lucide-react';

interface ReceiptItem {
  id: string;
  name: string;
  specs?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface AdminBusinessInfo {
  businessName: string;
  tagline: string;
  businessAddress: string;
  businessCityStatePin: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite: string;
  businessUpiId: string;
  businessUpiName: string;
}

const DEFAULT_ADMIN_INFO: AdminBusinessInfo = {
  businessName: 'SenAZ 3D PRINTS',
  tagline: 'Custom 3D Printing & Rapid Prototyping Studio',
  businessAddress: '',
  businessCityStatePin: '',
  businessPhone: '',
  businessEmail: 'support@senaz3dprints.in',
  businessWebsite: 'senaz3dprints.in',
  businessUpiId: '',
  businessUpiName: 'SenAZ 3D PRINTS',
};

export default function AdminReceiptsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [savedReceipts, setSavedReceipts] = useState<any[]>([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [savingReceipt, setSavingReceipt] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Active Main View Tab
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('editor');
  const [savedSearch, setSavedSearch] = useState('');
  const [showAdminInfoEdit, setShowAdminInfoEdit] = useState(false);

  // Admin / Business Sender Information (Configured by Admin)
  const [adminInfo, setAdminInfo] = useState<AdminBusinessInfo>(DEFAULT_ADMIN_INFO);

  // Document Details
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [docType, setDocType] = useState<'RECEIPT' | 'ADVANCE_RECEIPT' | 'QUOTATION' | 'DELIVERY_RECEIPT'>('RECEIPT');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [estimatedDelivery, setEstimatedDelivery] = useState('3-5 Business Days');

  // Customer Info (Purely Generic Placeholders)
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Line Items
  const [items, setItems] = useState<ReceiptItem[]>([
    {
      id: '1',
      name: 'Custom 3D Printing Service',
      specs: 'Material: PLA+ • Layer Height: 0.16mm',
      quantity: 1,
      unitPrice: 450,
      total: 450,
    },
  ]);

  // Financials & Payment
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [advancePaid, setAdvancePaid] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string>('PAID_IN_FULL');
  const [paymentMode, setPaymentMode] = useState<string>('UPI / Online');
  const [copied, setCopied] = useState(false);

  // Generate initial random receipt number
  const generateNewReceiptNumber = (type: string = docType) => {
    const prefix = type === 'QUOTATION' ? 'SNZ-QUOTE' : 'SNZ-REC';
    return `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;
  };

  // Initialize
  useEffect(() => {
    setReceiptNumber(generateNewReceiptNumber(docType));

    // Load saved business info from localStorage
    try {
      const storedAdmin = localStorage.getItem('senaz_admin_business_info');
      if (storedAdmin) {
        setAdminInfo({ ...DEFAULT_ADMIN_INFO, ...JSON.parse(storedAdmin) });
      }
    } catch (e) {}

    // Load store orders & custom requests for quick-import
    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {});

    fetch('/api/admin/custom-requests')
      .then((res) => res.json())
      .then((data) => setCustomRequests(data.requests || []))
      .catch(() => {});

    // Load saved receipts from database
    loadSavedReceipts();
  }, []);

  const loadSavedReceipts = async () => {
    setLoadingReceipts(true);
    try {
      const res = await fetch('/api/admin/receipts');
      const data = await res.json();
      if (data.receipts) {
        setSavedReceipts(data.receipts);
      }
    } catch (e) {
      console.error('Failed to load receipts:', e);
    } finally {
      setLoadingReceipts(false);
    }
  };

  // Save Admin Business Info
  const handleSaveAdminInfo = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('senaz_admin_business_info', JSON.stringify(adminInfo));
    } catch (e) {}
    setShowAdminInfoEdit(false);
    setSaveSuccessMsg('Studio & Admin Address saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Reset & Create a New Blank Receipt
  const handleCreateNew = () => {
    setCurrentId(null);
    setReceiptNumber(generateNewReceiptNumber(docType));
    setIssueDate(new Date().toISOString().split('T')[0]);
    setCustomerName('');
    setWhatsapp('');
    setEmail('');
    setAddress('');
    setCity('');
    setState('');
    setPincode('');
    setCustomerNotes('');
    setDiscountAmount(0);
    setShippingFee(0);
    setAdvancePaid(0);
    setPaymentStatus('PAID_IN_FULL');
    setItems([
      {
        id: '1',
        name: 'Custom 3D Printing Service',
        specs: 'Material: PLA+ • Layer Height: 0.16mm',
        quantity: 1,
        unitPrice: 450,
        total: 450,
      },
    ]);
    setActiveTab('editor');
    setSaveSuccessMsg('');
  };

  // Quick import from selected order or custom request
  const handleImportOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return;

    setCurrentId(null);
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
        if (it.personalizedText) specsArr.push(`Custom: "${it.personalizedText}"`);
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

    setCurrentId(null);
    setDocType('QUOTATION');
    setReceiptNumber(`${req.id}-QUOTE`);
    setCustomerName(req.customerName || '');
    setWhatsapp(req.whatsapp || '');
    setEmail(req.email || '');
    setCustomerNotes(`Custom Specs: ${req.additionalNotes || 'N/A'}`);

    const qty = Number(req.quantity) || 1;
    setItems([
      {
        id: '1',
        name: `Custom 3D Print - ${req.productType || 'Model Manufacturing'}`,
        specs: `Material: ${req.materialPreference || 'PLA+'} • Color: ${req.colorPreference || 'Default'} ${req.dimensions ? `• Dims: ${req.dimensions}` : ''}`,
        quantity: qty,
        unitPrice: 500,
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

  const addItem = (preset?: Partial<ReceiptItem>) => {
    setItems([
      ...items,
      {
        id: String(Date.now()),
        name: preset?.name || 'Custom 3D Printed Item',
        specs: preset?.specs || 'Material: PLA+ • Standard Precision',
        quantity: preset?.quantity || 1,
        unitPrice: preset?.unitPrice ?? 350,
        total: (preset?.quantity || 1) * (preset?.unitPrice ?? 350),
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      setItems([
        {
          id: String(Date.now()),
          name: '',
          specs: '',
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ]);
      return;
    }
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Calculations (No Tax)
  const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const grandTotal = Math.max(0, subtotal - (Number(discountAmount) || 0) + (Number(shippingFee) || 0));
  const balanceDue = Math.max(0, grandTotal - (Number(advancePaid) || 0));

  const docTitleMap = {
    RECEIPT: 'ORDER RECEIPT',
    ADVANCE_RECEIPT: 'ADVANCE PAYMENT RECEIPT',
    QUOTATION: 'PRICE QUOTATION / ESTIMATE',
    DELIVERY_RECEIPT: 'DELIVERY CHALLAN & RECEIPT',
  };

  // Save receipt to database
  const handleSaveReceipt = async () => {
    if (!receiptNumber || !customerName) {
      alert('Please provide at least a Receipt Number and Customer Name.');
      return;
    }

    setSavingReceipt(true);
    try {
      const payload = {
        id: currentId,
        receiptNumber,
        docType,
        customerName,
        whatsapp,
        email,
        address,
        city,
        state,
        pincode,
        customerNotes,
        adminBusinessInfo: adminInfo,
        items,
        subtotal,
        discountAmount,
        shippingFee,
        taxPercent: 0,
        grandTotal,
        advancePaid,
        balanceDue,
        paymentStatus,
        paymentMode,
        upiId: adminInfo.businessUpiId,
        estimatedDelivery,
        issueDate,
      };

      const res = await fetch('/api/admin/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.receipt) {
        setCurrentId(data.receipt.id);
        setSaveSuccessMsg(`Receipt "${receiptNumber}" saved successfully!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        loadSavedReceipts();
      } else {
        alert(data.error || 'Failed to save receipt.');
      }
    } catch (e) {
      alert('Error saving receipt.');
    } finally {
      setSavingReceipt(false);
    }
  };

  // Load saved receipt into editor
  const handleLoadSavedReceipt = (rec: any) => {
    setCurrentId(rec.id);
    setReceiptNumber(rec.receiptNumber);
    const rawType = rec.docType || 'RECEIPT';
    setDocType(rawType === 'INVOICE' ? 'RECEIPT' : rawType);
    setCustomerName(rec.customerName || '');
    setWhatsapp(rec.whatsapp || '');
    setEmail(rec.email || '');
    setAddress(rec.address || '');
    setCity(rec.city || '');
    setState(rec.state || '');
    setPincode(rec.pincode || '');
    setCustomerNotes(rec.customerNotes || '');
    setDiscountAmount(rec.discountAmount || 0);
    setShippingFee(rec.shippingFee || 0);
    setAdvancePaid(rec.advancePaid || 0);
    setPaymentStatus(rec.paymentStatus || 'PAID_IN_FULL');
    setPaymentMode(rec.paymentMode || 'UPI / Online');
    setEstimatedDelivery(rec.estimatedDelivery || '3-5 Business Days');
    setIssueDate(rec.issueDate || new Date().toISOString().split('T')[0]);

    if (rec.adminBusinessInfo) {
      try {
        const parsed = typeof rec.adminBusinessInfo === 'string' ? JSON.parse(rec.adminBusinessInfo) : rec.adminBusinessInfo;
        if (parsed && typeof parsed === 'object') {
          setAdminInfo((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {}
    }

    if (rec.items) {
      try {
        const parsedItems = typeof rec.items === 'string' ? JSON.parse(rec.items) : rec.items;
        if (Array.isArray(parsedItems)) setItems(parsedItems);
      } catch (e) {}
    }

    setActiveTab('editor');
    setSaveSuccessMsg(`Loaded receipt "${rec.receiptNumber}"`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Duplicate saved receipt
  const handleDuplicateReceipt = (rec: any) => {
    handleLoadSavedReceipt(rec);
    setCurrentId(null);
    setReceiptNumber(generateNewReceiptNumber(rec.docType === 'QUOTATION' ? 'QUOTATION' : 'RECEIPT'));
    setIssueDate(new Date().toISOString().split('T')[0]);
    setSaveSuccessMsg('Receipt duplicated with new reference number.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Delete saved receipt
  const handleDeleteReceipt = async (id: string, refNum: string) => {
    if (!confirm(`Are you sure you want to delete receipt ${refNum}?`)) return;

    try {
      const res = await fetch(`/api/admin/receipts?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSavedReceipts((prev) => prev.filter((r) => r.id !== id));
        if (currentId === id) setCurrentId(null);
      }
    } catch (e) {
      alert('Failed to delete receipt.');
    }
  };

  // WhatsApp Message Generator
  const generateWhatsAppMessage = () => {
    let itemLines = '';
    items.forEach((it, idx) => {
      itemLines += `${idx + 1}. *${it.name}*\n`;
      itemLines += `   Qty: ${it.quantity} | Unit Price: Rs. ${it.unitPrice} | Total: Rs. ${it.total}\n`;
      if (it.specs) itemLines += `   Specs: ${it.specs}\n`;
    });

    const msg = `*${adminInfo.businessName} - ${docTitleMap[docType]}*
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
*• TOTAL AMOUNT: Rs. ${grandTotal}*
${advancePaid > 0 ? `• Advance Received: Rs. ${advancePaid}\n• *BALANCE PAYABLE:* Rs. ${balanceDue}\n` : ''}• Payment Status: *${paymentStatus.replace(/_/g, ' ')}*
${adminInfo.businessUpiId ? `• Payment Mode: ${paymentMode} (UPI: ${adminInfo.businessUpiId})\n` : `• Payment Mode: ${paymentMode}\n`}
*Estimated Delivery:* ${estimatedDelivery}
Thank you for choosing ${adminInfo.businessName}!`;

    return msg;
  };

  const handleSendWhatsApp = () => {
    const cleanNumber = (whatsapp || '').replace(/[^0-9]/g, '');
    const num = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const url = `https://wa.me/${num || ''}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
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

  // Filter saved receipts
  const filteredSaved = savedReceipts.filter((r) => {
    const q = savedSearch.toLowerCase();
    return (
      (r.customerName || '').toLowerCase().includes(q) ||
      (r.receiptNumber || '').toLowerCase().includes(q) ||
      (r.whatsapp || '').includes(q) ||
      (r.docType || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header & View Tabs (Hidden during Print) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-tech-accent" />
            <span>Customer Receipts & Quotations</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Create custom receipts & quotes, adjust negotiated prices, save to database, and print or share on WhatsApp
          </p>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Navigation Tabs */}
          <div className="flex items-center bg-tech-card p-1 rounded-xl border border-tech-border">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-tech-accent text-tech-bg font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-tech-accent text-tech-bg font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('history');
                loadSavedReceipts();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-tech-accent text-tech-bg font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Saved ({savedReceipts.length})</span>
            </button>
          </div>

          {/* Quick Actions */}
          <button
            onClick={handleCreateNew}
            className="px-3 py-2 rounded-xl bg-tech-card hover:bg-tech-border text-slate-200 hover:text-white border border-tech-border text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Start a fresh blank receipt"
          >
            <Plus className="w-3.5 h-3.5 text-tech-accent" />
            <span className="hidden sm:inline">New Blank</span>
          </button>

          <button
            onClick={handleSaveReceipt}
            disabled={savingReceipt}
            className="px-3.5 py-2 rounded-xl bg-brand-800 hover:bg-brand-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border border-brand-600 shadow-md shadow-brand-950/40 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-tech-accent" />
            <span>{savingReceipt ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-tech-card hover:bg-tech-border text-slate-200 hover:text-white border border-tech-border text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-tech-accent" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-950/40"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="print:hidden p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActiveTab('history')}
            className="underline text-emerald-200 hover:text-white text-[11px]"
          >
            View in Saved List →
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: RECEIPT EDITOR */}
      {/* ========================================================================= */}
      {activeTab === 'editor' && (
        <div className="print:hidden space-y-6">
          {/* Quick Pre-Fill & Admin Settings Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Quick Import from Store Orders */}
            <div className="p-3.5 rounded-xl bg-tech-card border border-tech-border space-y-1.5">
              <label className="block text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-tech-accent" />
                <span>Import Recent Order:</span>
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) handleImportOrder(e.target.value);
                }}
                defaultValue=""
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
              >
                <option value="">Select an order to pre-fill...</option>
                {orders.map((ord) => (
                  <option key={ord.id} value={ord.id}>
                    {ord.id} - {ord.customerName} (₹{ord.totalAmount})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Import from Custom Requests */}
            <div className="p-3.5 rounded-xl bg-tech-card border border-tech-border space-y-1.5">
              <label className="block text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Import Custom 3D Request:</span>
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) handleImportCustomRequest(e.target.value);
                }}
                defaultValue=""
                className="w-full bg-tech-bg border border-tech-border rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
              >
                <option value="">Select custom request...</option>
                {customRequests.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.id} - {req.customerName} ({req.productType})
                  </option>
                ))}
              </select>
            </div>

            {/* Studio / Admin Address Quick Customizer */}
            <div className="p-3.5 rounded-xl bg-tech-card border border-tech-border flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white block">
                  {adminInfo.businessName || 'Your Brand Name'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[200px]">
                  {adminInfo.businessAddress
                    ? `${adminInfo.businessAddress}, ${adminInfo.businessCityStatePin}`
                    : 'Click "Edit Address" to set your studio address'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminInfoEdit(!showAdminInfoEdit)}
                className="px-2.5 py-1.5 rounded-lg bg-tech-bg hover:bg-tech-border border border-tech-border text-[11px] font-mono text-tech-accent flex items-center gap-1 transition-colors"
              >
                <Building2 className="w-3 h-3" />
                <span>{showAdminInfoEdit ? 'Close' : 'Edit Admin Address'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Admin / Business Address Editor */}
          {showAdminInfoEdit && (
            <div className="p-5 rounded-2xl bg-tech-card/90 border border-tech-accent/40 space-y-4 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-tech-accent" />
                  <span>Configure Admin / Studio Address & Sender Information</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Saved automatically to all future receipts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-300 mb-1">Studio / Brand Name</label>
                  <input
                    type="text"
                    value={adminInfo.businessName}
                    onChange={(e) => setAdminInfo({ ...adminInfo, businessName: e.target.value })}
                    placeholder="e.g. SenAZ 3D PRINTS"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={adminInfo.tagline}
                    onChange={(e) => setAdminInfo({ ...adminInfo, tagline: e.target.value })}
                    placeholder="e.g. Custom 3D Printing & Rapid Prototyping Studio"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Studio / Business Street Address</label>
                  <input
                    type="text"
                    value={adminInfo.businessAddress}
                    onChange={(e) => setAdminInfo({ ...adminInfo, businessAddress: e.target.value })}
                    placeholder="e.g. 123 Tech Park, MG Road"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">City, State & Pincode</label>
                  <input
                    type="text"
                    value={adminInfo.businessCityStatePin}
                    onChange={(e) => setAdminInfo({ ...adminInfo, businessCityStatePin: e.target.value })}
                    placeholder="e.g. Mumbai, Maharashtra - 400001"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Business Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={adminInfo.businessPhone}
                    onChange={(e) => setAdminInfo({ ...adminInfo, businessPhone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Business Email</label>
                  <input
                    type="email"
                    value={adminInfo.businessEmail}
                    onChange={(e) => setAdminInfo({ ...adminInfo, businessEmail: e.target.value })}
                    placeholder="e.g. support@senaz3dprints.in"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">UPI ID for Payments</label>
                  <input
                    type="text"
                    value={adminInfo.businessUpiId}
                    onChange={(e) => setAdminInfo({ ...adminInfo, businessUpiId: e.target.value })}
                    placeholder="e.g. senaz3dprints@upi"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">UPI Beneficiary Name</label>
                  <input
                    type="text"
                    value={adminInfo.businessUpiName}
                    onChange={(e) => setAdminInfo({ ...adminInfo, businessUpiName: e.target.value })}
                    placeholder="e.g. SenAZ 3D PRINTS"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Website URL</label>
                  <input
                    type="text"
                    value={adminInfo.businessWebsite}
                    onChange={(e) => setAdminInfo({ ...adminInfo, businessWebsite: e.target.value })}
                    placeholder="e.g. senaz3dprints.in"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAdminInfo}
                  className="px-4 py-2 rounded-xl bg-tech-accent text-tech-bg text-xs font-mono font-bold hover:bg-tech-accent/90 transition-all flex items-center gap-1.5 shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Studio Info</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 1: Document Settings */}
          <div className="p-5 rounded-2xl bg-tech-card border border-tech-border space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <FileText className="w-4 h-4 text-tech-accent" />
              <span>1. Document & Receipt Settings</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e: any) => setDocType(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                >
                  <option value="RECEIPT">Order Receipt</option>
                  <option value="ADVANCE_RECEIPT">Advance Payment Receipt</option>
                  <option value="QUOTATION">Price Quotation / Estimate</option>
                  <option value="DELIVERY_RECEIPT">Delivery Challan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Receipt Reference No.</label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="e.g. SNZ-REC-10492"
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
                <label className="block text-slate-300 mb-1">Estimated Dispatch / Delivery</label>
                <input
                  type="text"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="e.g. 3-5 Business Days"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Customer Information (GENERIC PLACEHOLDERS) */}
          <div className="p-5 rounded-2xl bg-tech-card border border-tech-border space-y-4">
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <User className="w-4 h-4 text-tech-accent" />
              <span>2. Customer & Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">WhatsApp / Contact Phone *</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Customer Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rahul.sharma@example.com"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1">Delivery Street Address / Area</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Green Heights, MG Road"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. MH"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 400001"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Line Items & Pricing (Creatable, Editable, Deletable) */}
          <div className="p-5 rounded-2xl bg-tech-card border border-tech-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-tech-accent" />
                  <span>3. Line Items & Custom Pricing (Manually Editable)</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Create, edit, or delete item rows. You can manually override unit prices to reflect agreed customer pricing.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addItem()}
                  className="px-3 py-1.5 rounded-lg bg-tech-accent text-tech-bg font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow hover:bg-tech-accent/90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line Item</span>
                </button>
              </div>
            </div>

            {/* Quick Preset Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="text-slate-400">Quick Add:</span>
              <button
                type="button"
                onClick={() =>
                  addItem({
                    name: 'Custom STL 3D Print',
                    specs: 'Material: PLA+ • 0.16mm layer height • 20% Infill',
                    unitPrice: 450,
                  })
                }
                className="px-2.5 py-1 rounded bg-tech-bg hover:bg-tech-border border border-tech-border text-slate-300 hover:text-white transition-colors"
              >
                + STL Print (₹450)
              </button>
              <button
                type="button"
                onClick={() =>
                  addItem({
                    name: 'Personalized 3D Name Keychain',
                    specs: 'Dual-Color Embossed Letters • High Rigidity PLA+',
                    unitPrice: 199,
                  })
                }
                className="px-2.5 py-1 rounded bg-tech-bg hover:bg-tech-border border border-tech-border text-slate-300 hover:text-white transition-colors"
              >
                + Keychain (₹199)
              </button>
              <button
                type="button"
                onClick={() =>
                  addItem({
                    name: 'Custom Curved Lithophane Lamp',
                    specs: 'White High-Res PLA • Warm LED Base included',
                    unitPrice: 699,
                  })
                }
                className="px-2.5 py-1 rounded bg-tech-bg hover:bg-tech-border border border-tech-border text-slate-300 hover:text-white transition-colors"
              >
                + Lithophane (₹699)
              </button>
              <button
                type="button"
                onClick={() =>
                  addItem({
                    name: '3D CAD Modeling & Slicing Fee',
                    specs: 'Parametric CAD Model Generation & STL Optimization',
                    unitPrice: 300,
                  })
                }
                className="px-2.5 py-1 rounded bg-tech-bg hover:bg-tech-border border border-tech-border text-slate-300 hover:text-white transition-colors"
              >
                + CAD Design (₹300)
              </button>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono text-slate-300">
                <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
                  <tr>
                    <th className="p-3 w-1/3">Item Description *</th>
                    <th className="p-3">3D Material & Custom Specs</th>
                    <th className="p-3 w-20 text-center">Qty</th>
                    <th className="p-3 w-32 text-right">Unit Price (₹)</th>
                    <th className="p-3 w-28 text-right">Total (₹)</th>
                    <th className="p-3 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tech-border">
                  {items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-tech-bg/50 transition-colors">
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(idx, 'name', e.target.value)}
                          placeholder="e.g. Custom 3D Printed Statue"
                          className="w-full bg-tech-bg border border-tech-border rounded px-2.5 py-1.5 text-white font-semibold focus:outline-none focus:border-tech-accent"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.specs || ''}
                          onChange={(e) => updateItem(idx, 'specs', e.target.value)}
                          placeholder="e.g. Material: PETG • Color: Matte Black"
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
                            className="w-full bg-tech-bg border border-tech-border rounded pl-6 pr-2 py-1.5 text-tech-accent font-bold focus:outline-none focus:border-tech-accent text-right"
                          />
                        </div>
                      </td>
                      <td className="p-3 font-bold text-white text-right">
                        ₹{item.total}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="p-1.5 rounded-lg hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete line item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Negotiation Overrides, Banking & Summary */}
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
                    placeholder="e.g. UPI / Google Pay / NetBanking"
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">UPI ID on Receipt</label>
                  <input
                    type="text"
                    value={adminInfo.businessUpiId}
                    onChange={(e) => setAdminInfo({ ...adminInfo, businessUpiId: e.target.value })}
                    placeholder="e.g. senaz3dprints@upi"
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
                <label className="block text-slate-300 mb-1 text-xs font-mono">
                  Customer Notes / Special Production Instructions
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="e.g. Infill 30% gyroid, double bubble-wrapped packaging"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                />
              </div>
            </div>

            {/* Total Math Summary */}
            <div className="p-5 rounded-2xl bg-tech-card border border-tech-border space-y-3 font-mono text-xs">
              <h3 className="text-sm font-bold text-white font-sans">Payment Summary</h3>

              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({items.length} items):</span>
                  <span className="font-bold text-white">₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-300">Discount (₹):</span>
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
                  <span>Total Payable:</span>
                  <span className="text-tech-accent text-base font-extrabold">₹{grandTotal}</span>
                </div>

                {advancePaid > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold pt-1">
                    <span>Advance Received:</span>
                    <span>-₹{advancePaid}</span>
                  </div>
                )}

                <div className="flex justify-between text-amber-400 font-bold pt-1 border-t border-dashed border-tech-border">
                  <span>Balance Due:</span>
                  <span className="text-base">₹{balanceDue}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="flex-1 py-2.5 rounded-xl bg-tech-accent text-tech-bg font-bold text-xs hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Preview Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveReceipt}
                  disabled={savingReceipt}
                  className="px-4 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs border border-brand-600 transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-tech-accent" />
                  <span>{savingReceipt ? 'Saving...' : 'Save'}</span>
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

      {/* ========================================================================= */}
      {/* TAB 2: LIVE RECEIPT PREVIEW (PRINTABLE OFFICIAL VIEW) */}
      {/* ========================================================================= */}
      {(activeTab === 'preview' || true) && (
        <div className={`${activeTab !== 'preview' ? 'hidden print:block' : 'block'} space-y-4`}>
          {/* Floating Action Bar above Preview */}
          <div className="print:hidden p-3 rounded-xl bg-tech-card border border-tech-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-300">
                Viewing: {receiptNumber} ({docTitleMap[docType]})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className="px-3 py-1.5 rounded-lg bg-tech-bg hover:bg-tech-border border border-tech-border text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5 text-tech-accent" />
                <span>Back to Editor</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-lg bg-tech-accent text-tech-bg text-xs font-mono font-bold hover:bg-tech-accent/90 transition-all flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Printable Invoice Container (Pure White High-Resolution Card) */}
          <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-slate-200 font-sans print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
            {/* Header with Custom Admin Branding */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  {adminInfo.businessName || 'SenAZ 3D PRINTS'}
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-0.5 font-semibold">
                  {adminInfo.tagline || 'Custom 3D Printing & Rapid Prototyping Studio'}
                </p>
                <div className="mt-2 text-xs text-slate-600 space-y-0.5 font-mono">
                  {(adminInfo.businessAddress || adminInfo.businessCityStatePin) && (
                    <p>📍 {adminInfo.businessAddress ? `${adminInfo.businessAddress}, ` : ''}{adminInfo.businessCityStatePin}</p>
                  )}
                  {(adminInfo.businessPhone || adminInfo.businessWebsite || adminInfo.businessEmail) && (
                    <p>
                      {adminInfo.businessPhone ? `📞 ${adminInfo.businessPhone} | ` : ''}
                      {adminInfo.businessEmail ? `✉️ ${adminInfo.businessEmail} | ` : ''}
                      🌐 {adminInfo.businessWebsite || 'senaz3dprints.in'}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white font-mono font-bold text-xs rounded">
                  {docTitleMap[docType]}
                </span>
                <p className="text-xs font-mono text-slate-500 pt-1">
                  <strong>Receipt Ref No:</strong> <span className="text-slate-900 font-bold">{receiptNumber}</span>
                </p>
                <p className="text-xs font-mono text-slate-500">
                  <strong>Date:</strong> {issueDate}
                </p>
              </div>
            </div>

            {/* Customer & Delivery Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
              <div>
                <span className="font-mono text-slate-400 uppercase tracking-wider font-bold block mb-1">
                  Customer & Delivery Details:
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{customerName || 'Valued Customer'}</h3>
                {address && <p className="text-slate-700 mt-0.5">{address}</p>}
                {(city || state || pincode) && (
                  <p className="text-slate-600">
                    {[city, state].filter(Boolean).join(', ')}{pincode ? ` - ${pincode}` : ''}
                  </p>
                )}
                <p className="text-slate-600 mt-1 font-mono">
                  <strong>WhatsApp / Phone:</strong> {whatsapp || 'N/A'}
                </p>
                {email && <p className="text-slate-600 font-mono"><strong>Email:</strong> {email}</p>}
              </div>

              <div className="sm:text-right space-y-1 font-mono">
                <span className="text-slate-400 uppercase tracking-wider font-bold block mb-1">
                  Order & Production Specs:
                </span>
                <p className="text-slate-700">
                  <strong>Payment Status:</strong>{' '}
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

            {/* Line Items Table */}
            <div className="py-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-900 font-mono uppercase">
                    <th className="py-2.5 font-bold w-8">#</th>
                    <th className="py-2.5 font-bold">Item Description</th>
                    <th className="py-2.5 font-bold">3D Specifications / Notes</th>
                    <th className="py-2.5 text-center font-bold w-14">Qty</th>
                    <th className="py-2.5 text-right font-bold w-24">Unit Price</th>
                    <th className="py-2.5 text-right font-bold w-24">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((it, idx) => (
                    <tr key={idx} className="py-2">
                      <td className="py-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                      <td className="py-3">
                        <span className="font-bold text-slate-900 block">{it.name || '3D Printed Item'}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-900">
              <div className="space-y-2 text-xs font-mono">
                <span className="font-bold text-slate-900 block">Payment Information:</span>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-[11px]">
                  {adminInfo.businessUpiId ? (
                    <>
                      <p><strong>UPI ID:</strong> <span className="font-bold text-cyan-700">{adminInfo.businessUpiId}</span></p>
                      {adminInfo.businessUpiName && <p><strong>Beneficiary:</strong> {adminInfo.businessUpiName}</p>}
                    </>
                  ) : (
                    <p className="text-slate-700"><strong>Accepted Mode:</strong> {paymentMode || 'UPI / Net Banking / Cash'}</p>
                  )}
                  <p className="text-slate-500 pt-1">
                    Please share payment screenshot on WhatsApp for instant order confirmation.
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
                    <span>Discount:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Delivery / Shipping:</span>
                  <span className="font-bold text-slate-900">
                    {shippingFee > 0 ? `₹${shippingFee}` : 'FREE'}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                  <span>Total Amount:</span>
                  <span className="text-base text-cyan-700">₹{grandTotal}</span>
                </div>

                {advancePaid > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Advance Received:</span>
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
              <p>Thank you for choosing {adminInfo.businessName || 'SenAZ 3D PRINTS'}. All custom prints are inspected for dimensional accuracy and structural integrity.</p>
              <p>© {new Date().getFullYear()} {adminInfo.businessName || 'SenAZ 3D PRINTS'} • {adminInfo.businessWebsite || 'senaz3dprints.in'}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SAVED RECEIPTS & QUOTES DATABASE */}
      {/* ========================================================================= */}
      {activeTab === 'history' && (
        <div className="print:hidden space-y-4">
          <div className="p-4 rounded-2xl bg-tech-card border border-tech-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={savedSearch}
                onChange={(e) => setSavedSearch(e.target.value)}
                placeholder="Search by customer name, ref no, phone..."
                className="w-full bg-tech-bg border border-tech-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
              />
            </div>

            <button
              onClick={handleCreateNew}
              className="px-4 py-2 rounded-xl bg-tech-accent text-tech-bg font-bold text-xs font-mono flex items-center gap-1.5 hover:bg-tech-accent/90 transition-all shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Receipt</span>
            </button>
          </div>

          {loadingReceipts ? (
            <div className="p-12 text-center text-xs font-mono text-slate-400 bg-tech-card rounded-2xl border border-tech-border">
              Loading saved receipts...
            </div>
          ) : filteredSaved.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-slate-400 bg-tech-card rounded-2xl border border-tech-border space-y-3">
              <p>No saved receipts found.</p>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 rounded-xl bg-tech-bg hover:bg-tech-border border border-tech-border text-tech-accent font-semibold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Your First Receipt</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-tech-border bg-tech-card">
              <table className="w-full text-left text-xs font-mono text-slate-300">
                <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
                  <tr>
                    <th className="p-3.5">Ref No. & Type</th>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Phone / WhatsApp</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Total</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-tech-border">
                  {filteredSaved.map((rec) => (
                    <tr key={rec.id} className="hover:bg-tech-bg/50 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-white block">{rec.receiptNumber}</span>
                        <span className="text-[10px] text-tech-accent">{rec.docType}</span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-100">
                        {rec.customerName}
                      </td>
                      <td className="p-3.5 text-slate-400">
                        {rec.whatsapp || 'N/A'}
                      </td>
                      <td className="p-3.5 text-slate-400">
                        {rec.issueDate}
                      </td>
                      <td className="p-3.5 text-right font-bold text-white">
                        ₹{rec.grandTotal}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          {(rec.paymentStatus || 'PAID').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              handleLoadSavedReceipt(rec);
                              setActiveTab('preview');
                            }}
                            className="p-1.5 rounded-lg bg-tech-bg hover:bg-tech-border text-slate-300 hover:text-white transition-colors"
                            title="Preview & Print"
                          >
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          </button>

                          <button
                            onClick={() => handleLoadSavedReceipt(rec)}
                            className="p-1.5 rounded-lg bg-tech-bg hover:bg-tech-border text-slate-300 hover:text-white transition-colors"
                            title="Edit receipt"
                          >
                            <Edit className="w-3.5 h-3.5 text-tech-accent" />
                          </button>

                          <button
                            onClick={() => handleDuplicateReceipt(rec)}
                            className="p-1.5 rounded-lg bg-tech-bg hover:bg-tech-border text-slate-300 hover:text-white transition-colors"
                            title="Duplicate receipt"
                          >
                            <Copy className="w-3.5 h-3.5 text-amber-400" />
                          </button>

                          <button
                            onClick={() => handleDeleteReceipt(rec.id, rec.receiptNumber)}
                            className="p-1.5 rounded-lg bg-tech-bg hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete receipt"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
