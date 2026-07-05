export default function LoadingSkeleton({ variant = 'inline' }) {
  if (variant === 'inline') {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="d-flex flex-column align-items-center gap-3">
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            📰
          </div>
          <p style={{ margin: '0 0 0.75rem 0', color: '#6c757d', fontSize: 'var(--fs-sm)' }}>
            Cargando...
          </p>
          <div className="d-flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#667eea',
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
              transform: translateY(-8px);
            }
          }
        `}</style>
      </div>
    );
  }

  return null;
}
