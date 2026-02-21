"use client"

import { useState } from "react"
import { Shuffle, ChevronDown, Brain, Loader2 } from "lucide-react"

type Props = {
  onResult: (data: { sentiment: string; confidence: number }) => void
}

export function SentimentAnalyzer({ onResult }: Props) {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confidenceBar, setConfidenceBar] = useState(0)

  const analyzeSentiment = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("https://sentiment-analysis-oh35.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Backend error")
      }

      const data = await response.json()

      const confidence = data.confidence
        ? Math.round(data.confidence * 100)
        : 90

      setConfidenceBar(confidence)

      onResult({
        sentiment: data.sentiment,
        confidence,
      })

    } catch (err) {
      setError("Unable to connect to backend")
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className="gradient-border glass-card flex flex-col gap-6 rounded-2xl p-6">

      <h3 className="text-xs font-bold tracking-[0.2em] uppercase">
        Live Sentiment Analyzer
      </h3>

      <div className="flex items-center gap-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d15] px-4 py-3">
        <input
          type="text"
          placeholder="Type or paste your review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none"
        />

        <button
          onClick={() =>
            setText("This product is absolutely amazing and works perfectly!")
          }
          className="cursor-pointer text-[#8888a0] hover:text-[#00d4ff]"
        >
          <Shuffle className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={analyzeSentiment}
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#1a1a2e] px-6 py-2.5 text-sm hover:bg-[#222240] disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            Analyze
            <ChevronDown className="h-3.5 w-3.5" />
          </>
        )}
      </button>

      {/* Confidence bar */}
      <div className="flex items-center gap-3">
        <Brain className="h-5 w-5 text-[#00d4ff]" />
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#8888a0]">Confidence</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#1a1a2e]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00d4ff] to-[#4060ff] transition-all duration-700"
              style={{ width: `${confidenceBar}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
