import React, { useState } from 'react';
import BrushStrokes from "../../utils/brushStrokes";
import { useNavigate } from "react-router-dom";



export default function NoticiasRecientes() {
    const navigate = useNavigate();
    
    return (
        <>
            {/* ARTICULOS */}
            <div className='mx-5 mb-5'>
                {/* Recent News Section */}
                <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', background: 'rgba(255, 255, 255, 0.95)' }}>
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
                                onClick={() => navigate("/search")}
                            >
                                Ver todas →
                            </button>
                        </div>

                        {/* News List */}
                        <div className="d-flex flex-column gap-3">

                            {/* ITEM EXAMPLE */}
                            <div
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
                                            Nuevo proyecto de conservación ambiental en la cuenca del río
                                        </h6>
                                        {true && (
                                            <span className="badge bg-warning text-dark px-2 py-1 small">🔒 Paywall</span>
                                        )}
                                    </div>

                                    <div className="d-flex flex-wrap gap-2 align-items-center small text-muted">
                                        <span>El Universal</span>
                                        <span>•</span>
                                        <span>Por María González</span>
                                        <span>•</span>
                                        <span>Hace 2 horas</span>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                        <span className="badge bg-light text-dark border px-2 py-1 small">
                                            📍 Jalisco, México
                                        </span>
                                        <span className="badge bg-light text-primary border border-primary px-2 py-1 small">
                                            Cobertura: Nacional
                                        </span>
                                    </div>

                                    <div className="d-flex flex-wrap gap-1">
                                        <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-2 py-1 small">Medio Ambiente</span>
                                        <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-2 py-1 small">Conservación</span>
                                        <span className="badge rounded-pill bg-info bg-opacity-10 text-info px-2 py-1 small">Agua</span>
                                    </div>

                                    <div className="small text-muted">
                                        <span className="fw-medium">Actores:</span> SEMARNAT, Gobierno Estatal, ONG Ambientalistas
                                    </div>
                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}