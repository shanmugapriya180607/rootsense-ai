import { NextResponse } from "next/server";
import { generateSeries, services } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const seed = Math.floor(Date.now() / 5000);
  return NextResponse.json({
    services,
    cpu: generateSeries({ points: 60, base: 62, variance: 14, spikeAt: 42, spikeMag: 28, seed }),
    memory: generateSeries({ points: 60, base: 58, variance: 6, trend: 0.18, seed: seed + 1 }),
    latency: generateSeries({ points: 60, base: 240, variance: 60, spikeAt: 38, spikeMag: 340, seed: seed + 2 }),
    errorRate: generateSeries({ points: 60, base: 0.6, variance: 0.4, spikeAt: 45, spikeMag: 6.5, seed: seed + 3 }),
    rps: generateSeries({ points: 60, base: 8400, variance: 600, seed: seed + 4 }),
  });
}
