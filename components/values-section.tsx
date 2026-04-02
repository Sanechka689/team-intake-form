import { FadeIn } from './fade-in'

const values = [
  {
    number: '01',
    title: 'Тишина',
    description: 'Лучшие кадры рождаются в моменты, когда все замолкают. Я работаю в тишине — не потому что так надо, а потому что так виднее.',
  },
  {
    number: '02',
    title: 'Свет как язык',
    description: 'Я не "добавляю" свет — я нахожу его. Естественный, рассеянный, острый — каждый источник рассказывает другую историю.',
  },
  {
    number: '03',
    title: 'Пространство',
    description: 'Пустое пространство в кадре — это не ошибка. Это дыхание. Именно оно даёт зрителю возможность почувствовать.',
  },
  {
    number: '04',
    title: 'Медленность',
    description: 'Я не спешу. Хорошая фотография требует времени — для наблюдения, для доверия, для момента, который нельзя инсценировать.',
  },
]

export function ValuesSection() {
  return (
    <section
      id="values"
      className="relative py-40 md:py-56 px-8 md:px-16 bg-[#0D0D0D]"
      aria-label="Ценности фотографа"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="grid md:grid-cols-12 mb-24 gap-8">
          <div className="md:col-span-3">
            <FadeIn direction="up">
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#7A7060] mt-3">
                03 — Ценности
              </p>
            </FadeIn>
          </div>
          <div className="md:col-span-9">
            <FadeIn direction="up" delay={150}>
              <h2 className="font-serif text-[48px] md:text-[68px] font-light text-[#F5F2E9] leading-[1.05] tracking-[-0.01em] text-balance">
                Почему именно{' '}
                <span className="italic text-[#E6D2A2]">Лампа</span>
              </h2>
            </FadeIn>
          </div>
        </div>

        {/* Values list */}
        <div className="space-y-0">
          {values.map((value, index) => (
            <FadeIn key={value.number} direction="up" delay={index * 100}>
              <div className="group grid md:grid-cols-12 gap-8 py-12 border-t border-[#1A1A1A] hover:border-[#2E2820] transition-colors duration-500 cursor-default">

                {/* Number */}
                <div className="md:col-span-2 flex items-start">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[#2E2820] group-hover:text-[#7A7060] transition-colors duration-500 mt-1">
                    {value.number}
                  </span>
                </div>

                {/* Title */}
                <div className="md:col-span-4">
                  <h3 className="font-serif text-[32px] md:text-[40px] font-light text-[#F5F2E9] group-hover:text-[#E6D2A2] transition-colors duration-500 leading-[1.1]">
                    {value.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="md:col-span-5 md:col-start-8">
                  <p className="font-mono text-[13px] leading-[1.9] text-[#7A7060] group-hover:text-[#9A9080] transition-colors duration-500 tracking-wide">
                    {value.description}
                  </p>
                </div>

              </div>
            </FadeIn>
          ))}

          {/* Last border */}
          <div className="border-t border-[#1A1A1A]" />
        </div>

        {/* Photographer note */}
        <FadeIn direction="up" delay={300}>
          <div className="mt-28 grid md:grid-cols-12 gap-8">
            <div className="md:col-span-3" />
            <div className="md:col-span-6">
              <div className="w-8 h-px bg-[#E6D2A2]/30 mb-8" />
              <p className="font-mono text-[13px] leading-[2] text-[#7A7060]">
                Я работаю с людьми, интерьерами и объектами. Принимаю небольшое количество проектов в год — чтобы каждому уделить то внимание, которого он заслуживает.
              </p>
              <p className="font-mono text-[13px] leading-[2] text-[#7A7060] mt-4">
                Студия базируется в Москве. Выезды по договорённости.
              </p>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
