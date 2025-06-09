import { NextRequest, NextResponse } from 'next/server';
import app from '@/lib/firebase/init';
import {
  collection,
  getDocs,
  addDoc,
  getFirestore,
  where,
  query,
} from 'firebase/firestore';
const firestore = getFirestore(app);
import path from "path";
import fs from "fs";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ coll: string }> },
) {
  const collectionName = (await params).coll;
  const { searchParams } = new URL(request.url);

  if (!collectionName || typeof collectionName !== 'string') {
    return NextResponse.json({ status: 400, error: 'Invalid collection name' });
  }
  const collectionRef = collection(firestore, collectionName);

  try {
    const whereConditions = [];

    for (const [key, value] of searchParams.entries()) {
      if (key && value) {
        whereConditions.push(where(key, '==', value));
      }
    }
    const q = whereConditions.length
      ? query(collectionRef, ...whereConditions)
      : collectionRef;
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ status: 200, data: items });
  } catch (error) {
    console.error('Firestore GET Error:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
// const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");
// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ coll: string }> },
// ) {
//   const collectionName = (await params).coll;

//   if (!collectionName || typeof collectionName !== 'string') {
//     return NextResponse.json({ status: 400, error: 'Invalid collection name' });
//   }
//   if (collectionName == 'upload') {
//     const formData = await req.formData();
//     const body = Object.fromEntries(formData);
//     const file = (body.file as Blob) || null;

//     if (file) {
//       const buffer = Buffer.from(await file.arrayBuffer());
//       if (!fs.existsSync(UPLOAD_DIR)) {
//         fs.mkdirSync(UPLOAD_DIR);
//       }

//       fs.writeFileSync(
//         path.resolve(UPLOAD_DIR, (body.file as File).name),
//         buffer
//       );
//     } else {
//       return NextResponse.json({
//         success: false,
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       name: (body.file as File).name,
//     });
//   }


//   const collectionRef = collection(firestore, collectionName);
//   try {
//     const data = await req.json();
//     if (!data || typeof data !== 'object') {
//       return NextResponse.json({ status: 400, error: 'Invalid data' });
//     }
//     const docRef = await addDoc(collectionRef, data);
//     return NextResponse.json({
//       status: 20,
//       data: { id: docRef.id, ...data },
//     });
//   } catch (error) {
//     console.error('Firestore POST Error:', error);
//     return NextResponse.json({ status: 500, error: 'Internal Server Error' });
//   }
// }
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const UPLOAD_DIR = './public/uploads'; // Sesuaikan jika perlu

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ coll: string }> },
) {
  const collectionName = (await params).coll;

  if (!collectionName || typeof collectionName !== 'string') {
    return NextResponse.json({ status: 400, error: 'Invalid collection name' });
  }

  // 1. Jika koleksi 'upload', tangani file
  if (collectionName === 'upload') {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const file = (body.file as Blob) || null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      fs.writeFileSync(
        path.resolve(UPLOAD_DIR, (body.file as File).name),
        buffer
      );

      return NextResponse.json({
        success: true,
        name: (body.file as File).name,
      });
    } else {
      return NextResponse.json({ success: false });
    }
  }

  // 2. Jika koleksi 'login', proses autentikasi
  if (collectionName === 'login') {
    try {
      const { email, password } = await req.json();

      if (!email || !password) {
        return NextResponse.json({ status: 400, error: 'Email dan password wajib diisi' });
      }

      const usersRef = collection(firestore, 'users'); // bisa sesuaikan jika usernya dari 'login'
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return NextResponse.json({ status: 401, error: 'Email tidak ditemukan' });
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const isMatch = await bcrypt.compare(password, userData.password);

      if (!isMatch) {
        return NextResponse.json({ status: 401, error: 'Password salah' });
      }

      const token = jwt.sign(
        { uid: userDoc.id, email: userData.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      const cookieStore = await cookies();
      cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24, // 1 jam
        path: '/',
        sameSite: 'lax',
      });
      return NextResponse.json({ status: 200, token });
    } catch (err) {
      console.error('Login error:', err);
      return NextResponse.json({ status: 500, error: 'Terjadi kesalahan server' });
    }
  }

  // 3. Default: Tambahkan dokumen ke koleksi lain
  const collectionRef = collection(firestore, collectionName);
  try {
    const data = await req.json();
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ status: 400, error: 'Invalid data' });
    }
    const docRef = await addDoc(collectionRef, data);
    return NextResponse.json({
      status: 200,
      data: { id: docRef.id, ...data },
    });
  } catch (error) {
    console.error('Firestore POST Error:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}