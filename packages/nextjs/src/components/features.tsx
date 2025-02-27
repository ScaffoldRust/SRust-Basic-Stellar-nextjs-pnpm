import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Cpu, Shield, Zap } from "lucide-react"
import FeatureCard from "./features-card"

export function Features() {
  return (
    <section className="container py-16 lg:py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Scaffold Rust?</h2>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground">
          Empower your development workflow with powerful tools and features designed for the Stellar ecosystem.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={<Zap className="h-6 w-6 text-orange-700" />}
          title="Fast Development"
          description="Quick setup and rapid development with hot reloading and instant feedback."
        />
        <FeatureCard
          icon={<Shield className="h-6 w-6 text-orange-700" />}
          title="Type Safety"
          description="Leverage Rust's strong type system for safer smart contract development."
        />
        <FeatureCard
          icon={<Code2 className="h-6 w-6 text-orange-700" />}
          title="Modern Tooling"
          description="Built-in debugging, testing, and deployment tools for a seamless workflow."
        />
        <FeatureCard
          icon={<Cpu className="h-6 w-6 text-orange-700" />}
          title="Optimized Runtime"
          description="High-performance execution environment for Stellar smart contracts."
        />
      </div>
    </section>
  )
}



