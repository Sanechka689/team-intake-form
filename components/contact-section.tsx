'use client'

import { useState } from 'react'
import { FadeIn } from './fade-in'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Simulate send
    await new Promise((res) => setTimeout(res, 1400))
    setStatus('sent')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section
      id="contact"
      className="relative py-40 md:py-56 px-8 md:px-16 bg-[#0D0D0D]"
      aria-label="Контактная форма"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20">

          {/* Left: heading + info */}
          <div className="md:col-span-5">
            <FadeIn direction="up">
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#7A7060] mb-8">
                05 — Контакт
              </p>
              <h2 className="font-serif text-[48px] md:text-[62px] lg:text-[72px] font-light text-[#F5F2E9] leading-[1.0] tracking-[-0.01em] text-balance">
                Начнём
                <br />
                <span className="text-[#E6D2A2]">разговор</span>
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={200}>
              <div className="mt-14 space-y-6">
                <div className="w-8 h-px bg-[#E6D2A2]/30" />
                <p className="font-mono text-[13px] leading-[2] text-[#7A7060]">
                  Если у вас есть проект, идея или просто желание поговорить о свете — напишите. Я читаю каждое письмо.
                </p>
                <div className="pt-4 space-y-3">
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#7A7060]">
                    Москва
                  </p>
                  <a
                    href="mailto:hello@lampa.studio"
                    className="block font-mono text-[13px] text-[#E6D2A2]/80 hover:text-[#E6D2A2] transition-colors duration-300 tracking-wide"
                  >
                    hello@lampa.studio
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-mono text-[13px] text-[#7A7060] hover:text-[#E6D2A2] transition-colors duration-300 tracking-wide"
                  >
                    @lampa.studio
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: contact form */}
          <div className="md:col-span-6 md:col-start-7">
            <FadeIn direction="up" delay={300}>
              {status === 'sent' ? (
                <div className="flex flex-col items-start justify-center h-full py-20">
                  <div className="w-8 h-px bg-[#E6D2A2]/40 mb-8" />
                  <p className="font-serif text-[32px] font-light text-[#F5F2E9] mb-4">
                    Получено.
                  </p>
                  <p className="font-mono text-[13px] text-[#7A7060] leading-[2]">
                    Я вернусь к вам в ближайшее время. Спасибо за доверие.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8" noValidate>

                  {/* Name */}
                  <div className="group">
                    <label htmlFor="name" className="block font-mono text-[10px] tracking-[0.3em] uppercase text-[#7A7060] mb-3 group-focus-within:text-[#E6D2A2] transition-colors duration-300">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2E2820] focus:border-[#E6D2A2]/60 py-3 font-mono text-[14px] text-[#F5F2E9] placeholder:text-[#2E2820] outline-none transition-colors duration-500"
                      placeholder="Александр"
                    />
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label htmlFor="email" className="block font-mono text-[10px] tracking-[0.3em] uppercase text-[#7A7060] mb-3 group-focus-within:text-[#E6D2A2] transition-colors duration-300">
                      Электронная почта
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-[#2E2820] focus:border-[#E6D2A2]/60 py-3 font-mono text-[14px] text-[#F5F2E9] placeholder:text-[#2E2820] outline-none transition-colors duration-500"
                      placeholder="alex@example.com"
                    />
                  </div>

                  {/* Message */}
                  <div className="group">
                    <label htmlFor="message" className="block font-mono text-[10px] tracking-[0.3em] uppercase text-[#7A7060] mb-3 group-focus-within:text-[#E6D2A2] transition-colors duration-300">
                      Сообщение
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-transparent border-b border-[#2E2820] focus:border-[#E6D2A2]/60 py-3 font-mono text-[14px] text-[#F5F2E9] placeholder:text-[#2E2820] outline-none resize-none transition-colors duration-500 leading-[1.9]"
                      placeholder="Расскажите о вашем проекте..."
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group relative inline-flex items-center gap-4 font-mono text-[11px] tracking-[0.3em] uppercase text-[#E6D2A2] hover:text-[#F5F2E9] transition-colors duration-300 disabled:opacity-50"
                    >
                      <span className="relative">
                        {status === 'sending' ? 'Отправляется...' : 'Отправить письмо'}
                        <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-[#E6D2A2] transition-all duration-500" />
                      </span>
                      <span className="block w-12 h-px bg-[#E6D2A2]/40 group-hover:w-20 transition-all duration-500" />
                    </button>
                  </div>

                </form>
              )}
            </FadeIn>
          </div>

        </div>
      </div>
    </section>
  )
}
