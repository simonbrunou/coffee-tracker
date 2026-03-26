"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Coffee, ClipboardList, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Coffee,
    title: "Log & Rate",
    description:
      "Record every cup you try. Rate your coffees and add tasting notes to remember the ones you loved.",
  },
  {
    icon: ClipboardList,
    title: "Brewing Details",
    description:
      "Track brew methods, grind sizes, water temperatures, and more to perfect your technique over time.",
  },
  {
    icon: BarChart3,
    title: "Personal Dashboard",
    description:
      "See your coffee stats at a glance. Discover patterns in your preferences and explore new flavors.",
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || (status === "authenticated" && session)) {
    return null;
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-amber-900 sm:text-6xl">
              Track Your Coffee Journey
            </h1>
            <p className="mt-6 text-lg leading-8 text-amber-700">
              Discover, log, and rate your coffee experiences. From your morning
              espresso to that special single-origin pour-over, keep a record of
              every memorable cup.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-amber-600">
              Simple tools to elevate your coffee experience
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="text-center transition-shadow hover:shadow-md"
              >
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                    <feature.icon className="h-7 w-7 text-amber-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-amber-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA footer */}
      <section className="bg-amber-800 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to start brewing better?
          </h2>
          <p className="mt-4 text-amber-200">
            Join BrewLog and never forget a great cup again.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-amber-800 hover:bg-amber-50 text-base"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
