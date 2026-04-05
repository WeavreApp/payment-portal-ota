'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StatusChartProps {
  fullyPaid: number;
  partial: number;
  outstanding: number;
}

const COLORS = ['#16a34a', '#ca8a04', '#dc2626'];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border rounded-lg shadow-lg p-3">
      <p className="text-sm font-medium">{payload[0].name}</p>
      <p className="text-sm font-semibold">{payload[0].value} students</p>
    </div>
  );
}

export function StatusChart({ fullyPaid, partial, outstanding }: StatusChartProps) {
  const data = [
    { name: 'Fully Paid', value: fullyPaid },
    { name: 'Partial', value: partial },
    { name: 'Outstanding', value: outstanding },
  ];

  const total = fullyPaid + partial + outstanding;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Payment Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 flex items-center">
          <div className="w-1/2">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-3">
            {data.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
