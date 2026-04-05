'use client';

import { useAuth } from '@/components/auth-provider';
import { AdminSidebar } from '@/components/admin/sidebar';
import { Loader as Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push('/admin');
    }
  }, [loading, session, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex-1 bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 p-6 lg:p-8 pt-16 lg:pt-8">{children}</main>
    </div>
  );
}
