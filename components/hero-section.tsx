"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronDown, X } from "lucide-react"
import Image from "next/image"

type Particle = {
  top: string
  left: string
  opacity: number
}

export function HeroSection() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [showModal, setShowModal] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Generate particles safely (hydration safe)
  useEffect(() => {
    const generated = Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.8 + 0.2,
    }))
    setParticles(generated)
  }, [])

  // Prepare audio once
  useEffect(() => {
    const audio = new Audio("/songs/faa.mp3")
    audio.loop = true
    audio.volume = 0.7
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  // Play / Stop sound when modal toggles
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (showModal) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [showModal])

  return (
    <>
      <section className="relative overflow-hidden px-6 py-12 lg:px-10 lg:py-20">

        {/* Floating orbs */}
        <div className="animate-float-slow absolute top-10 right-10 h-16 w-16 rounded-full bg-gradient-to-br from-[#4060ff]/40 to-[#c850f0]/30 blur-sm" />
        <div className="animate-float absolute bottom-20 right-20 h-10 w-10 rounded-full bg-gradient-to-br from-[#00d4ff]/30 to-[#4060ff]/20 blur-sm" />
        <div className="animate-float-slow absolute top-40 left-[60%] h-6 w-6 rounded-full bg-[#c850f0]/30 blur-sm" />
        <div className="animate-float absolute bottom-10 left-10 h-8 w-8 rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#c850f0]/20 blur-sm" />

        {/* Particle field */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute h-[2px] w-[2px] rounded-full bg-[#00d4ff]"
              style={{
                top: p.top,
                left: p.left,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div className="gradient-border glass-card z-10 max-w-lg rounded-2xl p-8">
            <h1 className="glow-text mb-4 text-4xl font-bold lg:text-5xl">
              Emotion Intelligence{" "}
              <span>Powered by AI</span>
            </h1>

            <p className="mb-8 text-lg text-[#8888a0]">
              Analyze human sentiment with precision, speed, and elegance
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg border border-[#2a2a3e] bg-[#12121a] px-6 py-3 text-sm font-medium transition-all hover:border-[#00d4ff]/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            >
              Try the Analyzer
            </button>
          </div>

          {/* Sphere */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative h-[300px] w-[300px] lg:h-[400px] lg:w-[400px]">
              <div className="absolute inset-[-20px] rounded-full bg-gradient-to-r from-[#00d4ff]/10 via-[#c850f0]/10 to-[#00d4ff]/10 blur-xl" />
              <div className="animate-sphere-rotate absolute inset-[-10px] rounded-full border border-[#00d4ff]/20" />
              <div
                className="animate-sphere-rotate absolute inset-[-5px] rounded-full border border-[#c850f0]/15"
                style={{ animationDuration: "25s", animationDirection: "reverse" }}
              />

              <div className="relative h-full w-full overflow-hidden rounded-full">
                <Image
                  src="/images/ai-sphere.png"
                  alt="AI Sphere"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll */}
        <div className="mt-12 flex flex-col items-center gap-2">
          <ChevronDown className="h-6 w-6 text-[#8888a0]" />
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">

          <div className="relative w-[95%] max-w-3xl rounded-2xl bg-[#0d0d15] p-6 shadow-2xl animate-fadeIn">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-[#8888a0] hover:text-white"
            >
              <X />
            </button>

            <div className="relative h-[400px] w-[700px] overflow-hidden rounded-xl">
              <Image
                src="/images/pradeep.png"
                alt="AI Popup"
                fill
                className="object"
              />
            </div>

          </div>
        </div>
      )}
    </>
  )
}
