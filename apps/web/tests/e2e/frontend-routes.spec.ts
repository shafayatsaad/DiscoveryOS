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
  { path: `/projects/${projectId}/reports`, heading: "Solid-State Polymer Electrolyte Evidence Review" },
  { path: `/projects/${projectId}/settings`, heading: "Settings" },
];

for (const route of routes) {
  test(`renders ${route.path}`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
  });
}

test("dashboard magic moment streams to report links", async ({ page }) => {
  const streamEvents = [
    { event_type: "pipeline.started", stage: null, progress: 5 },
    { event_type: "stage.completed", stage: "planner", progress: 18 },
    { event_type: "stage.completed", stage: "retriever", progress: 42 },
    { event_type: "stage.completed", stage: "knowledge_graph", progress: 68 },
    { event_type: "stage.completed", stage: "report", progress: 90 },
    { event_type: "pipeline.completed", stage: "report", progress: 100 },
  ].map((event) => ({
    ...event,
    message: "Demo event",
    timestamp: new Date().toISOString(),
    metadata: {
      papers_count: 4,
      evidence_count: 6,
      contradictions_count: 1,
      novelty_score: event.progress >= 90 ? 0.82 : null,
      current_agent: event.stage,
      execution_time_ms: 120,
      stages: {},
    },
  }));

  await page.route("**/api/v1/projects/*/run", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      json: {
        run_id: "e2e-demo-run",
        project_id: projectId,
        status: "running",
        progress: 5,
        current_stage: "planner",
      },
      status: 202,
    });
  });

  await page.route("**/api/v1/projects/*/stream", async (route) => {
    await route.fulfill({
      body: streamEvents.map((event) => `data: ${JSON.stringify(event)}\n\n`).join(""),
      contentType: "text/event-stream",
      headers: {
        "Cache-Control": "no-cache",
      },
      status: 200,
    });
  });

  await page.goto("/dashboard");
  await page.getByLabel("Research problem").fill("Can microplastics contribute to Alzheimer's disease?");
  await page.getByRole("button", { name: "Run Query" }).click();
  await expect(page.getByRole("heading", { name: "Discovery Complete" })).toBeVisible({
    timeout: 9_000,
  });
  await expect(page.getByText("Report Generated")).toBeVisible();
  await expect(page.getByRole("link", { name: "Reports", exact: true })).toBeVisible();
});
