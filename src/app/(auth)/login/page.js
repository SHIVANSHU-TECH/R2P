// app/(auth)/login/page.js
'use client';
import { redirect } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/authmodal';

export default function LoginPage() {
  const { user } = useAuth();
  if (user) redirect('/dashboard');
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthModal />
    </div>
  );
}