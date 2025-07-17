"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Globe, 
  Smartphone, 
  Bot, 
  Megaphone, 
  ShoppingCart 
} from "lucide-react";

const Navbar = () => {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/oknum-logo.png"
              alt="Oknum Studio"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Our Services
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Professional digital solutions tailored for your
                          business needs.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/web"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium leading-none">
                          <Globe className="h-4 w-4" />
                          Website
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          Pembuatan website dan aplikasi web custom dengan
                          teknologi modern untuk kebutuhan bisnis Anda
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/mobile"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium leading-none">
                          <Smartphone className="h-4 w-4" />
                          Mobile App
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Pengembangan aplikasi mobile cross-platform untuk iOS
                          dan Android yang responsif dan user-friendly
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/ai-automation"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium leading-none">
                          <Bot className="h-4 w-4" />
                          AI, Chatbot & Automation System
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          Solusi AI pintar, chatbot otomatis, dan sistem
                          automasi workflow untuk meningkatkan efisiensi
                          operasional bisnis
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/digital-ads"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium leading-none">
                          <Megaphone className="h-4 w-4" />
                          Digital Advertising & Brand Awareness
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          Strategi iklan & konten Sosmed untuk membangun
                          awareness dan memicu traffic qualified.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/e-commerce"
                      >
                        <div className="flex items-center gap-2 text-sm font-medium leading-none">
                          <ShoppingCart className="h-4 w-4" />
                          E-Commerce
                        </div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          Pengelolaan toko online (web + marketplace) end-to-end
                          untuk meningkatkan sales.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/pricing" className="font-medium">
                  Pricing
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {/* Disabled for now */}
                  <li>
                    <span className="block select-none space-y-1 rounded-md p-3 leading-none outline-none text-gray-400 cursor-not-allowed">
                      <div className="text-sm font-medium leading-none">
                        Documentation
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                        Coming soon
                      </p>
                    </span>
                  </li>
                  {/* Disabled for now */}
                  <li>
                    <span className="block select-none space-y-1 rounded-md p-3 leading-none outline-none text-gray-400 cursor-not-allowed">
                      <div className="text-sm font-medium leading-none">
                        Blog
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                        Coming soon
                      </p>
                    </span>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/about"
                      >
                        <div className="text-sm font-medium leading-none">
                          About Us
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Learn about our team and company
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/contact"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Contact
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get in touch with our team
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center">
          <Link href="/contact">
            <Button className="text-sm font-medium">Contact Us</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
