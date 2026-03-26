"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { CoffeeForm } from "@/components/coffee-form";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditCoffeePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  const [coffeeData, setCoffeeData] = React.useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchCoffee() {
      try {
        const res = await fetch(`/api/coffees/${id}`);
        if (!res.ok) {
          throw new Error("Failed to load coffee");
        }
        const data = await res.json();
        setCoffeeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load coffee");
      } finally {
        setIsFetching(false);
      }
    }
    fetchCoffee();
  }, [id]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/coffees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update coffee");
      }

      toast({
        title: "Coffee updated!",
        description: `"${data.name}" has been updated.`,
        variant: "success",
      });

      router.push(`/coffees/${id}`);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-amber-100" />
          <div className="h-64 animate-pulse rounded-lg bg-amber-50" />
          <div className="h-48 animate-pulse rounded-lg bg-amber-50" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-800 font-medium">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/coffees")}
          >
            Back to Coffees
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <h1 className="text-3xl font-bold text-amber-900 mb-6">Edit Coffee</h1>

      {coffeeData && (
        <CoffeeForm
          initialData={coffeeData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
