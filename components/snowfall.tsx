"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import styles from './snowfall.module.css'

export function Snowfall() {
  const { theme } = useTheme()
  const [showSnowfall, setShowSnowfall] = useState(false)
  const [previousTheme, setPreviousTheme] = useState<string | undefined>(undefined)
  const [snowflakes, setSnowflakes] = useState<React.ReactNode[]>([])

  // Generate a new set of snowflakes
  const generateSnowflakes = () => {
    // Array of different snowflake Unicode characters
    const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❋'];
    
    return Array.from({ length: 10 }).map((_, index) => {
      const id = Date.now() + index;
      const isLeftSide = index % 2 === 0;
      const horizontalPosition = isLeftSide 
        ? Math.random() * 10 // 0-10% from left
        : 90 + Math.random() * 10; // 90-100% from right
      
      const animationDuration = 3 + Math.random() * 5 // 3-8s animation
      const size = 15 + Math.random() * 15 // 15-30px size
      const opacity = 0.6 + Math.random() * 0.4 // 0.6-1 opacity
      const animationDelay = Math.random() * 0.5 // 0-0.5s delay
      const rotation = Math.random() * 360 // Random initial rotation
      const snowflakeChar = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
      
      return (
        <div 
          key={`${id}-${index}`}
          className={styles.snowflake}
          style={{
            left: `${horizontalPosition}%`,
            fontSize: `${size}px`,
            opacity,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`,
            transform: `rotate(${rotation}deg)`
          }}
          onAnimationEnd={(e) => {
            // Remove this snowflake when animation ends
            if (e.currentTarget.parentNode) {
              e.currentTarget.remove();
            }
          }}
        >
          {snowflakeChar}
        </div>
      )
    });
  }

  useEffect(() => {
    // Only trigger snowfall when switching to dark mode (not on initial load)
    if (previousTheme !== undefined && previousTheme === 'light' && theme === 'dark') {
      setShowSnowfall(true)
      
      // Generate initial snowflakes
      setSnowflakes(generateSnowflakes())
      
      // Continue generating snowflakes every 500ms for 4 seconds
      const interval = setInterval(() => {
        setSnowflakes(prev => [...prev, ...generateSnowflakes()])
      }, 500)
      
      // Stop generating new snowflakes after 4 seconds
      const stopGeneratingTimer = setTimeout(() => {
        clearInterval(interval)
      }, 4000)
      
      // Hide snowfall after 10 seconds
      const hideTimer = setTimeout(() => {
        setShowSnowfall(false)
      }, 10000)
      
      return () => {
        clearTimeout(hideTimer)
        clearTimeout(stopGeneratingTimer)
        clearInterval(interval)
      }
    }
    
    setPreviousTheme(theme)
  }, [theme, previousTheme])

  if (!showSnowfall) return null

  return <div className={styles.snowfallContainer}>{snowflakes}</div>
}
