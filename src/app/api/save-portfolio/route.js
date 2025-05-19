// app/api/save-portfolio/route.js
import { getFirestore } from 'firebase-admin/firestore';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';

initializeFirebaseAdmin();

export const runtime = 'nodejs';
export async function POST(request) {
  const { userId, portfolioData } = await request.json();
  
  try {
    const db = getFirestore();
    await db.collection('portfolios').doc(userId).set(portfolioData);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}