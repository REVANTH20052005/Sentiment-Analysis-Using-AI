"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

type Props = {
  prediction: {
    sentiment: string
    confidence: number
  } | null
}

export function VisuightsSection({ prediction }: Props) {

  const sentiment = prediction?.sentiment || "Neutral"
  const confidence = prediction?.confidence || 0

  const colors = {
    Positive: "#22c55e",
    Neutral: "#00d4ff",
    Negative: "#ef4444",
  }

  const activeColor =
    colors[sentiment as keyof typeof colors]

  const donutData = [
    { name: "Positive", value: sentiment === "Positive" ? confidence : 10 },
    { name: "Neutral", value: sentiment === "Neutral" ? confidence : 10 },
    { name: "Negative", value: sentiment === "Negative" ? confidence : 10 },
  ]

  return (
    <div className="flex flex-col gap-6 lg:flex-row">

      {/* ===================== */}
      {/* DONUT CHART */}
      {/* ===================== */}
      <div className="glass-card flex flex-1 flex-col items-center rounded-2xl p-6">
        <h4 className="mb-4 text-sm font-semibold text-[#e8e8ed]">
          Sentiment Distribution
        </h4>

        <div className="relative h-[160px] w-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                stroke="none"
                animationDuration={800}
              >
                {donutData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={colors[entry.name as keyof typeof colors]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <p
          className="mt-4 text-lg font-semibold"
          style={{ color: activeColor }}
        >
          {sentiment}
        </p>

        <p className="text-sm text-[#8888a0]">
          {confidence}% Confidence
        </p>
      </div>

      {/* ===================== */}
      {/* PREMIUM GAUGE */}
      {/* ===================== */}
      <div className="glass-card flex flex-1 flex-col items-center rounded-2xl p-6">

        <h4 className="mb-4 text-sm font-semibold text-[#e8e8ed]">
          Sentiment Gauge
        </h4>

        <GaugeChart
          confidence={confidence}
          color={activeColor}
        />

        {/* BIG NUMBER INSIDE METER */}
      <text
        x="100"
        y="78"
        textAnchor="middle"
        fontSize="24"
        fontWeight="bold"
        fill="#e8e8ed"
      >
        {confidence}%
      </text>

        {/* TEXT BELOW METER */}
        <div className="mt-4 text-center">
          <p
            className="text-lg font-semibold"
            style={{ color: activeColor }}
          >
            {sentiment}
          </p>
          <p className="text-sm text-[#8888a0]">
            {confidence}% Confidence
          </p>
        </div>

      </div>

    </div>
  )
}


/* ========================= */
/* GAUGE COMPONENT */
/* ========================= */

function GaugeChart({
  confidence,
  color,
}: {
  confidence: number
  color: string
}) {

  const angle = (confidence / 100) * 180
  const radians = (Math.PI * (180 - angle)) / 180

  const radius = 80
  const needleLength = 70

  const arcEndX = 100 + radius * Math.cos(radians)
  const arcEndY = 100 - radius * Math.sin(radians)

  const needleX = 100 + needleLength * Math.cos(radians)
  const needleY = 100 - needleLength * Math.sin(radians)

  return (
    <svg viewBox="0 0 200 140" className="h-[170px] w-[200px]">

      {/* Background Meter */}
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="#1a1a2e"
        strokeWidth="16"
      />

      {/* Colored Fill Meter */}
      <path
        d={`M 20 100 A 80 80 0 0 1 ${arcEndX} ${arcEndY}`}
        fill="none"
        stroke={color}
        strokeWidth="16"
        strokeLinecap="round"
        style={{
          transition: "all 0.9s ease",
          filter: `drop-shadow(0 0 10px ${color})`,
        }}
      />

      {/* Needle */}
      <line
        x1="100"
        y1="100"
        x2={needleX}
        y2={needleY}
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        style={{
          transition: "all 0.9s ease",
        }}
      />

      {/* Needle Center */}
      <circle cx="100" cy="100" r="8" fill={color} />

    </svg>
  )
}
