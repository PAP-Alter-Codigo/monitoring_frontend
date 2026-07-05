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
                                    <Card id={`article-card-${item.id}`} className="w-100 d-flex flex-column" style={{ overflow: 'hidden' }}>
                                        <div style={{
                                            backgroundColor: originColor,
                                            color: '#fff',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            padding: '4px 12px',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                        }}>
                                            {originLabel}
                                        </div>
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="d-flex justify-content-between align-items-start gap-2">
                                                <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">{item.headline}</a>
                                                <TTSButton selector={`#article-card-${item.id}`} className="flex-shrink-0" />
                                            </Card.Title>
                                            <Card.Text>
                                                <strong>Autor:</strong> {item.author || 'N/A'}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Fecha de Publicación:</strong> {item.publicationDate || 'N/A'}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Nombre de la Fuente:</strong> {item.sourceName || 'N/A'}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>¿De Pago?:</strong> {item.paywall === true ? 'Sí' : item.paywall === false ? 'No' : 'N/A'}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Nivel de Cobertura:</strong> {item.coverageLevel || 'N/A'}
                                            </Card.Text>
                                            {item.summary && (
                                                <Card.Text>
                                                    <strong>Resumen:</strong> {item.summary}
                                                </Card.Text>
                                            )}
                                            <Card.Text>
                                                <strong>Actores Mencionados:</strong>{' '}
                                                {Array.isArray(item.actorsMentioned)
                                                    ? item.actorsMentioned.map((id) => actorsMap[id] || id).join(', ')
                                                    : 'N/A'}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Etiquetas:</strong>{' '}
                                                {Array.isArray(item.tags)
                                                    ? item.tags.map((id) => tagsMap[id] || id).join(', ')
                                                    : 'N/A'}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Ubicación:</strong>{' '}
                                                {Array.isArray(item.location) && item.location.length > 0
                                                    ? item.location.map((loc) => loc.name).join(', ')
                                                    : 'N/A'}
                                            </Card.Text>
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
