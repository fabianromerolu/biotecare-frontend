export const BIOMARKER_ROWS = [
  {
    key: "CNFL",
    label: "CNFL",
    description: "Longitud de fibras nerviosas corneales",
    unit: "mm/mm²",
    normal: "> 20 mm/mm²",
    tooltip: {
      fullName: "Corneal Nerve Fiber Length — Longitud de Fibras Nerviosas Corneales",
      explains:
        "Mide la longitud total de las fibras nerviosas por unidad de superficie en el plexo subbasal de la córnea mediante IVCM.",
      normalRange: "Normal: > 20 mm/mm². Reducción progresiva indica pérdida de inervación corneal.",
      clinical:
        "Valores bajos (< 15 mm/mm²) se asocian a neuropatía corneal y déficit lagrimal. Correlaciona directamente con la severidad de los síntomas de ojo seco.",
    },
  },
  {
    key: "CNFD",
    label: "CNFD",
    description: "Densidad de fibras nerviosas corneales",
    unit: "fibras/mm²",
    normal: "> 25 fibras/mm²",
    tooltip: {
      fullName: "Corneal Nerve Fiber Density — Densidad de Fibras Nerviosas Corneales",
      explains:
        "Contabiliza el número de fibras nerviosas principales por mm² en la capa subbasal corneal.",
      normalRange: "Normal: > 25 fibras/mm². Valores < 20 indican denervación significativa.",
      clinical:
        "La denervación corneal altera la sensibilidad y la producción refleja de lágrima. Se observa en ojo seco severo, queratocono y neuropatía diabética.",
    },
  },
  {
    key: "CNBD",
    label: "CNBD",
    description: "Densidad de ramificaciones nerviosas",
    unit: "ramas/mm²",
    normal: "> 5.5 ramas/mm²",
    tooltip: {
      fullName: "Corneal Nerve Branch Density — Densidad de Ramificaciones Nerviosas Corneales",
      explains:
        "Mide el número de ramificaciones secundarias por mm² en el plexo subbasal. Las ramificaciones son esenciales para la sensibilidad táctil y térmica de la córnea.",
      normalRange: "Normal: > 5.5 ramas/mm². Su reducción precede a la pérdida de fibras principales.",
      clinical:
        "Indicador temprano y sensible de neuropatía corneal. Su disminución orienta hacia tratamientos neuroregeneradores (plasma rico en plaquetas, suero autólogo).",
    },
  },
  {
    key: "dendritic_cell_count",
    label: "Células dendríticas",
    description: "Conteo por unidad de superficie",
    unit: "células/mm²",
    normal: "< 30 células/mm²",
    tooltip: {
      fullName: "Densidad de Células Dendríticas Corneales",
      explains:
        "Cuantifica las células presentadoras de antígenos (células de Langerhans) en el epitelio corneal. Su presencia refleja activación inmunitaria e inflamación local.",
      normalRange:
        "Normal: < 30 células/mm². Valores > 70 indican inflamación activa significativa.",
      clinical:
        "En ojo seco inflamatorio la densidad puede superar 100 células/mm². Guía la indicación de tratamiento antiinflamatorio (ciclosporina, corticoides tópicos).",
    },
  },
  {
    key: "microneuroma_count",
    label: "Microneuromas",
    description: "Terminaciones nerviosas alteradas",
    unit: "conteo",
    normal: "0 (ausencia)",
    tooltip: {
      fullName: "Microneuromas Corneales",
      explains:
        "Detecta terminaciones nerviosas con morfología anormal (bulbosas o tortuosas), signo de daño axonal o regeneración nerviosa aberrante.",
      normalRange: "Normal: 0. Cualquier presencia es clínicamente relevante.",
      clinical:
        "Su presencia se asocia a dolor neuropático ocular y síntomas que no responden a lubricación. Orienta hacia diagnóstico de ojo seco neuropático y terapias dirigidas al sistema nervioso.",
    },
  },
] as const;
