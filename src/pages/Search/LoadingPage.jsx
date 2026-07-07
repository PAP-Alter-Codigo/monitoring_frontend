import BrushStrokes from "../../utils/brushStrokes";

export default function LoadingPage() {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #43C6AC 0%, #191654 100%)' }}
    >
      {/* Decorative brush strokes */}
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

      {/* Loading content */}
      <div className="text-center position-relative z-1">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
          style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 0 40px rgba(102, 126, 234, 0.6)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>📰</span>
        </div>

        <h2 style={{ color: '#fff', marginBottom: '1rem', fontWeight: 700, fontSize: 'var(--fs-2xl)' }}>
          Cargando Artículos
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2rem', fontSize: 'var(--fs-base)' }}>
          Preparando tu búsqueda...
        </p>

        {/* Animated loader */}
        <div className="d-flex justify-content-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#fff',
                animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
                opacity: 0.7
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.7;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
