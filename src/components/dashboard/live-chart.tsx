"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generateSeries } from "@/lib/mock-data";

type Variant = "area" | "line";

interface LiveChartProps {
  variant?: Variant;
  color?: string;
  base?: number;
  variance?: number;
  spikeAt?: number;
  spikeMag?: number;
  trend?: number;
  height?: number;
  unit?: string;
  liveInterval?: number;
  seed?: number;
}

export function LiveChart({
  variant = "area",
  color = "hsl(var(--neon-violet))",
  base = 60,
  variance = 10,
  spikeAt,
  spikeMag,
  trend = 0,
  height = 200,
  unit = "",
  liveInterval = 3500,
  seed = 7,
}: LiveChartProps) {
  const [data, setData] = React.useState(() =>
    generateSeries({ points: 60, base, variance, spikeAt, spikeMag, trend, seed })
  );

  React.useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(0, last.v + (Math.random() - 0.5) * variance * 1.4);
        return [...prev.slice(1), { t: last.t + 1, v: Math.round(next * 10) / 10 }];
      });
    }, liveInterval);
    return () => clearInterval(id);
  }, [liveInterval, variance]);

  const gradId = React.useId();

  return (
    <ResponsiveContainer width="100%" height={height}>
      {variant === "area" ? (
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" opacity={0.4} vertical={false} />
          <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gradId})`} />
        </AreaChart>
      ) : (
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="2 4" opacity={0.4} vertical={false} />
          <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: color, strokeOpacity: 0.3 }} />
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}

function ChartTooltip({ active, payload, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border/60 bg-popover/95 px-2.5 py-1.5 text-xs shadow-xl backdrop-blur">
      <div className="font-mono text-foreground">
        {payload[0].value}
        {unit}
      </div>
    </div>
  );
}
