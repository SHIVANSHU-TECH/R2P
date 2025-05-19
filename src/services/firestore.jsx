// services/firestore.js
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const savePortfolio = async (userId, data) => {
  await setDoc(doc(db, 'portfolios', userId), data);
};

export const getPortfolio = async (userId) => {
  const docRef = doc(db, 'portfolios', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const parseResume = async (file) => {
  const response = await fetch('/api/parse-resume', {
    method: 'POST',
    body: file
  });
  return response.json();
};