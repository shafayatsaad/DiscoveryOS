// Purpose: Store frontend report artifacts in a paper-like structure with export-ready formats.

import { getProjectWorkspace } from "@/features/projects/data/project-workspaces";

export type EvidenceCard = {
  claim: string;
  citation: string;
  confidence: number;
  note: string;
};

export type ReportChart = {
  label: string;
  value: number;
  tone: "primary" | "secondary" | "tertiary" | "error";
};

export type ResearchReport = {
  title: string;
  subtitle: string;
  executiveSummary: string;
  tableOfContents: string[];
  evidenceCards: EvidenceCard[];
  graphSnapshot: {
    nodes: number;
    edges: number;
    centralClaim: string;
    highConfidenceLinks: number;
  };
  charts: ReportChart[];
  contradictions: string[];
  researchGaps: string[];
  suggestedExperiments: string[];
  references: string[];
};

const reportByDomain = {
  Biomedical: {
    title: "Immune Exhaustion Biomarker Evidence Review",
    subtitle: "A source-linked synthesis of checkpoint marker reproducibility across cohorts and assays.",
    executiveSummary:
      "Checkpoint-associated immune exhaustion markers appear reproducible across several cohorts, but assay context strongly affects interpretation. The most reliable next step is matched flow and spatial profiling against a compact marker panel.",
    evidenceCards: [
      {
        claim: "LAG3/TIM3 signals recur in exhausted T-cell signatures.",
        citation: "Checkpoint marker evidence across exhausted T cells. OpenAlex.",
        confidence: 89,
        note: "Strong cohort overlap, with assay-dependent effect size.",
      },
      {
        claim: "Bulk RNA and spatial profiling diverge in mixed-cell samples.",
        citation: "Bulk and spatial immune profiling discordance. OpenAlex.",
        confidence: 76,
        note: "Treat as context-sensitive evidence, not a universal contradiction.",
      },
    ],
    contradictions: [
      "Bulk RNA suggests higher exhaustion burden than spatial profiling in mixed tumor regions.",
      "Flow validation preserves direction for marker expression but changes magnitude across cohorts.",
    ],
    researchGaps: [
      "Longitudinal validation remains limited.",
      "Shared marker panels are inconsistent across studies.",
      "Assay calibration details are frequently absent from abstracts.",
    ],
    suggestedExperiments: [
      "Validate a compact LAG3/TIM3 signature with matched flow and spatial profiling.",
      "Run cross-cohort calibration using a shared marker panel and confidence interval reporting.",
    ],
  },
  Climate: {
    title: "Urban Heat Resilience Evidence Review",
    subtitle: "A synthesis of intervention, exposure, and measurement evidence for dense neighborhoods.",
    executiveSummary:
      "Combined shade networks and reflective roof interventions show stronger heat-resilience potential than either intervention alone. Wearable exposure validation is essential because satellite measures can miss pedestrian-scale shading effects.",
    evidenceCards: [
      {
        claim: "Tree canopy interventions reduce modeled pedestrian exposure.",
        citation: "Urban canopy cooling meta-analysis. OpenAlex.",
        confidence: 85,
        note: "Most consistent when paired with human-scale exposure measures.",
      },
      {
        claim: "Satellite surface temperature can diverge from pedestrian heat exposure.",
        citation: "Satellite versus pedestrian heat discordance. OpenAlex.",
        confidence: 78,
        note: "Important limitation for intervention prioritization.",
      },
    ],
    contradictions: [
      "Surface-temperature improvement does not always match wearable exposure improvement.",
      "Cool roof benefits vary by morphology, orientation, and exposure metric.",
    ],
    researchGaps: [
      "Neighborhood-scale intervention trials are sparse.",
      "Wearable exposure validation is uneven.",
      "Transit-adjacent heat effects need stronger causal evidence.",
    ],
    suggestedExperiments: [
      "Run a block-level intervention comparison with canopy, roof reflectance, and pedestrian sensors.",
      "Compare satellite, stationary, and wearable exposure measurements across shaded routes.",
    ],
  },
  Default: {
    title: "Solid-State Polymer Electrolyte Evidence Review",
    subtitle: "A research-paper style synthesis of candidate materials, graph evidence, and validation gaps.",
    executiveSummary:
      "Ceramic-filled polymer electrolytes show a promising conductivity-stability tradeoff, but interfacial failure remains the main validation risk. Evidence supports focused comparison of LLZO-filled PEO-LiTFSI blends against additive variants under matched protocols.",
    evidenceCards: [
      {
        claim: "Ceramic fillers improve conductivity when dispersion is controlled.",
        citation: "Polymer electrolyte conductivity screen. OpenAlex.",
        confidence: 92,
        note: "High relevance to the current material hypothesis.",
      },
      {
        claim: "High-current cycling can increase interface instability.",
        citation: "Interface failure modes in solid-state lithium cells. arXiv.",
        confidence: 71,
        note: "Risk signal requires matched cycling validation.",
      },
    ],
    contradictions: [
      "Conductivity gains are linked to possible dendrite risk under high-current cycling.",
      "Thermal stability improves in some filler regimes while manufacturability becomes less certain.",
    ],
    researchGaps: [
      "Room-temperature cycling data is incomplete.",
      "Filler dispersion methods are not standardized.",
      "Manufacturability constraints are weakly reported.",
    ],
    suggestedExperiments: [
      "Compare LLZO-filled PEO-LiTFSI blends against ionic-liquid additive variants.",
      "Run matched cycling and thermal protocols with interface imaging after failure.",
    ],
  },
};

