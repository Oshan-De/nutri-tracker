import {
  pgTable,
  serial,
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

export const foodLogs = pgTable('food_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  foodName: text('food_name').notNull(),
  calories: integer('calories').notNull(),
  protein: integer('protein'),
  carbs: integer('carbs'),
  fat: integer('fat'),
  mealType: text('meal_type').notNull(),
  logDate: date('log_date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
})
