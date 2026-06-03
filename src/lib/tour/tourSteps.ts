import type { TourRoute } from "./tourTypes";

export const TOUR_ROUTES: TourRoute[] = [
  // ── BIENVENIDA + NAVEGACIÓN (/patients) ────────────────────────────────────
  {
    pathname: "/patients",
    matchMode: "exact",
    steps: [
      {
        targetId: "__global_welcome",
        isModal: true,
        title: "Bienvenido a Biotecare",
        content:
          "Plataforma clínica para el análisis de imágenes de microscopía confocal (IVCM) y la detección temprana de ojo seco con inteligencia artificial. Este recorrido le guía por los módulos principales.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "sidebar__nav-patients",
        title: "Gestión de pacientes",
        content:
          "Acceda a todos sus pacientes registrados. Los registros son anónimos — nunca introduzca nombres ni documentos de identidad.",
        placement: "right",
        roles: ["all"],
      },
      {
        targetId: "sidebar__nav-model",
        title: "Estado del sistema",
        content:
          "Compruebe si la API y el modelo de IA están operativos antes de ejecutar un análisis.",
        placement: "right",
        roles: ["all"],
      },
      {
        targetId: "patients__new-patient-button",
        title: "Registrar nuevo paciente",
        content:
          "Crea un registro anónimo vinculado a su sistema de historia clínica mediante un código externo único.",
        placement: "bottom-start",
        roles: ["all"],
      },
      {
        targetId: "patients__table",
        title: "Listado de pacientes",
        content:
          "Pulse sobre cualquier fila para abrir el expediente del paciente y ver sus imágenes IVCM con los resultados del análisis.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  {
    pathname: "/patients/[patientId]",
    matchMode: "pattern",
    steps: [
      {
        targetId: "patient-detail__summary-card",
        title: "Resumen del expediente",
        content:
          "Aquí se concentra la información básica del paciente anonimizado. Desde esta tarjeta puede editar el registro o eliminarlo si corresponde.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "patient-detail__images-section",
        title: "Imágenes del paciente",
        content:
          "Esta sección reúne las imágenes IVCM cargadas para el paciente. Cada imagen puede abrirse para revisar su análisis individual.",
        placement: "bottom-start",
        roles: ["all"],
      },
      {
        targetId: "patient-detail__upload-button",
        title: "Subir nueva imagen",
        content:
          "Use este botón para agregar una imagen IVCM al expediente. Después podrá ejecutar el modelo sobre esa imagen.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "patient-detail__timeline",
        title: "Evolución visual",
        content:
          "Cuando existen imágenes analizadas, la línea de evolución permite comparar fechas, probabilidad y revisión médica a lo largo del tiempo.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "patient-detail__aggregation-card",
        title: "Análisis agregado",
        content:
          "Cuando el paciente tiene al menos una imagen analizada, Biotecare puede combinar los resultados para generar una lectura global del caso.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "patient-detail__ai-act-disclaimer",
        title: "Supervisión clínica",
        content:
          "Este aviso recuerda que el sistema apoya la decisión, pero no reemplaza el criterio profesional del médico responsable.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  {
    pathname: "/patients/[patientId]/images/[imageId]",
    matchMode: "pattern",
    steps: [
      {
        targetId: "image-detail__pipeline-stepper",
        title: "Estado de procesamiento",
        content:
          "Este indicador muestra si la imagen está cargada, preprocesada o analizada por el modelo.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "image-detail__run-ai-button",
        title: "Ejecutar análisis IA",
        content:
          "Al confirmar esta acción, el modelo calcula la probabilidad de ojo seco, genera el mapa Grad-CAM y guarda el resultado.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "image-detail__visual-accordion",
        title: "Visor desplegable",
        content:
          "Abra este acordeón para revisar la imagen original y el mapa de activación. Al bajar la opacidad del mapa aparece progresivamente la imagen real debajo.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "image-detail__probability-gauge",
        title: "Probabilidad estimada",
        content:
          "El medidor resume la probabilidad calculada por el modelo y la compara contra el umbral usado para clasificar el caso.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "image-detail__doctor-review-panel",
        title: "Revisión del médico",
        content:
          "Después de revisar la imagen, el mapa y el contexto clínico, el médico puede aceptar o rechazar la predicción.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "image-detail__biomarkers-table",
        title: "Biomarcadores",
        content:
          "La tabla resume señales cuantitativas extraídas de la imagen para complementar la interpretación visual.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  {
    pathname: "/patients/[patientId]/upload",
    matchMode: "pattern",
    steps: [
      {
        targetId: "upload__drop-zone",
        title: "Seleccionar imagen IVCM",
        content:
          "Arrastre o seleccione el archivo de imagen que desea asociar al expediente del paciente.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "upload__eye-selector",
        title: "Ojo examinado",
        content:
          "Indique si la imagen corresponde al ojo derecho u ojo izquierdo cuando ese dato esté disponible.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "upload__z-depth-field",
        title: "Profundidad Z",
        content:
          "Este campo opcional permite registrar la profundidad de adquisición en micras para conservar mejor el contexto de la captura.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "upload__submit-button",
        title: "Guardar imagen",
        content:
          "Al subirla, la imagen queda disponible en el expediente y podrá abrirse para ejecutar el análisis de IA.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

];
