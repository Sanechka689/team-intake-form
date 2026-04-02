'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { label: 'Философия', href: '#philosophy' },
  { label: 'Портфолио', href: '#portfolio' },
  { label: 'Ценности', href: '#values' },
  { label: 'Контакт', href: '#contact' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? 'bg-[#0D0D0D]/90 backdrop-blur-sm border-b border-[#2E2820]/60' : 'bg-transparent'
      }`}
    >
      <nav className="flex items-center justify-between px-8 md:px-16 py-6">
        {/* Logo */}
        <Link
          href="#"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-serif text-2xl font-light tracking-[0.15em] text-[#E6D2A2] hover:text-[#F5F2E9] transition-colors duration-300"
          aria-label="Лампа — на главную"
        >
          Лампа
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#7A7060] hover:text-[#E6D2A2] transition-colors duration-300"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 group"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Открыть меню"
        >
          <span className={`block w-6 h-px bg-[#E6D2A2] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-px bg-[#E6D2A2] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-[#E6D2A2] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#0D0D0D]/97 backdrop-blur-md border-t border-[#2E2820]/40 transition-all duration-500 overflow-hidden ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col py-8 px-8 gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#7A7060] hover:text-[#E6D2A2] transition-colors duration-300"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
