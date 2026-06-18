import React, { useState, useEffect } from 'react';
import BrushStrokes from "../../utils/brushStrokes";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";


export default function NoticiasRecientes() {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    const [tagsMap, setTagsMap] = useState({});
    const [actorsMap, setActorsMap] = useState({});
    const [locationsMap, setLocationsMap] = useState({});

    useEffect(() => {
        fetchWithAuth(`${apiUrl}/articles`)
            .then((res) => res.json())
            .then((data) => {
                setData(data.slice(0, 3));
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

    return (
        <>
            {/* ARTICULOS */}
            <div className='mx-5 mb-5'>
                {/* Recent News Section */}
                <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', background: 'rgba(255, 255, 255, 0.95)' }} onClick={() => navigate("/search")}>

                    <div className="card-body p-4 p-md-5">

                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="position-relative d-inline-block">
                                <h4 className="mb-0 fw-bold">Noticias Recientes</h4>
                                <div className="position-absolute" style={{ bottom: '-5px', left: '0' }}>
                                    <BrushStrokes
                                        variant="underline"
                                        color="#667eea"
                                        width={180}
                                        height={15}
                                        strokeWidth={2}
                                        opacity={0.3}
                                    />
                                </div>
                            </div>
                            <button
                                className="btn btn-sm btn-outline-primary rounded-pill"

                            >
                                Ver todas
                            </button>
                        </div>

                        {!dataIsLoaded && <div>LOADING...</div>}

                        {/* News List */}
                        <div className="d-flex flex-column gap-3">

                            {/* ITEM EXAMPLE */}

                            {data.map(item => (
                                <div
                                    key={item.id}
                                    className="border rounded-3 p-3 position-relative"
                                    style={{
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        background: '#fff'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex justify-content-between align-items-start gap-3">
                                            <h6 className="mb-0 fw-semibold" style={{ flex: 1 }}>
                                                <a target='_blank' href={item.url || '#'}>{item.headline}</a>
                                            </h6>
                                            {item.paywall && (
                                                <span className="badge bg-warning text-dark px-2 py-1 small">🔒 Paywall</span>
                                            )}
                                        </div>

                                        <div className="d-flex flex-wrap gap-2 align-items-center small text-muted">
                                            <span>{item.sourceName}</span>
                                            <span>•</span>
                                            <span>Por {item.author}</span>
                                            <span>•</span>
                                            <span>{item.publicationDate}</span>
                                        </div>

                                        <div className="d-flex flex-wrap gap-2 align-items-center">
                                            <span className="badge bg-light text-dark border px-2 py-1 small">
                                                📍 {locationsMap[item.location]}
                                            </span>
                                            <span className="badge bg-light text-primary border border-primary px-2 py-1 small">
                                                Cobertura: {item.coverageLevel}
                                            </span>
                                        </div>

                                        <div className="d-flex flex-wrap gap-1">
                                            {Array.isArray(item.tags) && item.tags.length > 0 ? (
                                                item.tags.map((id) => (
                                                    <span
                                                        key={String(id)}
                                                        className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-2 py-1 small me-1"
                                                    >
                                                        {tagsMap[id] ?? id}
                                                    </span>
                                                ))
                                            ) : (
                                                'N/A'
                                            )}
                                        </div>

                                        <div className="small text-muted">
                                            <span className="fw-medium">Actores:</span>
                                            {
                                                Array.isArray(item.actorsMentioned)
                                                    ? item.actorsMentioned.map(id => actorsMap[id] || id).join(', ')
                                                    : 'N/A'
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}



                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}