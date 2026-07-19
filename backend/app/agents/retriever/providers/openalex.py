"""Purpose: Retrieve and normalize paper metadata from OpenAlex."""

from typing import Any

from app.agents.retriever.providers.base import HttpLiteratureProvider
from app.agents.retriever.schemas import Paper


class OpenAlexProvider(HttpLiteratureProvider):
    """OpenAlex works provider implementation."""

    name = "OpenAlex"
    base_url = "https://api.openalex.org/works"

    async def search(self, query: str, limit: int) -> list[Paper]:
        """Search OpenAlex and normalize work records into Paper objects."""

        data = await self._get_json(
            cache_key=f"openalex:{query}:{limit}",
            url=self.base_url,
            params={"search": query, "per-page": limit},
        )
        return [self._parse_work(work, query) for work in data.get("results", [])[:limit]]

    def _parse_work(self, work: dict[str, Any], query: str) -> Paper:
        """Normalize one OpenAlex work record."""

        authors = [
            authorship.get("author", {}).get("display_name", "")
            for authorship in work.get("authorships", [])
        ]
        concepts = [
            concept.get("display_name", "")
            for concept in work.get("concepts", [])
            if concept.get("display_name")
        ]
        return Paper(
            title=work.get("title") or "Untitled OpenAlex work",
            authors=[author for author in authors if author],
            year=work.get("publication_year"),
            abstract=self._reconstruct_abstract(work.get("abstract_inverted_index")),
            doi=self._normalize_doi(work.get("doi")),
            url=work.get("primary_location", {}).get("landing_page_url") or work.get("id"),
            source=self.name,
            keywords=concepts[:8] or query.split()[:8],
            citation_count=work.get("cited_by_count"),
        )

    def _reconstruct_abstract(self, inverted_index: dict[str, list[int]] | None) -> str | None:
        """Convert OpenAlex inverted-index abstracts into readable text."""

        if not inverted_index:
            return None

        positioned_words: list[tuple[int, str]] = []
        for word, positions in inverted_index.items():
            positioned_words.extend((position, word) for position in positions)
        return " ".join(word for _, word in sorted(positioned_words))

    def _normalize_doi(self, doi: str | None) -> str | None:
        """Strip DOI URL prefixes to keep downstream deduplication stable."""

        if not doi:
            return None
        return doi.replace("https://doi.org/", "").lower()
