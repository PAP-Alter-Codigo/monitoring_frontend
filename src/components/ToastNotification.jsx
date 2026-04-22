import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const BG_MAP = { success: 'success', danger: 'danger', warning: 'warning' };
const LABEL_MAP = { success: '✓ Éxito', danger: '✗ Error', warning: '⚠ Aviso' };

function ToastNotification({ show, message, type = 'success', onClose }) {
  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1100, position: 'fixed' }}>
      <Toast show={show} onClose={onClose} delay={3500} autohide bg={BG_MAP[type] || 'success'}>
        <Toast.Header closeButton>
          <strong className="me-auto">{LABEL_MAP[type] || '✓ Éxito'}</strong>
        </Toast.Header>
        <Toast.Body className="text-white fw-medium">
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastNotification;
