import { type ReactNode, useEffect } from "react"

function getTheme(): "light" | "dark" {
  const hour = new Date().getHours()
  return hour >= 8 && hour < 18 ? "light" : "dark"
}

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
}

function msUntilNextChange(): number {
  const now = new Date()
  const next = new Date(now)
  const hour = now.getHours()
  if (hour < 8) {
    next.setHours(8, 0, 0, 0)
  } else if (hour < 18) {
    next.setHours(18, 0, 0, 0)
  } else {
    next.setDate(next.getDate() + 1)
    next.setHours(8, 0, 0, 0)
  }
  return next.getTime() - now.getTime()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyTheme(getTheme())

    let timeoutId: ReturnType<typeof setTimeout>

    function scheduleNext() {
      timeoutId = setTimeout(() => {
        applyTheme(getTheme())
        scheduleNext()
      }, msUntilNextChange())
    }

    scheduleNext()

    return () => clearTimeout(timeoutId)
  }, [])

  return <>{children}</>
}
