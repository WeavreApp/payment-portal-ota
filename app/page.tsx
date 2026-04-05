'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CreditCard, ShieldCheck, ChartBar as BarChart3, ArrowRight, Users, Lock } from 'lucide-react';
import { SCHOOL_NAME, SCHOOL_TAGLINE, SCHOOL_LOGO } from '@/lib/constants';

const features = [
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'Parents can submit fee payments online with proof of transfer for quick verification.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: ShieldCheck,
    title: 'Fraud Protection',
    description: 'Automated checks detect duplicate references, duplicate receipts, and suspicious amounts.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Track collections, outstanding balances, and payment trends through visual dashboards.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Users,
    title: 'Student Management',
    description: 'Maintain a complete record of students, their fees, and payment progression.',
    color: 'bg-teal-50 text-teal-600',
  },
];

export default function HomePage() {
  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src={SCHOOL_LOGO}
              alt={SCHOOL_NAME}
              width={36}
              height={36}
              className="rounded-lg object-cover"
            />
            <span className="font-bold text-foreground">{SCHOOL_NAME}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/admin" className="gap-2">
                <Lock className="h-4 w-4" />
                Staff Login
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="sm:hidden px-2">
              <Link href="/admin"><Lock className="h-4 w-4" /></Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/pay">Pay Now</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image
              src={SCHOOL_LOGO}
              alt={SCHOOL_NAME}
              width={80}
              height={80}
              className="rounded-2xl object-cover"
            />
          </div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <ShieldCheck className="h-4 w-4" />
            Secure & Transparent
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
            {SCHOOL_NAME}{' '}
            <span className="text-primary">Payment Portal</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-5 leading-relaxed">
            {SCHOOL_TAGLINE}. A modern, secure platform for managing student fee payments
            with real-time tracking, automated verification, and comprehensive analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/pay">
                Make a Payment <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8" asChild>
              <Link href="/admin">Staff Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100"
            >
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${f.color} mb-4`}
              >
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Ready to make a payment?
            </h2>
            <p className="text-muted-foreground mt-3">
              Submit your school fee payment in minutes. Our secure portal ensures
              your payment is tracked and verified.
            </p>
            <Button size="lg" className="mt-6 gap-2 px-8" asChild>
              <Link href="/pay">
                Go to Payment Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={SCHOOL_LOGO}
              alt={SCHOOL_NAME}
              width={24}
              height={24}
              className="rounded object-cover"
            />
            <span className="text-sm font-medium">{SCHOOL_NAME}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Secure payment management system
          </p>
        </div>
      </footer>
    </div>
  );
}
