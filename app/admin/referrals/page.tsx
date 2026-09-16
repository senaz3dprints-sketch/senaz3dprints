import React from 'react';
import { db } from '@/lib/db';
import { Share2, Users, IndianRupee } from 'lucide-react';

export const revalidate = 0;

export default async function AdminReferralsPage() {
  const referrals = await db.referral.findMany({
    orderBy: { totalReferrals: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-tech-border pb-4">
        <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
          Referral System Records
        </h1>
        <p className="text-xs text-slate-400 font-mono">
          Track referrer performance, unique codes (`?ref=CODE`), and order volume
        </p>
      </div>

      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5">Referral Code</th>
                <th className="p-3.5">Referrer Name</th>
                <th className="p-3.5">Contact</th>
                <th className="p-3.5">Successful Referrals</th>
                <th className="p-3.5">Total Generated Value</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {referrals.map((r) => (
                <tr key={r.id} className="hover:bg-tech-bg/50">
                  <td className="p-3.5 font-bold text-tech-accent tracking-wider">{r.referralCode}</td>
                  <td className="p-3.5 font-bold text-white">{r.referrerName}</td>
                  <td className="p-3.5">{r.referrerContact || 'N/A'}</td>
                  <td className="p-3.5 font-bold text-white">{r.totalReferrals}</td>
                  <td className="p-3.5 font-bold text-emerald-400">₹{r.totalOrderValue}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                      {r.status}
                    </span>
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
