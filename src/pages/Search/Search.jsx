import { useEffect, useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import Filters from "./Filters";
import ArticleList from "./ArticleList";
import LoadingPage from "./LoadingPage";
import BrushStrokes from "../../utils/brushStrokes";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import Spinner from "react-bootstrap/Spinner";
import "./Search.css";
import ReturnMenu from "../../components/return-menu";
import HelpTooltip from "../../components/HelpTooltip";

const PAGE_SIZE = 20;

/**
 * Build a URLSearchParams string from the current filters and page.
 * Tags and actors are sent as comma-separated IDs (keys of the maps).
 */
function buildQueryString(filters, tagsMap, actorsMap, page, limit, exportAll = false) {
  const params = new URLSearchParams();

  if (page)  params.set("page",  String(page));
  if (limit) params.set("limit", String(limit));
  if (exportAll) params.set("export", "true");

  if (filters.publicationDate.startDate) params.set("startDate", filters.publicationDate.startDate);
  if (filters.publicationDate.endDate)   params.set("endDate",   filters.publicationDate.endDate);
  if (filters.headline)    params.set("headline",    filters.headline);
  if (filters.sourceName)  params.set("sourceName",  filters.sourceName);
  if (filters.author)      params.set("author",      filters.author);
  if (filters.coverageLevel) params.set("coverageLevel", filters.coverageLevel);
  if (filters.paywall !== null) params.set("paywall", String(filters.paywall));
  if (filters.origin)      params.set("origin", filters.origin);
  if (filters.location)    params.set("location", filters.location);

  // Convert tag/actor names → IDs for server-side matching
  if (filters.tags.length > 0) {
    const tagIds = filters.tags
      .map((name) => Object.entries(tagsMap).find(([, n]) => n === name)?.[0])
      .filter(Boolean);
    if (tagIds.length > 0) params.set("tags", tagIds.join(","));
  }

  if (filters.actorsMentioned.length > 0) {
    const actorIds = filters.actorsMentioned
      .map((name) => Object.entries(actorsMap).find(([, n]) => n === name)?.[0])
      .filter(Boolean);
    if (actorIds.length > 0) params.set("actorsMentioned", actorIds.join(","));
  }

  return params.toString();
}

function Search() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Catalog data (loaded once)
  const [catalogsLoaded, setCatalogsLoaded] = useState(false);
  const [tagsMap, setTagsMap] = useState({});
  const [actorsMap, setActorsMap] = useState({});
  const [locationsMap, setLocationsMap] = useState({});
  const [sourceNames, setSourceNames] = useState([]);
  const [coverageLevels, setCoverageLevels] = useState([]);
  const [authorNames, setAuthorNames] = useState([]);

  // Paginated search results
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchLoading, setSearchLoading] = useState(false);

  // Export state
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState({
    publicationDate: { startDate: "", endDate: "" },
    sourceName: "",
    paywall: null,
    headline: "",
    url: "",
    author: "",
    coverageLevel: "",
    actorsMentioned: [],
    tags: [],
    location: "",
    origin: "",
  });

  // Track if catalogs are ready so we can build IDs for query params
  const tagsMapRef    = useRef({});
  const actorsMapRef  = useRef({});

  // ── 1. Load catalogs once ────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetchWithAuth(`${apiUrl}/tags`).then((res) => (res && res.ok ? res.json() : [])),
      fetchWithAuth(`${apiUrl}/actors`).then((res) => (res && res.ok ? res.json() : [])),
      fetchWithAuth(`${apiUrl}/locations`).then((res) => (res && res.ok ? res.json() : [])),
      fetchWithAuth(`${apiUrl}/articles/search?limit=1`).then((res) => (res && res.ok ? res.json() : null)),
    ])
      .then(([tags, actors, locations, firstPage]) => {
        const tMap = {}, aMap = {}, lMap = {};
        if (Array.isArray(tags))      tags.forEach((t) => (tMap[t.id] = t.name));
        if (Array.isArray(actors))    actors.forEach((a) => (aMap[a.id] = a.name));
        if (Array.isArray(locations)) locations.forEach((l) => (lMap[l.id] = l.name));

        tagsMapRef.current   = tMap;
        actorsMapRef.current = aMap;

        setTagsMap(tMap);
        setActorsMap(aMap);
        setLocationsMap(lMap);

        // Derive dropdown options from all articles metadata returned alongside
        // the first page. We do one extra request to get all source/author/coverage
        // options without fetching every article body.
        // Use a lightweight export=true call to gather unique field values.
        return fetchWithAuth(`${apiUrl}/articles/search?export=true&limit=1000`)
          .then((res) => (res && res.ok ? res.json() : []))
          .then((allArticles) => {
            if (!Array.isArray(allArticles)) return;
            const normalizeCoverage = (val) => {
              if (!val) return "";
              return val.split("/").map((p) => p.trim().toLowerCase()).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).sort().join(" / ");
            };
            const uniqueSources  = [...new Set(allArticles.map((a) => a.sourceName).filter(Boolean))].sort();
            const uniqueCoverage = [...new Set(allArticles.map((a) => normalizeCoverage(a.coverageLevel)).filter(Boolean))].sort();
            const uniqueAuthors  = [...new Set(allArticles.map((a) => a.author?.trim()).filter(Boolean))].sort();
            setSourceNames(uniqueSources);
            setCoverageLevels(uniqueCoverage);
            setAuthorNames(uniqueAuthors);
          });
      })
      .catch((err) => console.error("Error al cargar catálogos:", err))
      .finally(() => setCatalogsLoaded(true));
  }, [apiUrl]);

  // ── 2. Fetch articles whenever filters or page change ──────────────────
  const fetchArticles = useCallback(
    (page) => {
      setSearchLoading(true);
      const qs = buildQueryString(filters, tagsMapRef.current, actorsMapRef.current, page, PAGE_SIZE);
      fetchWithAuth(`${apiUrl}/articles/search?${qs}`)
        .then((res) => {
          if (!res || !res.ok) throw new Error(`HTTP ${res?.status}`);
          return res.json();
        })
        .then((data) => {
          setArticles(data.articles || []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.page || 1);
        })
        .catch((err) => {
          console.error("Error al cargar artículos:", err);
          setArticles([]);
          setTotal(0);
          setTotalPages(1);
        })
        .finally(() => setSearchLoading(false));
    },
    [filters, apiUrl]
  );

  // Re-fetch when filters change (reset to page 1)
  useEffect(() => {
    if (!catalogsLoaded) return;
    fetchArticles(1);
  }, [filters, catalogsLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    fetchArticles(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── 3. Export — fetches ALL filtered articles from the server ──────────
  const exportToExcel = async () => {
    setExporting(true);
    try {
      const qs = buildQueryString(filters, tagsMapRef.current, actorsMapRef.current, 1, PAGE_SIZE, true);
      const res = await fetchWithAuth(`${apiUrl}/articles/search?${qs}`);
      if (!res || !res.ok) throw new Error(`HTTP ${res?.status}`);
      const allArticles = await res.json();

      const dataToExport = (Array.isArray(allArticles) ? allArticles : []).map((item) => ({
        Titular:    item.headline || "",
        Fuente:     item.sourceName || "",
        Fecha:      item.publicationDate || "",
        Autor:      item.author || "",
        Relevancia: item.relevance || item.relevanceLevel || item.relevance_level || "",
        "Por qué":  item.why || item.whyItMatters || item.why_it_matters || "",
        Resumen:    item.summary || "",
        Enlace:     item.url || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      worksheet["!cols"] = [
        { wch: 40 }, { wch: 20 }, { wch: 12 }, { wch: 25 },
        { wch: 15 }, { wch: 45 }, { wch: 50 }, { wch: 40 },
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
      XLSX.writeFile(workbook, "resultados_busqueda.xlsx");
    } catch (err) {
      console.error("Error al exportar:", err);
    } finally {
      setExporting(false);
    }
  };

  // ── 4. Render ──────────────────────────────────────────────────────────
  if (!catalogsLoaded) return <LoadingPage />;

  // Build pagination items
  const paginationItems = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage   = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

  for (let p = startPage; p <= endPage; p++) {
    paginationItems.push(
      <Pagination.Item key={p} active={p === currentPage} onClick={() => handlePageChange(p)}>
        {p}
      </Pagination.Item>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #43C6AC 0%, #191654 100%)" }}
    >
      <div className="position-absolute top-0 start-0 opacity-25">
        <BrushStrokes variant="circle" color="#ffffff" width={120} height={120} strokeWidth={8} opacity={0.3} />
      </div>
      <div className="position-absolute" style={{ top: "15%", right: "10%", opacity: 0.2 }}>
        <BrushStrokes variant="wave" color="#ffffff" width={180} height={60} strokeWidth={6} opacity={0.4} />
      </div>
      <div className="position-absolute" style={{ bottom: "20%", left: "5%", opacity: 0.15 }}>
        <BrushStrokes variant="circle" color="#ffffff" width={100} height={100} strokeWidth={6} opacity={0.3} />
      </div>
      <div className="position-absolute" style={{ bottom: "10%", right: "15%", opacity: 0.2 }}>
        <BrushStrokes variant="wave" color="#ffffff" width={150} height={50} strokeWidth={5} opacity={0.4} />
      </div>

      <div className="search-page">
        <ReturnMenu />

        <Container className="app-container mt-4">
          <h1 className="text-white pb-4">Artículos</h1>
          <Filters
            filters={filters}
            setFilters={(newFilters) => {
              setFilters(newFilters);
            }}
            tagsMap={tagsMap}
            actorsMap={actorsMap}
            locationsMap={locationsMap}
            sourceNames={sourceNames}
            coverageLevels={coverageLevels}
            authorNames={authorNames}
          />
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-3 text-white">
            <div>
              <h2 className="mb-0">Resultados</h2>
              <p className="mb-0 text-white-50">
                {searchLoading ? "Buscando…" : `${total} artículo${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={exportToExcel}
              disabled={total === 0 || exporting || searchLoading}
            >
              {exporting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z" />
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                </svg>
              )}
              {exporting ? "Exportando…" : "Exportar a Excel"}
            </button>
          </div>

          {searchLoading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="light" />
            </div>
          ) : (
            <>
              <ArticleList
                articles={articles}
                actorsMap={actorsMap}
                tagsMap={tagsMap}
                locationsMap={locationsMap}
              />

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                    <Pagination.Prev  onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {startPage > 1 && <Pagination.Ellipsis disabled />}
                    {paginationItems}
                    {endPage < totalPages && <Pagination.Ellipsis disabled />}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                  </Pagination>
                </div>
              )}

              {totalPages > 1 && (
                <p className="text-center text-white-50 mb-4" style={{ fontSize: "0.85rem" }}>
                  Página {currentPage} de {totalPages}
                </p>
              )}
            </>
          )}
        </Container>
      </div>

      <HelpTooltip
        page="search"
        positionStyle={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
        }}
      />
    </div>
  );
}

export default Search;
