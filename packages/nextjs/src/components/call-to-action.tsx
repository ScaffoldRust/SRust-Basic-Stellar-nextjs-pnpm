import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CallToAction() {
  return (
    <section className="border-t bg-muted/50">
      <div className="container py-16 lg:py-20">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground">
            Join the growing community of developers building on Stellar with Scaffold Rust.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

