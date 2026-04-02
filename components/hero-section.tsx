'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleScrollDown = () => {
    const el = document.querySelector('#philosophy')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden"
      aria-label="Главный экран"
    >
      {/* Lamp scene image — full background */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      >
        <Image
          src="/images/hero-lamp.jpg"
          alt="Архитектурная настольная лампа направлена на тёмную деревянную стену, создавая тёплый прямоугольный световой ореол"
          fill
          priority

          className="object-cover object-center"
          onLoad={() => setLoaded(true)}
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/60 via-transparent to-[#0D0D0D]/30" />
      </div>

      {/* Hero content — bottom left */}
      <div className="relative z-10 w-full px-8 md:px-16 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-end">

            {/* Left: brand name + tagline */}
            <div
              className={`${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '200ms' }}
            >
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#7A7060] mb-6">
                Фотография · Свет · Образ
              </p>
              <h1 className="font-serif text-[80px] md:text-[120px] lg:text-[150px] leading-[0.9] font-light text-[#F5F2E9] tracking-[-0.02em] text-balance">
                Лампа
              </h1>
              <div className="mt-8 w-12 h-px bg-[#E6D2A2]/40" />
              <p
                className={`mt-6 font-mono text-[12px] tracking-[0.18em] uppercase text-[#7A7060] max-w-xs leading-relaxed ${
                  loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '600ms' }}
              >
                Свет — это начало всего.
                <br />
                Каждый снимок рождается из внимания.
              </p>
            </div>

            {/* Right: scroll hint */}
            <div
              className={`flex md:justify-end items-end ${loaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '900ms' }}
            >
              <button
                onClick={handleScrollDown}
                className="group flex flex-col items-center gap-4 text-[#7A7060] hover:text-[#E6D2A2] transition-colors duration-300"
                aria-label="Прокрутить вниз"
              >
                <span className="font-mono text-[9px] tracking-[0.35em] uppercase rotate-90 mb-2">
                  Scroll
                </span>
                <div className="relative w-px h-16 bg-[#2E2820] overflow-hidden">
                  <div className="absolute top-0 w-full bg-[#E6D2A2]/60 h-full animate-[slideDown_2s_ease-in-out_infinite]" 
                    style={{ animation: 'slideDown 2s ease-in-out infinite' }} />
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent" />

      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
