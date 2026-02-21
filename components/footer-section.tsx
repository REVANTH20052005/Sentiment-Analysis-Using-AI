"use client"

import { useState, useRef, useEffect } from "react"

export function FooterSection() {
  const [ambientSound, setAmbientSound] = useState(false)
  const [lyricsStarted, setLyricsStarted] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 🔥 SET YOUR REAL LYRICS START TIME HERE (in seconds)
  const LYRICS_START_TIME = 20 // example: 20 seconds

  useEffect(() => {
    const audio = new Audio("/songs/revanth-1.mp3")
    audio.loop = true // ✅ Infinite loop enabled
    audio.volume = 0.6

    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      // Trigger when lyrics start
      if (audio.currentTime >= LYRICS_START_TIME) {
        setLyricsStarted(true)
      } else {
        setLyricsStarted(false)
      }
    }

    const handleLoop = () => {
      // Reset UI when song restarts
      setLyricsStarted(false)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("seeked", handleLoop)
    audio.addEventListener("ended", handleLoop)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("seeked", handleLoop)
      audio.removeEventListener("ended", handleLoop)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (ambientSound) {
      audio.currentTime = 0
      audio.play().catch((err) => {
        console.log("Autoplay blocked:", err)
      })
    } else {
      audio.pause()
      audio.currentTime = 0
      setLyricsStarted(false)
    }
  }, [ambientSound])

  return (
    <footer
      className={`flex items-center justify-between border-t px-6 py-6 lg:px-10 transition-all duration-700 ${
        lyricsStarted
          ? "border-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.4)]"
          : "border-[#1e1e30]"
      }`}
    >
      <p
        className={`text-sm font-semibold transition-colors duration-700 ${
          lyricsStarted ? "text-[#00d4ff]" : "text-[#e8e8ed]"
        }`}
      >
        {lyricsStarted
          ? "🎤 Lyrics Live Mode Activated"
          : "Built with Intelligence"}
      </p>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[#8888a0]">
          with Love by Bala Prakash
        </span>

        <button
          onClick={() => setAmbientSound(!ambientSound)}
          className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-300 ${
            ambientSound ? "bg-[#00d4ff]" : "bg-[#2a2a3e]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-[#e8e8ed] transition-transform duration-300 ${
              ambientSound ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </footer>
  )
}
