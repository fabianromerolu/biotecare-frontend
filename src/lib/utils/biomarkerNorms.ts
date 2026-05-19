export const BIOMARKER_ROWS = [
  {
    key: "CNFL",
    label: "CNFL",
    description: "Corneal Nerve Fiber Length",
    unit: "mm/mm2",
    normal: "> 20 mm/mm2",
  },
  {
    key: "CNFD",
    label: "CNFD",
    description: "Corneal Nerve Fiber Density",
    unit: "fibras/mm2",
    normal: "> 25 fibras/mm2",
  },
  {
    key: "CNBD",
    label: "CNBD",
    description: "Corneal Nerve Branch Density",
    unit: "um",
    normal: "> 5.5 um",
  },
  {
    key: "dendritic_cell_count",
    label: "Celulas dendriticas",
    description: "Conteo aproximado por imagen",
    unit: "celulas/mm2",
    normal: "< 30 celulas/mm2",
  },
  {
    key: "microneuroma_count",
    label: "Microneuromas",
    description: "Terminaciones nerviosas alteradas",
    unit: "conteo",
    normal: "0",
  },
] as const;
