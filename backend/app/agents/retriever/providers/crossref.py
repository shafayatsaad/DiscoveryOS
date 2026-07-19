"""Purpose: Retrieve and normalize paper metadata from Crossref."""

import re
from typing import Any

from app.agents.retriever.providers.base import HttpLiteratureProvider
from app.agents.retriever.schemas import Paper


class CrossrefProvider(HttpLiteratureProvider):
    """Crossref works provider implementation."""

    name = "Crossref"
    base_url = "https://api.crossref.org/works"

    async def search(self, query: str, limit: int) -> list[Paper]:
        """Search Crossref and normalize work records into Paper objects."""

        data = await self._get_json(
            cache_key=f"crossref:{query}:{limit}",
            url=self.base_url,
            params={"query": query, "rows": limit},
        )
        items = data.get("message", {}).get("items", [])
        return [self._parse_work(item, query) for item in items[:limit]]

    def _parse_work(self, item: dict[str, Any], query: str) -> Paper:
        """Normalize one Crossref work record."""

        authors = [
            " ".join(
                part
                for part in [author.get("given"), author.get("family")]
                if isinstance(part, str)
            )
            for author in item.get("author", [])
        ]
        issued_parts = item.get("issued", {}).get("date-parts", [[]])
        year = issued_parts[0][0] if issued_parts and issued_parts[0] else None
        return Paper(
            title=(item.get("title") or ["Untitled Crossref work"])[0],
            authors=[author for author in authors if author],
            year=year,
            abstract=self._strip_markup(item.get("abstract")),
            doi=(item.get("DOI") or "").lower() or None,
            url=item.get("URL"),
            source=self.name,
            keywords=(item.get("subject") or [])[:8] or query.split()[:8],
            citation_count=item.get("is-referenced-by-count"),
        )

    def _strip_markup(self, value: str | None) -> str | None:
        """Remove lightweight publisher XML/HTML tags from Crossref abstracts."""

        if not value:
            return None
        return re.sub(r"<[^>]+>", " ", value).strip()
