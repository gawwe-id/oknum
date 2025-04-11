"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Code } from "@/components/ui/code";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background py-20 md:py-32">
      {/* Spotlight effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-80" />

      <div className="container relative max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="font-rubik text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="block">From idea to scale.</span>
            <span className="block text-primary">Simplified.</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ship production apps at lightning speed, and scale to a global
            audience effortlessly with our next-gen serverless database.
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/get-started">
              <Button size="lg" className="rounded-md px-8">
                Get started for free
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="overflow-hidden rounded-lg bg-black/80 shadow-md">
              <div className="p-1 bg-gray-800/80">
                <div className="flex items-center space-x-2 px-3 py-1">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div className="ml-2 text-sm text-gray-400">Terminal</div>
                </div>
              </div>
              <div className="p-4 text-left">
                <code className="text-sm font-mono text-gray-200">
                  <span className="text-gray-500">$</span> npx product@latest
                  init --db <span className="text-green-400">✓</span>
                </code>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-8 opacity-50 grayscale"
                src="/api/placeholder/120/40"
                alt="Client logo"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-8 opacity-50 grayscale"
                src="/api/placeholder/120/40"
                alt="Client logo"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-8 opacity-50 grayscale"
                src="/api/placeholder/120/40"
                alt="Client logo"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-8 opacity-50 grayscale"
                src="/api/placeholder/120/40"
                alt="Client logo"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-8 opacity-50 grayscale"
                src="/api/placeholder/120/40"
                alt="Client logo"
              />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-1">
              <img
                className="h-8 opacity-50 grayscale"
                src="/api/placeholder/120/40"
                alt="Client logo"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
