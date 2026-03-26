"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const GRIND_SIZES = [
  "Extra Fine",
  "Fine",
  "Medium-Fine",
  "Medium",
  "Medium-Coarse",
  "Coarse",
];

const VARIETIES = ["Arabica", "Robusta", "Liberica", "Excelsa"];

const ORIGIN_SUGGESTIONS = [
  "Ethiopia",
  "Colombia",
  "Brazil",
  "Kenya",
  "Guatemala",
  "Costa Rica",
  "Indonesia",
  "Vietnam",
  "Jamaica",
  "Honduras",
  "Peru",
  "Mexico",
  "India",
  "Rwanda",
  "Tanzania",
];

const FLAVOR_SUGGESTIONS = [
  "Chocolate",
  "Nutty",
  "Fruity",
  "Floral",
  "Citrus",
  "Caramel",
  "Berry",
  "Spicy",
  "Earthy",
  "Vanilla",
];

const TASTING_ATTRIBUTES = [
  { key: "aroma", label: "Aroma" },
  { key: "acidity", label: "Acidity" },
  { key: "body", label: "Body" },
  { key: "sweetness", label: "Sweetness" },
  { key: "bitterness", label: "Bitterness" },
] as const;

type TastingKey = (typeof TASTING_ATTRIBUTES)[number]["key"];

interface CoffeeFormData {
  name: string;
  roaster: string;
  origin: string;
  variety: string;
  brewMethod: string;
  grindSize: string;
  waterTemp: string;
  doseGrams: string;
  yieldMl: string;
  brewTimeSeconds: string;
  rating: number;
  aroma: number;
  acidity: number;
  body: number;
  sweetness: number;
  bitterness: number;
  flavorNotes: string;
  notes: string;
  tags: string;
}

interface CoffeeFormProps {
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading: boolean;
}

function TastingSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="min-w-[80px] text-sm">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={cn(
              "h-8 w-8 rounded-md text-xs font-medium transition-colors",
              level <= value
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-400 hover:bg-amber-100"
            )}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CoffeeForm({ initialData, onSubmit, isLoading }: CoffeeFormProps) {
  const [form, setForm] = React.useState<CoffeeFormData>(() => ({
    name: (initialData?.name as string) || "",
    roaster: (initialData?.roaster as string) || "",
    origin: (initialData?.origin as string) || "",
    variety: (initialData?.variety as string) || "",
    brewMethod: (initialData?.brewMethod as string) || "",
    grindSize: (initialData?.grindSize as string) || "",
    waterTemp: initialData?.waterTemp != null ? String(initialData.waterTemp) : "",
    doseGrams: initialData?.doseGrams != null ? String(initialData.doseGrams) : "",
    yieldMl: initialData?.yieldMl != null ? String(initialData.yieldMl) : "",
    brewTimeSeconds:
      initialData?.brewTimeSeconds != null ? String(initialData.brewTimeSeconds) : "",
    rating: (initialData?.rating as number) || 0,
    aroma: (initialData?.aroma as number) || 0,
    acidity: (initialData?.acidity as number) || 0,
    body: (initialData?.body as number) || 0,
    sweetness: (initialData?.sweetness as number) || 0,
    bitterness: (initialData?.bitterness as number) || 0,
    flavorNotes: (initialData?.flavorNotes as string) || "",
    notes: (initialData?.notes as string) || "",
    tags: Array.isArray(initialData?.tags)
      ? (initialData.tags as Array<{ name: string }>).map((t) => t.name).join(", ")
      : "",
  }));

  const [customVariety, setCustomVariety] = React.useState(
    initialData?.variety && !VARIETIES.includes(initialData.variety as string)
      ? (initialData.variety as string)
      : ""
  );
  const [showCustomVariety, setShowCustomVariety] = React.useState(
    !!initialData?.variety && !VARIETIES.includes(initialData.variety as string)
  );

  const [showOriginSuggestions, setShowOriginSuggestions] = React.useState(false);
  const [showFlavorSuggestions, setShowFlavorSuggestions] = React.useState(false);

  const update = (key: keyof CoffeeFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    const data: Record<string, unknown> = {
      name: form.name,
      roaster: form.roaster || null,
      origin: form.origin || null,
      variety: showCustomVariety ? customVariety || null : form.variety || null,
      brewMethod: form.brewMethod || null,
      grindSize: form.grindSize || null,
      waterTemp: form.waterTemp ? parseFloat(form.waterTemp) : null,
      doseGrams: form.doseGrams ? parseFloat(form.doseGrams) : null,
      yieldMl: form.yieldMl ? parseFloat(form.yieldMl) : null,
      brewTimeSeconds: form.brewTimeSeconds ? parseInt(form.brewTimeSeconds, 10) : null,
      rating: form.rating,
      aroma: form.aroma || null,
      acidity: form.acidity || null,
      body: form.body || null,
      sweetness: form.sweetness || null,
      bitterness: form.bitterness || null,
      flavorNotes: form.flavorNotes || null,
      notes: form.notes || null,
      tags,
    };

    onSubmit(data);
  };

  const addFlavorNote = (flavor: string) => {
    const existing = form.flavorNotes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!existing.includes(flavor)) {
      const updated = [...existing, flavor].join(", ");
      update("flavorNotes", updated);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g. Morning Blend"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roaster">Roaster</Label>
            <Input
              id="roaster"
              placeholder="e.g. Blue Bottle"
              value={form.roaster}
              onChange={(e) => update("roaster", e.target.value)}
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              placeholder="e.g. Ethiopia"
              value={form.origin}
              onChange={(e) => update("origin", e.target.value)}
              onFocus={() => setShowOriginSuggestions(true)}
              onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
            />
            {showOriginSuggestions && (
              <div className="absolute z-10 top-full mt-1 w-full rounded-md border border-amber-100 bg-white shadow-md max-h-40 overflow-y-auto">
                {ORIGIN_SUGGESTIONS.filter((o) =>
                  o.toLowerCase().includes(form.origin.toLowerCase())
                ).map((origin) => (
                  <button
                    key={origin}
                    type="button"
                    className="w-full px-3 py-1.5 text-left text-sm hover:bg-amber-50"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      update("origin", origin);
                      setShowOriginSuggestions(false);
                    }}
                  >
                    {origin}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label>Variety</Label>
            <div className="flex gap-2">
              <Select
                value={showCustomVariety ? "__custom__" : form.variety}
                onValueChange={(val) => {
                  if (val === "__custom__") {
                    setShowCustomVariety(true);
                    update("variety", "");
                  } else {
                    setShowCustomVariety(false);
                    setCustomVariety("");
                    update("variety", val);
                  }
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select variety" />
                </SelectTrigger>
                <SelectContent>
                  {VARIETIES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                  <SelectItem value="__custom__">Custom...</SelectItem>
                </SelectContent>
              </Select>
              {showCustomVariety && (
                <Input
                  placeholder="Enter custom variety"
                  value={customVariety}
                  onChange={(e) => setCustomVariety(e.target.value)}
                  className="flex-1"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brewing Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Brewing Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Brew Method</Label>
            <Select
              value={form.brewMethod}
              onValueChange={(val) => update("brewMethod", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {BREW_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Grind Size</Label>
            <Select
              value={form.grindSize}
              onValueChange={(val) => update("grindSize", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grind size" />
              </SelectTrigger>
              <SelectContent>
                {GRIND_SIZES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waterTemp">Water Temp (°C)</Label>
            <Input
              id="waterTemp"
              type="number"
              placeholder="e.g. 93"
              value={form.waterTemp}
              onChange={(e) => update("waterTemp", e.target.value)}
              min={0}
              max={100}
              step={0.5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doseGrams">Dose (g)</Label>
            <Input
              id="doseGrams"
              type="number"
              placeholder="e.g. 18"
              value={form.doseGrams}
              onChange={(e) => update("doseGrams", e.target.value)}
              min={0}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yieldMl">Yield (ml)</Label>
            <Input
              id="yieldMl"
              type="number"
              placeholder="e.g. 36"
              value={form.yieldMl}
              onChange={(e) => update("yieldMl", e.target.value)}
              min={0}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brewTimeSeconds">Brew Time (seconds)</Label>
            <Input
              id="brewTimeSeconds"
              type="number"
              placeholder="e.g. 25"
              value={form.brewTimeSeconds}
              onChange={(e) => update("brewTimeSeconds", e.target.value)}
              min={0}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tasting Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasting Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <StarRating
              value={form.rating}
              onChange={(val) => update("rating", val)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {TASTING_ATTRIBUTES.map((attr) => (
              <TastingSelector
                key={attr.key}
                label={attr.label}
                value={form[attr.key]}
                onChange={(val) => update(attr.key as TastingKey, val)}
              />
            ))}
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="flavorNotes">Flavor Notes</Label>
            <Input
              id="flavorNotes"
              placeholder="e.g. Chocolate, Fruity, Caramel"
              value={form.flavorNotes}
              onChange={(e) => update("flavorNotes", e.target.value)}
              onFocus={() => setShowFlavorSuggestions(true)}
              onBlur={() => setTimeout(() => setShowFlavorSuggestions(false), 200)}
            />
            {showFlavorSuggestions && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {FLAVOR_SUGGESTIONS.map((flavor) => (
                  <button
                    key={flavor}
                    type="button"
                    className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-800 hover:bg-amber-100 transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addFlavorNote(flavor);
                    }}
                  >
                    + {flavor}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes & Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notes & Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this coffee..."
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              placeholder="e.g. morning, favorite, light roast"
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
            />
            {form.tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading || !form.name.trim()}>
          {isLoading ? "Saving..." : initialData ? "Update Coffee" : "Add Coffee"}
        </Button>
      </div>
    </form>
  );
}
