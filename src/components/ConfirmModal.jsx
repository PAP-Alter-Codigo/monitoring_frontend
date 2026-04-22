import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ConfirmModal({ show, title, message, onConfirm, onCancel, confirmLabel = 'Eliminar', confirmVariant = 'danger' }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button variant={confirmVariant} onClick={onConfirm}>{confirmLabel}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
