'use client'

import Image from 'next/image'
import { useState } from 'react'
import { FadeIn } from './fade-in'

const portfolioItems = [
  {
    id: 1,
    src: '/images/portfolio-1.jpg',
    title: 'Портрет в тишине',
    category: 'Портрет',
    year: '2024',
  },
  {
    id: 2,
    src: '/images/portfolio-2.jpg',
    title: 'Архитектура света',
    category: 'Интерьер',
    year: '2024',
  },
  {
    id: 3,
    src: '/images/portfolio-3.jpg',
    title: 'Натюрморт',
    category: 'Still Life',
    year: '2023',
  },
  {
    id: 4,
    src: '/images/portfolio-4.jpg',
    title: 'Ночная улица',
    category: 'Городской пейзаж',
    year: '2023',
  },
  {
    id: 5,
    src: '/images/portfolio-5.jpg',
    title: 'Свет и тень',
    category: 'Портрет',
    year: '2024',
  },
]

export function PortfolioSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section
      id="portfolio"
      className="relative py-32 md:py-48 bg-[#0D0D0D]"
      aria-label="Портфолио"
    >
      {/* Section header */}
      <div className="px-8 md:px-16 mb-20">
        <div className="max-w-7xl mx-auto flex items-end justify-between">
          <FadeIn direction="up">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#7A7060] mb-4">
                02 — Портфолио
              </p>
              <h2 className="font-serif text-[48px] md:text-[64px] font-light text-[#F5F2E9] leading-[1.0] tracking-[-0.01em]">
                Избранные работы
              </h2>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={200}>
            <p className="hidden md:block font-mono text-[11px] tracking-[0.2em] text-[#7A7060] uppercase mb-2">
              2023 – 2024
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Portfolio grid */}
      <div className="px-8 md:px-16">
        <div className="max-w-7xl mx-auto">

          {/* Large feature item */}
          <FadeIn direction="up">
            <div
              className="relative group overflow-hidden mb-4 cursor-pointer"
              onMouseEnter={() => setHoveredId(1)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ height: 'clamp(320px, 55vw, 680px)' }}
            >
              <Image
                src={portfolioItems[0].src}
                alt={portfolioItems[0].title}
                fill
                className={`object-cover transition-all duration-1000 ${
                  hoveredId === 1 ? 'scale-105' : 'scale-100'
                }`}

              />
              <div className={`absolute inset-0 bg-[#0D0D0D] transition-opacity duration-700 ${
                hoveredId === 1 ? 'opacity-20' : 'opacity-40'
              }`} />
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E6D2A2]/60 mb-2">
                    {portfolioItems[0].category}
                  </p>
                  <h3 className="font-serif text-[28px] md:text-[36px] font-light text-[#F5F2E9]">
                    {portfolioItems[0].title}
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-[#7A7060]">
                  {portfolioItems[0].year}
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {portfolioItems.slice(1, 3).map((item, index) => (
              <FadeIn key={item.id} direction="up" delay={index * 120}>
                <div
                  className="relative group overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ height: 'clamp(240px, 30vw, 480px)' }}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className={`object-cover transition-all duration-1000 ${
                      hoveredId === item.id ? 'scale-105' : 'scale-100'
                    }`}

                  />
                  <div className={`absolute inset-0 bg-[#0D0D0D] transition-opacity duration-700 ${
                    hoveredId === item.id ? 'opacity-15' : 'opacity-45'
                  }`} />
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#E6D2A2]/60 mb-1">
                        {item.category}
                      </p>
                      <h3 className="font-serif text-[22px] font-light text-[#F5F2E9]">
                        {item.title}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-[#7A7060]">{item.year}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Three-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portfolioItems.slice(2, 5).map((item, index) => (
              <FadeIn key={`${item.id}-grid`} direction="up" delay={index * 100}>
                <div
                  className="relative group overflow-hidden cursor-pointer"
                  onMouseEnter={() => setHoveredId(item.id + 100)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{ height: 'clamp(200px, 22vw, 360px)' }}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className={`object-cover transition-all duration-1000 ${
                      hoveredId === item.id + 100 ? 'scale-105' : 'scale-100'
                    }`}

                  />
                  <div className={`absolute inset-0 bg-[#0D0D0D] transition-opacity duration-700 ${
                    hoveredId === item.id + 100 ? 'opacity-15' : 'opacity-50'
                  }`} />
                  <div className="absolute bottom-5 left-5">
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#E6D2A2]/50 mb-1">
                      {item.category}
                    </p>
                    <h3 className="font-serif text-[18px] font-light text-[#F5F2E9]">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

        </div>
      </div>

      {/* Decorative separator */}
      <div className="px-8 md:px-16 mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2E2820] to-transparent" />
        </div>
      </div>
    </section>
  )
}
