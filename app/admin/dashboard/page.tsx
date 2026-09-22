import React from 'react';
import { db } from '@/lib/db';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  IndianRupee,
  UploadCloud,
  Package,
  AlertTriangle,
  Tag,
  ArrowRight,
  MessageCircle,
  FolderTree,
  Receipt,
  Plus,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const totalOrders = await db.order.count();
  const pendingOrders = await db.order.count({ where: { status: 'PENDING' } });
  const completedOrders = await db.order.count({ where: { status: 'DELIVERED' } });

  const allOrders = await db.order.findMany({ select: { totalAmount: true } });
  const storeRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const totalCustomRequests = await db.customRequest.count();
  const pendingCustomRequests = await db.customRequest.count({ where: { status: 'PENDING' } });
  const allCustomRequests = await db.customRequest.findMany({
    where: { status: { not: 'REJECTED' } },
    select: { quotedAmount: true, status: true },
  });
  const customRevenue = allCustomRequests.reduce((sum, r) => sum + (r.quotedAmount || 0), 0);

  const totalRevenue = storeRevenue + customRevenue;

  const activeProducts = await db.product.count({ where: { isPublished: true } });
  const totalCategories = await db.category.count();
  const lowStockProducts = await db.product.count({ where: { stockQuantity: { lte: 5 } } });

  const totalCouponUsage = await db.coupon.aggregate({ _sum: { timesUsed: true } });

  const totalReferralPartners = await db.referral.count({ where: { status: 'ACTIVE' } });
  const referralOrdersCount = await db.order.count({ where: { referralCode: { not: null } } });

  const recentOrders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const recentCustomRequests = await db.customRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
          Business Overview & Analytics
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          SenAZ 3D PRINTS Operational Metrics & Combined Financials
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Combined Revenue */}
        <div className="bg-tech-card p-5 rounded-2xl border border-tech-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Total Gross Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            ₹{storeRevenue.toLocaleString('en-IN')} Store + ₹{customRevenue.toLocaleString('en-IN')} Custom
          </p>
        </div>

        {/* Custom 3D Printing Revenue */}
        <Link
          href="/admin/custom-requests"
          className="bg-tech-card p-5 rounded-2xl border border-tech-border hover:border-tech-accent transition-all space-y-2 group block"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-sky-400 transition-colors">
            <span className="text-xs font-mono">Custom 3D Orders</span>
            <UploadCloud className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">
            ₹{customRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            {totalCustomRequests} requests ({pendingCustomRequests} new) →
          </p>
        </Link>

        {/* Total Store Orders */}
        <Link
          href="/admin/orders"
          className="bg-tech-card p-5 rounded-2xl border border-tech-border hover:border-tech-accent transition-all space-y-2 group block"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-tech-accent transition-colors">
            <span className="text-xs font-mono">Store Catalog Orders</span>
            <ShoppingBag className="w-4 h-4 text-tech-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalOrders} <span className="text-xs text-amber-400 font-normal">({pendingOrders} pending)</span>
          </div>
          <p className="text-[11px] font-mono text-slate-400">
            ₹{storeRevenue.toLocaleString('en-IN')} store sales →
          </p>
        </Link>

        {/* Pending Action Required */}
        <div className="bg-tech-card p-5 rounded-2xl border border-tech-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Pending Actions</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {pendingOrders + pendingCustomRequests}
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            {pendingOrders} store orders, {pendingCustomRequests} custom quotes
          </p>
        </div>

        {/* Active Products */}
        <div className="bg-tech-card p-5 rounded-2xl border border-tech-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Active Products</span>
            <Package className="w-4 h-4 text-tech-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{activeProducts}</div>
          <p className="text-[11px] font-mono text-slate-500">Live in public store catalog</p>
        </div>

        {/* Referral Partner Network */}
        <Link
          href="/admin/referrals"
          className="bg-tech-card p-5 rounded-2xl border border-tech-border hover:border-tech-accent transition-all space-y-2 group block"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-tech-accent transition-colors">
            <span className="text-xs font-mono">Referral Network</span>
            <Tag className="w-4 h-4 text-tech-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-tech-accent">
            {referralOrdersCount} <span className="text-xs text-slate-400">orders</span>
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            {totalReferralPartners} active referral partners →
          </p>
        </Link>

        {/* Coupon Usage */}
        <div className="bg-tech-card p-5 rounded-2xl border border-tech-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Coupon Redemptions</span>
            <Tag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {totalCouponUsage._sum.timesUsed || 0}
          </div>
          <p className="text-[11px] font-mono text-slate-500">Total discount applications</p>
        </div>

        {/* Active Categories */}
        <Link
          href="/admin/categories"
          className="bg-tech-card p-5 rounded-2xl border border-tech-border hover:border-tech-accent transition-all space-y-2 group block"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-tech-accent transition-colors">
            <span className="text-xs font-mono">Catalog Categories</span>
            <FolderTree className="w-4 h-4 text-tech-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalCategories}</div>
          <p className="text-[11px] font-mono text-slate-500">Classifications & filters →</p>
        </Link>

        {/* Generate Receipts / Quotes */}
        <Link
          href="/admin/receipts"
          className="bg-tech-card p-5 rounded-2xl border border-tech-border hover:border-tech-accent transition-all space-y-2 group block"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-tech-accent transition-colors">
            <span className="text-xs font-mono">Receipts & Quotes</span>
            <Receipt className="w-4 h-4 text-tech-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-tech-accent">Create</div>
          <p className="text-[11px] font-mono text-slate-500">Custom prices & invoices →</p>
        </Link>

        {/* Completed Orders */}
        <div className="bg-tech-card p-5 rounded-2xl border border-tech-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Dispatched Orders</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{completedOrders}</div>
          <p className="text-[11px] font-mono text-slate-500">Delivered to customers</p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-tech-card rounded-2xl border border-tech-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-xs font-mono text-tech-accent hover:text-white flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">WhatsApp</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500 font-mono">
                    No store orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-tech-bg/50">
                    <td className="p-3 font-bold text-white">{ord.id}</td>
                    <td className="p-3">{ord.customerName}</td>
                    <td className="p-3">{ord.whatsapp}</td>
                    <td className="p-3 font-bold text-tech-accent">₹{ord.totalAmount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <a
                        href={`https://wa.me/${ord.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-black" />
                        <span>Chat</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Custom 3D Requests */}
      <div className="bg-tech-card rounded-2xl border border-tech-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-sky-400" />
            <span>Recent Custom 3D Printing Requests</span>
          </h3>
          <Link
            href="/admin/custom-requests"
            className="text-xs font-mono text-sky-400 hover:text-white flex items-center gap-1"
          >
            <span>View All Custom Requests</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3">Request ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Product Type</th>
                <th className="p-3">Quoted Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {recentCustomRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-500 font-mono">
                    No custom requests yet.
                  </td>
                </tr>
              ) : (
                recentCustomRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-tech-bg/50">
                    <td className="p-3 font-bold text-white">{req.id}</td>
                    <td className="p-3">{req.customerName}</td>
                    <td className="p-3 text-tech-accent font-semibold">{req.productType}</td>
                    <td className="p-3 font-bold text-emerald-400">
                      {req.quotedAmount && Number(req.quotedAmount) > 0 ? `₹${req.quotedAmount}` : 'Unquoted'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400'
                            : req.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-sky-500/20 text-sky-400'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <Link
                        href="/admin/receipts"
                        className="px-2 py-1 rounded bg-tech-bg border border-tech-border text-[11px] text-slate-300 hover:text-white hover:border-tech-accent"
                      >
                        Quote / Receipt
                      </Link>
                      <a
                        href={`https://wa.me/${req.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
