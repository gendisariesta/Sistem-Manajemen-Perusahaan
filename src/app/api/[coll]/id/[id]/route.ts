// app/api/[coll]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import app from '@/lib/firebase/init';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getFirestore,
} from 'firebase/firestore';

const firestore = getFirestore(app);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ coll: string; id: string }> }
) {
  const { coll: collectionName, id } = await params;

  if (!collectionName || typeof collectionName !== 'string') {
    return NextResponse.json({ error: 'Invalid collection name' }, { status: 400 });
  }

  const docRef = doc(firestore, collectionName, id);

  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ id: snapshot.id, ...snapshot.data() }, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ coll: string; id: string }> }
) {
  const { coll: collectionName, id } = await params;

  if (!collectionName || typeof collectionName !== 'string') {
    return NextResponse.json({ error: 'Invalid collection name' }, { status: 400 });
  }

  const docRef = doc(firestore, collectionName, id);

  try {
    const data = await request.json();

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await updateDoc(docRef, data);
    const updatedDoc = await getDoc(docRef);

    return NextResponse.json({ id: updatedDoc.id, ...updatedDoc.data() }, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ coll: string; id: string }> }
) {
  const { coll: collectionName, id } = await params;
  if (!collectionName || typeof collectionName !== 'string') {
    return NextResponse.json({ error: 'Invalid collection name' }, { status: 400 });
  }

  const docRef = doc(firestore, collectionName, id);

  try {
    await deleteDoc(docRef);
    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
