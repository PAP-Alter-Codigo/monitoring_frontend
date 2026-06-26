import React, { useState } from 'react';
import './HelpTooltip.css';

const PAGE_HELP_DATA = {
  login: {
    title: "Acceso al Sistema",
    emojiClass: "anim-login-key",
    emoji: "🔑",
    description: "Bienvenido a TerritoRios. Este es el punto de acceso seguro a la plataforma. Utiliza tu cuenta institucional de Google para iniciar sesión y acceder a los datos de monitoreo de prensa.",
    details: [
      "Autenticación segura con Google OAuth.",
      "Acceso restringido a personal autorizado.",
      "Redirección automática al panel de control principal."
    ]
  },
  home: {
    title: "Panel de Control",
    emojiClass: "anim-home-dash",
    emoji: "📊",
    description: "Este es tu menú principal de navegación. Aquí tienes accesos directos rápidos para gestionar e investigar noticias de manera centralizada.",
    details: [
      "Sección de Artículos: Para buscar, filtrar y analizar notas guardadas.",
      "Sección de Admin: Para gestionar etiquetas y fuentes de noticias.",
      "Vista rápida de Noticias Recientes añadidas en la parte inferior."
    ]
  },
  search: {
    title: "Buscador de Artículos",
    emojiClass: "anim-search-glass",
    emoji: "🔍",
    description: "Aquí puedes explorar toda la base de datos de artículos de monitoreo. Usa los filtros superiores para acotar las noticias de tu interés.",
    details: [
      "Filtros avanzados por rango de fecha (DD/MM/AAAA), autor, medio, paywall y más.",
      "Filtros jerárquicos expandibles por Etiquetas y Actores mencionados.",
      "Los resultados se agrupan automáticamente por mes y año de publicación."
    ]
  },
  "article-form": {
    title: "Registro de Artículos",
    emojiClass: "anim-form-pencil",
    emoji: "📝",
    description: "Formulario para la captura manual de nuevos artículos periodísticos relacionados con las problemáticas monitoreadas.",
    details: [
      "Ingresa obligatoriamente el encabezado, link, autor y fecha de publicación.",
      "Introduce la fecha en formato DD/MM/AAAA (ej. 15/06/2026).",
      "Selecciona los actores, tags y ubicaciones correspondientes a la nota."
    ]
  },
  admin: {
    title: "Panel de Administración",
    emojiClass: "anim-admin-gear",
    emoji: "⚙️",
    description: "Espacio de control y mantenimiento para la parametrización de las variables clave del sistema.",
    details: [
      "Pestaña de Tags: Crea y edita las etiquetas temáticas del monitoreo.",
      "Pestaña de Fuentes: Agrega y configura las URLs de origen de los medios.",
      "Acceso rápido directo al Formulario de Alta de Artículos."
    ]
  }
};

function HelpTooltip({ page, positionStyle = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const data = PAGE_HELP_DATA[page];

  if (!data) return null;

  const toggleTooltip = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating help button */}
      <button
        className="help-tooltip-btn"
        onClick={toggleTooltip}
        title="Mostrar Ayuda"
        aria-label={`Mostrar ayuda sobre ${data.title}`}
        aria-expanded={isOpen}
        aria-controls="help-dialog"
        type="button"
        style={positionStyle}
      >
        <span aria-hidden="true">❓</span>
      </button>

      {/* Glassmorphic Overlay & Dialog Box */}
      {isOpen && (
        <div className="help-modal-overlay" onClick={toggleTooltip}>
          <div
            id="help-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-dialog-title"
            className="help-dialog-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="help-dialog-header">
              <h4 id="help-dialog-title" className="help-dialog-title">
                <span aria-hidden="true">💡 </span>
                {data.title}
              </h4>
              <button 
                className="help-dialog-close" 
                onClick={toggleTooltip}
                aria-label="Cerrar diálogo de ayuda"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <div className="help-animation-container" aria-hidden="true">
              <span className={`display-1 ${data.emojiClass}`}>
                {data.emoji}
              </span>
            </div>

            <div className="help-dialog-body text-start">
              <p className="text-muted fs-6 mb-3">
                {data.description}
              </p>

              <div className="pt-2">
                <h6 className="fw-bold text-dark mb-2">Características clave:</h6>
                <ul className="ps-3 mb-0 text-muted small">
                  {data.details.map((detail, idx) => (
                    <li key={idx} className="mb-1">{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HelpTooltip;
