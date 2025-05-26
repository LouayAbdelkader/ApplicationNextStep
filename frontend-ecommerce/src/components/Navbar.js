// src/components/Navbar.js
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <h1 className="text-2xl font-bold">E-Commerce</h1>
      <div className="flex space-x-4">
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
