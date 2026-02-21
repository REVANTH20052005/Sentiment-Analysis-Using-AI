"use client"

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts"
import {
  Sparkles,
  BrainCircuit,
  LayoutGrid,
  BarChart3,
  FolderOpen,
  Music,
} from "lucide-react"

const miniChartData = [
  { v: 30 },
  { v: 45 },
  { v: 35 },
  { v: 50 },
  { v: 40 },
  { v: 55 },
  { v: 48 },
  { v: 60 },
  { v: 52 },
  { v: 70 },
]

const miniChartData2 = [
  { v: 20 },
  { v: 35 },
  { v: 25 },
  { v: 45 },
  { v: 30 },
  { v: 50 },
  { v: 40 },
  { v: 65 },
  { v: 55 },
  { v: 80 },
]

interface PerformanceCardProps {
  icon?: React.ReactNode
  label: string
  value?: string
  chart?: boolean
  chartColor?: string
  grid?: boolean
}

function PerformanceCard({
  icon,
  label,
  value,
  chart,
  chartColor = "#00d4ff",
  grid,
}: PerformanceCardProps) {
  return (
    <div className="glass-card glass-card-hover flex flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all">
      {icon && <div className="text-[#00d4ff]">{icon}</div>}
      {value && (
        <span className="text-xl font-bold text-[#e8e8ed]">{value}</span>
      )}
      {chart && (
        <div className="h-[40px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={miniChartData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={chartColor}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {grid && (
        <div className="grid grid-cols-8 gap-[2px]">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-[1px]"
              style={{
                backgroundColor:
                  Math.random() > 0.6
                    ? `rgba(0, 212, 255, ${Math.random() * 0.6 + 0.2})`
                    : "rgba(26, 26, 46, 0.8)",
              }}
            />
          ))}
        </div>
      )}
      <span className="text-center text-xs text-[#8888a0]">{label}</span>
    </div>
  )
}

export function ModelPerformance() {
  return (
    <section className="px-6 py-8 lg:px-10">
      <div className="mb-6 flex flex-col gap-8 lg:flex-row lg:gap-16">
        {/* Model Performance */}
        <div className="flex-1">
          <h3 className="mb-4 text-xs font-bold tracking-[0.2em] text-[#e8e8ed] uppercase">
            Model Performance
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <PerformanceCard
              icon={<Sparkles className="h-5 w-5" />}
              label="Real-time AI"
            />
            <PerformanceCard
              icon={<BrainCircuit className="h-5 w-5" />}
              label="Deep NLP Processing"
            />
          </div>
        </div>

        {/* Features */}
        <div className="flex-1">
          <h3 className="mb-4 text-xs font-bold tracking-[0.2em] text-[#e8e8ed] uppercase">
            Features
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <PerformanceCard
              icon={<LayoutGrid className="h-5 w-5" />}
              label="Deep NLP Confusion Matrix"
            />
            <PerformanceCard
              icon={<BarChart3 className="h-5 w-5" />}
              label=""
              value="95%"
            />
            <PerformanceCard
              chart
              chartColor="#ef4444"
              label=""
            />
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <PerformanceCard
          icon={<Sparkles className="h-5 w-5" />}
          label=""
          value="95.2%"
        />
        <PerformanceCard
          icon={<BrainCircuit className="h-5 w-5" />}
          label="Bigram + TF-IDF"
        />
        <PerformanceCard grid label="Architecture" />
        <PerformanceCard
          icon={<FolderOpen className="h-5 w-5" />}
          label="ROC Curve"
        />
        <PerformanceCard
          icon={<Music className="h-5 w-5" />}
          label="AI Ambient Sound"
        />
      </div>
    </section>
  )
}

export function MiniLineChart() {
  return (
    <div className="h-[40px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={miniChartData2}>
          <Line
            type="monotone"
            dataKey="v"
            stroke="#00d4ff"
            strokeWidth={1.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke="#ef4444"
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
