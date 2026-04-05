export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPaymentStatusLabel(totalFees: number, totalPaid: number): string {
  if (totalPaid >= totalFees && totalFees > 0) return 'Fully Paid';
  if (totalPaid > 0) return 'Partial';
  return 'Outstanding';
}

export function getPaymentStatusColor(totalFees: number, totalPaid: number): string {
  if (totalPaid >= totalFees && totalFees > 0) return 'success';
  if (totalPaid > 0) return 'warning';
  return 'destructive';
}
