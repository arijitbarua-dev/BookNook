"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/providers/ThemeProvider"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({ showLabel = false, className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative flex items-center gap-2 rounded-full p-1.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3985F5]",
        "border border-[#DCE9F5] bg-white/80 hover:bg-[#DDF0FF]/60 text-[#243B73] shadow-xs",
        "dark:border-[#24345E] dark:bg-[#152244]/80 dark:hover:bg-[#1E2E56] dark:text-[#93C5FD]",
        className
      )}
    >
      <div className="relative flex items-center">
        {/* Toggle Track Pill */}
        <div className="relative h-6 w-11 rounded-full bg-[#EAF5FF] transition-colors duration-300 dark:bg-[#0B132B] border border-[#DCE9F5] dark:border-[#24345E]">
          {/* Thumb */}
          <div
            className={cn(
              "absolute top-0.5 left-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#3155C8] text-white shadow-xs transition-transform duration-300 dark:bg-[#4671F6]",
              isDark && "translate-x-5"
            )}
          >
            {isDark ? (
              <Moon className="size-2.5 text-white" />
            ) : (
              <Sun className="size-2.5 text-white" />
            )}
          </div>
        </div>
      </div>

      {showLabel && (
        <span className="text-xs font-medium tracking-tight text-[#60718B] dark:text-[#94A3B8] select-none pr-1">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  )
}

