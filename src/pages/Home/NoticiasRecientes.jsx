import React, { useState, useEffect } from 'react';
import BrushStrokes from "../../utils/brushStrokes";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


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

                        {!dataIsLoaded && <div>Cargando...</div>}

                        {/* News List */}
                        <div className="d-flex flex-column gap-3">

                            {/* ITEM EXAMPLE */}

                            {data.map(item => {
                                const origin = item.origin?.toLowerCase();
                                const originColor = origin === 'muninn' ? '#722294' : '#60CC7D';
                                const originLabel = origin === 'muninn' ? 'Muninn' : origin === 'user' ? 'Usuario' : origin || 'N/A';

                                return (
                                    <div
                                        key={item.id}
                                        className="border-0 rounded-3 p-4 position-relative"
                                        style={{
                                            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                                            cursor: 'pointer',
                                            background: '#fff',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                                            e.currentTarget.style.transform = 'scale(1.02)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        {(origin === 'muninn' || origin === 'user') && (
                                            <div style={{
                                                backgroundColor: originColor,
                                                color: '#fff',
                                                fontSize: 'var(--fs-sm)',
                                                fontWeight: 600,
                                                padding: '4px 12px',
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                marginBottom: '12px',
                                                display: 'inline-block',
                                                borderRadius: '4px'
                                            }}>
                                                {originLabel}
                                            </div>
                                        )}

                                        <div className="d-flex flex-column gap-3">
                                            <div>
                                                <a target='_blank' rel="noopener noreferrer" href={item.url || '#'} style={{
                                                    fontSize: 'var(--fs-xl)',
                                                    fontWeight: 700,
                                                    color: '#0066cc',
                                                    textDecoration: 'none',
                                                    lineHeight: 'var(--lh-tight)',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {item.headline}
                                                </a>
                                            </div>

                                            <div className="metadata-grid" style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: '12px',
                                                fontSize: 'var(--fs-sm)',
                                                color: '#6c757d',
                                                paddingTop: '8px',
                                                borderTop: '1px solid rgba(108,117,125,0.1)'
                                            }}>
                                                <div>
                                                    <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: '4px', color: '#555' }}>Autor</div>
                                                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500, color: '#333' }}>{item.author || 'N/A'}</div>
                                                </div>

                                                {item.publicationDate && (
                                                    <div>
                                                        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: '4px', color: '#555' }}>Fecha</div>
                                                        <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500, color: '#333' }}>{item.publicationDate}</div>
                                                    </div>
                                                )}

                                                {item.sourceName && (
                                                    <div>
                                                        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: '4px', color: '#555' }}>Fuente</div>
                                                        <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500, color: '#333' }}>{item.sourceName}</div>
                                                    </div>
                                                )}

                                                {item.coverageLevel && (
                                                    <div>
                                                        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, marginBottom: '4px', color: '#555' }}>Cobertura</div>
                                                        <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500, color: '#333' }}>{item.coverageLevel.charAt(0).toUpperCase() + item.coverageLevel.slice(1)}</div>
                                                    </div>
                                                )}
                                            </div>

                                            {Array.isArray(item.tags) && item.tags.length > 0 && (
                                                <div>
                                                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Etiquetas</div>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {item.tags.map((id) => (
                                                            <span key={String(id)} className="badge rounded-pill" style={{ background: 'rgba(108,117,125,0.15)', color: '#6c757d', fontSize: 'var(--fs-sm)' }}>
                                                                {tagsMap[id] ?? id}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {Array.isArray(item.actorsMentioned) && item.actorsMentioned.length > 0 && (
                                                <div>
                                                    <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, color: '#555', marginBottom: '6px' }}>Actores Mencionados</div>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {item.actorsMentioned.map((id) => (
                                                            <span key={id} className="badge rounded-pill" style={{ background: 'rgba(108,117,125,0.15)', color: '#6c757d', fontSize: 'var(--fs-sm)' }}>
                                                                {actorsMap[id] || id}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}



                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}