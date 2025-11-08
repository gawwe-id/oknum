/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as bookings from "../bookings.js";
import type * as categories from "../categories.js";
import type * as classes from "../classes.js";
import type * as curriculum from "../curriculum.js";
import type * as dashboard from "../dashboard.js";
import type * as experts from "../experts.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as payments from "../payments.js";
import type * as schedules from "../schedules.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  bookings: typeof bookings;
  categories: typeof categories;
  classes: typeof classes;
  curriculum: typeof curriculum;
  dashboard: typeof dashboard;
  experts: typeof experts;
  files: typeof files;
  http: typeof http;
  payments: typeof payments;
  schedules: typeof schedules;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
