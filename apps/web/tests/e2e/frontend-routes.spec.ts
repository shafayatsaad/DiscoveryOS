// Purpose: Smoke-test the completed DiscoveryOS frontend surfaces and key navigation destinations.

import { expect, test } from "@playwright/test";

const projectId = "polymer-electrolyte-discovery";

const routes = [
  { path: "/", heading: "Accelerate Scientific Discovery" },
  { path: "/dashboard", heading: "What scientific problem are you trying to solve today?" },
  { path: `/projects/${projectId}`, heading: "Solid-State Polymer Electrolytes" },
  { path: `/projects/${projectId}/pipeline`, heading: "Research Pipeline" },
  { path: `/projects/${projectId}/evidence`, heading: "Evidence Explorer" },
  { path: `/projects/${projectId}/graph`, heading: "PEO-LiTFSI" },
  { path: `/projects/${projectId}/ml`, heading: "ML Insights" },
  { path: `/projects/${projectId}/hypotheses`, heading: "Hypotheses" },
  { path: `/projects/${projectId}/experiments`, heading: "Suggested Experiments" },
  { path: `/projects/${projectId}/reports`, heading: "Evidence-backed Research Report" },
  { path: `/projects/${projectId}/settings`, heading: "Settings" },
];

for (const route of routes) {
  test(`renders ${route.path}`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
  });
}

test("dashboard magic moment streams to report links", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByLabel("Research problem").fill("Can microplastics contribute to Alzheimer's disease?");
  await page.getByRole("button", { name: "Run Query" }).click();
  await expect(page.getByText("DiscoveryOS Pipeline")).toBeVisible();
  await expect(page.getByText("Writing report")).toBeVisible({ timeout: 9_000 });
  await expect(page.getByRole("link", { name: "Report", exact: true })).toBeVisible();
});
