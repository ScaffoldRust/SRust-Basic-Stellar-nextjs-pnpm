import Navbar from "@/components/navigation-menu"
import { Features } from "@/components/features"
import { DebugContracts } from "@/components/debug-contracts"
import { HeroSection } from "@/components/hero"
import { CallToAction } from "@/components/call-to-action"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Navbar />
        </header>
        <main className="flex flex-col items-center">
          <HeroSection />
          <Features />
          <DebugContracts />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  )
}
