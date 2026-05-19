import type { TourRoute } from "./tourTypes";

export const TOUR_ROUTES: TourRoute[] = [
  // ── BIENVENIDA GLOBAL (primera visita, ruta /patients) ─────────────────────
  {
    pathname: "/patients",
    matchMode: "exact",
    steps: [
      {
        targetId: "__global_welcome",
        isModal: true,
        title: "Bienvenido a Biotecare",
        content:
          "Esta es su plataforma clínica para el análisis de imágenes de microscopía confocal (IVCM) y la detección temprana de ojo seco con inteligencia artificial. Le haremos un recorrido rápido de los módulos principales.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "sidebar__nav-patients",
        title: "Gestión de pacientes",
        content:
          "Aquí accede a todos sus pacientes registrados. Los registros son anónimos — nunca introduzca nombres ni documentos de identidad del paciente.",
        placement: "right",
        roles: ["all"],
      },
      {
        targetId: "sidebar__nav-model",
        title: "Estado del sistema",
        content:
          "Compruebe aquí si la API y el modelo de IA están operativos antes de ejecutar un análisis. Si hay algún problema, contacte al administrador.",
        placement: "right",
        roles: ["all"],
      },
      {
        targetId: "topbar__session-badge",
        title: "Sesión clínica temporal",
        content:
          "Su sesión expira automáticamente por seguridad. Los datos no persisten entre sesiones del navegador. Si comparte equipo, cierre siempre la sesión al terminar.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "topbar__logout-button",
        title: "Cerrar sesión",
        content:
          "Use este botón al finalizar su trabajo. Cerrar la pestaña del navegador sin pulsar Salir no elimina la sesión activa en el servidor.",
        placement: "bottom-start",
        roles: ["all"],
      },
    ],
  },

  // ── LISTADO DE PACIENTES (/patients) ────────────────────────────────────────
  {
    pathname: "/patients",
    matchMode: "exact",
    steps: [
      {
        targetId: "patients__search-input",
        title: "Búsqueda por código",
        content:
          "Escriba el código anónimo del paciente (ej. HRT-2026-0042) para localizarlo. El filtro actúa en tiempo real conforme escribe.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "patients__sex-filter",
        title: "Filtro por sexo",
        content:
          "Muestra sólo pacientes de un sexo determinado. Útil cuando trabaja con cohortes diferenciadas en estudios clínicos.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "patients__status-filter",
        title: "Filtro por estado de análisis",
        content:
          '"Sin analizar" son registros nuevos sin imágenes. "Pendiente" tienen imagen subida pero sin predicción de IA. "Con predicción" ya fueron procesados por el modelo.',
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "patients__new-patient-button",
        title: "Registrar nuevo paciente",
        content:
          "Crea un nuevo registro anónimo. Necesitará un código externo único — este es el vínculo entre Biotecare y su sistema de historia clínica.",
        placement: "bottom-start",
        roles: ["all"],
      },
      {
        targetId: "patients__table",
        title: "Listado de pacientes",
        content:
          "Pulse sobre cualquier fila para abrir el expediente del paciente: ver sus imágenes IVCM y la predicción de ojo seco.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  // ── CREAR PACIENTE (/patients/new) ──────────────────────────────────────────
  {
    pathname: "/patients/new",
    matchMode: "exact",
    steps: [
      {
        targetId: "patient-form__code-field",
        title: "Código anónimo externo",
        content:
          "Introduzca el identificador que vincula este registro con su sistema de historia clínica. Nunca use el nombre real, DNI ni seguridad social. Formato sugerido: SIGLAS-AÑO-NÚMERO (ej. HRT-2026-0042).",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "patient-form__birth-year-field",
        title: "Año de nacimiento",
        content:
          "Solo el año — no la fecha completa — para cumplir con el principio de minimización de datos del RGPD. Este campo es opcional.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "patient-form__sex-field",
        title: "Sexo biológico",
        content:
          "Relevante para los rangos de referencia de biomarcadores corneales. Si el paciente prefiere no indicarlo, seleccione «No registrado».",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "patient-form__submit-button",
        title: "Guardar el registro",
        content:
          "Al guardar, el registro queda vinculado a su cuenta. A continuación podrá subir imágenes IVCM y ejecutar el análisis de IA.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  // ── EDITAR PACIENTE (/patients/[id]/edit) ────────────────────────────────
  {
    pathname: "/patients",
    matchMode: "startsWith",
    steps: [
      {
        targetId: "patient-form__birth-year-field",
        title: "Editar datos del paciente",
        content:
          "Puede modificar el año de nacimiento y el sexo. El código externo no se puede cambiar una vez creado para preservar la trazabilidad del expediente.",
        placement: "bottom",
        roles: ["all"],
        mountDelay: 200,
      },
      {
        targetId: "patient-form__submit-button",
        title: "Guardar cambios",
        content:
          "Los cambios se registran en el servidor y quedan asociados al historial de auditoría del expediente clínico.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  // ── DETALLE PACIENTE (/patients/[id]) ───────────────────────────────────────
  {
    pathname: "/patients",
    matchMode: "startsWith",
    steps: [
      {
        targetId: "patient-detail__images-section",
        title: "Imágenes IVCM del paciente",
        content:
          "Aquí se listan todas las imágenes de microscopía confocal registradas. Cada tarjeta muestra el estado del procesamiento: cargada, preprocesada o con predicción.",
        placement: "top",
        roles: ["all"],
        mountDelay: 300,
      },
      {
        targetId: "patient-detail__upload-button",
        title: "Subir nueva imagen IVCM",
        content:
          "Añada imágenes PNG, JPEG, TIFF o BMP del microscopio confocal corneal. El sistema las almacena de forma segura en el servidor local.",
        placement: "bottom-start",
        roles: ["all"],
      },
      {
        targetId: "patient-detail__ai-act-disclaimer",
        title: "Supervisión humana obligatoria (EU AI Act)",
        content:
          "Este aviso es un requisito legal del Reglamento UE 2024/1689 sobre IA. La plataforma es un sistema de apoyo a la decisión — el diagnóstico final es siempre responsabilidad del médico. No puede desactivarse.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "patient-detail__aggregation-card",
        title: "Predicción agregada del paciente",
        content:
          "Combina las predicciones de todas las imágenes IVCM en una única probabilidad de ojo seco. Elija el método: Promedio (recomendado para práctica clínica estándar), Máximo (identifica el peor caso) o Atención (pondera según el modelo).",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "patient-detail__aggregation-submit",
        title: "Generar predicción agregada",
        content:
          "Activo cuando al menos una imagen tiene predicción. El resultado muestra la probabilidad global, los biomarcadores agregados y el panel de revisión médica.",
        placement: "bottom-start",
        roles: ["all"],
      },
    ],
  },

  // ── SUBIR IMAGEN (/patients/[id]/upload) ────────────────────────────────────
  {
    pathname: "/patients",
    matchMode: "startsWith",
    steps: [
      {
        targetId: "upload__drop-zone",
        title: "Zona de carga de imagen",
        content:
          "Arrastre la imagen aquí o pulse para explorar archivos. Se admiten PNG, JPEG, TIFF y BMP hasta 25 MB. El sistema verifica el tipo real del archivo por su cabecera binaria.",
        placement: "bottom",
        roles: ["all"],
        mountDelay: 200,
      },
      {
        targetId: "upload__eye-selector",
        title: "Ojo analizado",
        content:
          "Indique si la imagen corresponde al ojo derecho (OD) u ojo izquierdo (OS). Esta información es clave para el seguimiento longitudinal del paciente.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "upload__z-depth-field",
        title: "Profundidad Z (μm)",
        content:
          "El plano de enfoque de la imagen confocal en micrómetros. Rellene este campo si su microscopio lo registra — mejora la trazabilidad del estudio clínico.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "upload__submit-button",
        title: "Enviar imagen al servidor",
        content:
          "Al pulsar, la imagen se transfiere al servidor local y queda disponible para el análisis de IA desde la página de detalle.",
        placement: "top-start",
        roles: ["all"],
      },
    ],
  },

  // ── DETALLE DE IMAGEN (/patients/[id]/images/[imgId]) ──────────────────────
  {
    pathname: "/patients",
    matchMode: "startsWith",
    steps: [
      {
        targetId: "image-detail__pipeline-stepper",
        title: "Estado del procesamiento",
        content:
          "El pipeline tiene tres etapas: CARGADA (imagen recibida), PREPROCESADA (normalizada y lista) y PREDICHA (el modelo generó resultados). Los pasos completados aparecen en verde.",
        placement: "bottom",
        roles: ["all"],
        mountDelay: 300,
      },
      {
        targetId: "image-detail__run-ai-button",
        title: "Ejecutar análisis con IA",
        content:
          "Lanza el modelo ResNet-18 entrenado en imágenes IVCM. El proceso puede tardar hasta 30 segundos en hardware sin GPU. Se mostrará un diálogo de confirmación con el aviso legal antes de ejecutar.",
        placement: "bottom-start",
        roles: ["all"],
      },
      {
        targetId: "image-detail__probability-gauge",
        title: "Probabilidad de ojo seco",
        content:
          "El dial muestra la probabilidad calculada por el modelo. La línea discontinua marca el umbral configurado — valores por encima indican «ojo seco detectado». Este resultado es orientativo: el diagnóstico es suyo.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "image-detail__doctor-review-panel",
        title: "Revisión médica",
        content:
          "Aquí ejerce su supervisión obligatoria. Puede aceptar o rechazar la predicción del modelo. Esta acción queda registrada de forma permanente para la trazabilidad de evidencia clínica.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "image-detail__biomarkers-table",
        title: "Biomarcadores corneales",
        content:
          "El modelo calcula cinco biomarcadores cuantitativos: densidad de fibras nerviosas (CNFL, CNFD), densidad de ramificaciones (CNBD), células dendríticas y microneuromas. Los rangos de referencia son orientativos.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "image-detail__heatmap-viewer",
        title: "Mapa de calor de activación",
        content:
          "Visualización de las zonas que más influyeron en la predicción del modelo (Grad-CAM). Las áreas cálidas (rojo/amarillo) son las regiones con mayor peso para la decisión de IA.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "image-detail__audit-trail",
        title: "Registro de trazabilidad",
        content:
          "Cada predicción tiene un ID único, la versión exacta del modelo y la fecha. Puede copiar el ID para incluirlo en el informe clínico o en el sistema de historia clínica electrónica.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  // ── ESTADO DEL SISTEMA (/model) ─────────────────────────────────────────────
  {
    pathname: "/model",
    matchMode: "exact",
    steps: [
      {
        targetId: "model__health-card",
        title: "Estado de la API",
        content:
          "Muestra si el servidor y la base de datos responden correctamente. Si el estado es «degradado», contacte al administrador del sistema antes de ejecutar análisis clínicos.",
        placement: "bottom",
        roles: ["all"],
        mountDelay: 200,
      },
      {
        targetId: "model__model-card",
        title: "Información del modelo de IA",
        content:
          "Versión exacta del modelo ResNet-18 cargado, biomarcadores calculados y etiquetas de clasificación. Guarde esta información para la documentación clínica de sus estudios.",
        placement: "bottom",
        roles: ["all"],
      },
    ],
  },
];
