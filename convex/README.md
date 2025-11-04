# Convex Database Schema

This directory contains the Convex database schema and functions for the business class platform.

## Setup

1. Install dependencies: `pnpm install`
2. Initialize Convex: `npx convex dev` (this will create `.convex/` directory and generate types)
3. Set environment variables:
   - `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
   - `DUITKU_MERCHANT_CODE` - Duitku merchant code
   - `DUITKU_API_KEY` - Duitku API key
   - `DUITKU_BASE_URL` - Duitku API base URL (optional, defaults to https://api.duitku.com)

## Database Schema

### Tables

1. **users** - User accounts (required for booking)
2. **experts** - Expert/instructor profiles (self-registration, no approval needed)
3. **classes** - Business classes (support offline/online/hybrid)
4. **curriculum** - Curriculum/syllabus for each class
5. **schedules** - Class schedules (multi-session support)
6. **bookings** - Class bookings (requires user authentication)
7. **payments** - Payment records (Duitku integration)
8. **categories** - Class categories

## Functions

### Queries
- User queries: `getUserProfile`, `getUserByEmail`
- Expert queries: `getExpertById`, `getExpertByUserId`, `getActiveExperts`
- Class queries: `getClasses`, `getClassById`, `getClassesByExpert`
- Schedule queries: `getSchedulesByClass`, `getScheduleById`, `getUpcomingSchedules`
- Booking queries: `getBookingsByUser`, `getBookingById`
- Payment queries: `getPaymentByBooking`, `getPaymentById`
- Category queries: `getActiveCategories`, `getCategoryById`, `getCategoryBySlug`, `getSubcategories`
- Curriculum queries: `getCurriculumsByClass`

### Mutations
- User mutations: `createUser`, `updateUser`
- Expert mutations: `createExpert`, `updateExpert`
- Class mutations: `createClass`, `updateClass`
- Schedule mutations: `createSchedule`, `updateSchedule`, `incrementBookedSeats`
- Booking mutations: `createBooking`, `updateBookingStatus`
- Payment mutations: `createPayment`, `updatePaymentStatus`
- Category mutations: `createCategory`, `updateCategory`
- Curriculum mutations: `upsertCurriculum`

### Actions
- `initiateDuitkuPayment` - Initialize payment via Duitku API
- `processDuitkuWebhook` - Handle Duitku webhook callbacks

## Features

- ✅ Multi-session class support
- ✅ Hybrid classes (offline/online)
- ✅ User authentication required for booking
- ✅ Duitku payment gateway integration
- ✅ Expert self-registration (no admin approval needed)

