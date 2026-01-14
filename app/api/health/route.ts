import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'unchecked',
  };

  try {
    // Dynamic import to handle case where Prisma client isn't generated yet
    const { db } = await import('@/lib/db');
    await db.$queryRaw`SELECT 1`;
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'degraded';
    console.error('Database health check failed:', error);
  }

  return NextResponse.json(health);
}
