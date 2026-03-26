import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { coffeeSchema } from "@/lib/validations";
import { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search");
  const method = searchParams.get("method");
  const rating = searchParams.get("rating");
  const sort = searchParams.get("sort") || "newest";

  const where: Prisma.CoffeeWhereInput = {
    userId: session.user.id,
  };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { roaster: { contains: search } },
      { origin: { contains: search } },
    ];
  }

  if (method) {
    where.brewMethod = method;
  }

  if (rating) {
    where.rating = { gte: parseInt(rating, 10) };
  }

  let orderBy: Prisma.CoffeeOrderByWithRelationInput;
  switch (sort) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "highest-rated":
      orderBy = { rating: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  const coffees = await prisma.coffee.findMany({
    where,
    include: { tags: true },
    orderBy,
  });

  return NextResponse.json(coffees);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = coffeeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { tags, ...data } = result.data;

    const coffee = await prisma.coffee.create({
      data: {
        ...data,
        userId: session.user.id,
        tags: tags
          ? {
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
      },
      include: { tags: true },
    });

    return NextResponse.json(coffee, { status: 201 });
  } catch (error) {
    console.error("Create coffee error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
