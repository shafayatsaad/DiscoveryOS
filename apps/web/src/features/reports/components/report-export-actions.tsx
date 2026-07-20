"use client";

// Purpose: Provide frontend-only report exports for Markdown, HTML, PDF print, and LaTeX.

import { Download, FileCode2, FileText, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  type ResearchReport,
  reportToHtml,
  reportToLatex,
  reportToMarkdown,
} from "@/features/reports/data/reports-content";

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ReportExportActions({ report }: { report: ResearchReport }) {
  const slug = report.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => downloadFile(`${slug}.md`, reportToMarkdown(report), "text/markdown")}
        type="button"
        variant="secondary"
      >
        <Download className="h-4 w-4" />
        Markdown
      </Button>
      <Button
        onClick={() => downloadFile(`${slug}.html`, reportToHtml(report), "text/html")}
        type="button"
        variant="secondary"
      >
        <FileCode2 className="h-4 w-4" />
        HTML
      </Button>
      <Button onClick={() => window.print()} type="button" variant="secondary">
        <Printer className="h-4 w-4" />
        PDF
      </Button>
      <Button
        onClick={() => downloadFile(`${slug}.tex`, reportToLatex(report), "application/x-tex")}
        type="button"
        variant="secondary"
      >
        <FileText className="h-4 w-4" />
        LaTeX
      </Button>
    </div>
  );
}
