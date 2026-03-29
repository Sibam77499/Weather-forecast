import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { HourlyData, TemperatureUnit } from '@/types/weather';
import { celsiusToFahrenheit } from '@/lib/weather-utils';

interface TemperatureChartProps {
  data: HourlyData;
  unit: TemperatureUnit;
}

export default function TemperatureChart({ data, unit }: TemperatureChartProps) {
  const now = new Date();
  const currentHour = now.getHours();
  const startIndex = data.time.findIndex(t => new Date(t).getHours() === currentHour && new Date(t).getDate() === now.getDate());
  const start = startIndex >= 0 ? startIndex : 0;

  const chartData = data.time.slice(start, start + 24).map((time, i) => {
    const idx = start + i;
    const temp = unit === 'fahrenheit' ? celsiusToFahrenheit(data.temperature[idx]) : Math.round(data.temperature[idx]);
    const hour = new Date(time);
    return {
      name: i === 0 ? 'Now' : hour.toLocaleTimeString([], { hour: '2-digit', hour12: true }),
      temp,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
    >
      <h3 className="weather-text font-semibold text-lg mb-3">Temperature Trend</h3>
      <div className="glass-card p-4">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(0,0,0,0.7)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
              }}
              formatter={(value: number) => [`${value}°`, 'Temp']}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
