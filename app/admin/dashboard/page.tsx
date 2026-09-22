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
  const storeOrdersRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const allCustomRequests = await db.customRequest.findMany({ select: { quotedPrice: true } });
  const customRequestsRevenue = allCustomRequests.reduce((sum, r) => sum + (r.quotedPrice || 0), 0);

  const totalCombinedRevenue = storeOrdersRevenue + customRequestsRevenue;

  const totalCustomRequests = await db.customRequest.count();
  const pendingCustomRequests = await db.customRequest.count({ where: { status: 'PENDING' } });

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
          Business Overview & Analytics
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          SenAZ 3D PRINTS Operational Metrics
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-tech-card p-5 rounded-2xl border border-tech-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-tech-accent" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalOrders}</div>
          <p className="text-[11px] font-mono text-slate-500">Recorded order submissions</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-tech-card p-5 rounded-2xl border border-tech-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Pending Orders</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">{pendingOrders}</div>
          <p className="text-[11px] font-mono text-slate-500">Awaiting WhatsApp confirmation</p>
        </div>

        {/* Total Combined Revenue */}
        <div className="bg-tech-card p-5 rounded-2xl border border-tech-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Total Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ₹{totalCombinedRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-[10px] font-mono text-slate-400 truncate">
            Store: ₹{storeOrdersRevenue.toLocaleString('en-IN')} • Custom: ₹{customRequestsRevenue.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Custom Requests */}
        <div className="bg-tech-card p-5 rounded-2xl border border-tech-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono">Custom 3D Requests</span>
            <UploadCloud className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">
            {totalCustomRequests} <span className="text-xs text-slate-400">({pendingCustomRequests} new)</span>
          </div>
          <p className="text-[11px] font-mono text-slate-500">Uploaded STL models & quotes</p>
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
              {recentOrders.map((ord) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
