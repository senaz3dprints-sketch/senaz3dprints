import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createAdminToken, setAdminCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    const token = await createAdminToken(authUsername);
    setAdminCookie(token);

    return NextResponse.json({ success: true, username: authUsername });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Server authentication error.' }, { status: 500 });
  }
}
