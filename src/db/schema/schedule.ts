import { json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

interface scheduleJsonElement {
    id: string
}

export const schedule = pgTable("schedule", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    courses: json("courses").$type<scheduleJsonElement[]>().notNull(),
    registrations: json("registrations").$type<scheduleJsonElement[]>().notNull(),
    groups: json("groups").$type<scheduleJsonElement[]>().notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})

export const scheduleRelations = relations(schedule, ({ one }) => ({
    user: one(user, {
        fields: [schedule.userId],
        references: [user.id],
    }),
}));

export const userScheduleRelations = relations(user, ({ many }) => ({
    plans: many(schedule),
}));
