import BrushStrokes from '../utils/brushStrokes';


function LoginPage() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  console.log(apiUrl);

  const handleLogin = () => {
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
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

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            
            {/* Card principal */}
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="card-body p-4 p-md-5">
                
                {/* Header con logo/título */}
                <div className="text-center mb-5">
                  <div className="position-relative d-inline-block mb-3">
                    <h1 className="display-4 mb-0" style={{ fontWeight: '300' }}>
                      Territo<span className="fw-bold text-success">Rios</span>
                    </h1>
                    <div className="position-absolute" style={{ bottom: '-15px', left: '50%', transform: 'translateX(-50%)' }}>
                      <BrushStrokes 
                        variant="underline" 
                        color="#198754" 
                        width={280} 
                        height={30} 
                        strokeWidth={6} 
                        opacity={0.6} 
                      />
                    </div>
                  </div>
                  
                  <p className="text-muted fs-5 fw-light mt-4 mb-0">
                    Herramienta de Monitoreo
                  </p>
                  
                  {/* Brush stroke decorativo */}
                  <div className="d-flex justify-content-center mt-3">
                    <BrushStrokes 
                      variant="wave" 
                      color="#667eea" 
                      width={120} 
                      height={30} 
                      strokeWidth={4} 
                      opacity={0.5} 
                    />
                  </div>
                </div>

                {/* Contenido descriptivo */}
                <div className="mb-4 text-center">
                  <p className="text-muted mb-4">
                    Accede a nuestra nueva herramienta de monitoreo, donde podras consultar de manera sencilla las noticias e informacion relevante sobre nuestras distintas problematicas
                  </p>
                  
                  {/* Features con brush strokes */}
                  {/* <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-4">
                      <div className="p-3 position-relative">
                        <div className="position-absolute top-0 start-50 translate-middle-x opacity-50">
                          <BrushStrokes variant="circle" color="#198754" width={50} height={50} strokeWidth={3} opacity={0.3} />
                        </div>
                        <div className="pt-3">
                          <div className="fs-4 mb-1">📊</div>
                          <small className="text-muted fw-medium">Análisis</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="p-3 position-relative">
                        <div className="position-absolute top-0 start-50 translate-middle-x opacity-50">
                          <BrushStrokes variant="circle" color="#667eea" width={50} height={50} strokeWidth={3} opacity={0.3} />
                        </div>
                        <div className="pt-3">
                          <div className="fs-4 mb-1">🗺️</div>
                          <small className="text-muted fw-medium">Mapas</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="p-3 position-relative">
                        <div className="position-absolute top-0 start-50 translate-middle-x opacity-50">
                          <BrushStrokes variant="circle" color="#764ba2" width={50} height={50} strokeWidth={3} opacity={0.3} />
                        </div>
                        <div className="pt-3">
                          <div className="fs-4 mb-1">⚡</div>
                          <small className="text-muted fw-medium">Tiempo Real</small>
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Botón de login */}
                <div className="text-center">
                  <button 
                    className="btn btn-lg px-5 py-3 border-0 shadow position-relative"
                    onClick={handleLogin}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '50px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease',
                      overflow: 'visible'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continuar con Google</span>
                    </span>
                  </button>
                  
                  {/* Brush stroke debajo del botón */}
                  <div className="d-flex justify-content-center mt-3">
                    <BrushStrokes 
                      variant="underline" 
                      color="#667eea" 
                      width={200} 
                      height={25} 
                      strokeWidth={3} 
                      opacity={0.4} 
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    {/* FOOTER TEXT  */}
                  </small>
                </div>
              </div>
            </div>

            {/* Texto adicional debajo */}
            <div className="text-center mt-4">
              <p className="text-white small opacity-75">
                © 2024 TerritorioRios. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
