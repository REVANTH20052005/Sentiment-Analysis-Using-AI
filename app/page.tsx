"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { SentimentAnalyzer } from "@/components/sentiment-analyzer"
import { VisuightsSection } from "@/components/visuights-section"
import { ModelPerformance } from "@/components/model-performance"
import { FooterSection } from "@/components/footer-section"

type Prediction = {
  sentiment: string
  confidence: number
} | null

export default function Home() {
  const [theme, setTheme] = useState("Deep Black")
  const [prediction, setPrediction] = useState<Prediction>(null)

  const bgClass =
    theme === "Deep Black"
      ? "bg-[#050508]"
      : theme === "Dark"
      ? "bg-[#0a0a0f]"
      : "bg-[#0d0d15]"

  return (
    <div className={`min-h-screen ${bgClass} text-[#e8e8ed] transition-colors duration-500`}>
      <Header theme={theme} setTheme={setTheme} />

      <main className="mx-auto max-w-7xl">
        <HeroSection />

        <section className="px-6 py-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row">
            
            {/* LEFT */}
            <div className="flex-1 lg:max-w-md">
              <SentimentAnalyzer onResult={setPrediction} />
            </div>

            {/* RIGHT */}
            <div className="flex-1">
              <VisuightsSection prediction={prediction} />
            </div>

          </div>
        </section>

        <ModelPerformance />
        <FooterSection />
      </main>
    </div>
  )
}
