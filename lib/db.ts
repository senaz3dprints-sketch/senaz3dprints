import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl(): string {
  // If remote database URL is configured, use it directly
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL;
  }

  // Only copy to /tmp if running in Vercel serverless environment with SQLite
  if (process.env.VERCEL) {
    try {
      const tmpDbPath = '/tmp/senaz_dev.db';
      const localDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
      const rootDbPath = path.join(process.cwd(), 'dev.db');

      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(localDbPath)) {
          fs.copyFileSync(localDbPath, tmpDbPath);
        } else if (fs.existsSync(rootDbPath)) {
          fs.copyFileSync(rootDbPath, tmpDbPath);
        }
      }

      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.warn('[DB Setup] Could not copy SQLite database to /tmp:', e);
    }
  }

  return process.env.DATABASE_URL || 'file:./dev.db';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
