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

    const admin = await db.adminUser.findUnique({
      where: { username: username.trim() },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 });
    }

    const token = await createAdminToken(admin.username);
    setAdminCookie(token);

    return NextResponse.json({ success: true, username: admin.username });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Server authentication error.' }, { status: 500 });
  }
}
