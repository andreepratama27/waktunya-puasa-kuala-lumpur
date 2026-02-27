import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ramadanDays: defineTable({
    year: v.number(),
    dateISO: v.string(), // YYYY-MM-DD
    dayNumber: v.number(), // 1..29
  })
    .index("by_year", ["year"])
    .index("by_year_date", ["year", "dateISO"]),

  fastCheckins: defineTable({
    year: v.number(),
    dateISO: v.string(), // YYYY-MM-DD
    status: v.union(v.literal("fasting"), v.literal("not_fasting")),
    reason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_year", ["year"])
    .index("by_year_date", ["year", "dateISO"]),
});
