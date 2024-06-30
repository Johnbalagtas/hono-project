import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { type ExpenseType } from "../../../server/routes/expenses";
import { hc } from "hono/client";

export const Route = createFileRoute("/expenses")({
  component: () => Expenses(),
});

const client = hc<ExpenseType>("/api/expenses");

async function getAllExpenses() {
  const res = await client["index"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getAllExpenses,
  });

  if (error) return "An error has occurred: " + error.message;

  

  //  const totalExpense = data?.expenses.reduce((acc, expense) => acc + expense.amount, 0);
  //  console.log(totalExpense)

  return (
    <div className="p-4 max-w-3xl m-auto">
      <Table>
        <TableCaption>A list of your recent expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {<Skeleton className="h-4" />}
                    </TableCell>
                    <TableCell>{<Skeleton className="h-4" />}</TableCell>
                    <TableCell>{<Skeleton className="h-4" />}</TableCell>
                  </TableRow>
                ))
            : data?.expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
