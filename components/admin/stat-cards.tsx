'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, DollarSign, CircleAlert as AlertCircle, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface StatCardsProps {
  totalStudents: number;
  totalCollected: number;
  totalOutstanding: number;
  pendingReviews: number;
}

const cards = [
  {
    key: 'students',
    label: 'Total Students',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'collected',
    label: 'Total Collected',
    icon: DollarSign,
    color: 'bg-green-50 text-green-600',
    format: (v: number) => formatCurrency(v),
  },
  {
    key: 'outstanding',
    label: 'Outstanding Balance',
    icon: AlertCircle,
    color: 'bg-red-50 text-red-600',
    format: (v: number) => formatCurrency(v),
  },
  {
    key: 'pending',
    label: 'Pending Reviews',
    icon: Clock,
    color: 'bg-amber-50 text-amber-600',
    format: (v: number) => v.toLocaleString(),
  },
] as const;

export function StatCards({ totalStudents, totalCollected, totalOutstanding, pendingReviews }: StatCardsProps) {
  const values = {
    students: totalStudents,
    collected: totalCollected,
    outstanding: totalOutstanding,
    pending: pendingReviews,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.key} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {card.format(values[card.key])}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
