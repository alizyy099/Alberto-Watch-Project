import { useState, useEffect, useCallback } from 'react'
import { ThemeContext } from './ThemeContextInstance'

export function ThemeProvider({ children }) {
  // Always default to 'dark' mode unless user explicitly selected 'light'
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('alberto_theme')
      return saved === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })

  // Synchronize data-theme attribute on <html> and class on <body>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'light') {
      document.body.classList.add('light-theme')
      document.body.classList.remove('dark-theme')
    } else {
      document.body.classList.add('dark-theme')
      document.body.classList.remove('light-theme')
    }
    try {
      localStorage.setItem('alberto_theme', theme)
    } catch {}
  }, [theme])

  const setTheme = useCallback((newTheme) => {
    const valid = newTheme === 'light' ? 'light' : 'dark'
    setThemeState(valid)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = {
    theme,
    isDarkMode: theme === 'dark',
    setTheme,
    toggleTheme
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
