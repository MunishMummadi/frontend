"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import styles from './snowfall.module.css'

export function Snowfall() {
  const { theme } = useTheme()
  const [showSnowfall, setShowSnowfall] = useState(false)
  const [previousTheme, setPreviousTheme] = useState<string | undefined>(undefined)

  useEffect(() => {
    // Only trigger snowfall when switching to dark mode (not on initial load)
    if (previousTheme !== undefined && previousTheme === 'light' && theme === 'dark') {
      setShowSnowfall(true)
      
      // Hide snowfall after 10 seconds
      const timer = setTimeout(() => {
        setShowSnowfall(false)
      }, 10000)
      
      return () => clearTimeout(timer)
    }
    
    setPreviousTheme(theme)
  }, [theme, previousTheme])

  if (!showSnowfall) return null

  // Array of different snowflake Unicode characters
  const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❋', '✧', '✦'];

  // Generate 50 snowflakes with random properties
  const snowflakes = Array.from({ length: 50 }).map((_, index) => {
    // For left side: 0-20% of screen width
    // For right side: 80-100% of screen width
    const isLeftSide = index % 2 === 0;
    const horizontalPosition = isLeftSide 
      ? Math.random() * 20 // 0-20% from left
      : 80 + Math.random() * 20; // 80-100% from right
    
    const animationDuration = 3 + Math.random() * 7 // 3-10s animation
    const size = 15 + Math.random() * 15 // 15-30px size
    const opacity = 0.6 + Math.random() * 0.4 // 0.6-1 opacity
    const animationDelay = Math.random() * 5 // 0-5s delay
    const rotation = Math.random() * 360 // Random initial rotation
    const snowflakeChar = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
    
    return (
      <div 
        key={index}
        className={styles.snowflake}
        style={{
          left: `${horizontalPosition}%`,
          fontSize: `${size}px`,
          opacity,
          animationDuration: `${animationDuration}s`,
          animationDelay: `${animationDelay}s`,
          transform: `rotate(${rotation}deg)`
        }}
      >
        {snowflakeChar}
      </div>
    )
  })

  return <div className={styles.snowfallContainer}>{snowflakes}</div>
}
