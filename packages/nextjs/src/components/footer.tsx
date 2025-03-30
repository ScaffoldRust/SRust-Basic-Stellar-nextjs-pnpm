"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Github, Twitter, DiscIcon as Discord, ArrowRight } from "lucide-react";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Footer() {
  return (
    <footer className="border-t bg-black/40 backdrop-blur-xl text-white">
      <div className="container py-12 md:py-16 lg:py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={item} className="space-y-4 text-white">
            <h3 className="text-lg font-bold">Scaffold Rust</h3>
            <p className="text-sm text-white">
              Build, test, and deploy smart contracts on Stellar with
              confidence.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary"
              >
                <Github className="h-5 w-5 text-orange-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary"
              >
                <Twitter className="h-5 w-5 text-orange-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary"
              >
                <Discord className="h-5 w-5 text-orange-700" />
              </Button>
            </div>
          </motion.div>
          <motion.div variants={item}>
            <h3 className="mb-4 text-lg font-bold">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary outline-none border-none"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary outline-none border-none"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary outline-none border-none"
                >
                  Tutorials
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary outline-none border-none"
                >
                  Examples
                </Link>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={item}>
            <h3 className="mb-4 text-lg font-bold">Community</h3>
            <ul className="space-y-3 text-sm text-white">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary outline-none border-none"
                >
                  GitHub Discussions
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary outline-none border-none"
                >
                  Discord Server
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary outline-none border-none"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary outline-none border-none"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={item} className="space-y-4">
            <h3 className="text-lg font-bold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates and announcements.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-[220px] bg-black/20"
              />
              <Button variant="default" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground"
        >
          <p>© 2024 Scaffold Rust. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
