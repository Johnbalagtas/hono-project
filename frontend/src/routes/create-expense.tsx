import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm } from "@tanstack/react-form";

import { type ExpensePostType } from "../../../server/routes/expenses";
import { hc } from "hono/client";

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense,
});

const client = hc<ExpensePostType>("/api/expenses");

function CreateExpense() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 3000));
      const res = await client["index"].$post({ json: value });
      if (!res.ok) {
        throw new Error("Server error");
      }
      navigate({ to: "/expenses"})
    },
  });

  return (
    <div className="p-2">
      <h2>Create Expense</h2>

      <form
        className="max-w-xl m-auto "
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="block">
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "Title is required"
                  : value.length < 3
                    ? "First name must be at least 3 characters"
                    : undefined,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return (
                  value.includes("error") && 'No "error" allowed in first name'
                );
              },
            }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={field.name}
                  />
                  {field.state.meta.touchedErrors ? (
                    <em>{field.state.meta.touchedErrors}</em>
                  ) : null}
                </>
              );
            }}
          />
        </div>

        <div>
          <form.Field
            name="amount"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  type="number"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(+e.target.value)}
                  placeholder={field.name}
                />
                {field.state.meta.touchedErrors ? (
                  <em>{field.state.meta.touchedErrors}</em>
                ) : null}
              </>
            )}
          />
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className="mt-4" disabled={!canSubmit}>
              {isSubmitting ? "Submitting" : "Create"}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
