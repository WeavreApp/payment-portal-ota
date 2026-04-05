'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth-provider';
import { SCHOOL_NAME, SCHOOL_LOGO } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import Image from 'next/image';

const baseNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/review', label: 'Review Queue', icon: ShieldCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut, profile, isSuperAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = isSuperAdmin
    ? [...baseNavItems, { href: '/admin/staff', label: 'Staff', icon: UserCog }]
    : baseNavItems;

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r flex flex-col transition-transform duration-200',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <Image
                src={SCHOOL_LOGO}
                alt={SCHOOL_NAME}
                width={40}
                height={40}
                className="rounded-xl object-cover"
              />
              <div>
                <p className="font-bold text-sm text-foreground leading-tight">{SCHOOL_NAME}</p>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          {profile && (
            <div className="mb-3 px-3">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-sm font-medium text-foreground truncate">{profile.full_name}</p>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs flex-shrink-0',
                    isSuperAdmin
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  )}
                >
                  {isSuperAdmin ? 'Admin' : 'Viewer'}
                </Badge>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
