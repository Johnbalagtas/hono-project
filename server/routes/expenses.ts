import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";



const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
})

type Expense = z.infer<typeof expenseSchema>;

const fakeExpenses: Expense[] = [
  { id: 1, title: "Car Insurance", amount: 294.67 },
  { id: 2, title: "Rent", amount: 1000 },
  { id: 3, title: "Groceries", amount: 200 },
  { id: 4, title: "Phone Bill", amount: 50 },
  { id: 5, title: "Internet", amount: 50 },
];

const createPostSchema = z.object({
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

export const expensesRoute = new Hono();

const expenses = expensesRoute.get("/", (c) => {
  return c.json({ expenses: fakeExpenses });
});

const expensePost = expensesRoute.post("/", zValidator("json", createPostSchema), async (c) => {
  const expense = c.req.valid("json");
  fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });
  c.status(201);
  return c.json({ expense });
});

expensesRoute.get("/:id{[0-9]+}", (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const expense = fakeExpenses.find((expense) => expense.id === id);
  if (!expense) {
    return c.notFound();
  }
  return c.json({ expense });
});

expensesRoute.delete("/:id{[0-9]+}", (c) => {
  const id = Number.parseInt(c.req.param("id"));
  const index = fakeExpenses.findIndex((expense) => expense.id === id);
  if (index === -1) {
    return c.notFound();
  }
  const deletedExpense = fakeExpenses.splice(index, 1)[0];
  return c.json({ message: deletedExpense });
});

const total = expensesRoute.get("/total-spent", (c) => {
  const totalExpense = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  return c.json({ totalExpense });
})

export default expensesRoute;
export type ApiRoutesType = typeof total;
export type ExpenseType = typeof expenses;
export type ExpensePostType = typeof expensePost; 