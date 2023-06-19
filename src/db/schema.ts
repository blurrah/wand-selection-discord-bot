import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  guildId: text("guild_id").notNull(),
});

export const usersWands = relations(users, ({ one }) => ({
  wand: one(wands, {
    fields: [users.id],
    references: [wands.userId],
  }),
}));

export const wands = pgTable("wands", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  wood: text("wood").notNull(),
  core: text("core").notNull(),
  length: integer("length").notNull(),
});
