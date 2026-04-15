import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function ArticleList({ articles, actorsMap, tagsMap, locationsMap }) {
    if (articles.length === 0) return <p>No articles found.</p>;

    return (
        <Row xs={1} md={2} className='g-4'>
        {articles.map((item) => {
          const origin = item.origin?.toLowerCase();

          const originColor = origin === 'muninn' ? '#722294' : '#60CC7D';
          const originLabel = origin === 'munnin' ? 'Munnin' : origin === 'user' ? 'User' : origin || 'N/A';

          return (
          <Col key={item.id}>
            <Card className='mb-4' style={{ overflow: 'hidden' }}>
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
              <Card.Body>
                <Card.Title><a href={item.url || '#'}>{item.headline}</a></Card.Title>
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
                  <strong>Paywall:</strong> {item.paywall === true ? 'Si' : item.paywall === false ? 'No' : 'N/A'}
                </Card.Text>
                <Card.Text>
                  <strong>Nivel de Cobertura:</strong> {item.coverageLevel || 'N/A'}
                </Card.Text>
                {item.summary && (
                  <Card.Text>
                    <strong>Resumen:</strong> {item.summary}
                  </Card.Text>
                )}
                <Card.Text><strong>Actores Mencionados:</strong> {
              Array.isArray(item.actorsMentioned)
                ? item.actorsMentioned.map(id => actorsMap[id] || id).join(', ')
                : 'N/A'
            }</Card.Text>
            <Card.Text><strong>Tags:</strong> {
              Array.isArray(item.tags)
                ? item.tags.map(id => tagsMap[id] || id).join(', ')
                : 'N/A'
            }</Card.Text>
            <Card.Text><strong>Ubicación:</strong> {
              Array.isArray(item.location) && item.location.length > 0
                ? item.location.map(loc => loc.name).join(', ')
                : 'N/A'
            }</Card.Text>
          </Card.Body>
        </Card>
      </Col>
          );
        })}
  </Row>
)
}

export default ArticleList;