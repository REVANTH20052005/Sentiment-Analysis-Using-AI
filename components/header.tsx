"use client"

import { X } from "lucide-react"

interface HeaderProps {
  theme: string
  setTheme: (theme: string) => void
}

export function Header({ theme, setTheme }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 lg:px-10">
      <div className="flex items-center gap-3">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          className="text-[#00d4ff]"
        >
          <path
            d="M4 20C4 20 8 12 12 16C16 20 20 8 24 12C28 16 28 12 28 12"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M4 24C4 24 8 16 12 20C16 24 20 12 24 16C28 20 28 16 28 16"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
        <span className="text-sm font-bold tracking-[0.2em] text-[#e8e8ed] uppercase">
          Sentiment Intelligence
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-1 text-sm md:flex">
          {["Dark", "Deep Black", "Light"].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`cursor-pointer rounded-md px-3 py-1 transition-colors ${
                theme === t
                  ? "text-[#e8e8ed]"
                  : "text-[#8888a0] hover:text-[#e8e8ed]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="cursor-pointer text-[#8888a0] transition-colors hover:text-[#e8e8ed]">
          <X className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
