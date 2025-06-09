"use client";
import React, { useState } from 'react';
import ComponentCard from '../ComponentCard';
import Label from '../form/Label';
import Input from '../form/InputField';
import Select from '../form/Select';
import { useRouter } from 'next/router';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import app from '@/lib/firebase/init'
const firestore = getFirestore(app);
// import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '../../../icons';
// import DatePicker from '@/components/form/date-picker';

export default function DefaultInputs() {
  
  const router = useRouter();
  const [task, setTask] = useState({
    name: ""    
  });

  const onChange = (e: any) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };


  const handleCreate = async () => {
    const col = collection(firestore, "divisi");
    try {
      addDoc(col, {
        nama: task.name,
        jumlah:0,
      });
      router.push("/");
    } catch (error) { }
  };
  return (
    <ComponentCard title="Form Input Divisi">
      <div className="space-y-6">
        <div>
          <Label>Nama Divisi</Label>
          <Input type="text"
            name="name"
            value={task?.name}
            onChange={onChange} />
        </div>
      </div>
    </ComponentCard>
  );
}
