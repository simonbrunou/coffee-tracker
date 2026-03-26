import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [
    totalCoffees,
    averageRatingResult,
    topBrewMethods,
    topOrigins,
    recentCoffees,
    ratingDistribution,
  ] = await Promise.all([
    // Total coffees
    prisma.coffee.count({ where: { userId } }),

    // Average rating
    prisma.coffee.aggregate({
      where: { userId, rating: { gt: 0 } },
      _avg: { rating: true },
    }),

    // Top brew methods
    prisma.coffee.groupBy({
      by: ["brewMethod"],
      where: { userId, brewMethod: { not: null } },
      _count: { brewMethod: true },
      orderBy: { _count: { brewMethod: "desc" } },
      take: 5,
    }),

    // Top origins
    prisma.coffee.groupBy({
      by: ["origin"],
      where: { userId, origin: { not: null } },
      _count: { origin: true },
      orderBy: { _count: { origin: "desc" } },
      take: 5,
    }),

    // Recent coffees
    prisma.coffee.findMany({
      where: { userId },
      include: { tags: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

    // Rating distribution (1-5)
    prisma.coffee.groupBy({
      by: ["rating"],
      where: { userId, rating: { gte: 1, lte: 5 } },
      _count: { rating: true },
      orderBy: { rating: "asc" },
    }),
  ]);

  // Coffees per month for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const coffeesInRange = await prisma.coffee.findMany({
    where: {
      userId,
      createdAt: { gte: sixMonthsAgo },
    },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const coffeesPerMonth: Record<string, number> = {};
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    coffeesPerMonth[key] = 0;
  }

  for (const coffee of coffeesInRange) {
    const date = new Date(coffee.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (key in coffeesPerMonth) {
      coffeesPerMonth[key]++;
    }
  }

  const coffeesPerMonthArray = Object.entries(coffeesPerMonth)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return NextResponse.json({
    totalCoffees,
    averageRating: averageRatingResult._avg.rating
      ? Math.round(averageRatingResult._avg.rating * 10) / 10
      : 0,
    topBrewMethods: topBrewMethods.map((item) => ({
      method: item.brewMethod,
      count: item._count.brewMethod,
    })),
    topOrigins: topOrigins.map((item) => ({
      origin: item.origin,
      count: item._count.origin,
    })),
    recentCoffees,
    coffeesPerMonth: coffeesPerMonthArray,
    ratingDistribution: ratingDistribution.map((item) => ({
      rating: item.rating,
      count: item._count.rating,
    })),
  });
}