export function getResearchReport(projectId: string): ResearchReport {
  const project = getProjectWorkspace(projectId);
  const domainReport =
    project.domain === "Biomedical"
      ? reportByDomain.Biomedical
      : project.domain === "Climate"
        ? reportByDomain.Climate
        : reportByDomain.Default;

  return {
    ...domainReport,
    tableOfContents: [
      "Executive Summary",
      "Evidence Cards",
      "Knowledge Graph Snapshot",
      "Charts",
      "Contradictions",
      "Research Gaps",
      "Suggested Experiments",
      "References",
    ],
    graphSnapshot: {
      nodes: project.domain === "Biomedical" ? 184 : project.domain === "Climate" ? 161 : 311,
      edges: project.domain === "Biomedical" ? 402 : project.domain === "Climate" ? 377 : 692,
      centralClaim: project.researchGoal,
      highConfidenceLinks: project.domain === "Biomedical" ? 48 : project.domain === "Climate" ? 39 : 74,
    },
    charts: [
      { label: "Evidence strength", value: project.domain === "Climate" ? 85 : 89, tone: "primary" },
      { label: "Citation coverage", value: project.domain === "Biomedical" ? 81 : 76, tone: "secondary" },
      { label: "Novelty signal", value: project.domain === "Climate" ? 72 : 92, tone: "tertiary" },
      { label: "Contradiction risk", value: project.domain === "Biomedical" ? 38 : 31, tone: "error" },
    ],
    references: [
      "Claim extraction artifacts. DiscoveryOS workspace.",
      "Knowledge graph snapshot. DiscoveryOS graph builder.",
      "Contradiction detection run. DiscoveryOS critic agent.",
      "Novelty analyzer scores. DiscoveryOS novelty agent.",
      "Experiment planner output. DiscoveryOS experiment agent.",
    ],
  };
}

export function reportToMarkdown(report: ResearchReport) {
  const lines = [
    `# ${report.title}`,
    "",
    report.subtitle,
    "",
    "## Executive Summary",
    report.executiveSummary,
    "",
    "## Evidence Cards",
    ...report.evidenceCards.map(
      (card) => `- ${card.claim} (${card.confidence}% confidence). ${card.citation} ${card.note}`,
    ),
    "",
    "## Knowledge Graph Snapshot",
    `- Nodes: ${report.graphSnapshot.nodes}`,
    `- Edges: ${report.graphSnapshot.edges}`,
    `- High-confidence links: ${report.graphSnapshot.highConfidenceLinks}`,
    `- Central claim: ${report.graphSnapshot.centralClaim}`,
    "",
    "## Charts",
    ...report.charts.map((chart) => `- ${chart.label}: ${chart.value}%`),
    "",
    "## Contradictions",
    ...report.contradictions.map((item) => `- ${item}`),
    "",
    "## Research Gaps",
    ...report.researchGaps.map((item) => `- ${item}`),
    "",
    "## Suggested Experiments",
    ...report.suggestedExperiments.map((item) => `- ${item}`),
    "",
    "## References",
    ...report.references.map((item) => `- ${item}`),
  ];

  return lines.join("\n");
}

export function reportToHtml(report: ResearchReport) {
  return `<article>${reportToMarkdown(report)
    .split("\n")
    .map((line) => {
      if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
      if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
      if (line.startsWith("- ")) return `<p>${line}</p>`;
      return line ? `<p>${line}</p>` : "";
    })
    .join("\n")}</article>`;
}

export function reportToLatex(report: ResearchReport) {
  return [
    "\\documentclass{article}",
    "\\usepackage[margin=1in]{geometry}",
    "\\title{" + report.title + "}",
    "\\begin{document}",
    "\\maketitle",
    "\\section*{Executive Summary}",
    report.executiveSummary,
    "\\section*{Evidence Cards}",
    ...report.evidenceCards.map((card) => `\\textbf{${card.claim}} ${card.citation} Confidence: ${card.confidence}\\%.`),
    "\\section*{Knowledge Graph Snapshot}",
    `Nodes: ${report.graphSnapshot.nodes}. Edges: ${report.graphSnapshot.edges}.`,
    "\\section*{Contradictions}",
    ...report.contradictions,
    "\\section*{Research Gaps}",
    ...report.researchGaps,
    "\\section*{Suggested Experiments}",
    ...report.suggestedExperiments,
    "\\section*{References}",
    ...report.references,
    "\\end{document}",
  ].join("\n\n");
}
