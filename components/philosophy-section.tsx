import { FadeIn } from './fade-in'

export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="relative py-40 md:py-52 px-8 md:px-16 bg-[#0D0D0D]"
      aria-label="Философия бренда"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">

          {/* Left: section label */}
          <div className="md:col-span-3">
            <FadeIn direction="up">
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#7A7060] mt-3">
                01 — Идея
              </p>
            </FadeIn>
          </div>

          {/* Right: content */}
          <div className="md:col-span-9">
            <FadeIn direction="up" delay={150}>
              <h2 className="font-serif text-[48px] md:text-[68px] lg:text-[80px] leading-[1.05] font-light text-[#F5F2E9] tracking-[-0.01em] text-balance mb-14">
                Свет — это не просто техника.
                <br />
                <span className="text-[#E6D2A2]">Это намерение.</span>
              </h2>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <FadeIn direction="up" delay={250}>
                <div>
                  <div className="w-8 h-px bg-[#E6D2A2]/40 mb-8" />
                  <p className="font-mono text-[13px] leading-[2] text-[#7A7060] font-light tracking-wide">
                    Лампа — это не только источник освещения. Это метафора внимания. Когда фотограф направляет объектив на человека или предмет — он делает то же самое, что лампа с пространством вокруг: выделяет, раскрывает, создаёт.
                  </p>
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={350}>
                <div>
                  <div className="w-8 h-px bg-[#E6D2A2]/40 mb-8" />
                  <p className="font-mono text-[13px] leading-[2] text-[#7A7060] font-light tracking-wide">
                    Каждый снимок начинается до нажатия кнопки. Он начинается с паузы. С наблюдения. С умения видеть то, что уже есть — и только потом — зафиксировать.
                  </p>
                </div>
              </FadeIn>
            </div>

            {/* Decorative quote */}
            <FadeIn direction="up" delay={450}>
              <div className="mt-24 pl-8 border-l border-[#2E2820]">
                <blockquote className="font-serif text-[28px] md:text-[36px] font-light italic text-[#E6D2A2]/70 leading-[1.4] tracking-wide">
                  "Фотография — это искусство найти свет там, где его не видят другие."
                </blockquote>
              </div>
            </FadeIn>
          </div>

        </div>

        {/* Decorative horizontal rule */}
        <FadeIn direction="in" delay={200}>
          <div className="mt-32 w-full h-px bg-gradient-to-r from-transparent via-[#2E2820] to-transparent" />
        </FadeIn>
      </div>
    </section>
  )
}
