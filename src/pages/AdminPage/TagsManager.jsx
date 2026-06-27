import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import ConfirmModal from '../../components/ConfirmModal';
import ToastNotification from '../../components/ToastNotification';
import TTSButton from '../../components/TTSButton';

function TagsManager() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const [tags, setTags] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [modal, setModal] = useState({ show: false, id: null, name: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const fetchTags = async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/tags`);
      const data = await res.json();
      setTags(data);
    } catch {
      showToast('Error al cargar las etiquetas', 'danger');
    }
  };

  useEffect(() => { fetchTags(); }, []);

  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type });

  const startEdit = (tag) => {
    setEditingId(tag.id);
    setEditValue(tag.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editValue.trim()) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${apiUrl}/tags/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify({ name: editValue.trim() }),
      });
      if (!res.ok) throw new Error();
      showToast('Etiqueta actualizada exitosamente');
      setEditingId(null);
      await fetchTags();
    } catch {
      showToast('Error al actualizar la etiqueta', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (tag) =>
    setModal({ show: true, id: tag.id, name: tag.name });

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${apiUrl}/tags/${modal.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Etiqueta eliminada exitosamente');
      await fetchTags();
    } catch {
      showToast('Error al eliminar la etiqueta', 'danger');
    } finally {
      setLoading(false);
      setModal({ show: false, id: null, name: '' });
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${apiUrl}/tags`, {
        method: 'POST',
        body: JSON.stringify({ name: newTagName.trim() }),
      });
      if (!res.ok) throw new Error();
      showToast('Etiqueta creada exitosamente');
      setNewTagName('');
      await fetchTags();
    } catch {
      showToast('Error al crear la etiqueta', 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(t => ({ ...t, show: false }))}
      />
      <ConfirmModal
        show={modal.show}
        title="Eliminar Etiqueta"
        message={`¿Estás seguro de que deseas eliminar la etiqueta "${modal.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setModal({ show: false, id: null, name: '' })}
      />

      <div className="mb-4">
        <h6 className="fw-bold text-muted mb-3 text-uppercase d-flex align-items-center gap-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
          Nueva Etiqueta
          <TTSButton
            text="Agrega una nueva etiqueta al sistema escribiendo su nombre y presionando Agregar o la tecla Enter."
            onClick={(e) => e.stopPropagation()}
          />
        </h6>
        <InputGroup style={{ maxWidth: '480px' }}>
          <Form.Control
            placeholder="Nombre de la etiqueta"
            value={newTagName}
            onChange={e => setNewTagName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createTag()}
          />
          <Button
            onClick={createTag}
            disabled={loading || !newTagName.trim()}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
          >
            + Agregar
          </Button>
        </InputGroup>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr className="border-bottom">
              <th className="text-muted fw-semibold pb-3" style={{ width: '80px', fontSize: '0.8rem' }}>#</th>
              <th className="text-muted fw-semibold pb-3" style={{ fontSize: '0.8rem' }}>NOMBRE</th>
              <th className="text-muted fw-semibold pb-3 text-end" style={{ width: '180px', fontSize: '0.8rem' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {tags.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-muted py-5">
                  <div style={{ fontSize: '2rem' }}>🏷️</div>
                  <div className="mt-2">No hay etiquetas registradas</div>
                </td>
              </tr>
            ) : tags.map(tag => (
              <tr key={tag.id}>
                <td className="text-muted small">
                  <div className="d-flex align-items-center gap-1">
                    <TTSButton
                      text={`Etiqueta Nombre: ${tag.name}.`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {tag.id}
                  </div>
                </td>
                <td>
                  {editingId === tag.id ? (
                    <Form.Control
                      size="sm"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                      style={{ maxWidth: '320px' }}
                    />
                  ) : (
                    <span className="fw-medium">{tag.name}</span>
                  )}
                </td>
                <td className="text-end">
                  {editingId === tag.id ? (
                    <div className="d-flex gap-2 justify-content-end">
                      <Button size="sm" variant="success" onClick={saveEdit} disabled={loading}>
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline-secondary" onClick={cancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2 justify-content-end">
                      <Button size="sm" variant="outline-primary" onClick={() => startEdit(tag)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => confirmDelete(tag)}>
                        Eliminar
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TagsManager;