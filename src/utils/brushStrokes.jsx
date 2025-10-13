import React from 'react';

const BrushStrokes = ({ 
  color = '#000000', 
  opacity = 0.8, 
  width = 200, 
  height = 50,
  strokeWidth = 8,
  variant = 'underline'
}) => {
  
  const generatePath = (variant) => {
    switch(variant) {
      case 'underline':
        return `M 10,${height/2} Q ${width/4},${height/2 - 5} ${width/2},${height/2} T ${width - 10},${height/2}`;
      
      case 'circle':
        const cx = width / 2;
        const cy = height / 2;
        const r = Math.min(width, height) / 2 - 10;
        return `M ${cx + r},${cy} A ${r},${r} 0 1,1 ${cx + r - 0.1},${cy}`;
      
      case 'highlight':
        return `M 5,${height/2} Q ${width/3},${height/2 + 3} ${width*2/3},${height/2 - 3} T ${width - 5},${height/2}`;
      
      case 'cross':
        return `M 10,10 L ${width - 10},${height - 10} M ${width - 10},10 L 10,${height - 10}`;
      
      case 'wave':
        return `M 10,${height/2} Q ${width/6},${height/4} ${width/3},${height/2} T ${width*2/3},${height/2} T ${width - 10},${height/2}`;
      
      case 'arrow':
        return `M 10,${height/2} L ${width - 20},${height/2} L ${width - 30},${height/2 - 10} M ${width - 20},${height/2} L ${width - 30},${height/2 + 10}`;
      
      default:
        return `M 10,${height/2} L ${width - 10},${height/2}`;
    }
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id={`roughen-${variant}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </defs>
      <path
        d={generatePath(variant)}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        opacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#roughen-${variant})`}
      />
    </svg>
  );
};

// Componente de demostración
const BrushStrokesDemo = () => {
  const variants = ['underline', 'circle', 'highlight', 'cross', 'wave', 'arrow'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h1 className="display-4 text-center mb-2">
            Brush Strokes Component
          </h1>
          <div className="d-flex justify-content-center">
            <BrushStrokes variant="underline" color="#6C63FF" width={300} strokeWidth={6} />
          </div>
        </div>

        <div className="col-12 mb-5">
          <div className="alert alert-info">
            <strong>Uso:</strong> {'<BrushStrokes variant="underline" color="#FF6B6B" width={200} height={50} strokeWidth={8} opacity={0.8} />'}
          </div>
        </div>

        <div className="col-12">
          <h3 className="mb-4">Variantes Disponibles</h3>
          <div className="row g-4">
            {variants.map((variant, idx) => (
              <div key={variant} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '150px' }}>
                    <h5 className="card-title mb-3 text-capitalize">{variant}</h5>
                    <BrushStrokes 
                      variant={variant} 
                      color={colors[idx]} 
                      width={200} 
                      height={variant === 'circle' ? 80 : 50}
                      strokeWidth={8}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 mt-5">
          <h3 className="mb-4">Ejemplos de Uso</h3>
          
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="mb-3">Título con subrayado</h4>
              <div className="position-relative d-inline-block">
                <h2 className="mb-0">Texto Destacado</h2>
                <div className="position-absolute" style={{ bottom: '-10px', left: '0' }}>
                  <BrushStrokes variant="underline" color="#FF6B6B" width={250} strokeWidth={6} />
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h4 className="mb-3">Texto con highlight</h4>
              <div className="position-relative d-inline-block">
                <span className="fs-4">Importante</span>
                <div className="position-absolute" style={{ top: '50%', left: '-5px', transform: 'translateY(-50%)', zIndex: '-1' }}>
                  <BrushStrokes variant="highlight" color="#FFA07A" width={150} height={40} strokeWidth={20} opacity={0.3} />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h4 className="mb-3">Elementos decorativos</h4>
              <div className="d-flex gap-3 flex-wrap align-items-center">
                <BrushStrokes variant="circle" color="#4ECDC4" width={60} height={60} strokeWidth={6} />
                <BrushStrokes variant="wave" color="#98D8C8" width={150} strokeWidth={5} />
                <BrushStrokes variant="arrow" color="#F7DC6F" width={120} strokeWidth={6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrushStrokes;