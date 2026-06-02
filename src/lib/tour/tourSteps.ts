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

];
