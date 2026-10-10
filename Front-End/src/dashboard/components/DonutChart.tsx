import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatBRL } from '../../shared/utils/formatters';

interface DonutChartProps {
  data: Array<{ name: string; value: number; color: string; percent?: number }>;
  /** Como exibir os valores (moeda por padrao; passe numero para contagens). */
  formatValue?: (value: number) => string;
  /** Rotulo pequeno sob o total no centro do anel. */
  centerLabel?: string;
}

const CustomTooltip = ({ active, payload, formatValue }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-tooltip rounded-xl px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: data.color }}
          />
          <p className="text-white/80 font-medium text-sm">{data.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-bold">{formatValue(data.value)}</span>
          {data.percent !== undefined && (
            <span className="text-white/30 text-xs font-semibold">{data.percent}%</span>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function DonutChart({ data, formatValue = formatBRL, centerLabel = 'Total' }: DonutChartProps) {
  const validData = data.filter(d => d.value > 0);

  if (validData.length === 0) {
    return (
      <div className="w-full h-full rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
        <span className="text-white/30 text-sm">Sem dados</span>
      </div>
    );
  }

  const totalValue = validData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="w-full h-full relative">
      {/* Subtle outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.03] to-transparent" />

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip formatValue={formatValue} />} cursor={{ fill: 'transparent' }} />
          <Pie
            data={validData}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="95%"
            paddingAngle={1.5}
            dataKey="value"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth={1}
            cornerRadius={3}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {validData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center total */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-1">
          <span className="text-white/80 text-2xl font-semibold tracking-tight leading-none tabular-nums">
            {formatValue(totalValue)}
          </span>
          <span className="text-white/40 text-xs">{centerLabel}</span>
        </div>
      </div>
    </div>
  );
}
