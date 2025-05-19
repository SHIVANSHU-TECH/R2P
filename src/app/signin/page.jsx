// Login.jsx
"use client" 
import AuthForm from "../../components/auth/Authform";
import { useRouter } from 'next/navigation';


export default function Login() {
  const router = useRouter();
  return <AuthForm isLogin={true} onSuccess={() => router.push("/dashboard")} />;
}
