import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./ArticleForm.css";
import BrushStrokes from "../../utils/brushStrokes"
import HelpTooltip from "../../components/HelpTooltip";
import TTSButton from "../../components/TTSButton";

import { fetchWithAuth } from "../../utils/fetchWithAuth";
import ReturnMenu from "../../components/return-menu";

function ArticleForm() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    publicationDate: "",
    sourceName: "",
    paywall: false,
    headline: "",
    url: "",
    author: "",
    coverageLevel: "Local",
    actorsMentioned: [],
    tags: [],
    location: [],
  });

  const [tagsMap, setTagsMap] = useState({});
  const [actorsMap, setActorsMap] = useState({});
  const [locationsMap, setLocationsMap] = useState({});

  useEffect(() => {
    Promise.all([
      fetchWithAuth(`${apiUrl}/tags`).then((res) => res.json()),
      fetchWithAuth(`${apiUrl}/actors`).then((res) => res.json()),
      fetchWithAuth(`${apiUrl}/locations`).then((res) => res.json()),
    ]).then(([tags, actors, locations]) => {
      const tMap = {},
        aMap = {},
        lMap = {};
      // FIX: stringify IDs to avoid type mismatch with checkbox string values
      tags.forEach((tag) => (tMap[String(tag.id)] = tag.name));
      actors.forEach((actor) => (aMap[String(actor.id)] = actor.name));
      locations.forEach((loc) => (lMap[String(loc.id)] = loc.name));
      setTagsMap(tMap);
      setActorsMap(aMap);
      setLocationsMap(lMap);
    });
  }, []);

  const sources = [
    "Antena 7",
    "Astillero",
    "Canal 44",
    "Cascada Noticias",
    "El Diario NTR",
    "El Informador",
    "El Norte",
    "El Occidental",
    "El Universal",
    "La Cronica de Hoy",
    "Lider Informativo",
    "Mega Noticias",
    "Mural",
    "Notisistema",
    "Quadratin Jalisco",
    "Radar Sonoro",
    "Radio UdeG",
    "REDTN Jalisco",
    "Telediario",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => {
      const arr = prev[name] || [];
      if (checked) {
        return { ...prev, [name]: [...arr, value] };
      } else {
        return { ...prev, [name]: arr.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.publicationDate)
      newErrors.publicationDate = "Fecha de publicacion es requerida";
    if (!formData.headline) newErrors.headline = "Encabezado es requerido";
    if (!formData.sourceName) newErrors.sourceName = "Fuente es requerida";
    if (!formData.url) newErrors.url = "Link a la nota es requerido";
    if (!formData.author) newErrors.author = "Autor es requerido";
    if (formData.location.length === 0) newErrors.location = "Ubicación es requerida";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Submitting form with data:", formData);
      try {
        const response = await fetch(`${apiUrl}/articles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          console.log("Network response was not ok", data);
          throw new Error("Network response was not ok ", data);
        }

        console.log("Form submitted successfully:", data);

        alert("Formulario enviado exitosamente");
        setFormData({
          publicationDate: "",
          sourceName: "",
          paywall: false,
          headline: "",
          url: "",
          author: "",
          coverageLevel: "Local",
          actorsMentioned: [],
          tags: [],
          location: [],
        });
      } catch (error) {
        console.error("Error submitting form: ", error);
      }
    }
  };

  return (
    <>
      <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #43C6AC 0%, #191654 100%)' }}>

        {/* Decorative brush strokes background */}
        <div className="position-absolute top-0 start-0 opacity-25">
          <BrushStrokes variant="circle" color="#ffffff" width={120} height={120} strokeWidth={8} opacity={0.3} />
        </div>
        <div className="position-absolute" style={{ top: '15%', right: '10%', opacity: 0.2 }}>
          <BrushStrokes variant="wave" color="#ffffff" width={180} height={60} strokeWidth={6} opacity={0.4} />
        </div>
        <div className="position-absolute" style={{ bottom: '20%', left: '5%', opacity: 0.15 }}>
          <BrushStrokes variant="circle" color="#ffffff" width={100} height={100} strokeWidth={6} opacity={0.3} />
        </div>
        <div className="position-absolute" style={{ bottom: '10%', right: '15%', opacity: 0.2 }}>
          <BrushStrokes variant="wave" color="#ffffff" width={150} height={50} strokeWidth={5} opacity={0.4} />
        </div>

        <div className="article-form-page">
          <ReturnMenu />

          <div className="article-form-container">
            <h1>MONITOREO - LOS LAURELES</h1>
            <p>Seguimiento a las notas periodisticas en relacion al tema</p>

            <p className="required">* Indica valores requeridos</p>
            <Form onSubmit={handleSubmit} className="article-form">

              {/* Fecha de publicación */}
              <div className="d-flex align-items-center gap-2 mb-2">
                <TTSButton
                  text={`Fecha de publicación. Requerido. Formato día, mes, año. ${
                    formData.publicationDate
                      ? `Valor actual: ${formData.publicationDate}`
                      : "Está vacío. Ingrese la fecha de publicación."
                  }`}
                />
                <Form.Label className="mb-0">
                  <strong>
                    Fecha de publicación <span className="required">*</span>
                  </strong>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                name="publicationDate"
                value={formData.publicationDate}
                onChange={handleChange}
                isInvalid={!!errors.publicationDate}
                placeholder="DD/MM/AAAA"
              />
              <Form.Control.Feedback type="invalid">
                {errors.publicationDate}
              </Form.Control.Feedback>

              {/* Encabezado */}
              <div className="d-flex align-items-center gap-2 mb-2 mt-3">
                <TTSButton
                  text={`Encabezado. Requerido. Ingrese el título de la nota. ${
                    formData.headline
                      ? `Valor actual: ${formData.headline}`
                      : "Está vacío."
                  }`}
                />
                <Form.Label className="mb-0">
                  <strong>
                    Encabezado <span className="required">*</span>
                  </strong>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                placeholder="Ingrese el encabezado de la nota"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                isInvalid={!!errors.headline}
              />
              <Form.Control.Feedback type="invalid">
                {errors.headline}
              </Form.Control.Feedback>

              {/* Fuente */}
              <div className="d-flex align-items-center gap-2 mb-2 mt-3">
                <TTSButton
                  text={`Medio o fuente. Requerido. ${
                    formData.sourceName
                      ? `Seleccionado: ${formData.sourceName}`
                      : "Ninguna fuente seleccionada de la lista."
                  }`}
                />
                <Form.Label className="mb-0">
                  <strong>
                    Medio en el que aparece la nota (fuente) <span className="required">*</span>
                  </strong>
                </Form.Label>
              </div>
              {sources.map((val) => (
                <Form.Check
                  key={val}
                  type="radio"
                  label={val}
                  name="sourceName"
                  value={val}
                  checked={formData.sourceName === val}
                  onChange={handleChange}
                  isInvalid={!!errors.sourceName}
                />
              ))}
              <Form.Control.Feedback type="invalid">
                {errors.sourceName}
              </Form.Control.Feedback>

              {/* Nivel de cobertura */}
              <div className="d-flex align-items-center gap-2 mb-2 mt-3">
                <TTSButton
                  text={`Nivel de cobertura del medio. Requerido. Valor actual: ${formData.coverageLevel}`}
                />
                <Form.Label className="mb-0">
                  <strong>
                    Nivel de cobertura del medio <span className="required">*</span>
                  </strong>
                </Form.Label>
              </div>
              <Form.Select
                name="coverageLevel"
                value={formData.coverageLevel}
                onChange={handleChange}
              >
                <option value="Local">Local</option>
                <option value="Estatal">Estatal</option>
                <option value="Nacional">Nacional</option>
              </Form.Select>

              {/* Autor */}
              <div className="d-flex align-items-center gap-2 mb-2 mt-3">
                <TTSButton
                  text={`Autora o autor de la nota. Requerido. ${
                    formData.author
                      ? `Valor actual: ${formData.author}`
                      : "Está vacío. Ingrese el nombre del autor."
                  }`}
                />
                <Form.Label className="mb-0">
                  <strong>
                    Autora o autor de la nota <span className="required">*</span>
                  </strong>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del autor"
                name="author"
                value={formData.author}
                onChange={handleChange}
                isInvalid={!!errors.author}
              />
              <Form.Control.Feedback type="invalid">
                {errors.author}
              </Form.Control.Feedback>

              {/* URL */}
              <div className="d-flex align-items-center gap-2 mb-2 mt-3">
                <TTSButton
                  text={`Enlace o link de la nota. Requerido. ${
                    formData.url
                      ? `Valor actual: ${formData.url}`
                      : "Está vacío. Ingrese el enlace de la nota."
                  }`}
                />
                <Form.Label className="mb-0">
                  <strong>
                    Link a la nota <span className="required">*</span>
                  </strong>
                </Form.Label>
              </div>
              <Form.Control
                type="text"
                placeholder="Ingrese el Link de la nota"
                name="url"
                value={formData.url}
                onChange={handleChange}
                isInvalid={!!errors.url}
              />
              <Form.Control.Feedback type="invalid">
                {errors.url}
              </Form.Control.Feedback>

              {/* Etiquetas */}
              <div className="d-flex align-items-center gap-2 mb-2 mt-3">
                <TTSButton
                  text={`Etiquetas del artículo. ${
                    formData.tags.length > 0
                      ? `Seleccionadas: ${formData.tags.map(id => tagsMap[id] || id).join(', ')}`
                      : "Ninguna etiqueta seleccionada."
                  }`}
                />
                <Form.Label className="mb-0">
                  <strong>Etiquetas</strong>
                </Form.Label>
              </div>
              {Object.entries(tagsMap).map(([id, name]) => (
                <Form.Check
                  key={id}
                  type="checkbox"
                  label={name}
                  name="tags"
                  value={id}
                  checked={formData.tags.includes(id)}
                  onChange={handleCheckboxChange}
                />
              ))}

              {/* Ubicación */}
              <div className="d-flex align-items-center gap-2 mb-2 mt-3">
                <TTSButton
                  text={`Ubicación. Requerido. ${
                    formData.location.length > 0
                      ? `Seleccionadas: ${formData.location.map(id => locationsMap[id] || id).join(', ')}`
                      : "Ninguna ubicación seleccionada."
                  }`}
                />
                <Form.Label className="mb-0">
                  <strong>
                    Ubicación <span className="required">*</span>
                  </strong>
                </Form.Label>
              </div>
              {Object.entries(locationsMap).map(([id, name]) => (
                <Form.Check
                  key={id}
                  type="checkbox"
                  label={name}
                  name="location"
                  value={id}
                  checked={formData.location.includes(id)}
                  onChange={handleCheckboxChange}
                  isInvalid={!!errors.location}
                />
              ))}
              {errors.location && (
                <div className="invalid-feedback d-block">{errors.location}</div>
              )}

              {/* Actores Mencionados */}
              <div className="d-flex align-items-center gap-2 mb-2 mt-3">
                <TTSButton
                  text={`Actores mencionados. ${
                    formData.actorsMentioned.length > 0
                      ? `Seleccionados: ${formData.actorsMentioned.map(id => actorsMap[id] || id).join(', ')}`
                      : "Ningún actor seleccionado."
                  }`}
                />
                <Form.Label className="mb-0">
                  <strong>Actores Mencionados</strong>
                </Form.Label>
              </div>
              {Object.entries(actorsMap).map(([id, name]) => (
                <Form.Check
                  key={id}
                  type="checkbox"
                  label={name}
                  name="actorsMentioned"
                  value={id}
                  checked={formData.actorsMentioned.includes(id)}
                  onChange={handleCheckboxChange}
                />
              ))}

              <Button type="submit" variant="primary" className="mt-4">
                Enviar
              </Button>
            </Form>
          </div>
        </div>

        <HelpTooltip
          page="article-form"
          positionStyle={{
            position: "fixed",
            bottom: "30px",
            right: "30px"
          }}
        />
      </div>
    </>
  );
}

export default ArticleForm;