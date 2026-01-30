import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { Metric } from '@/lib/api';
import { format } from 'date-fns';

interface MetricsChartProps {
  metrics: Metric[];
  type?: 'line' | 'area';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 border border-border/50 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono font-medium text-foreground">
              {entry.value?.toFixed(2)}
              {entry.name.includes('CPU') || entry.name.includes('Memory') ? '%' : ''}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const MetricsChart: React.FC<MetricsChartProps> = ({ metrics, type = 'area' }) => {
  const chartData = metrics.map((metric) => ({
    time: format(new Date(metric.timestamp), 'HH:mm'),
    fullTime: format(new Date(metric.timestamp), 'MMM d, HH:mm:ss'),
    cpu: metric.cpu_utilization,
    memory: metric.memory_usage,
    networkIn: metric.network_in ? metric.network_in / 1024 / 1024 : null, // Convert to MB
    networkOut: metric.network_out ? metric.network_out / 1024 / 1024 : null,
  })).reverse();

  if (chartData.length === 0) {
    return (
      <div className="chart-container h-80 flex items-center justify-center">
        <p className="text-muted-foreground">No metrics data available</p>
      </div>
    );
  }

  const Chart = type === 'area' ? AreaChart : LineChart;

  return (
    <div className="chart-container h-80">
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(183, 74%, 44%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(183, 74%, 44%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(158, 64%, 42%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
          <XAxis
            dataKey="time"
            stroke="hsl(215, 20%, 55%)"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="hsl(215, 20%, 55%)"
            fontSize={12}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          {type === 'area' ? (
            <>
              <Area
                type="monotone"
                dataKey="cpu"
                name="CPU %"
                stroke="hsl(183, 74%, 44%)"
                strokeWidth={2}
                fill="url(#cpuGradient)"
              />
              <Area
                type="monotone"
                dataKey="memory"
                name="Memory %"
                stroke="hsl(158, 64%, 42%)"
                strokeWidth={2}
                fill="url(#memoryGradient)"
              />
            </>
          ) : (
            <>
              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU %"
                stroke="hsl(183, 74%, 44%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="memory"
                name="Memory %"
                stroke="hsl(158, 64%, 42%)"
                strokeWidth={2}
                dot={false}
              />
            </>
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
};
