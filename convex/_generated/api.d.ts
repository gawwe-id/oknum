/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as additionalPerks from "../additionalPerks.js";
import type * as auth from "../auth.js";
import type * as benefits from "../benefits.js";
import type * as bookings from "../bookings.js";
import type * as categories from "../categories.js";
import type * as classes from "../classes.js";
import type * as consultants from "../consultants.js";
import type * as curriculum from "../curriculum.js";
import type * as dashboard from "../dashboard.js";
import type * as documentation from "../documentation.js";
import type * as emails from "../emails.js";
import type * as experts from "../experts.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as issues from "../issues.js";
import type * as journey from "../journey.js";
import type * as payments from "../payments.js";
import type * as schedules from "../schedules.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  additionalPerks: typeof additionalPerks;
  auth: typeof auth;
  benefits: typeof benefits;
  bookings: typeof bookings;
  categories: typeof categories;
  classes: typeof classes;
  consultants: typeof consultants;
  curriculum: typeof curriculum;
  dashboard: typeof dashboard;
  documentation: typeof documentation;
  emails: typeof emails;
  experts: typeof experts;
  files: typeof files;
  http: typeof http;
  issues: typeof issues;
  journey: typeof journey;
  payments: typeof payments;
  schedules: typeof schedules;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
