"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Coffee, Star, Flame, Globe, Plus, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";

interface StatsData {
  totalCoffees: number;
  averageRating: number;
  topBrewMethods: { brewMethod: string; _count: { brewMethod: number } }[];
  topOrigins: { origin: string; _count: { origin: number } }[];
  recentCoffees: {
    id: string;
    name: string;
    roaster: string;
    rating: number;
    brewMethod: string;
    createdAt: string;
  }[];
  coffeesPerMonth: { month: string; count: number }[];
  ratingDistribution: { rating: number; _count: { rating: number } }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <p className="text-amber-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-700">Error</CardTitle>
            <CardDescription className="text-red-500">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!stats || stats.totalCoffees === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-2">
              <Coffee className="h-12 w-12 text-amber-400" />
            </div>
            <CardTitle>No coffees yet</CardTitle>
            <CardDescription>
              Start tracking your coffee journey by adding your first cup!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/coffees/new">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Coffee
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const favoriteMethod =
    stats.topBrewMethods.length > 0 ? stats.topBrewMethods[0].brewMethod : "N/A";
  const topOrigin =
    stats.topOrigins.length > 0 ? stats.topOrigins[0].origin : "N/A";

  const maxBrewCount =
    stats.topBrewMethods.length > 0
      ? Math.max(...stats.topBrewMethods.map((m) => m._count.brewMethod))
      : 1;
  const maxOriginCount =
    stats.topOrigins.length > 0
      ? Math.max(...stats.topOrigins.map((o) => o._count.origin))
      : 1;

  const ratingData = [1, 2, 3, 4, 5].map((rating) => {
    const found = stats.ratingDistribution.find((r) => r.rating === rating);
    return {
      rating: `${rating} star${rating !== 1 ? "s" : ""}`,
      count: found ? found._count.rating : 0,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Dashboard</h1>
        <p className="text-amber-600 mt-1">Your coffee tracking overview</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-sm font-medium">
              Total Coffees
            </CardDescription>
            <Coffee className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {stats.totalCoffees}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-sm font-medium">
              Average Rating
            </CardDescription>
            <Star className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {stats.averageRating.toFixed(1)}{" "}
              <span className="text-lg font-normal text-amber-500">/ 5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-sm font-medium">
              Favorite Method
            </CardDescription>
            <Flame className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 truncate">
              {favoriteMethod}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-sm font-medium">
              Top Origin
            </CardDescription>
            <Globe className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 truncate">
              {topOrigin}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coffees Over Time</CardTitle>
            <CardDescription>Your coffee intake over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            {mounted && stats.coffeesPerMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={stats.coffeesPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#92400e" }}
                    stroke="#d97706"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#92400e" }}
                    stroke="#d97706"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#d97706"
                    strokeWidth={2}
                    fill="#f59e0b"
                    dot={{ fill: "#d97706", strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: "#b45309", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : mounted ? (
              <p className="text-amber-500 text-sm text-center py-8">
                No monthly data yet
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
            <CardDescription>How you rate your coffees</CardDescription>
          </CardHeader>
          <CardContent>
            {mounted ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ratingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" />
                  <XAxis
                    dataKey="rating"
                    tick={{ fontSize: 12, fill: "#92400e" }}
                    stroke="#d97706"
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#92400e" }}
                    stroke="#d97706"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fffbeb",
                      border: "1px solid #fde68a",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Brew Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Brew Methods</CardTitle>
            <CardDescription>Your most used methods</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topBrewMethods.length > 0 ? (
              <div className="space-y-3">
                {stats.topBrewMethods.map((method) => (
                  <div key={method.brewMethod} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-amber-900">
                        {method.brewMethod}
                      </span>
                      <span className="text-amber-600">
                        {method._count.brewMethod}
                      </span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(method._count.brewMethod / maxBrewCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-amber-500 text-sm">No brew methods recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Top Origins */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Origins</CardTitle>
            <CardDescription>Where your beans come from</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topOrigins.length > 0 ? (
              <div className="space-y-3">
                {stats.topOrigins.map((origin) => (
                  <div key={origin.origin} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-amber-900">
                        {origin.origin}
                      </span>
                      <span className="text-amber-600">
                        {origin._count.origin}
                      </span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(origin._count.origin / maxOriginCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-amber-500 text-sm">No origins recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Coffees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Coffees</CardTitle>
            <CardDescription>Your latest additions</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentCoffees.length > 0 ? (
              <div className="space-y-3">
                {stats.recentCoffees.slice(0, 5).map((coffee) => (
                  <Link
                    key={coffee.id}
                    href={`/coffees/${coffee.id}`}
                    className="block p-3 rounded-lg border border-amber-50 hover:bg-amber-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-amber-900 truncate">
                          {coffee.name}
                        </p>
                        <p className="text-xs text-amber-500 truncate">
                          {coffee.roaster}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {coffee.brewMethod}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <StarRating value={coffee.rating} readonly className="[&_svg]:h-4 [&_svg]:w-4" />
                      <span className="text-xs text-amber-400">
                        {new Date(coffee.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-amber-500 text-sm">No coffees recorded yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
