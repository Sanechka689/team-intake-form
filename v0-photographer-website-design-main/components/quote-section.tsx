import { FadeIn } from './fade-in'

export function QuoteSection() {
  return (
    <section
      className="relative py-40 md:py-60 px-8 md:px-16 bg-[#111008] overflow-hidden"
      aria-label="Вдохновляющая цитата"
    >
      {/* Subtle warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(230,210,162,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-12">
          <div className="md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3">

            <FadeIn direction="up">
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#7A7060] mb-16 text-center">
                04 — Мысль
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={200}>
              <blockquote
                className="font-serif text-[40px] md:text-[58px] lg:text-[68px] font-light leading-[1.15] text-[#F5F2E9] tracking-[-0.01em] text-center text-balance"
              >
                "Лампа не украшает комнату —
                <br />
                она{' '}
                <em className="not-italic text-[#E6D2A2]">открывает</em>{' '}
                её."
              </blockquote>
            </FadeIn>

            <FadeIn direction="up" delay={400}>
              <div className="flex flex-col items-center mt-16 gap-4">
                <div className="w-px h-12 bg-[#2E2820]" />
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#7A7060]">
                  Лампа Studio
                </p>
              </div>
            </FadeIn>

          </div>
        </div>

        {/* Decorative bottom line */}
        <FadeIn direction="in" delay={500}>
          <div className="mt-24 w-full h-px bg-gradient-to-r from-transparent via-[#2E2820] to-transparent" />
        </FadeIn>
      </div>
    </section>
  )
}
