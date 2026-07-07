import React, { useState, useRef, useEffect } from 'react';
import BrushStrokes from "../../utils/brushStrokes";
import { useNavigate } from "react-router-dom";
import NoticiasRecientes from './NoticiasRecientes';
import HelpTooltip from '../../components/HelpTooltip';
import TTSButton from '../../components/TTSButton';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

function HomePage() {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const articlesCardRef = useRef(null);
    const adminCardRef = useRef(null);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/auth/admin`);
                const data = await response.json();
                
                if (data.isAdmin) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Failed to fetch admin status", error);
            }
        };
        checkAdmin();
    }, []);

    return (
        <>
            <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #43C6AC 0%, #191654 100%)', paddingBottom: '3rem' }}>
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
                        <div className={isAdmin ? "col-12 col-md-6" : "col-12"}>
                            <div
                                ref={articlesCardRef}
                                className="card border-0 shadow-lg h-100 position-relative overflow-hidden"
                                style={{
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    transform: hoveredCard === 'news' ? 'translateY(-8px)' : 'translateY(0)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate("/search")}
                                onMouseEnter={() => setHoveredCard('news')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <TTSButton targetRef={articlesCardRef} className="position-absolute top-0 end-0 m-3" style={{ zIndex: 10 }} />
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
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                boxShadow: '0 0 30px rgba(102, 126, 234, 0.4)'
                                            }}
                                        >
                                            <span className="fs-1">📰</span>
                                        </div>
                                    </div>

                                    <div className="position-relative d-inline-block mb-3">
                                        <h3 className="card-title h4 fw-bold mb-0">Artículos</h3>
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
                                        Accede a la base de datos de artículos guardados. Busca y filtra información relevante
                                    </p>

                                    <div className="mt-4">
                                        <button
                                            className="btn btn-primary fw-medium"
                                            onClick={() => navigate("/search")}
                                            style={{
                                                transition: 'all 0.3s ease',
                                                transform: hoveredCard === 'news' ? 'scale(1.05)' : 'scale(1)'
                                            }}
                                        >
                                            Buscar Artículos →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* SEGUNDA CARD */}
                        {isAdmin && (
                        <div className="col-12 col-md-6">
                            <div
                                ref={adminCardRef}
                                className="card border-0 shadow-lg h-100 position-relative overflow-hidden"
                                style={{
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease',
                                    transform: hoveredCard === 'search' ? 'translateY(-8px)' : 'translateY(0)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate("/admin-page")}
                                onMouseEnter={() => setHoveredCard('search')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <TTSButton targetRef={adminCardRef} className="position-absolute top-0 end-0 m-3" style={{ zIndex: 10 }} />
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
                                                background: 'linear-gradient(135deg, #a1c736 0%, #5f7e08 100%)',
                                                boxShadow: '0 0 30px rgba(161, 199, 54, 0.4)'
                                            }}
                                        >
                                            <span className="fs-1">🔍</span>
                                        </div>
                                    </div>

                                    <div className="position-relative d-inline-block mb-3">
                                        <h3 className="card-title h4 fw-bold mb-0">Administración</h3>
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
                                        Página de administración donde el administrador puede crear nuevas etiquetas y fuentes
                                    </p>

                                    <div className="mt-4">
                                        <button
                                            className="btn btn-success fw-medium"
                                            onClick={() => navigate("/admin-page")}
                                            style={{
                                                transition: 'all 0.3s ease',
                                                transform: hoveredCard === 'search' ? 'scale(1.05)' : 'scale(1)'
                                            }}
                                        >
                                            Panel de Administración →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>

                </div>
                <NoticiasRecientes />

                <HelpTooltip
                    page="home"
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

export default HomePage;