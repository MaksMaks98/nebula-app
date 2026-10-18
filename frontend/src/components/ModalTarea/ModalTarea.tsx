import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Tarea, TareaFormulario } from "../../types/Tarea";
import { fechaParaInput } from "../../utils/formato";

type Props = {
  mostrar: boolean;
  tarea?: Tarea | null;
  onCerrar: () => void;
  onGuardar: (valores: TareaFormulario) => Promise<void>;
};

const esquema = Yup.object({
  titulo: Yup.string().trim().required("El título es obligatorio"),
  descripcion: Yup.string().trim(),
  fechaLimite: Yup.string(),
  prioridad: Yup.string()
    .oneOf(["alta", "media", "baja"])
    .required("La prioridad es obligatoria"),
  etiquetas: Yup.string(),
  completada: Yup.boolean(),
});

const valoresIniciales: TareaFormulario = {
  titulo: "",
  descripcion: "",
  fechaLimite: "",
  prioridad: "media",
  etiquetas: "",
  completada: false,
};

// De lo que manda la API a lo que maneja el formulario (todo texto, nunca undefined)
const tareaAFormulario = (tarea: Tarea): TareaFormulario => ({
  titulo: tarea.titulo,
  descripcion: tarea.descripcion ?? "",
  fechaLimite: fechaParaInput(tarea.fechaLimite),
  prioridad: tarea.prioridad,
  etiquetas: tarea.etiquetas.join(", "),
  completada: tarea.completada,
});

type CampoDeTexto = "titulo" | "descripcion" | "fechaLimite" | "etiquetas";

const ModalTarea = ({ mostrar, tarea, onCerrar, onGuardar }: Props) => {
  const formik = useFormik<TareaFormulario>({
    initialValues: tarea ? tareaAFormulario(tarea) : valoresIniciales,
    enableReinitialize: true,
    validationSchema: esquema,
    onSubmit: async (valores, { resetForm, setStatus }) => {
      try {
        await onGuardar(valores);
        resetForm();
      } catch {
        setStatus("No se pudo guardar la tarea");
      }
    },
  });

  const cerrar = () => {
    formik.resetForm();
    onCerrar();
  };
    // Arma un campo completo (etiqueta, input y mensaje de error) sin repetir JSX
  const campoTexto = (
    nombre: CampoDeTexto,
    etiqueta: string,
    tipo: "text" | "date" | "textarea" = "text",
    ayuda?: string,
  ) => {
    const propsCampo = {
      name: nombre,
      value: formik.values[nombre],
      onChange: formik.handleChange,
      onBlur: formik.handleBlur,
      isInvalid: formik.touched[nombre] && !!formik.errors[nombre],
    };

    return (
      <Form.Group className="mb-3" controlId={nombre}>
        <Form.Label>{etiqueta}</Form.Label>
        {tipo === "textarea" ? (
          <Form.Control as="textarea" rows={3} {...propsCampo} />
        ) : (
          <Form.Control type={tipo} {...propsCampo} />
        )}
        {ayuda && <Form.Text className="text-secondary">{ayuda}</Form.Text>}
        <Form.Control.Feedback type="invalid">
          {formik.errors[nombre]}
        </Form.Control.Feedback>
      </Form.Group>
    );
  };

  return (
    <Modal show={mostrar} onHide={cerrar} centered>
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Modal.Header closeButton>
          <Modal.Title>{tarea ? "Editar tarea" : "Nueva tarea"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {campoTexto("titulo", "Título")}
          {campoTexto("descripcion", "Descripción", "textarea")}

          <Row>
            <Col sm={6}>{campoTexto("fechaLimite", "Fecha límite", "date")}</Col>
            <Col sm={6}>
              <Form.Group className="mb-3" controlId="prioridad">
                <Form.Label>Prioridad</Form.Label>
                <Form.Select
                  name="prioridad"
                  value={formik.values.prioridad}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {campoTexto("etiquetas", "Etiquetas", "text", "Separalas con comas: facultad, urgente")}

          {tarea && (
            <Form.Check
              type="switch"
              id="completada"
              name="completada"
              label="Completada"
              checked={formik.values.completada}
              onChange={formik.handleChange}
            />
          )}

          {formik.status && (
            <p className="text-danger mt-3 mb-0">{formik.status}</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={formik.isSubmitting}>
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalTarea;
