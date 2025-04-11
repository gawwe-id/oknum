"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { reggae } from "@/app/fonts";

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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </motion.div>
            <span className={`font-bold text-xl ${reggae.className}`}>
              Oknum
            </span>
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
                      <a
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
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/web-app"
                      >
                        <div className="text-sm font-medium leading-none">
                          Web App Development
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Modern & responsive websites
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/mobile-app"
                      >
                        <div className="text-sm font-medium leading-none">
                          Mobile App Development
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          iOS & Android applications
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink className="font-medium">
                  Pricing
                </NavigationMenuLink>
              </Link>
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
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/about"
                      >
                        <div className="text-sm font-medium leading-none">
                          About Us
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Learn about our team and company
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <a
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/contact"
                      >
                        <div className="text-sm font-medium leading-none">
                          Contact
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get in touch with our team
                        </p>
                      </a>
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
