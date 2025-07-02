import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./ArticleForm.css";

import { fetchWithAuth } from "../../utils/fetchWithAuth";

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
    location: "",
    /*     publicationType: "",
    format: "",
    description: "",
    timestamp: null, */
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
      tags.forEach((tag) => (tMap[tag.id] = tag.name));
      actors.forEach((actor) => (aMap[actor.id] = actor.name));
      locations.forEach((loc) => (lMap[loc.id] = loc.name));
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

  const types = [
    "Columna de opinion",
    "Crónica",
    "Editorial",
    "Entrevista",
    "Nota informativa (noticia)",
    "Notas de agencia",
    "Publicacion de Redes Sociales",
    "Reportaje (texto mas extenso, implica investigacion)",
  ];

  const formats = [
    "Audio/Radio",
    "Fotografia/Fotoreportaje",
    "Informacion grafica",
    "Prensa Escrita",
    "Video",
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
    if (!formData.location) newErrors.location = "Ubicación es requerida";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Submitting form with data:", formData);
      // formData.timestamp = new Date().toISOString();
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
          location: "",
        });
      } catch (error) {
        console.error("Error submitting form: ", error);
      }
    }
  };

  return (
    <div className="article-form-page">
      <div className="article-form-container">
        <h1>MONITOREO - LOS LAURELES</h1>
        <p>Seguimiento a las notas periodisticas en relacion al tema</p>

        <p className="required">* Indica valores requeridos</p>
        <Form onSubmit={handleSubmit} className="article-form">
          <Form.Label>
            <strong>
              Fecha de publicación <span className="required">*</span>
            </strong>
          </Form.Label>
          <Form.Control
            type="text"
            name="publicationDate"
            value={formData.publicationDate}
            onChange={handleChange}
            isInvalid={!!errors.publicationDate}
            placeholder="MM/DD/YYYY"
          />

          <Form.Control.Feedback type="invalid">
            {errors.publicationDate}
          </Form.Control.Feedback>

          <Form.Label>
            <strong>
              Encabezado <span className="required">*</span>
            </strong>
          </Form.Label>
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

          <Form.Label>
            <strong>
              Medio en el que aparece la nota (fuente)
              <span className="required">*</span>
            </strong>
          </Form.Label>
          {sources.map((val) => (
            <Form.Check
              key={val}
              type="radio"
              label={val}
              name="sourceName"
              value={val}
              onChange={handleChange}
              isInvalid={!!errors.sourceName}
            />
          ))}

          <Form.Control.Feedback type="invalid">
            {errors.sourceName}
          </Form.Control.Feedback>

          <Form.Label>
            <strong>
              Nivel de cobertura del medio<span className="required">*</span>
            </strong>
          </Form.Label>
          <Form.Select
            name="coverageLevel"
            value={formData.coverageLevel}
            onChange={handleChange}
          >
            <option value="Local">Local</option>
            <option value="Estatal">Estatal</option>
            <option value="Nacional">Nacional</option>
          </Form.Select>

          <Form.Label>
            <strong>
              Autora o autor de la nota <span className="required">*</span>
            </strong>
          </Form.Label>
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

          <Form.Label>
            <strong>
              Link a la nota <span className="required">*</span>
            </strong>
          </Form.Label>
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

          {/* <Form.Label>
          <strong>Tipo de publicación</strong>
        </Form.Label>
        {types.map((val) => (
          <Form.Check
            key={val}
            type="radio"
            label={val}
            name="type"
            value={val}
            onChange={handleChange}
          />
        ))}
        <Form.Label>
          <strong>Formato/Soporte</strong>
        </Form.Label>
        {formats.map((val) => (
          <Form.Check
            key={val}
            type="radio"
            label={val}
            name="format"
            value={val}
            onChange={handleChange}
          />
        ))}

        <Form.Label>
          <strong>Declaración</strong>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Ingrese una breve descripción del evento o situación"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
        /> */}

          <Form.Label>
            <strong>Tags</strong>
          </Form.Label>
          {Object.entries(tagsMap).map(([id, name]) => (
            <Form.Check
              key={id}
              type="checkbox"
              label={name}
              name="tags"
              value={id}
              onChange={handleCheckboxChange}
            />
          ))}

          <Form.Label>
            <strong>Ubicación</strong>
          </Form.Label>
          {Object.entries(locationsMap).map(([id, name]) => (
            <Form.Check
              key={id}
              type="radio"
              label={name}
              name="location"
              value={id}
              onChange={handleChange}
            />
          ))}

          <Form.Label>
            <strong>Actores Mencionados</strong>
          </Form.Label>
          {Object.entries(actorsMap).map(([id, name]) => (
            <Form.Check
              key={id}
              type="checkbox"
              label={name}
              name="actors"
              value={id}
              onChange={handleCheckboxChange}
            />
          ))}

          <Button type="submit" variant="primary" className="mt-4">
            Enviar
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ArticleForm;
