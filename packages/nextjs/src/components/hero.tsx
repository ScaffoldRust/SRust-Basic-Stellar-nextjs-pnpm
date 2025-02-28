"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code2 } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <div className="container flex flex-col items-center justify-center space-y-8 py-24 text-center lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center space-x-2 rounded-full bg-muted/10 px-4 py-1.5 text-sm font-medium backdrop-blur"
      >
        <span className="text-muted-foreground">Now with improved debugging tools</span>
      </motion.div>
      <div className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Build on Stellar with
          <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"> Rust</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl"
        >
          A powerful, modular, and efficient toolset for building, testing, and deploying smart contracts on the Stellar
          blockchain.
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <Button size="lg" className="group">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
        <Button variant="outline" size="lg">
          <Code2 className="mr-2 h-4 w-4" />
          View on GitHub
        </Button>
      </motion.div>
    </div>
  )
}

