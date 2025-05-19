// Signup.jsx
"use client" 
import AuthForm from "../../components/auth/Authform";
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  return <AuthForm isLogin={false} onSuccess={() => router.push("/dashboard")} />;
}
