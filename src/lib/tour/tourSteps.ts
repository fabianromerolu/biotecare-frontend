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

  // ── MÓDULO MODELO (/model) ────────────────────────────────────────────────
  {
    pathname: "/model",
    matchMode: "exact",
    steps: [
      {
        targetId: "__model_intro",
        isModal: true,
        title: "Módulo Modelo",
        content:
          "Este módulo le permite comprobar el estado operativo del sistema y entender cómo funciona el modelo de IA ResNet-18 que analiza las imágenes IVCM.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "model__refresh-button",
        title: "Refrescar estado",
        content:
          "Pulse este botón para consultar en tiempo real si la API y la base de datos están disponibles. Hágalo antes de iniciar una sesión de análisis.",
        placement: "bottom-start",
        roles: ["all"],
      },
      {
        targetId: "model__health-card",
        title: "Estado de los servicios",
        content:
          "Muestra si la API y la base de datos responden correctamente. Si algún servicio aparece en rojo, espere unos minutos antes de ejecutar análisis.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "model__model-card",
        title: "Modelo activo",
        content:
          "Indica la versión del modelo ResNet-18 en uso, la tarea que realiza (clasificación binaria) y los biomarcadores que calcula automáticamente.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "model__steps-section",
        title: "El recorrido de una imagen",
        content:
          "Explica en cuatro pasos simples qué hace el sistema: recibe la imagen, busca patrones, genera el mapa Grad-CAM y espera la decisión del médico.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "model__result-card",
        title: "Cómo leer el resultado",
        content:
          "Resume los tres conceptos clave del análisis: la probabilidad estimada, el mapa Grad-CAM y los biomarcadores morfológicos. Todos son complementarios, ninguno sustituye al juicio clínico.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  // ── MÓDULO LEGAL (/legal) ─────────────────────────────────────────────────
  // Subfenotipos IVCM (/subfenotipos-ivcm)
  {
    pathname: "/subfenotipos-ivcm",
    matchMode: "exact",
    steps: [
      {
        targetId: "__subphenotypes_intro",
        isModal: true,
        title: "Subfenotipos IVCM",
        content:
          "Este modulo es una capa exploratoria no diagnostica. Agrupa imagenes IVCM para buscar subfenotipos visuales, revisar calidad de imagen y generar evidencia tecnica sin modificar las predicciones clinicas.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__header",
        title: "Objetivo del modulo",
        content:
          "Use esta vista para explorar patrones visuales entre imagenes ya cargadas. Biotecare conserva el flujo clinico supervisado; este modulo solo investiga agrupamientos y calidad.",
        placement: "bottom-start",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__disclaimer",
        title: "Resultado no diagnostico",
        content:
          "Los clusters no son diagnosticos ni reemplazan la revision medica. Sirven para investigacion, control de calidad y descubrimiento de posibles subgrupos que deben validarse despues.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__new-run-card",
        title: "Crear una corrida",
        content:
          "Configure el numero de clusters, componentes PCA, semilla reproducible y comparaciones opcionales con GMM y consenso. La configuracion por defecto sirve para la demo inicial.",
        placement: "right",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__patient-selector",
        title: "Seleccion de pacientes",
        content:
          "Puede marcar pacientes concretos o dejar la seleccion vacia para usar todas las imagenes disponibles del medico actual. Se requieren al menos 6 imagenes IVCM.",
        placement: "right",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__run-button",
        title: "Ejecutar exploracion",
        content:
          "Este boton lanza el procesamiento. La corrida calcula embeddings, PCA, KMeans, GMM opcional, consenso opcional, ARI y metricas de calidad por imagen.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__runs-card",
        title: "Corridas guardadas",
        content:
          "Aqui se listan las exploraciones previas. Cada corrida conserva estado, fecha, numero de imagenes, clusters y un boton para ver su detalle sin tocar Prediction.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__metrics",
        title: "Metricas principales",
        content:
          "Revise imagenes procesadas, numero de clusters y ARI. ARI compara particiones: valores cercanos a 1 indican mayor acuerdo entre KMeans, GMM o consenso.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__pca-card",
        title: "PCA por cluster",
        content:
          "El grafico ubica cada imagen en PC1 y PC2 coloreada por cluster. Es una vista exploratoria para ver separacion visual, no una frontera clinica.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__distribution-card",
        title: "Distribucion de clusters",
        content:
          "La distribucion ayuda a detectar grupos dominantes o subgrupos pequenos. Si un cluster coincide con baja calidad, se debe interpretar con cautela.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "subphenotypes__assignments-table",
        title: "Asignaciones por imagen",
        content:
          "La tabla muestra paciente, archivo, cluster, PC1, PC2, nitidez, contraste y saturacion. Estos datos permiten auditar cada imagen y preparar analisis posteriores.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  {
    pathname: "/legal",
    matchMode: "exact",
    steps: [
      {
        targetId: "__legal_intro",
        isModal: true,
        title: "Marco legal",
        content:
          "Este módulo documenta el cumplimiento normativo de Biotecare bajo la regulación española y europea: EU AI Act, RGPD, MDR, LOPDGDD y Ley 41/2002, entre otras.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "legal__summary-grid",
        title: "Indicadores de cumplimiento",
        content:
          "Resumen rápido del estado jurídico del sistema: viabilidad, clasificación como IA de alto riesgo, tipo de datos tratados y fase actual del proyecto.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "legal__rules-section",
        title: "Normas aplicables",
        content:
          "Fichas expandibles con cada norma relevante. Para cada una se indica qué regula, qué obliga a Biotecare y cuál es la autoridad competente.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "legal__compliance-matrix",
        title: "Matriz de cumplimiento",
        content:
          "Lista los requisitos regulatorios con su estado actual: Implementado, Pendiente, Parcial o No aplica aún. Es el punto de referencia antes de avanzar a producción.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "legal__roadmap-section",
        title: "Hoja de ruta regulatoria",
        content:
          "Divide las obligaciones en tres fases: antes de usar datos reales, antes del despliegue clínico y antes de comercializar. Identifica qué debe completarse en cada etapa.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

  // ── MANUAL DE USUARIO (/manual-usuario) ──────────────────────────────────
  {
    pathname: "/manual-usuario",
    matchMode: "exact",
    steps: [
      {
        targetId: "__manual_intro",
        isModal: true,
        title: "Manual de usuario",
        content:
          "Guía completa de uso de Biotecare. Encontrará instrucciones paso a paso para cada módulo del sistema, con capturas de la interfaz y advertencias clínicas relevantes.",
        placement: "bottom",
        roles: ["all"],
      },
      {
        targetId: "manual__sections",
        title: "Guía interactiva",
        content:
          "Cada acordeón responde una pregunta concreta sobre el sistema. Al expandirlo verá los pasos detallados, notas importantes y una vista de la interfaz correspondiente.",
        placement: "top",
        roles: ["all"],
      },
      {
        targetId: "manual__pdf-section",
        title: "Manual completo en PDF",
        content:
          "Puede previsualizar el documento completo y descargarlo como PDF para consulta sin conexión. El documento incluye todas las secciones con diagramas de interfaz anotados.",
        placement: "top",
        roles: ["all"],
      },
    ],
  },

];
