"use client";

// Purpose: Render a navigable breadcrumb trail showing the current page location.
// Uses Next.js <Link> so every segment is a client-side transition, not a full reload.

import { Fragment } from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export type BreadcrumbSegment = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  segments: BreadcrumbSegment[];
};

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-sm text-on-surface-variant">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 rounded p-1 transition-colors hover:text-primary"
            aria-label="Home"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;

          return (
            <Fragment key={segment.href}>
              <ChevronRight className="h-3.5 w-3.5 text-outline-variant" />
              <li>
                {isLast ? (
                  <span
                    className="rounded px-1 py-0.5 font-medium text-on-surface"
                    aria-current="page"
                  >
                    {segment.label}
                  </span>
                ) : (
                  <Link
                    href={segment.href}
                    className="rounded px-1 py-0.5 transition-colors hover:text-primary"
                  >
                    {segment.label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
