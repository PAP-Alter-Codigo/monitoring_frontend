import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import TTSButton from "../../components/TTSButton";

function Filters({
  filters,
  setFilters,
  tagsMap,
  actorsMap,
  locationsMap,
  sourceNames,
  coverageLevels,
  authorNames,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaywallChange = (e) => {
    const val = e.target.value;
    setFilters((prev) => ({
      ...prev,
      paywall: val === "" ? null : val === "true",
    }));
  };

  const handleMultiSelectChange = (e, field) => {
    const value = e.target.value;
    setFilters((prev) => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  };

  const handleDateChange = (e, type) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      publicationDate: {
        ...prev.publicationDate,
        [type]: value,
      },
    }));
  };

  return (
    <Form className="filters mb-4">
      <Row>
        <Col md={6}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <TTSButton
              text={`Fecha de inicio para búsqueda de artículos. ${filters.publicationDate.startDate ? `Valor actual: ${filters.publicationDate.startDate}` : "Vacía."}`}
            />
            <Form.Label className="mb-0 text-white">
              <strong style={{ color: "black" }}>Fecha de inicio:</strong>
            </Form.Label>
          </div>
          <Form.Control
            type="date"
            value={filters.publicationDate.startDate}
            onChange={(e) => handleDateChange(e, "startDate")}
          />
        </Col>
        <Col md={6}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <TTSButton
              text={`Fecha de fin para búsqueda de artículos. ${filters.publicationDate.endDate ? `Valor actual: ${filters.publicationDate.endDate}` : "Vacía."}`}
            />
            <Form.Label className="mb-0 text-white">
              <strong style={{ color: "black" }}>Fecha de fin:</strong>
            </Form.Label>
          </div>
          <Form.Control
            type="date"
            value={filters.publicationDate.endDate}
            onChange={(e) => handleDateChange(e, "endDate")}
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col md={4}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <TTSButton
              text={`Buscar por título. ${filters.headline ? `Buscando: ${filters.headline}` : "Vacío."}`}
            />
            <Form.Label className="mb-0 text-white">
              <strong style={{ color: "black" }}>Título:</strong>
            </Form.Label>
          </div>
          <Form.Control
            name="headline"
            placeholder="Título"
            value={filters.headline}
            onChange={handleInputChange}
          />
        </Col>
        <Col md={4}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <TTSButton
              text={`Filtrar por autor. ${filters.author ? `Seleccionado: ${filters.author}` : "Cualquier autor."}`}
            />
            <Form.Label className="mb-0 text-white">
              <strong style={{ color: "black" }}>Autor:</strong>
            </Form.Label>
          </div>
          <Form.Select
            name="author"
            value={filters.author}
            onChange={handleInputChange}
          >
            <option value="">Cualquier autor</option>
            {authorNames?.map((author, idx) => (
              <option key={idx} value={author}>
                {author}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <TTSButton
              text={`Filtrar por nombre de la fuente. ${filters.sourceName ? `Seleccionada: ${filters.sourceName}` : "Cualquier fuente."}`}
            />
            <Form.Label className="mb-0 text-white">
              <strong style={{ color: "black" }}>Fuente:</strong>
            </Form.Label>
          </div>
          <Form.Select
            name="sourceName"
            value={filters.sourceName}
            onChange={handleInputChange}
          >
            <option value="">Cualquier fuente</option>
            {sourceNames?.map((source, idx) => (
              <option key={idx} value={source}>
                {source}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col md={3}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <TTSButton
              text={`Filtrar por ubicación. ${filters.location ? `Seleccionada: ${filters.location}` : "Cualquier ubicación."}`}
            />
            <Form.Label className="mb-0 text-white">
              <strong style={{ color: "black" }}>Ubicación:</strong>
            </Form.Label>
          </div>
          <Form.Select
            name="location"
            value={filters.location}
            onChange={handleInputChange}
          >
            <option value="">Cualquier ubicación</option>
            {locationsMap &&
              Object.values(locationsMap).map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <TTSButton
              text={`Filtrar por nivel de cobertura. ${filters.coverageLevel ? `Seleccionado: ${filters.coverageLevel}` : "Cualquier cobertura."}`}
            />
            <Form.Label className="mb-0 text-white">
              <strong style={{ color: "black" }}>Cobertura:</strong>
            </Form.Label>
          </div>
          <Form.Select
            name="coverageLevel"
            value={filters.coverageLevel}
            onChange={handleInputChange}
          >
            <option value="">Cualquier cobertura</option>
            {coverageLevels?.map((level, idx) => (
              <option key={idx} value={level}>
                {level}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <TTSButton
              text={`Filtrar por artículo de pago. ${filters.paywall === null ? "Cualquiera" : filters.paywall ? "Sólo con paywall" : "Sólo sin paywall"}`}
            />
            <Form.Label className="mb-0 text-white">
              <strong style={{ color: "black" }}>¿De Pago?:</strong>
            </Form.Label>
          </div>
          <Form.Select
            name="paywall"
            value={filters.paywall !== null ? String(filters.paywall) : ""}
            onChange={handlePaywallChange}
          >
            <option value="">Cualquiera</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <TTSButton
              text={`Filtrar por origen del artículo. ${filters.origin ? `Origen: ${filters.origin}` : "Cualquier origen."}`}
            />
            <Form.Label className="mb-0 text-white">
              <strong style={{ color: "black" }}>Origen:</strong>
            </Form.Label>
          </div>
          <Form.Select
            name="origin"
            value={filters.origin}
            onChange={handleInputChange}
          >
            <option value="">Cualquiera</option>
            <option value="user">Usuario</option>
            <option value="muninn">Muninn</option>
          </Form.Select>
        </Col>
      </Row>

      <Accordion defaultActiveKey={null} className="mt-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <TTSButton
              text={`Filtrar por etiquetas. ${filters.tags.length > 0 ? `Seleccionadas: ${filters.tags.join(", ")}` : "Ninguna etiqueta seleccionada."}`}
              onClick={(e) => e.stopPropagation()}
              style={{ marginRight: "0.5rem" }}
            />
            <div className="d-flex align-items-center gap-2 w-100 justify-content-between pe-3">
              <span style={{ color: "black" }}>Etiquetas</span>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              {Object.entries(tagsMap).map(([id, name]) => (
                <Col key={id} xs={6} md={4} lg={3}>
                  <Form.Check
                    type="checkbox"
                    label={name}
                    value={name}
                    checked={filters.tags.includes(name)}
                    onChange={(e) => handleMultiSelectChange(e, "tags")}
                  />
                </Col>
              ))}
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <TTSButton
              text={`Filtrar por actores mencionados. ${filters.actorsMentioned.length > 0 ? `Seleccionados: ${filters.actorsMentioned.join(", ")}` : "Ningún actor seleccionado."}`}
              onClick={(e) => e.stopPropagation()}
              style={{ marginRight: "0.5rem" }}
            />
            <div className="d-flex align-items-center gap-2 w-100 justify-content-between pe-3">
              <span style={{ color: "black" }}>Actores Mencionados</span>
            </div>
          </Accordion.Header>
          <Accordion.Body>
            {Object.entries(actorsMap).length > 0 ? (
              <Row>
                {Object.entries(actorsMap).map(([id, name]) => (
                  <Col key={id} xs={6} md={4} lg={3}>
                    <Form.Check
                      type="checkbox"
                      label={name}
                      value={name}
                      checked={filters.actorsMentioned.includes(name)}
                      onChange={(e) =>
                        handleMultiSelectChange(e, "actorsMentioned")
                      }
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <p className="text-muted">No hay actores disponibles por el momento</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Form>
  );
}

export default Filters;
