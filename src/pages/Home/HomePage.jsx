import React, { useState } from 'react';
import BrushStrokes from "../../utils/brushStrokes";
import { useNavigate } from "react-router-dom";
import NoticiasRecientes from './NoticiasRecientes';


function HomePage() {
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();

    return (
        <>
            <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #43C6AC 0%, #191654 100%)' }}>
                <nav className="navbar navbar-expand-lg navbar-dark py-3">
                    <div className="container">
                        <div className="navbar-brand d-flex align-items-center">
                            <span className="fs-1 fw-light">Territo<span className="fw-bold text-success">Rios</span></span>
                        </div>
                        <button
                            className="btn btn-sm btn-outline-light rounded-pill px-3"
                            onClick={() => navigate("/")}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </nav>
                <div className='mx-4 my-4'>

                    <div className='row g-4 mb-5'>
                        <div className="col-12 col-md-6">
                            <div
                                className="card border-0 shadow-lg h-100 position-relative overflow-hidden"
                                style={{
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    transform: hoveredCard === 'news' ? 'translateY(-8px)' : 'translateY(0)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={() => setHoveredCard('news')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="position-absolute top-0 end-0 opacity-25">
                                    <BrushStrokes variant="circle" color="#667eea" width={100} height={100} strokeWidth={6} opacity={0.3} />
                                </div>

                                <div className="card-body p-4 p-md-5 position-relative">
                                    <div className="mb-4">
                                        <div
                                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            }}
                                        >
                                            <span className="fs-1">📰</span>
                                        </div>
                                    </div>

                                    <div className="position-relative d-inline-block mb-3">
                                        <h3 className="card-title h4 fw-bold mb-0">Articulos</h3>
                                        <div className="position-absolute" style={{ bottom: '-8px', left: '0' }}>
                                            <BrushStrokes
                                                variant="underline"
                                                color="#667eea"
                                                width={180}
                                                height={20}
                                                strokeWidth={3}
                                                opacity={0.4}
                                            />
                                        </div>
                                    </div>

                                    <p className="card-text text-muted mt-4 mb-4">
                                        Accede a la base de datos de artículos guardados. Busca y filtra información relevantes
                                    </p>

                                    <div className="mt-4 text-end">
                                        <span
                                            className="text-primary fw-medium"
                                            style={{
                                                transition: 'transform 0.3s ease',
                                                display: 'inline-block',
                                                transform: hoveredCard === 'news' ? 'translateX(5px)' : 'translateX(0)'
                                            }}
                                            onClick={() => navigate("/search")}
                                        >
                                            Buscar Articulos →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* SEGUNDA CARD */}
                        <div className="col-12 col-md-6">
                            <div
                                className="card border-0 shadow-lg h-100 position-relative overflow-hidden"
                                style={{
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    transform: hoveredCard === 'search' ? 'translateY(-8px)' : 'translateY(0)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={() => setHoveredCard('search')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="position-absolute top-0 end-0 opacity-25">
                                    <BrushStrokes variant="circle" color="#5f7e08" width={100} height={100} strokeWidth={6} opacity={0.3} />
                                </div>

                                <div className="card-body p-4 p-md-5 position-relative">
                                    <div className="mb-4">
                                        <div
                                            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                background: 'linear-gradient(135deg, #a1c736 0%, #5f7e08 100%)'
                                            }}
                                        >
                                            <span className="fs-1">🔍</span>
                                        </div>
                                    </div>

                                    <div className="position-relative d-inline-block mb-3">
                                        <h3 className="card-title h4 fw-bold mb-0">Admin</h3>
                                        <div className="position-absolute" style={{ bottom: '-8px', left: '0' }}>
                                            <BrushStrokes
                                                variant="underline"
                                                color="#5f7e08"
                                                width={180}
                                                height={20}
                                                strokeWidth={3}
                                                opacity={0.4}
                                            />
                                        </div>
                                    </div>

                                    <p className="card-text text-muted mt-4 mb-4">
                                        Pagina de administracion donde el admin puede crear nuevas tags y sources
                                    </p>

                                    <div className="mt-4 text-end">
                                        <span
                                            className="text-primary fw-medium"
                                            style={{
                                                transition: 'transform 0.3s ease',
                                                display: 'inline-block',
                                                transform: hoveredCard === 'search' ? 'translateX(5px)' : 'translateX(0)'
                                            }}
                                            onClick={() => navigate("/admin-page")}
                                        >
                                            Panel Admin →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <NoticiasRecientes/>
            </div>
        </>
    );
}

export default HomePage;