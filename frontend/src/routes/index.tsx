import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ApiRoutesType } from "../../../server/routes/expenses";
import { hc } from "hono/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: () => Index(),
});

const client = hc<ApiRoutesType>("/api/expenses");

async function getTotalSpent() {
  const res = await client["total-spent"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  const data = await res.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spent </CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>{isPending ? "..." : data.totalExpense}</CardContent>
      </Card>
      <CardFooter></CardFooter>
    </>
  );
}

