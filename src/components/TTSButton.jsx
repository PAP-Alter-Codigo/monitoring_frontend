import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './TTSButton.css';
import speakerIcon from '../assets/speaker.jpg';

function TTSButton({ text, targetRef, selector, lang = 'es-ES', className = '', style = {} }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Limpiar lectura al desmontar componente o detenerse
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getCleanText = () => {
    if (text) return text;
    
    let element = null;
    if (targetRef && targetRef.current) {
      element = targetRef.current;
    } else if (selector) {
      element = document.querySelector(selector);
    }
    
    if (element) {
      // Clonamos o extraemos el texto omitiendo botones de control o elementos auxiliares
      const tempElement = element.cloneNode(true);
      // Removemos elementos con la clase no-tts, botones, y el propio botón de tts
      const noReadElements = tempElement.querySelectorAll('.no-tts, button, .tts-btn');
      noReadElements.forEach(el => el.remove());
      return tempElement.innerText || tempElement.textContent;
    }
    return '';
  };

  const handleSpeak = (e) => {
    e.stopPropagation(); // Evitar eventos del contenedor padre

    if (!('speechSynthesis' in window)) {
      alert("Lo sentimos, tu navegador no soporta la síntesis de voz.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = getCleanText();
    if (!textToRead.trim()) return;

    window.speechSynthesis.cancel(); // Cancelar cualquier lectura activa anterior

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = lang;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <span style={{ fontSize: '1.1rem', fontWeight: 500, padding: '2px 6px' }}>Escuchar</span>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 200, hide: 400 }}
      overlay={renderTooltip}
    >
      <span
        role="button"
        tabIndex={0}
        className={`tts-btn ${isSpeaking ? 'speaking' : ''} ${className}`}
        style={style}
        onClick={handleSpeak}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleSpeak(e);
          }
        }}
        title={isSpeaking ? "Detener lectura" : ""}
        aria-label={isSpeaking ? "Detener lectura de voz" : "Escuchar este recuadro en voz alta"}
      >
        {isSpeaking ? (
          <svg className="tts-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <rect x="7" y="4" width="2" height="16" rx="0.5"/>
            <rect x="15" y="4" width="2" height="16" rx="0.5"/>
          </svg>
        ) : (
          <img src={speakerIcon} alt="Play" className="tts-icon" style={{ width: '20px', height: '20px' }} />
        )}
      </span>
    </OverlayTrigger>
  );
}

export default TTSButton;
