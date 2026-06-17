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

export const MANUAL_VERSION = "1.2.0";
export const MANUAL_DATE = "2026-06-17";
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

  /* ── Modelo de IA ─────────────────────────────────────────────────────── */
  {
    id: "model",
    title: "Modelo de IA y estado del sistema",
    iconName: "Microscope",
    questions: [
      {
        id: "model-status",
        question: "¿Qué información muestra el módulo Modelo de IA?",
        answer:
          "El módulo Modelo de IA resume el estado técnico del sistema y del modelo activo. Permite comprobar si la API y la base de datos están disponibles, revisar la versión del modelo, la tarea configurada, las etiquetas posibles y los biomarcadores informados por el backend.",
        steps: [
          "Abre Modelo en el menú lateral.",
          "Revisa la tarjeta Servicios para confirmar el estado de la API y la base de datos.",
          "Revisa la tarjeta Modelo activo para consultar versión, tarea, etiquetas y biomarcadores.",
          "Pulsa Refrescar estado si necesitas consultar de nuevo el backend.",
        ],
        note:
          "Este módulo no ejecuta inferencias. Su finalidad es dar contexto técnico y operativo sobre el sistema activo.",
        tags: ["/model", "model"],
      },
      {
        id: "model-interpretation",
        question: "¿Cómo ayuda la página Modelo a entender el análisis de IA?",
        answer:
          "La página explica el recorrido de una imagen: carga, búsqueda de patrones con ResNet-18, generación de Grad-CAM y biomarcadores, y revisión médica final. También recuerda que Grad-CAM y los biomarcadores son apoyo interpretativo y que la decisión clínica sigue siendo humana.",
        tags: ["/model", "model", "interpretation"],
      },
    ],
  },

  /* ── Marco legal ──────────────────────────────────────────────────────── */
  {
    id: "legal",
    title: "Marco legal y cumplimiento",
    iconName: "Scale",
    questions: [
      {
        id: "legal-purpose",
        question: "¿Para qué sirve el módulo Marco legal?",
        answer:
          "El módulo Marco legal resume las obligaciones normativas relevantes para Biotecare en el contexto español y europeo. Incluye referencias a RGPD, LOPDGDD, EU AI Act, MDR y normativa sanitaria, además de una matriz de cumplimiento, hoja de ruta regulatoria, riesgos jurídicos y glosario.",
        steps: [
          "Abre Legal en el menú lateral.",
          "Lee el resumen inicial para entender la viabilidad jurídica y la clasificación probable.",
          "Revisa Normas aplicables para ver obligaciones y autoridades de referencia.",
          "Consulta la matriz de cumplimiento para diferenciar puntos implementados, parciales y pendientes.",
          "Usa la hoja de ruta regulatoria para planificar pasos antes de datos reales, despliegue clínico o comercialización.",
        ],
        note:
          "La sección es orientativa y no sustituye una revisión legal formal antes de uso clínico real o comercialización.",
        tags: ["/legal", "legal"],
      },
      {
        id: "legal-reset",
        question: "¿Qué permite el botón de restablecer aviso legal?",
        answer:
          "El módulo Legal incluye una opción para restablecer la confirmación guardada del aviso legal en el navegador. Sirve para volver a mostrar el aviso al usuario cuando se necesite revisar o validar de nuevo la aceptación local.",
        tags: ["/legal", "legal", "reset"],
      },
    ],
  },

  /* ── Módulo de investigación: Subfenotipos IVCM ───────────────────────── */
  {
    id: "subphenotypes",
    title: "Módulo de investigación: Subfenotipos IVCM",
    iconName: "FlaskConical",
    questions: [
      {
        id: "subphenotypes-what",
        question: "¿Qué es el módulo Subfenotipos IVCM?",
        answer:
          "Subfenotipos IVCM es un módulo de investigación no diagnóstico. Agrupa imágenes IVCM mediante técnicas no supervisadas para explorar patrones visuales, revisar calidad de imagen y generar evidencia técnica complementaria. No sustituye ni modifica el análisis clínico principal de Biotecare.",
        note:
          "La regla de uso es: Biotecare asiste el flujo clínico supervisado; Subfenotipos IVCM explora patrones y subgrupos visuales.",
        tags: ["/subfenotipos-ivcm", "subphenotypes", "research"],
        previewId: "subphenotypes",
      },
      {
        id: "subphenotypes-run",
        question: "¿Cómo ejecutar una exploración de subfenotipos?",
        answer:
          "Entra en Subfenotipos IVCM desde el menú lateral, configura la corrida y pulsa Ejecutar exploración. Puedes usar todas las imágenes disponibles del médico o limitar la corrida a pacientes seleccionados. El sistema requiere al menos seis imágenes IVCM legibles para generar clusters.",
        steps: [
          "Abre Subfenotipos IVCM en el menú lateral.",
          "Define el número de clusters. El valor inicial recomendado es 3.",
          "Mantén PCA components en 2 para visualizar PC1 y PC2.",
          "Activa o desactiva la comparación con GMM y el consensus clustering según el objetivo del análisis.",
          "Selecciona pacientes específicos o deja la selección vacía para usar todos los pacientes del médico actual.",
          "Pulsa Ejecutar exploración y espera a que la corrida finalice.",
        ],
        warning:
          "Si hay menos de seis imágenes legibles, o si el número de clusters supera el número de imágenes válidas, la corrida no se ejecutará.",
        tags: ["/subfenotipos-ivcm", "subphenotypes", "run"],
        previewId: "subphenotypes",
      },
      {
        id: "subphenotypes-results",
        question: "¿Cómo interpretar los resultados de una corrida?",
        answer:
          "Al pulsar Ver en una corrida, el sistema abre una pantalla independiente de detalle con métricas globales, PCA coloreado por cluster, distribución de imágenes por cluster y tabla de asignaciones. Las métricas ARI ayudan a comparar la coherencia entre KMeans, GMM y consenso. Las métricas de calidad permiten detectar si un cluster podría estar explicado por imágenes borrosas, saturadas o de bajo contraste.",
        steps: [
          "Desde el listado de corridas, pulsa Ver para abrir la corrida en una vista separada.",
          "Revisa el estado de la corrida: Ejecutando, Completada o Fallida.",
          "Comprueba el número de imágenes procesadas y clusters generados.",
          "Lee ARI KMeans/GMM y ARI consenso si están disponibles.",
          "Observa el gráfico PCA para detectar agrupaciones visuales.",
          "Consulta la distribución para ver si algún cluster concentra demasiadas o muy pocas imágenes.",
          "Revisa la tabla de asignaciones con paciente, archivo, cluster, PC1, PC2, nitidez, contraste y saturación.",
        ],
        note:
          "Un cluster no equivale a un diagnóstico. Debe interpretarse como una agrupación exploratoria que requiere análisis posterior y validación.",
        tags: ["/subfenotipos-ivcm", "subphenotypes", "results"],
        previewId: "subphenotypes",
      },
      {
        id: "subphenotypes-images-gradcam",
        question: "¿Cómo revisar la imagen y el Grad-CAM dentro de una corrida?",
        answer:
          "En la pantalla de detalle de una corrida, cada asignación incluye un desplegable para visualizar la imagen original y, si existe, su mapa Grad-CAM. Esto permite contrastar el cluster asignado con la apariencia visual real de la imagen y con la explicación generada por el flujo clínico de IA.",
        steps: [
          "Abre el detalle de una corrida con el botón Ver.",
          "Baja hasta Imágenes asignadas.",
          "Despliega la fila de la imagen que quieras revisar.",
          "Comprueba la imagen original y el Grad-CAM si está disponible.",
          "Si el Grad-CAM no aparece, ejecuta primero el análisis IA de esa imagen desde el expediente clínico.",
        ],
        note:
          "El Grad-CAM pertenece al análisis clínico individual de la imagen. El módulo de investigación solo lo reutiliza para facilitar la inspección visual.",
        tags: ["/subfenotipos-ivcm", "subphenotypes", "gradcam"],
        previewId: "subphenotypes",
      },
      {
        id: "subphenotypes-delete",
        question: "¿Cómo eliminar una corrida de investigación?",
        answer:
          "Puedes eliminar una corrida desde el listado o desde su pantalla de detalle. La eliminación borra la corrida exploratoria y sus asignaciones, pero no elimina imágenes, predicciones clínicas, revisiones médicas ni Grad-CAM existentes.",
        steps: [
          "Entra en Subfenotipos IVCM.",
          "Localiza la corrida en la tabla.",
          "Pulsa Eliminar.",
          "Lee el diálogo de confirmación.",
          "Pulsa Eliminar definitivamente si quieres borrar la corrida.",
        ],
        warning:
          "La eliminación de la corrida no se puede deshacer. Si necesitas conservar métricas o asignaciones, expórtalas o documéntalas antes de borrar.",
        tags: ["/subfenotipos-ivcm", "subphenotypes", "delete"],
        previewId: "subphenotypes",
      },
      {
        id: "subphenotypes-clinical-flow",
        question: "¿Este módulo afecta las predicciones clínicas existentes?",
        answer:
          "No. Subfenotipos IVCM trabaja como una capa separada de investigación. Utiliza imágenes ya cargadas, pero guarda sus corridas y asignaciones en estructuras independientes. No escribe resultados en Prediction, no cambia el estado clínico de las imágenes y no altera la revisión médica ni el análisis agregado del paciente.",
        note:
          "Su valor principal es apoyar investigación interna, control de calidad, descubrimiento de patrones visuales y futuras mejoras de biomarcadores.",
        tags: ["/subfenotipos-ivcm", "subphenotypes", "clinical-flow"],
        previewId: "subphenotypes",
      },
    ],
  },
];
