'use client';

import { CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle, Circle as XCircle, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'destructive' | 'pending' | 'flagged';
  label: string;
  className?: string;
}

const config = {
  success: {
    icon: CheckCircle2,
    classes: 'bg-green-50 text-green-700 border-green-200',
  },
  warning: {
    icon: Clock,
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  destructive: {
    icon: XCircle,
    classes: 'bg-red-50 text-red-700 border-red-200',
  },
  pending: {
    icon: Clock,
    classes: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  flagged: {
    icon: AlertTriangle,
    classes: 'bg-orange-50 text-orange-700 border-orange-200',
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { icon: Icon, classes } = config[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
        classes,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export function PaymentStatusBadge({
  totalFees,
  totalPaid,
  studentType,
  hostelFee,
}: {
  totalFees: number;
  totalPaid: number;
  studentType?: 'day' | 'boarding';
  hostelFee?: number;
}) {
  // totalFees already includes hostelFee for boarding students
  const actualTotalFees = totalFees;
  
  if (totalPaid >= actualTotalFees && actualTotalFees > 0)
    return <StatusBadge status="success" label="Fully Paid" />;
  if (totalPaid > 0) return <StatusBadge status="warning" label="Partial" />;
  return <StatusBadge status="destructive" label="Outstanding" />;
}

export function TxnStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'verified':
      return <StatusBadge status="success" label="Verified" />;
    case 'pending':
      return <StatusBadge status="pending" label="Pending" />;
    case 'flagged':
      return <StatusBadge status="flagged" label="Flagged" />;
    case 'rejected':
      return <StatusBadge status="destructive" label="Rejected" />;
    default:
      return <StatusBadge status="pending" label={status} />;
  }
}
