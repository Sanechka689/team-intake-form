import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { PhilosophySection } from '@/components/philosophy-section'
import { PortfolioSection } from '@/components/portfolio-section'
import { ValuesSection } from '@/components/values-section'
import { QuoteSection } from '@/components/quote-section'
import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'

export default function LampaPage() {
  return (
    <main className="relative overflow-x-hidden bg-[#0D0D0D]">
      <Navigation />
      <HeroSection />
      <PhilosophySection />
      <PortfolioSection />
      <ValuesSection />
      <QuoteSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
