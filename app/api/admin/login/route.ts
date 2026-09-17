import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createAdminToken, setAdminCookie } from '@/lib/auth';

// In-memory rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lockUntil?: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip';
    const now = Date.now();

    // Check if IP is currently locked out
    const attemptRecord = loginAttempts.get(ip);
    if (attemptRecord?.lockUntil && attemptRecord.lockUntil > now) {
      const remainingMinutes = Math.ceil((attemptRecord.lockUntil - now) / 60000);
      return NextResponse.json(
        { error: `Too many failed login attempts. Please try again in ${remainingMinutes} minute(s).` },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    let isValid = false;
    const authUsername = username.trim();

    // 1. Check DB adminUser
    try {
      const admin = await db.adminUser.findUnique({
        where: { username: authUsername },
      });
      if (admin) {
        isValid = await bcrypt.compare(password, admin.password);
      }
    } catch (e) {}

    // 2. Direct env fallback check
    const envPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin_senaz_pass';
    if (!isValid && (authUsername.toLowerCase() === 'admin' || authUsername.toLowerCase() === 'senaz') && password === envPassword) {
      isValid = true;
    }

    if (!isValid) {
      // Record failed attempt
      const currentAttempts = (attemptRecord?.count || 0) + 1;
      if (currentAttempts >= MAX_ATTEMPTS) {
        loginAttempts.set(ip, { count: currentAttempts, lockUntil: now + LOCKOUT_PERIOD_MS });
        return NextResponse.json(
          { error: 'Account locked due to 5 failed attempts. Please try again in 15 minutes.' },
          { status: 429 }
        );
      } else {
        loginAttempts.set(ip, { count: currentAttempts });
        const remaining = MAX_ATTEMPTS - currentAttempts;
        return NextResponse.json(
          { error: `Invalid admin credentials. ${remaining} attempt(s) remaining.` },
          { status: 401 }
        );
      }
    }

    // Reset failed attempts on successful login
    loginAttempts.delete(ip);

    const token = await createAdminToken(authUsername);
    setAdminCookie(token);

    return NextResponse.json({ success: true, username: authUsername });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Server authentication error.' }, { status: 500 });
  }
}

