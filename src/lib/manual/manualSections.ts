export type ManualQuestion = {
  id: string;
  question: string;
  answer: string;
  steps?: string[];
  note?: string;
  warning?: string;
  tags: string[];
  /** Key into MANUAL_PREVIEWS registry — renders a visual UI mockup inside the accordion. */
  previewId?: string;
};

export type ManualSection = {
  id: string;
  title: string;
  iconName: string;
  questions: ManualQuestion[];
  /**
   * If false, the section is hidden from the web guide (accordions)
   * but still included in the PDF document.
   */
  showInWeb?: boolean;
};

export const MANUAL_VERSION = "1.0.0";
export const MANUAL_DATE = "2026-06-04";
export const APP_MANUAL_NAME = "Biotecare";

export const MANUAL_SECTIONS: ManualSection[] = [
  /* ── Acceso al sistema ──────────────────────────────────────
     showInWeb: false → hidden from accordions, kept in PDF
  ─────────────────────────────────────────────────────────── */
  {
    id: "auth",
    title: "Acceso al sistema",
    iconName: "LogIn",
    showInWeb: false,
    questions: [
      {
        id: "auth-login",
        question: "¿Cómo iniciar sesión en Biotecare?",
        answer:
          "Desde la pantalla de acceso, introduce tu correo electrónico y contraseña y pulsa Entrar. Si las credenciales son correctas, serás redirigido al módulo de Pacientes automáticamente.",
        steps: [
          "Abre la URL de Biotecare en tu navegador.",
          "Introduce tu correo electrónico registrado en el campo Email.",
          "Introduce tu contraseña en el campo Contraseña.",
          "Pulsa el botón Entrar.",
          "El sistema te redirige a la lista de pacientes.",
        ],
        note: "Si ves el mensaje 'Credenciales incorrectas', verifica que el correo y la contraseña sean exactamente los registrados. La contraseña distingue mayúsculas y minúsculas.",
        tags: ["/login", "auth"],
        previewId: "login",
      },
      {
        id: "auth-register",
        question: "¿Cómo crear una cuenta de médico?",
        answer:
          "En la pantalla de acceso, pulsa la pestaña Crear cuenta. Completa los campos de nombre completo, correo electrónico, contraseña y confirmación de contraseña. Al guardar, recibirás confirmación y podrás iniciar sesión.",
        steps: [
          "Abre la pantalla de acceso.",
          "Pulsa la pestaña o enlace Crear cuenta.",
          "Introduce tu nombre completo (mínimo 2 caracteres).",
          "Introduce tu correo electrónico.",
          "Elige una contraseña de al menos 8 caracteres.",
          "Repite la contraseña en el campo de confirmación.",
          "Pulsa Registrarse.",
        ],
        note: "La contraseña debe tener al menos 8 caracteres. Las dos contraseñas deben coincidir exactamente.",
        tags: ["/login", "auth", "register"],
        previewId: "login",
      },
    ],
  },

  /* ── Gestión de pacientes ─────────────────────────────────── */
  {
    id: "patients",
    title: "Gestión de pacientes",
    iconName: "UsersRound",
    questions: [
      {
        id: "patients-list",
        question: "¿Cómo buscar un paciente por código externo?",
        answer:
          "En el módulo Pacientes, usa el campo Buscar código externo para filtrar la tabla en tiempo real. La búsqueda es inmediata: la tabla se actualiza mientras escribes.",
        steps: [
          "Navega a Pacientes en el menú lateral.",
          "Escribe el código externo (o parte de él) en el campo de búsqueda.",
          "La tabla filtra los resultados automáticamente.",
          "Haz clic en el código externo de la fila para abrir el expediente.",
        ],
        tags: ["/patients"],
        previewId: "patients_list",
      },
      {
        id: "patients-filter",
        question: "¿Cómo filtrar pacientes por sexo o estado de análisis?",
        answer:
          "Junto al buscador hay dos menús desplegables: Sexo y Estado. Puedes combinarlos libremente. Los estados posibles son: Sin analizar (sin imágenes cargadas), Pendiente (imágenes sin análisis completado) y Con predicción (al menos un análisis finalizado).",
        tags: ["/patients"],
        previewId: "patients_list",
      },
      {
        id: "patients-create",
        question: "¿Cómo registrar un nuevo paciente?",
        answer:
          "Pulsa el botón Nuevo paciente (esquina superior derecha). El código externo es el único campo obligatorio; usa un identificador anónimo de tu historia clínica. El año de nacimiento y el sexo son opcionales.",
        steps: [
          "Pulsa Nuevo paciente.",
          "Introduce el código externo anonimizado (obligatorio). Ejemplo: HRT-2026-0042.",
          "Introduce el año de nacimiento si lo deseas (1900–2030).",
          "Selecciona el sexo si lo deseas: Femenino, Masculino u Otro.",
          "Pulsa Guardar.",
          "El sistema crea el expediente y te lleva al detalle del paciente.",
        ],
        warning:
          "No incluyas nombres, apellidos ni documentos de identidad. El código externo es inmutable una vez creado.",
        tags: ["/patients/new", "/patients"],
        previewId: "new_patient",
      },
      {
        id: "patients-edit",
        question: "¿Qué datos se pueden editar después de crear un paciente?",
        answer:
          "Solo el año de nacimiento y el sexo. El código externo es inmutable por trazabilidad clínica: no puede cambiarse después de la creación.",
        steps: [
          "Abre el detalle del paciente.",
          "Pulsa el botón Editar.",
          "Modifica el año de nacimiento y/o el sexo.",
          "Pulsa Guardar.",
        ],
        tags: ["/patients/:id/edit", "/patients/:id"],
        previewId: "patient_edit",
      },
      {
        id: "patients-delete",
        question: "¿Cómo eliminar un paciente?",
        answer:
          "En el detalle del paciente hay un botón Eliminar. Al pulsarlo se abre un diálogo de confirmación que advierte que se eliminarán el expediente, todas las imágenes y todos los análisis asociados. Esta acción es irreversible.",
        warning:
          "La eliminación es permanente. Todas las imágenes y predicciones del paciente se perderán. Asegúrate de tener una copia externa si necesitas conservar los datos.",
        steps: [
          "Abre el detalle del paciente.",
          "Pulsa el botón Eliminar.",
          "Lee el aviso del diálogo de confirmación.",
          "Pulsa Eliminar definitivamente para confirmar.",
        ],
        tags: ["/patients/:id"],
        previewId: "patient_delete",
      },
    ],
  },

  /* ── Carga de imágenes IVCM ─────────────────────────────── */
  {
    id: "upload",
    title: "Carga de imágenes IVCM",
    iconName: "Upload",
    questions: [
      {
        id: "upload-formats",
        question: "¿Qué formatos y tamaño máximo admite la carga de imágenes?",
        answer:
          "El sistema acepta imágenes en formato PNG, JPEG, TIFF y BMP. El tamaño máximo por archivo es de 25 MB. El sistema valida el tipo real del archivo (no solo la extensión).",
        tags: ["/patients/:id/upload"],
        previewId: "upload",
      },
      {
        id: "upload-steps",
        question: "¿Cómo subir una imagen IVCM al sistema?",
        answer:
          "Desde el detalle del paciente, pulsa Cargar imagen. Arrastra el archivo al área de carga o haz clic para buscarlo. Selecciona el ojo y la profundidad Z si los conoces, luego confirma la subida.",
        steps: [
          "Abre el detalle del paciente.",
          "Pulsa Cargar imagen (o Subir imagen IVCM).",
          "Arrastra el archivo PNG/JPEG/TIFF/BMP al área de carga, o haz clic en ella para buscar el archivo.",
          "Verifica que la vista previa muestre la imagen correctamente.",
          "Selecciona el ojo: OD (ojo derecho) u OS (ojo izquierdo). Este campo es opcional.",
          "Introduce la profundidad Z de captura en micrómetros si la conoces. Este campo es opcional.",
          "Pulsa Subir imagen.",
          "Espera a que la barra de progreso llegue al 100%. El sistema te lleva al detalle de la imagen.",
        ],
        note: "Si la imagen es un archivo TIFF o tiene dimensiones grandes, la carga puede tardar unos segundos más.",
        tags: ["/patients/:id/upload"],
        previewId: "upload",
      },
      {
        id: "upload-fields",
        question: "¿Qué significan los campos Ojo y Profundidad Z?",
        answer:
          "Ojo indica qué ojo se fotografió: OD es ojo derecho (oculus dexter) y OS es ojo izquierdo (oculus sinister). Profundidad Z es la distancia de enfoque en microscopía confocal corneal, medida en micrómetros (μm). Ambos campos son opcionales pero mejoran la trazabilidad clínica.",
        tags: ["/patients/:id/upload"],
        previewId: "upload",
      },
    ],
  },

  /* ── Análisis con IA ───────────────────────────────────── */
  {
    id: "analysis",
    title: "Análisis con inteligencia artificial",
    iconName: "BrainCircuit",
    questions: [
      {
        id: "analysis-run",
        question: "¿Cómo ejecutar el análisis de IA sobre una imagen?",
        answer:
          "En el detalle de la imagen, pulsa el botón Ejecutar análisis IA. Aparece un diálogo de confirmación. Al confirmar, el modelo ResNet-18 procesa la imagen (puede tardar hasta 30 segundos en CPU) y devuelve la probabilidad de ojo seco, el mapa Grad-CAM y los biomarcadores.",
        steps: [
          "Abre el detalle de la imagen desde el timeline del paciente.",
          "Pulsa Ejecutar análisis IA.",
          "Lee el diálogo de confirmación y pulsa Ejecutar análisis para proceder.",
          "Espera el procesamiento (indicador de estado 'Procesando...').",
          "Al terminar, el sistema muestra el gauge de probabilidad, el panel de revisión y los biomarcadores.",
        ],
        note: "El procesamiento puede tardar hasta 30 segundos. No cierres la página durante el análisis.",
        tags: ["/patients/:id/images/:imageId", "analysis"],
        previewId: "analysis",
      },
      {
        id: "analysis-states",
        question: "¿Cuáles son los estados posibles de una imagen?",
        answer:
          "Una imagen pasa por tres estados secuenciales: Cargada (recibida por el servidor), Preprocesada (lista para el modelo) y Predicha (análisis completado). Si ocurre un error en cualquier paso, el estado es Error.",
        note: "Si una imagen se queda en estado Cargada o Preprocesada durante más de unos minutos, consulta el módulo Modelo para ver el estado del sistema.",
        tags: ["/patients/:id/images/:imageId"],
        previewId: "analysis",
      },
      {
        id: "analysis-gauge",
        question: "¿Cómo interpretar el gauge de probabilidad?",
        answer:
          "El gauge es un velocímetro semicircular. La zona verde (0–50%) indica Normal y la zona roja (50–100%) indica Ojo seco detectado. La aguja señala el valor calculado por el modelo. La línea punteada azul marca el umbral decisional (50% por defecto).",
        note: "El porcentaje es una estimación del modelo, no un diagnóstico. El médico siempre tiene la palabra final mediante el panel de revisión.",
        tags: ["/patients/:id/images/:imageId", "analysis"],
        previewId: "gauge",
      },
      {
        id: "analysis-gradcam",
        question: "¿Qué es el mapa Grad-CAM y cómo verlo?",
        answer:
          "Grad-CAM es una superposición de color que resalta las regiones que más influyeron en la estimación del modelo. Para verlo, despliega el acordeón 'Imagen original y mapa de activación'. Puedes seleccionar tres modos: imagen original, solo el mapa de calor, o una mezcla con opacidad ajustable.",
        note: "Grad-CAM muestra dónde miró el modelo, no diagnostica. Úsalo para inspeccionar la consistencia clínica de la estimación.",
        tags: ["/patients/:id/images/:imageId", "gradcam"],
        previewId: "gradcam",
      },
      {
        id: "analysis-biomarkers",
        question: "¿Qué biomarcadores calcula el sistema y qué significan?",
        answer:
          "El sistema calcula cinco biomarcadores morfológicos: CNFL (longitud de fibras nerviosas corneales, normal > 20 mm/mm²), CNFD (densidad de fibras nerviosas, normal > 25 fibras/mm²), CNBD (densidad de ramificaciones, normal > 5.5 ramas/mm²), células dendríticas (normal < 30 células/mm², valores altos = inflamación) y microneuromas (normal 0, su presencia indica daño axonal). Haz clic en cada fila de la tabla para ver la interpretación clínica.",
        tags: ["/patients/:id/images/:imageId", "biomarkers"],
        previewId: "biomarkers",
      },
    ],
  },

  /* ── Revisión médica ─────────────────────────────────────── */
  {
    id: "review",
    title: "Revisión médica de predicciones",
    iconName: "Stethoscope",
    questions: [
      {
        id: "review-action",
        question: "¿Cómo aceptar o rechazar una predicción?",
        answer:
          "En el detalle de la imagen, el panel de revisión médica muestra dos botones: Aceptar resultado y Rechazar resultado. Al pulsar cualquiera aparece un diálogo de confirmación. Esta acción queda registrada en el expediente con el nombre del médico, la fecha y el resultado. Es irreversible.",
        steps: [
          "Abre el detalle de la imagen con análisis completado.",
          "Revisa el gauge de probabilidad, el mapa Grad-CAM y los biomarcadores.",
          "En el panel 'Revisión pendiente', decide si el resultado es clínicamente coherente.",
          "Pulsa Aceptar resultado o Rechazar resultado.",
          "Lee el diálogo de confirmación y pulsa el botón de confirmación final.",
        ],
        warning:
          "La revisión es irreversible. Asegúrate de haber evaluado el resultado antes de confirmar.",
        tags: ["/patients/:id/images/:imageId", "review"],
        previewId: "review",
      },
      {
        id: "review-meaning",
        question: "¿Qué diferencia hay entre aceptar y rechazar una predicción?",
        answer:
          "Aceptar significa que el médico ratifica que el resultado del modelo es clínicamente coherente y queda registrado como válido. Rechazar significa que el médico descarta el resultado (por ejemplo, imagen de baja calidad o resultado no coherente con el cuadro clínico). En ambos casos la acción queda registrada con trazabilidad completa.",
        tags: ["/patients/:id/images/:imageId", "review"],
        previewId: "review",
      },
    ],
  },

  /* ── Análisis agregado ──────────────────────────────────── */
  {
    id: "aggregate",
    title: "Análisis agregado del paciente",
    iconName: "BarChart2",
    questions: [
      {
        id: "aggregate-what",
        question: "¿Qué es el análisis agregado y cuándo se activa?",
        answer:
          "El análisis agregado consolida los resultados de múltiples imágenes del mismo paciente para ofrecer una perspectiva clínica de conjunto. El botón Generar análisis se activa solo cuando el paciente tiene al menos una imagen con predicción completada.",
        tags: ["/patients/:id", "aggregate"],
        previewId: "aggregate",
      },
      {
        id: "aggregate-run",
        question: "¿Cómo generar el análisis agregado de un paciente?",
        answer:
          "Desde el detalle del paciente, desplázate hasta la sección 'Análisis agregado del paciente' y pulsa Generar análisis. El sistema combina todas las predicciones usando el método de atención (attention aggregation) con umbral del 50% y muestra el resultado.",
        steps: [
          "Abre el detalle del paciente.",
          "Asegúrate de que al menos una imagen tenga estado Predicha.",
          "Desplázate hasta la sección 'Análisis agregado del paciente'.",
          "Pulsa Generar análisis.",
          "El sistema muestra el gauge agregado, el panel de revisión y los biomarcadores combinados.",
          "Puedes aceptar o rechazar el resultado agregado igual que una predicción individual.",
        ],
        tags: ["/patients/:id", "aggregate"],
        previewId: "aggregate",
      },
    ],
  },
];
