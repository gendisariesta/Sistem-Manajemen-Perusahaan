// lib/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import app from '@/lib/firebase/init';
const firestore = getFirestore(app);

const JWT_SECRET =  process.env.JWT_SECRET || 'default_secret';

export async function getUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { uid: string; email: string };
    const userRef = doc(firestore, 'users', decoded.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;
    return { uid: decoded.uid, ...userSnap.data() };
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
