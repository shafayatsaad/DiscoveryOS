"""Purpose: Retrieve and normalize paper metadata from arXiv."""

import xml.etree.ElementTree as ET

from app.agents.retriever.providers.base import HttpLiteratureProvider
from app.agents.retriever.schemas import Paper

ATOM_NAMESPACE = {"atom": "http://www.w3.org/2005/Atom"}


class ArxivProvider(HttpLiteratureProvider):
    """arXiv Atom API provider implementation."""

    name = "arXiv"
    base_url = "https://export.arxiv.org/api/query"

    async def search(self, query: str, limit: int) -> list[Paper]:
        """Search arXiv and normalize Atom entries into Paper objects."""

        text = await self._get_text(
            cache_key=f"arxiv:{query}:{limit}",
            url=self.base_url,
            params={"search_query": f"all:{query}", "start": 0, "max_results": limit},
        )
        root = ET.fromstring(text)
        return [
            self._parse_entry(entry, query)
            for entry in root.findall("atom:entry", ATOM_NAMESPACE)
        ]

    def _parse_entry(self, entry: ET.Element, query: str) -> Paper:
        """Normalize one arXiv Atom entry."""

        title = self._find_text(entry, "atom:title") or "Untitled arXiv preprint"
        published = self._find_text(entry, "atom:published")
        authors = [
            self._find_text(author, "atom:name") or ""
            for author in entry.findall("atom:author", ATOM_NAMESPACE)
        ]
        categories = [
            category.attrib.get("term", "")
            for category in entry.findall("atom:category", ATOM_NAMESPACE)
        ]
        doi = None
        for link in entry.findall("atom:link", ATOM_NAMESPACE):
            if link.attrib.get("title") == "doi":
                doi = link.attrib.get("href", "").replace("https://doi.org/", "").lower()

        return Paper(
            title=" ".join(title.split()),
            authors=[author for author in authors if author],
            year=int(published[:4]) if published and published[:4].isdigit() else None,
            abstract=" ".join((self._find_text(entry, "atom:summary") or "").split()) or None,
            doi=doi,
            url=self._find_text(entry, "atom:id"),
            source=self.name,
            keywords=[category for category in categories if category] or query.split()[:8],
            citation_count=None,
        )

    def _find_text(self, element: ET.Element, path: str) -> str | None:
        """Read namespaced Atom text safely."""

        child = element.find(path, ATOM_NAMESPACE)
        return child.text if child is not None else None
