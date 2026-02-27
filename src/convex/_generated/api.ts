// Minimal replacement for Convex codegen output.
// This lets the app compile without running `convex codegen`.
//
// Once a Convex project is configured, you can replace this with the real
// generated file by running `npx convex codegen`.
import { anyApi } from "convex/server";

export const api = anyApi;
