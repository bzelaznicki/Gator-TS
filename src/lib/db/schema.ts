import { pgTable, timestamp, uuid, unique, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export type User = typeof users.$inferSelect;

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
})

export type Feed = typeof feeds.$inferInsert;

export const feed_follows = pgTable("feed_follows", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date()), 
  userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
  feedId: uuid("feed_id").notNull().references(() => feeds.id, {onDelete: "cascade"}),
}, (t) => [
  unique().on(t.userId, t.feedId)
]
)