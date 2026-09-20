import type { Metadata } from 'next';
import React from 'react';
import AdminLayoutClient from '@/components/AdminLayoutClient';

export const metadata: Metadata = {
  title: 'Admin Console | SenAZ 3D PRINTS',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
