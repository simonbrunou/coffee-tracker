"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CoffeeForm } from "@/components/coffee-form";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewCoffeePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/coffees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create coffee");
      }

      toast({
        title: "Coffee added!",
        description: `"${data.name}" has been added to your collection.`,
        variant: "success",
      });

      router.push("/coffees");
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

      <h1 className="text-3xl font-bold text-amber-900 mb-6">Add New Coffee</h1>

      <CoffeeForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
