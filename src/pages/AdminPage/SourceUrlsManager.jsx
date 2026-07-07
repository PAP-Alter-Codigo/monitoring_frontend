import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import ConfirmModal from '../../components/ConfirmModal';
import ToastNotification from '../../components/ToastNotification';
import TTSButton from '../../components/TTSButton';

const TYPE_OPTIONS = ['rss', 'HTML'];
const EMPTY_FORM = { name: '', source_url: '', type: 'rss' };

function SourceUrlsManager() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const [sources, setSources] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState(EMPTY_FORM);
  const [newSource, setNewSource] = useState(EMPTY_FORM);
  const [modal, setModal] = useState({ show: false, id: null, name: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [loading, setLoading] = useState(false);

  const fetchSources = async () => {
    try {
      const res = await fetchWithAuth(`${apiUrl}/source-urls`);
      const data = await res.json();
      setSources(data);
    } catch {
      showToast('Error al cargar las fuentes', 'danger');
    }
  };

  useEffect(() => { fetchSources(); }, []);

  const showToast = (message, type = 'success') =>
    setToast({ show: true, message, type });

  const startEdit = (source) => {
    setEditingId(source.id);
    setEditValues({ name: source.name, source_url: source.source_url, type: source.type });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues(EMPTY_FORM);
  };

  const saveEdit = async () => {
    if (!editValues.name.trim() || !editValues.source_url.trim()) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${apiUrl}/source-urls/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(editValues),
      });
      if (!res.ok) throw new Error();
      showToast('Fuente actualizada exitosamente');
      setEditingId(null);
      await fetchSources();
    } catch {
      showToast('Error al actualizar la fuente', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (source) =>
    setModal({ show: true, id: source.id, name: source.name });

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${apiUrl}/source-urls/${modal.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('Fuente eliminada exitosamente');
      await fetchSources();
    } catch {
      showToast('Error al eliminar la fuente', 'danger');
    } finally {
      setLoading(false);
      setModal({ show: false, id: null, name: '' });
    }
  };

  const createSource = async () => {
    if (!newSource.name.trim() || !newSource.source_url.trim()) return;
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${apiUrl}/source-urls`, {
        method: 'POST',
        body: JSON.stringify(newSource),
      });
      if (!res.ok) throw new Error();
      showToast('Fuente creada exitosamente');
      setNewSource(EMPTY_FORM);
      await fetchSources();
    } catch {
      showToast('Error al crear la fuente', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const typeBadgeStyle = (type) =>
    type === 'rss'
      ? { background: 'rgba(13, 202, 240, 0.15)', color: '#0dcaf0', border: '1px solid rgba(13,202,240,0.4)' }
      : { background: 'rgba(108, 117, 125, 0.15)', color: '#6c757d', border: '1px solid rgba(108,117,125,0.4)' };

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
        title="Eliminar Fuente"
        message={`¿Estás seguro de que deseas eliminar la fuente "${modal.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setModal({ show: false, id: null, name: '' })}
      />

      <div className="mb-4 p-4 rounded-3" style={{ background: '#f8f9fa', border: '1px dashed #dee2e6' }}>
        <h6 className="fw-bold text-muted mb-3 text-uppercase d-flex align-items-center gap-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
          Nueva Fuente
          <TTSButton
            text="Agrega una nueva fuente de noticias al sistema indicando su nombre, URL y tipo de fuente."
            onClick={(e) => e.stopPropagation()}
          />
        </h6>
        <Row className="g-2 align-items-end">
          <Col xs={12} md={3}>
            <Form.Label className="small text-muted mb-1">Nombre</Form.Label>
            <Form.Control
              size="sm"
              placeholder="ej. BBC News RSS"
              value={newSource.name}
              onChange={e => setNewSource(s => ({ ...s, name: e.target.value }))}
            />
          </Col>
          <Col xs={12} md={5}>
            <Form.Label className="small text-muted mb-1">URL</Form.Label>
            <Form.Control
              size="sm"
              placeholder="ej. https://feeds.bbci.co.uk/news/rss.xml"
              value={newSource.source_url}
              onChange={e => setNewSource(s => ({ ...s, source_url: e.target.value }))}
            />
          </Col>
          <Col xs={6} md={2}>
            <Form.Label className="small text-muted mb-1">Tipo</Form.Label>
            <Form.Select
              size="sm"
              value={newSource.type}
              onChange={e => setNewSource(s => ({ ...s, type: e.target.value }))}
            >
              {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </Form.Select>
          </Col>
          <Col xs={6} md={2}>
            <Button
              size="sm"
              className="w-100"
              onClick={createSource}
              disabled={loading || !newSource.name.trim() || !newSource.source_url.trim()}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
            >
              + Agregar
            </Button>
          </Col>
        </Row>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr className="border-bottom">
              {/* <th className="text-muted fw-semibold pb-3" style={{ width: '70px', fontSize: '0.8rem' }}>#</th> */}
              <th className="text-muted fw-semibold pb-3" style={{ fontSize: '0.8rem' }}>NOMBRE</th>
              <th className="text-muted fw-semibold pb-3" style={{ fontSize: '0.8rem' }}>URL</th>
              <th className="text-muted fw-semibold pb-3" style={{ width: '90px', fontSize: '0.8rem' }}>TIPO</th>
              <th className="text-muted fw-semibold pb-3 text-end" style={{ width: '180px', fontSize: '0.8rem' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-muted py-5">
                  <div style={{ fontSize: '2rem' }}>🔗</div>
                  <div className="mt-2">No hay fuentes registradas</div>
                </td>
              </tr>
            ) : sources.map(source => (
              <tr key={source.id}>
                <td>
                  {editingId === source.id ? (
                    <Form.Control
                      size="sm"
                      value={editValues.name}
                      onChange={e => setEditValues(v => ({ ...v, name: e.target.value }))}
                    />
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <TTSButton
                        text={`Nombre: ${source.name}. URL: ${source.source_url}. Tipo: ${source.type}.`}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="fw-medium">{source.name}</span>
                    </div>
                  )}
                </td>
                <td>
                  {editingId === source.id ? (
                    <Form.Control
                      size="sm"
                      value={editValues.source_url}
                      onChange={e => setEditValues(v => ({ ...v, source_url: e.target.value }))}
                    />
                  ) : (
                    <a
                      href={source.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary small text-truncate d-block"
                      style={{ maxWidth: '320px' }}
                    >
                      {source.source_url}
                    </a>
                  )}
                </td>
                <td>
                  {editingId === source.id ? (
                    <Form.Select
                      size="sm"
                      value={editValues.type}
                      onChange={e => setEditValues(v => ({ ...v, type: e.target.value }))}
                    >
                      {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </Form.Select>
                  ) : (
                    <span className="badge rounded-pill px-2 py-1 small fw-semibold" style={typeBadgeStyle(source.type)}>
                      {source.type.toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="text-end">
                  {editingId === source.id ? (
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
                      <Button size="sm" variant="outline-primary" onClick={() => startEdit(source)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => confirmDelete(source)}>
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
export default SourceUrlsManager;