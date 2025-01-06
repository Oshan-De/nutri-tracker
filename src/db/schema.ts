import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  date,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  email: text('email'),
  dailyCalorieGoal: integer('daily_calorie_goal').default(2000),
  createdAt: timestamp('created_at').defaultNow(),
})

export const meals = pgTable('meals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id),
  mealName: text('meal_name').notNull(),
  calories: integer('calories').notNull(),
  protein: integer('protein'),
  carbs: integer('carbs'),
  fat: integer('fat'),
  mealType: text('meal_type').notNull(),
  logDate: date('log_date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})
