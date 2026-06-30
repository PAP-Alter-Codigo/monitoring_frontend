import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Filters from "./Filters";
import ArticleList from "./ArticleList";
import BrushStrokes from "../../utils/brushStrokes"
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import { parseDate } from "../../utils/parseDate";

import Container from "react-bootstrap/Container";
import "./Search.css";
import ReturnMenu from "../../components/return-menu";
import HelpTooltip from "../../components/HelpTooltip";

function Search() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [data, setData] = useState([]);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);

  const [tagsMap, setTagsMap] = useState({});
  const [actorsMap, setActorsMap] = useState({});
  const [locationsMap, setLocationsMap] = useState({});

  const [sourceNames, setSourceNames] = useState([]);
  const [coverageLevels, setCoverageLevels] = useState([]);
  const [authorNames, setAuthorNames] = useState([]);

  const [filters, setFilters] = useState({
    publicationDate: {
      startDate: "",
      endDate: "",
    },
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

  useEffect(() => {
    fetchWithAuth(`${apiUrl}/articles`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);

        const normalizeCoverage = (val) => {
          if (!val) return "";
          return val.split('/')
            .map(p => p.trim().toLowerCase())
            .map(p => p.charAt(0).toUpperCase() + p.slice(1))
            .sort()
            .join(' / ');
        };

        const uniqueSources = [...new Set(data.map(item => item.sourceName).filter(Boolean))].sort();
        const uniqueCoverage = [...new Set(data.map(item => normalizeCoverage(item.coverageLevel)).filter(Boolean))].sort();
        const uniqueAuthors = [...new Set(data.map(item => item.author?.trim()).filter(Boolean))].sort();

        setSourceNames(uniqueSources);
        setCoverageLevels(uniqueCoverage);
        setAuthorNames(uniqueAuthors);

        setDataIsLoaded(true);
      });

    Promise.all([
      fetchWithAuth(`${apiUrl}/tags`).then((res) => res.json()),
      fetchWithAuth(`${apiUrl}/actors`).then((res) => res.json()),
      fetchWithAuth(`${apiUrl}/locations`).then((res) => res.json()),
    ]).then(([tags, actors, locations]) => {
      const tMap = {},
        aMap = {},
        lMap = {};
      tags.forEach((tag) => (tMap[tag.id] = tag.name));
      actors.forEach((actor) => (aMap[actor.id] = actor.name));
      locations.forEach((loc) => (lMap[loc.id] = loc.name));
      setTagsMap(tMap);
      setActorsMap(aMap);
      setLocationsMap(lMap);
    });
  }, []);

  const filteredData = data.filter((item) => {
    const articleDate = parseDate(item.publicationDate);
    const startDate = filters.publicationDate.startDate
      ? new Date(filters.publicationDate.startDate + 'T00:00:00Z')
      : null;
    const endDate = filters.publicationDate.endDate
      ? new Date(filters.publicationDate.endDate + 'T23:59:59Z')
      : null;

    const isInDateRange =
      articleDate && ((!startDate || articleDate >= startDate) &&
        (!endDate || articleDate <= endDate));

    const headline = item.headline || "";
    const sourceName = item.sourceName || "";
    const paywall = item.paywall;
    const author = item.author || "";

    const normalizeCoverage = (val) => {
      if (!val) return "";
      return val.split('/')
        .map(p => p.trim().toLowerCase())
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .sort()
        .join(' / ');
    };
    const coverageLevel = normalizeCoverage(item.coverageLevel);

    const actors = Array.isArray(item.actorsMentioned)
      ? item.actorsMentioned
        .map((id) => actorsMap[id]?.toLowerCase() || "")
        .join(", ")
      : "";

    const tags = Array.isArray(item.tags)
      ? item.tags.map((id) => tagsMap[id]?.toLowerCase() || "").join(", ")
      : "";

    const location = Array.isArray(item.location)
      ? item.location.map((loc) => loc.name?.toLowerCase() || "").join(", ")
      : "";

    return (
      isInDateRange &&
      (filters.sourceName === "" ||
        sourceName.toLowerCase().includes(filters.sourceName.toLowerCase())) &&
      (filters.paywall === null || paywall === filters.paywall) &&
      (filters.headline === "" ||
        headline.toLowerCase().includes(filters.headline.toLowerCase())) &&
      (filters.author === "" ||
        author.toLowerCase().includes(filters.author.toLowerCase())) &&
      (filters.coverageLevel === "" ||
        coverageLevel
          .toLowerCase()
          .includes(filters.coverageLevel.toLowerCase())) &&
      (filters.actorsMentioned.length === 0 ||
        filters.actorsMentioned.some((actor) =>
          actors.includes(actor.toLowerCase())
        )) &&
      (filters.tags.length === 0 ||
        filters.tags.some((tag) => tags.includes(tag.toLowerCase()))) &&
      (filters.location === "" ||
        location.includes(filters.location.toLowerCase())) &&
      (filters.origin === "" ||
        (item.origin || "").toLowerCase() === filters.origin.toLowerCase())
    );
  });

  if (!dataIsLoaded) return <div>Cargando...</div>;

  const exportToExcel = () => {
    const dataToExport = filteredData.map(item => ({
      Titular: item.headline,
      Fuente: item.sourceName,
      Fecha: item.publicationDate,
      Autor: item.author,
      Enlace: item.url
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
    XLSX.writeFile(workbook, "resultados_busqueda.xlsx");
  };

  return (
    <>
      <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #43C6AC 0%, #191654 100%)' }}>

        {/* Decorative brush strokes background */}
        <div className="position-absolute top-0 start-0 opacity-25">
          <BrushStrokes variant="circle" color="#ffffff" width={120} height={120} strokeWidth={8} opacity={0.3} />
        </div>
        <div className="position-absolute" style={{ top: '15%', right: '10%', opacity: 0.2 }}>
          <BrushStrokes variant="wave" color="#ffffff" width={180} height={60} strokeWidth={6} opacity={0.4} />
        </div>
        <div className="position-absolute" style={{ bottom: '20%', left: '5%', opacity: 0.15 }}>
          <BrushStrokes variant="circle" color="#ffffff" width={100} height={100} strokeWidth={6} opacity={0.3} />
        </div>
        <div className="position-absolute" style={{ bottom: '10%', right: '15%', opacity: 0.2 }}>
          <BrushStrokes variant="wave" color="#ffffff" width={150} height={50} strokeWidth={5} opacity={0.4} />
        </div>



        <div className="search-page">

          {/* NAV BAR */}
          <ReturnMenu />

          {/* MAIN CONTAINER */}
          <Container className="app-container mt-4">
            <h1 className="text-white pb-4">Artículos</h1>
            <Filters
              filters={filters}
              setFilters={setFilters}
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
                <p className="mb-0 text-white-50">Número de artículos: {filteredData.length}</p>
              </div>
              <button
                className="btn btn-success d-flex align-items-center gap-2"
                onClick={exportToExcel}
                disabled={filteredData.length === 0}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z" />
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                </svg>
                Exportar a Excel
              </button>
            </div>
            <ArticleList
              articles={filteredData}
              actorsMap={actorsMap}
              tagsMap={tagsMap}
              locationsMap={locationsMap}
            />
          </Container>
        </div>

        <HelpTooltip
          page="search"
          positionStyle={{
            position: "fixed",
            bottom: "30px",
            right: "30px"
          }}
        />
      </div>
    </>
  );
}

export default Search;
