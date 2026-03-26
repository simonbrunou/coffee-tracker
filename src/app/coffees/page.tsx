"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Coffee, Loader2 } from "lucide-react";

const BREW_METHODS = [
  "Espresso",
  "Pour Over",
  "French Press",
  "AeroPress",
  "Moka Pot",
  "Cold Brew",
  "Drip",
  "Chemex",
  "Siphon",
  "Turkish",
];

interface CoffeeTag {
  id: string;
  name: string;
}

interface CoffeeListItem {
  id: string;
  name: string;
  roaster: string | null;
  origin: string | null;
  brewMethod: string | null;
  rating: number;
  notes: string | null;
  tags: CoffeeTag[];
  createdAt: string;
}

export default function CoffeesPage() {
  const router = useRouter();

  const [coffees, setCoffees] = React.useState<CoffeeListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");
  const [methodFilter, setMethodFilter] = React.useState("");
  const [ratingFilter, setRatingFilter] = React.useState("");
  const [sort, setSort] = React.useState("newest");

  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    async function fetchCoffees() {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (methodFilter) params.set("method", methodFilter);
        if (ratingFilter) params.set("rating", ratingFilter);
        if (sort) params.set("sort", sort);

        const res = await fetch(`/api/coffees?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load coffees");
        const data = await res.json();
        setCoffees(Array.isArray(data) ? data : data.coffees ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCoffees();
  }, [debouncedSearch, methodFilter, ratingFilter, sort]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">My Coffees</h1>
          <p className="text-amber-600 mt-1">
            Track and explore your coffee collection
          </p>
        </div>
        <Button onClick={() => router.push("/coffees/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Coffee
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
          <Input
            placeholder="Search coffees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={methodFilter}
          onValueChange={(val) => setMethodFilter(val === "__all__" ? "" : val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Brew method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All methods</SelectItem>
            {BREW_METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={ratingFilter}
          onValueChange={(val) =>
            setRatingFilter(val === "__all__" ? "" : val)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Min rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">Any rating</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r}+ stars
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="highest-rated">Highest rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="mt-4 text-amber-600 text-sm">Loading coffees...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-800 font-medium">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && coffees.length === 0 && (
        <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-12 text-center">
          <Coffee className="mx-auto h-16 w-16 text-amber-300" />
          <h2 className="mt-4 text-xl font-semibold text-amber-900">
            {debouncedSearch || methodFilter || ratingFilter
              ? "No coffees match your filters"
              : "No coffees yet"}
          </h2>
          <p className="mt-2 text-amber-600 max-w-md mx-auto">
            {debouncedSearch || methodFilter || ratingFilter
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Start building your coffee journal by adding your first brew. Track flavors, methods, and ratings to discover your preferences."}
          </p>
          {!(debouncedSearch || methodFilter || ratingFilter) && (
            <Button className="mt-6" onClick={() => router.push("/coffees/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Coffee
            </Button>
          )}
        </div>
      )}

      {/* Coffee Grid */}
      {!isLoading && !error && coffees.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coffees.map((coffee) => (
            <Card
              key={coffee.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => router.push(`/coffees/${coffee.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-amber-900 truncate">
                      {coffee.name}
                    </h3>
                    {coffee.roaster && (
                      <p className="text-sm text-amber-600 truncate">
                        {coffee.roaster}
                      </p>
                    )}
                  </div>
                  {coffee.brewMethod && (
                    <Badge variant="secondary" className="shrink-0">
                      {coffee.brewMethod}
                    </Badge>
                  )}
                </div>

                <div className="mt-3">
                  <StarRating value={coffee.rating} readonly className="[&_svg]:h-4 [&_svg]:w-4" />
                </div>

                {coffee.origin && (
                  <p className="mt-2 text-xs text-amber-500">
                    Origin: {coffee.origin}
                  </p>
                )}

                {coffee.notes && (
                  <p className="mt-2 text-sm text-amber-700 line-clamp-2">
                    {coffee.notes}
                  </p>
                )}

                {coffee.tags && coffee.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {coffee.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                    {coffee.tags.length > 3 && (
                      <span className="text-xs text-amber-400">
                        +{coffee.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <p className="mt-3 text-xs text-amber-400">
                  {new Date(coffee.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
