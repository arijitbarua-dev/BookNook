"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("booknook-theme") as Theme | null
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeState(savedTheme)
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        const initialTheme: Theme = prefersDark ? "dark" : "light"
        setThemeState(initialTheme)
        if (prefersDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    } catch {
      // Fallback to light
    }
    setMounted(true)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem("booknook-theme", newTheme)
    } catch {
      // Ignore
    }
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

