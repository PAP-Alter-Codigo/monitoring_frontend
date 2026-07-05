import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { parseDate } from '../../utils/parseDate';
import TTSButton from '../../components/TTSButton';

const MONTHS_ES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function getMonthKey(publicationDate) {
    const date = parseDate(publicationDate);
    if (!date) return 'Sin fecha';
    return `${MONTHS_ES[date.getMonth()]} ${date.getFullYear()}`;
}

function groupByMonth(articles) {
    const sorted = [...articles].sort((a, b) => {
        const da = parseDate(a.publicationDate);
        const db = parseDate(b.publicationDate);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return db - da;
    });

    const groups = [];
    const keyToIndex = {};

    sorted.forEach((article) => {
        const key = getMonthKey(article.publicationDate);
        if (keyToIndex[key] === undefined) {
            keyToIndex[key] = groups.length;
            groups.push({ key, articles: [] });
        }
        groups[keyToIndex[key]].articles.push(article);
    });

    return groups;
}

function ArticleList({ articles, actorsMap, tagsMap, locationsMap }) {
    if (articles.length === 0) return <p>No se encontraron artículos.</p>;

    const groups = groupByMonth(articles);

    return (
        <>
            {groups.map(({ key, articles: groupArticles }) => (
                <div key={key} className="mb-5">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <span
                            className="text-capitalize fw-bold"
                            style={{ fontSize: '1rem', color: '#191654', whiteSpace: 'nowrap' }}
                        >
                            {key}
                        </span>
                        <div
                            className="flex-grow-1"
                            style={{ height: '3px', backgroundColor: '#ffffff' }}
                        />
                        <span
                            className="badge rounded-pill"
                            style={{ background: 'rgba(102,126,234,0.15)', color: '#667eea', fontSize: '0.75rem' }}
                        >
                            {groupArticles.length}
                        </span>
                    </div>

                    <Row xs={1} md={2} className="g-4">
                        {groupArticles.map((item) => {
                            const origin = item.origin?.toLowerCase();
                            const originColor = origin === 'muninn' ? '#722294' : '#60CC7D';
                            const originLabel =
                                origin === 'muninn' ? 'Muninn'
                                    : origin === 'user' ? 'Usuario'
                                        : origin || 'N/A';

                            return (
                                <Col key={item.id} className="d-flex">
                                    <Card id={`article-card-${item.id}`} className="w-100 d-flex flex-column" style={{
                                        overflow: 'hidden',
                                        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}>
                                        {/* origin badge header */}
                                        {(origin === 'muninn' || origin === 'user') && (
                                            <div style={{
                                                backgroundColor: originColor,
                                                color: '#fff',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                padding: '4px 12px',
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase'
                                            }}>
                                                {originLabel}
                                            </div>
                                        )}

                                        <Card.Body className="d-flex flex-column" style={{ gap: '12px' }}>
                                            {/* headline */}
                                            <div className="d-flex justify-content-between align-items-start gap-2">
                                                <a href={item.url || '#'} target="_blank" rel="noopener noreferrer" style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: 700,
                                                    color: '#0066cc',
                                                    textDecoration: 'none',
                                                    lineHeight: '1.4',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    flex: 1
                                                }}>
                                                    {item.headline}
                                                </a>
                                                <TTSButton selector={`#article-card-${item.id}`} className="flex-shrink-0" />
                                            </div>

                                            {/* metadata row with columns */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                                                gap: '8px',
                                                fontSize: '0.8rem',
                                                color: '#6c757d',
                                                padding: '8px 0'
                                            }}>
                                                {/* autor */}
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Autor</div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>{item.author || 'N/A'}</div>
                                                </div>

                                                {/* fecha */}
                                                {item.publicationDate && (
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Fecha</div>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>{item.publicationDate}</div>
                                                    </div>
                                                )}

                                                {/* fuente */}
                                                {item.sourceName && (
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Fuente</div>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>{item.sourceName}</div>
                                                    </div>
                                                )}

                                                {/* cobertura */}
                                                {item.coverageLevel && (
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Cobertura</div>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>{item.coverageLevel.charAt(0).toUpperCase() + item.coverageLevel.slice(1)}</div>
                                                    </div>
                                                )}

                                                {/* paywall */}
                                                {item.paywall !== null && (
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>¿De pago?</div>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#333' }}>
                                                            {item.paywall ? 'Sí' : 'No'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* summary */}
                                            {item.summary && (
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '0.95rem',
                                                    color: '#555',
                                                    lineHeight: '1.5',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>
                                                    {item.summary}
                                                </p>
                                            )}

                                            {/* divider after summary */}
                                            <div style={{ height: '1px', backgroundColor: 'rgba(108,117,125,0.2)', margin: '4px 0' }} />

                                            {/* actors */}
                                            {Array.isArray(item.actorsMentioned) && item.actorsMentioned.length > 0 && (
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
                                                        Actores Mencionados
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {item.actorsMentioned.map((id) => (
                                                            <span key={id} className="badge rounded-pill" style={{ background: 'rgba(108,117,125,0.15)', color: '#6c757d', fontSize: '0.8rem' }}>
                                                                {actorsMap[id] || id}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* tags */}
                                            {Array.isArray(item.tags) && item.tags.length > 0 && (
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
                                                        Etiquetas
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {item.tags.map((id) => (
                                                            <span key={id} className="badge rounded-pill" style={{ background: 'rgba(108,117,125,0.15)', color: '#6c757d', fontSize: '0.8rem' }}>
                                                                {tagsMap[id] || id}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* locations */}
                                            {Array.isArray(item.location) && item.location.length > 0 && (
                                                <div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
                                                        Ubicación
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {item.location.map((loc) => (
                                                            <span key={loc.id || loc.name} className="badge rounded-pill" style={{ background: 'rgba(108,117,125,0.15)', color: '#6c757d', fontSize: '0.8rem' }}>
                                                                {loc.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            ))}
        </>
    );
}

export default ArticleList;
