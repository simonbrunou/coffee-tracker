"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Coffee, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isLoggedIn = status === "authenticated" && !!session?.user;

  return (
    <nav className="bg-amber-800 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Coffee className="h-6 w-6" />
            <span>BrewLog</span>
          </Link>

          {/* Right: Desktop nav */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/coffees"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  My Coffees
                </Link>
                <Link
                  href="/coffees/new"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Add Coffee
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700 transition-colors">
                      {session.user.name || "Account"}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-amber-600 truncate">
                        {session.user.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Login
                </Link>
                <Link href="/register">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-amber-800 hover:bg-amber-50"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden rounded-md p-2 hover:bg-amber-700 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-amber-700">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/coffees"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700"
                  onClick={() => setMobileOpen(false)}
                >
                  My Coffees
                </Link>
                <Link
                  href="/coffees/new"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Add Coffee
                </Link>
                <div className="border-t border-amber-700 pt-2 mt-2">
                  <p className="px-3 py-1 text-sm font-medium">
                    {session?.user?.name}
                  </p>
                  <p className="px-3 py-1 text-xs text-amber-200">
                    {session?.user?.email}
                  </p>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full text-left rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-amber-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
