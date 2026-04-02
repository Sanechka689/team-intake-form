'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'in'
}

export function FadeIn({ children, className = '', delay = 0, direction = 'up' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isFigmaCapture = window.location.hash.includes('figmacapture=')
    if (isFigmaCapture) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  const baseStyles = 'transition-all duration-1000 ease-out'
  const hiddenStyles = direction === 'up'
    ? 'opacity-0 translate-y-8'
    : 'opacity-0'
  const shownStyles = 'opacity-100 translate-y-0'

  return (
    <div
      ref={ref}
      className={`${baseStyles} ${visible ? shownStyles : hiddenStyles} ${className}`}
    >
      {children}
    </div>
  )
}
