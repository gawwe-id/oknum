# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Project Architecture

This is a Next.js 15 application using the App Router with TypeScript, serving as a digital agency website for Oknum Studio.

### Key Technologies
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling with shadcn/ui components
- **Framer Motion** for animations
- **Formspree** for form handling
- **Vercel OG** for dynamic OpenGraph image generation

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with SEO and structured data
│   ├── page.tsx           # Homepage
│   ├── api/og/            # OpenGraph image generation API
│   └── [pages]/           # Individual pages (contact, pricing, etc.)
├── components/            # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   └── [sections]/        # Page sections (navbar, hero, services, etc.)
├── lib/                   # Utility functions and configurations
│   ├── seo.ts             # SEO metadata construction
│   ├── og-image.ts        # OpenGraph image generation
│   └── utils.ts           # General utilities (cn function)
├── views/                 # Page-specific view components
└── assets/                # Static assets (images, etc.)
```

### Key Patterns

1. **SEO-First Approach**: Every page uses `constructMetadata()` from `@/lib/seo` for consistent SEO metadata
2. **Component Architecture**: 
   - Page components in `/app` handle routing and metadata
   - UI components in `/components` handle presentation
   - View components in `/views` handle page-specific logic
3. **Styling**: Uses Tailwind CSS with custom color system via CSS variables
4. **TypeScript Configuration**: Uses path aliases (`@/*` maps to `./src/*`)
5. **Structured Data**: Root layout includes JSON-LD structured data for SEO

### Development Notes

- The site is in Indonesian (`lang="id"`) and targets Indonesian market
- Uses custom fonts loaded via `fonts.ts`
- Implements dark mode support in Tailwind configuration
- Form handling via Formspree integration
- OpenGraph images generated dynamically via `/api/og` endpoint
- All components follow TypeScript strict mode

### Important Files

- `src/lib/seo.ts` - Central SEO configuration and metadata construction
- `src/app/layout.tsx` - Root layout with global SEO setup
- `tailwind.config.js` - Tailwind configuration with custom theme
- `src/components/ui/` - shadcn/ui component library