"use client";

// Purpose: Render the dashboard's persistent research navigation shell with client-side routing.

import { ArrowLeftFromLine, Menu, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  navItems,
  utilityNavItems,
} from "@/features/dashboard/data/dashboard-content";
import { MotionDiv } from "@/features/landing/components/motion-primitives";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  return (
    <>
      <details className="sticky top-0 z-40 border-b border-white/[0.06] bg-surface/90 backdrop-blur-xl md:hidden [&>summary::-webkit-details-marker]:hidden">
        <summary className="flex h-16 cursor-pointer list-none items-center justify-between px-5">
          <Link
            href="/"
            className="outline-none transition-transform hover:scale-[0.98]"
          >
            <Logo size="sm" />
          </Link>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/[0.04] hover:text-primary">
            <Menu className="h-4 w-4" />
          </span>
        </summary>
        <nav
          className="space-y-1 border-t border-white/[0.05] px-3 py-3"
          aria-label="Mobile dashboard"
        >
          {[...navItems, ...utilityNavItems].map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm font-semibold transition-colors border-l-2",
                  item.active
                    ? "bg-primary/5 text-primary border-primary"
                    : "text-on-surface-variant border-transparent hover:bg-white/[0.04] hover:text-on-surface",
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </details>

      <MotionDiv
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel sticky top-0 hidden h-screen w-72 shrink-0 flex-col rounded-none border-y-0 border-l-0 py-6 md:flex bg-surface/40"
        initial={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <div className="border-b border-white/[0.05] px-6 pb-6">
          <Link
            href="/"
            className="outline-none transition-transform hover:scale-[0.98]"
          >
            <Logo size="sm" />
          </Link>
          <p className="mt-2.5 font-display text-[10px] font-bold uppercase tracking-wider text-outline">
            Autonomous Research
          </p>
        </div>

        <nav
          className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
          aria-label="Dashboard"
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <MotionDiv
                animate={{ opacity: 1, x: 0 }}
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                transition={{ delay: index * 0.025, duration: 0.22 }}
              >
                <Link
                  href={item.href ?? "#"}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm font-semibold transition-all duration-200 active:scale-[0.98] border-l-2",
                    item.active
                      ? "bg-primary/5 text-primary border-primary shadow-[0_0_15px_rgba(173,198,255,0.06)]"
                      : "text-on-surface-variant border-transparent hover:bg-white/[0.02] hover:text-on-surface hover:border-white/10",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </MotionDiv>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 border-t border-white/[0.05] px-4 py-5">
          <Button asChild className="w-full">
            <Link href="/dashboard">
              <Plus className="h-4 w-4" />
              New Research
            </Link>
          </Button>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm font-semibold text-on-surface-variant transition-all hover:bg-white/[0.04] hover:text-on-surface"
          >
            <ArrowLeftFromLine className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          {utilityNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-display text-sm font-semibold text-on-surface-variant transition-all hover:bg-white/[0.04] hover:text-on-surface"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </MotionDiv>
    </>
  );
}
