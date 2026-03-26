import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { coffeeSchema } from "@/lib/validations";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const coffee = await prisma.coffee.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!coffee) {
    return NextResponse.json({ error: "Coffee not found" }, { status: 404 });
  }

  if (coffee.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(coffee);
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await prisma.coffee.findUnique({
    where: { id },
    include: { tags: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Coffee not found" }, { status: 404 });
  }

  if (existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const coffee = await prisma.coffee.update({
      where: { id },
      data: {
        ...data,
        tags: {
          set: [],
          ...(tags
            ? {
                connectOrCreate: tags.map((tag) => ({
                  where: { name: tag },
                  create: { name: tag },
                })),
              }
            : {}),
        },
      },
      include: { tags: true },
    });

    return NextResponse.json(coffee);
  } catch (error) {
    console.error("Update coffee error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const coffee = await prisma.coffee.findUnique({
    where: { id },
  });

  if (!coffee) {
    return NextResponse.json({ error: "Coffee not found" }, { status: 404 });
  }

  if (coffee.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.coffee.delete({ where: { id } });

  return NextResponse.json({ message: "Coffee deleted" });
}
