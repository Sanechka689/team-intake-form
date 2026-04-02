import { FadeIn } from './fade-in'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-[#1A1A1A] py-12 px-8 md:px-16 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Brand */}
          <FadeIn direction="in">
            <div className="flex items-center gap-6">
              <span className="font-serif text-xl font-light tracking-[0.15em] text-[#E6D2A2]/60">
                Лампа
              </span>
              <span className="hidden md:block w-px h-4 bg-[#2E2820]" />
              <span className="hidden md:block font-mono text-[10px] tracking-[0.2em] uppercase text-[#7A7060]">
                Photography Studio
              </span>
            </div>
          </FadeIn>

          {/* Copyright */}
          <FadeIn direction="in" delay={200}>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[#2E2820]">
              © {year} Лампа Studio. Все права защищены.
            </p>
          </FadeIn>

        </div>
      </div>
    </footer>
  )
}
