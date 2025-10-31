import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from './lib/prisma';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const count = await prisma.tournament.count();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Database connection successful',
      tournamentCount: count,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Database connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
}

