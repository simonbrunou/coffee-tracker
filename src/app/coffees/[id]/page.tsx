"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Pencil, Trash2, Coffee } from "lucide-react";

interface CoffeeTag {
  id: string;
  name: string;
}

interface CoffeeEntry {
  id: string;
  name: string;
  roaster: string | null;
  origin: string | null;
  variety: string | null;
  brewMethod: string | null;
  grindSize: string | null;
  waterTemp: number | null;
  doseGrams: number | null;
  yieldMl: number | null;
  brewTimeSeconds: number | null;
  rating: number;
  aroma: number | null;
  acidity: number | null;
  body: number | null;
  sweetness: number | null;
  bitterness: number | null;
  flavorNotes: string | null;
  notes: string | null;
  tags: CoffeeTag[];
  createdAt: string;
  updatedAt: string;
}

const TASTING_LABELS: Record<string, string> = {
  aroma: "Aroma",
  acidity: "Acidity",
  body: "Body",
  sweetness: "Sweetness",
  bitterness: "Bitterness",
};

const TASTING_COLORS: Record<string, string> = {
  aroma: "bg-purple-500",
  acidity: "bg-yellow-500",
  body: "bg-amber-700",
  sweetness: "bg-pink-500",
  bitterness: "bg-red-600",
};

function TastingBar({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-amber-800 font-medium">{label}</span>
        <span className="text-amber-600">{value}/5</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-amber-100">
        <div
          className={`h-2.5 rounded-full transition-all ${colorClass}`}
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between py-2 border-b border-amber-50 last:border-0">
      <span className="text-sm text-amber-600">{label}</span>
      <span className="text-sm font-medium text-amber-900">{value}</span>
    </div>
  );
}

export default function CoffeeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const id = params.id as string;

  const [coffee, setCoffee] = React.useState<CoffeeEntry | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchCoffee() {
      try {
        const res = await fetch(`/api/coffees/${id}`);
        if (!res.ok) throw new Error("Coffee not found");
        const data = await res.json();
        setCoffee(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load coffee");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCoffee();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/coffees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete coffee");

      toast({
        title: "Coffee deleted",
        description: `"${coffee?.name}" has been removed.`,
        variant: "success",
      });

      router.push("/coffees");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete",
        variant: "error",
      });
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-24 animate-pulse rounded bg-amber-100" />
          <div className="h-12 w-64 animate-pulse rounded bg-amber-100" />
          <div className="h-96 animate-pulse rounded-lg bg-amber-50" />
        </div>
      </div>
    );
  }

  if (error || !coffee) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-800 font-medium">{error || "Coffee not found"}</p>
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

  const hasTastingProfile =
    coffee.aroma || coffee.acidity || coffee.body || coffee.sweetness || coffee.bitterness;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/coffees")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Coffees
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">{coffee.name}</h1>
          {coffee.roaster && (
            <p className="text-amber-600 mt-1">by {coffee.roaster}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <StarRating value={coffee.rating} readonly />
            {coffee.brewMethod && (
              <Badge variant="secondary">{coffee.brewMethod}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/coffees/${id}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Coffee</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete &ldquo;{coffee.name}&rdquo;? This
                  action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coffee Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Coffee Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DetailRow label="Origin" value={coffee.origin} />
            <DetailRow label="Variety" value={coffee.variety} />
            <DetailRow label="Brew Method" value={coffee.brewMethod} />
            <DetailRow label="Grind Size" value={coffee.grindSize} />
            <DetailRow
              label="Water Temp"
              value={coffee.waterTemp != null ? `${coffee.waterTemp}°C` : null}
            />
            <DetailRow
              label="Dose"
              value={coffee.doseGrams != null ? `${coffee.doseGrams}g` : null}
            />
            <DetailRow
              label="Yield"
              value={coffee.yieldMl != null ? `${coffee.yieldMl}ml` : null}
            />
            <DetailRow
              label="Brew Time"
              value={
                coffee.brewTimeSeconds != null ? `${coffee.brewTimeSeconds}s` : null
              }
            />
          </CardContent>
        </Card>

        {/* Tasting Profile */}
        {hasTastingProfile && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tasting Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(TASTING_LABELS).map(([key, label]) => {
                const value = coffee[key as keyof CoffeeEntry] as number | null;
                if (!value) return null;
                return (
                  <TastingBar
                    key={key}
                    label={label}
                    value={value}
                    colorClass={TASTING_COLORS[key]}
                  />
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Flavor Notes */}
        {coffee.flavorNotes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Flavor Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {coffee.flavorNotes
                  .split(",")
                  .map((note) => note.trim())
                  .filter(Boolean)
                  .map((note) => (
                    <Badge key={note} variant="outline">
                      {note}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {coffee.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-800 whitespace-pre-wrap">
                {coffee.notes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tags */}
      {coffee.tags && coffee.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {coffee.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Timestamps */}
      <p className="mt-6 text-xs text-amber-400">
        Added {new Date(coffee.createdAt).toLocaleDateString()}
        {coffee.updatedAt !== coffee.createdAt &&
          ` | Updated ${new Date(coffee.updatedAt).toLocaleDateString()}`}
      </p>
    </div>
  );
}
