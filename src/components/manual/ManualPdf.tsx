import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
  Circle,
  Line,
} from "@react-pdf/renderer";
import {
  MANUAL_SECTIONS,
  MANUAL_VERSION,
  MANUAL_DATE,
  APP_MANUAL_NAME,
} from "@/lib/manual/manualSections";

Font.registerHyphenationCallback((word) => [word]);

/* ── Palette ──────────────────────────────────────────────── */
const C = {
  sidebarBg: "#2d4270",
  sidebarAccent: "#3d5290",
  primary: "#2e6abd",
  primaryLight: "#dbeafe",
  bg: "#f4f8fb",
  white: "#ffffff",
  border: "#c8d8ec",
  textDark: "#1e2b3c",
  textMid: "#374151",
  textMuted: "#6b7280",
  green: "#16a34a",
  greenLight: "#dcfce7",
  amber: "#d97706",
  amberLight: "#fef3c7",
  red: "#dc2626",
  redLight: "#fee2e2",
  blue: "#2563eb",
  blueLight: "#eff6ff",
  gaugeBg: "#e5e7eb",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.textDark,
    backgroundColor: C.white,
  },
  coverPage: {
    paddingTop: 72,
    paddingBottom: 56,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    backgroundColor: C.sidebarBg,
  },
  coverTitle: { fontSize: 26, fontFamily: "Helvetica-Bold", color: C.white, marginBottom: 6 },
  coverSubtitle: { fontSize: 13, color: "#93c5fd", marginBottom: 36 },
  coverMeta: { fontSize: 9, color: "#bfdbfe", marginBottom: 4 },
  coverDivider: { borderBottomWidth: 1, borderBottomColor: C.primary, marginVertical: 28 },
  coverDescription: { fontSize: 11, color: "#e2e8f0", lineHeight: 1.6 },
  coverDisclaimer: {
    marginTop: 36, padding: 12,
    borderLeftWidth: 3, borderLeftColor: C.amber,
    backgroundColor: "#1e3a6f",
  },
  coverDisclaimerText: { fontSize: 9, color: "#fde68a", lineHeight: 1.5 },

  pageHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 16, paddingBottom: 8,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerApp: { fontSize: 8.5, color: C.textMuted, fontFamily: "Helvetica-Bold" },
  headerVersion: { fontSize: 8.5, color: "#9ca3af" },

  tocTitle: { fontSize: 15, fontFamily: "Helvetica-Bold", color: C.sidebarBg, marginBottom: 14 },
  tocItem: {
    flexDirection: "row", justifyContent: "space-between",
    marginBottom: 5, paddingBottom: 4,
    borderBottomWidth: 1, borderBottomColor: "#f3f4f6",
  },
  tocSectionTitle: { fontSize: 10, color: C.textMid },
  tocSectionNum: { fontSize: 10, color: "#9ca3af" },

  sectionHeader: {
    flexDirection: "row", alignItems: "center",
    marginTop: 18, marginBottom: 10,
    paddingBottom: 5, borderBottomWidth: 2, borderBottomColor: C.sidebarBg,
  },
  sectionDot: {
    width: 8, height: 8, borderRadius: 4, marginRight: 8,
    backgroundColor: C.primary,
  },
  sectionTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: C.sidebarBg },

  questionBlock: {
    marginBottom: 10, padding: 9,
    backgroundColor: "#f9fafb", borderRadius: 4,
    borderLeftWidth: 3, borderLeftColor: C.primary,
  },
  questionText: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.textDark, marginBottom: 4 },
  answerText: { fontSize: 9, color: C.textMid, lineHeight: 1.55 },

  stepsContainer: { marginTop: 7, marginLeft: 4 },
  stepRow: { flexDirection: "row", gap: 5, marginBottom: 3 },
  stepNum: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: C.primary, minWidth: 14 },
  stepText: { fontSize: 8.5, color: C.textMid, lineHeight: 1.4, flex: 1 },

  noteBlock: {
    marginTop: 7, padding: 7,
    backgroundColor: C.blueLight, borderRadius: 3,
    borderLeftWidth: 2, borderLeftColor: C.blue,
  },
  noteLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.blue, marginBottom: 2 },
  noteText: { fontSize: 8, color: "#1e40af", lineHeight: 1.4 },
  warnBlock: {
    marginTop: 7, padding: 7,
    backgroundColor: C.amberLight, borderRadius: 3,
    borderLeftWidth: 2, borderLeftColor: C.amber,
  },
  warnLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#92400e", marginBottom: 2 },
  warnText: { fontSize: 8, color: "#92400e", lineHeight: 1.4 },

  /* Visual block: Mockup diagram */
  mockupContainer: {
    marginTop: 10, marginBottom: 4,
    borderRadius: 6, overflow: "hidden",
    border: `1px solid ${C.border}`,
  },
  mockupBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#f1f5f9", padding: 5,
    borderBottomWidth: 1, borderBottomColor: C.border,
    gap: 4,
  },
  mockupBarCircle: { width: 7, height: 7, borderRadius: 4 },
  mockupUrl: { fontSize: 7, color: "#94a3b8", marginLeft: 4 },
  mockupContent: { backgroundColor: C.bg, padding: 6 },
  mockupCard: {
    backgroundColor: C.white, borderRadius: 4,
    border: `1px solid ${C.border}`,
    padding: 8, marginBottom: 6,
  },
  mockupCardTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.textDark, marginBottom: 4 },
  mockupRow: { flexDirection: "row", gap: 6, marginBottom: 4 },
  mockupLabel: { fontSize: 7.5, color: C.textMuted, marginBottom: 2 },
  mockupField: {
    border: `1px solid ${C.border}`, borderRadius: 3,
    padding: "3 6", backgroundColor: C.white, fontSize: 7.5, color: C.textMid,
  },
  mockupFieldActive: {
    border: `2px solid ${C.primary}`, borderRadius: 3,
    padding: "3 6", backgroundColor: C.white, fontSize: 7.5, color: C.textMid,
  },
  mockupBtn: {
    backgroundColor: C.primary, borderRadius: 3,
    padding: "3 8", alignSelf: "flex-start",
  },
  mockupBtnText: { fontSize: 7.5, color: C.white, fontFamily: "Helvetica-Bold" },
  mockupBtnOutline: {
    border: `1px solid ${C.border}`, borderRadius: 3,
    padding: "3 8", alignSelf: "flex-start",
  },
  mockupBtnOutlineText: { fontSize: 7.5, color: C.textMid },
  mockupBadge: { borderRadius: 10, padding: "1 5" },

  /* Sidebar in mockup */
  sidebar: {
    width: 64, backgroundColor: C.sidebarBg,
    padding: 4, flexShrink: 0,
  },
  sidebarItem: {
    borderRadius: 3, padding: "3 5", marginBottom: 2,
  },
  sidebarItemText: { fontSize: 7, color: "rgba(255,255,255,0.75)" },
  sidebarItemActive: {
    borderRadius: 3, padding: "3 5", marginBottom: 2,
    backgroundColor: C.sidebarAccent,
  },
  sidebarItemActiveText: { fontSize: 7, color: C.white, fontFamily: "Helvetica-Bold" },

  footer: {
    position: "absolute", bottom: 20, left: 44, right: 44,
    flexDirection: "row", justifyContent: "space-between",
    borderTopWidth: 1, borderTopColor: C.border, paddingTop: 5,
  },
  footerText: { fontSize: 7.5, color: "#9ca3af" },
  pageNumber: { fontSize: 7.5, color: "#9ca3af" },

  calloutRow: { flexDirection: "row", gap: 5, marginBottom: 3, alignItems: "flex-start" },
  calloutNum: {
    width: 13, height: 13, borderRadius: 7,
    backgroundColor: C.primary,
    alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
  },
  calloutNumText: { fontSize: 6.5, color: C.white, fontFamily: "Helvetica-Bold" },
  calloutText: { fontSize: 8, color: C.textMid, flex: 1, lineHeight: 1.4 },
});

/* ── Sub-components ───────────────────────────────────────── */
function PageHeader() {
  return (
    <View style={styles.pageHeader} fixed>
      <Text style={styles.headerApp}>{APP_MANUAL_NAME} · Manual de usuario</Text>
      <Text style={styles.headerVersion}>v{MANUAL_VERSION}</Text>
    </View>
  );
}

function PageFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>{APP_MANUAL_NAME} · {MANUAL_DATE}</Text>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

function MockupBar({ url }: { url: string }) {
  return (
    <View style={styles.mockupBar}>
      <View style={[styles.mockupBarCircle, { backgroundColor: "#f87171" }]} />
      <View style={[styles.mockupBarCircle, { backgroundColor: "#fbbf24" }]} />
      <View style={[styles.mockupBarCircle, { backgroundColor: "#34d399" }]} />
      <Text style={styles.mockupUrl}>localhost:3000{url}</Text>
    </View>
  );
}

function SidebarMockPdf({ active }: { active: string }) {
  const items = ["Pacientes", "Subfenotipos IVCM", "Modelo", "Legal", "Manual"];
  const activeMap: Record<string, string> = {
    "/patients": "Pacientes", "/model": "Modelo",
    "/subfenotipos-ivcm": "Subfenotipos IVCM",
    "/legal": "Legal", "/manual-usuario": "Manual",
  };
  const activeLabel = activeMap[active] ?? "";
  return (
    <View style={styles.sidebar}>
      <View style={{ marginBottom: 6, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" }}>
        <Text style={{ fontSize: 7, color: C.white, fontFamily: "Helvetica-Bold" }}>Biotecare</Text>
        <Text style={{ fontSize: 5.5, color: "rgba(255,255,255,0.45)" }}>IVCM + IA clínica</Text>
      </View>
      {items.map((item) =>
        item === activeLabel ? (
          <View key={item} style={styles.sidebarItemActive}>
            <Text style={styles.sidebarItemActiveText}>{item}</Text>
          </View>
        ) : (
          <View key={item} style={styles.sidebarItem}>
            <Text style={styles.sidebarItemText}>{item}</Text>
          </View>
        ),
      )}
    </View>
  );
}

function Callout({ n, text }: { n: number; text: string }) {
  return (
    <View style={styles.calloutRow}>
      <View style={styles.calloutNum}>
        <Text style={styles.calloutNumText}>{n}</Text>
      </View>
      <Text style={styles.calloutText}>{text}</Text>
    </View>
  );
}

/* ── Screen-specific PDF diagrams ─────────────────────────── */

function LoginDiagram() {
  return (
    <View style={styles.mockupContainer} wrap={false}>
      <MockupBar url="/login" />
      <View style={{ backgroundColor: "#1e2d4e", padding: 12, alignItems: "center" }}>
        <View style={{ width: 180, backgroundColor: C.white, borderRadius: 6, padding: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 5 }}>
            <View style={{ width: 16, height: 16, backgroundColor: C.primary, borderRadius: 3 }} />
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: C.textDark }}>Biotecare</Text>
          </View>
          {/* Tabs */}
          <View style={{ flexDirection: "row", backgroundColor: "#f1f5f9", borderRadius: 4, padding: 2, marginBottom: 8 }}>
            <View style={{ flex: 1, backgroundColor: C.white, borderRadius: 3, padding: "3 0", alignItems: "center" }}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: C.textDark }}>Iniciar sesión</Text>
            </View>
            <View style={{ flex: 1, padding: "3 0", alignItems: "center" }}>
              <Text style={{ fontSize: 7, color: C.textMuted }}>Crear cuenta</Text>
            </View>
          </View>
          {/* Fields */}
          <View style={{ marginBottom: 5 }}>
            <Text style={styles.mockupLabel}>① Correo electrónico</Text>
            <View style={styles.mockupFieldActive}><Text style={styles.mockupField.fontSize ? undefined : {}}>doctor@hospital.es</Text></View>
          </View>
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.mockupLabel}>② Contraseña</Text>
            <View style={styles.mockupField}><Text style={{ fontSize: 7.5, color: C.textMuted }}>••••••••••</Text></View>
          </View>
          <View style={[styles.mockupBtn, { alignSelf: "stretch", alignItems: "center" }]}>
            <Text style={styles.mockupBtnText}>③ Entrar</Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 6, backgroundColor: "#fafafa" }}>
        <Callout n={1} text="Correo electrónico registrado en el sistema." />
        <Callout n={2} text="Contraseña (mínimo 8 caracteres, distingue mayúsculas)." />
        <Callout n={3} text='Botón "Entrar" — redirige al módulo de Pacientes.' />
      </View>
    </View>
  );
}

function PatientListDiagram() {
  const rows = [
    { code: "HRT-2026-0042", year: "1978", sex: "F", imgs: "2", status: "Con predicción", sc: C.green, slc: C.greenLight },
    { code: "OCU-2026-0109", year: "1965", sex: "M", imgs: "1", status: "Pendiente", sc: C.amber, slc: C.amberLight },
    { code: "DRY-2026-0007", year: "1990", sex: "F", imgs: "0", status: "Sin analizar", sc: C.textMuted, slc: "#f3f4f6" },
  ];
  return (
    <View style={styles.mockupContainer} wrap={false}>
      <MockupBar url="/patients" />
      <View style={[styles.mockupContent, { flexDirection: "row" }]}>
        <SidebarMockPdf active="/patients" />
        <View style={{ flex: 1, paddingLeft: 8 }}>
          {/* Toolbar */}
          <View style={{ flexDirection: "row", gap: 5, marginBottom: 6, alignItems: "center" }}>
            <View style={[styles.mockupField, { flex: 1 }]}><Text style={{ fontSize: 7, color: C.textMuted }}>① Buscar código externo…</Text></View>
            <View style={styles.mockupField}><Text style={{ fontSize: 7, color: C.textMuted }}>Sexo ▾</Text></View>
            <View style={styles.mockupField}><Text style={{ fontSize: 7, color: C.textMuted }}>② Estado ▾</Text></View>
            <View style={styles.mockupBtn}><Text style={styles.mockupBtnText}>③ + Nuevo paciente</Text></View>
          </View>
          {/* Table */}
          <View style={{ border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
            <View style={{ flexDirection: "row", backgroundColor: "#f8fafc", borderBottomWidth: 1, borderBottomColor: C.border }}>
              {["④ Código", "Año", "Sexo", "Imágenes", "Estado"].map((h) => (
                <View key={h} style={{ flex: h === "④ Código" ? 2 : 1, padding: "3 5" }}>
                  <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: C.textMuted, textTransform: "uppercase" }}>{h}</Text>
                </View>
              ))}
            </View>
            {rows.map((r, i) => (
              <View key={r.code} style={{ flexDirection: "row", borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderBottomColor: C.border }}>
                <View style={{ flex: 2, padding: "4 5" }}>
                  <Text style={{ fontSize: 7.5, color: C.primary, fontFamily: "Helvetica-Bold" }}>{r.code}</Text>
                </View>
                <View style={{ flex: 1, padding: "4 5" }}><Text style={{ fontSize: 7.5, color: C.textMid }}>{r.year}</Text></View>
                <View style={{ flex: 1, padding: "4 5" }}><Text style={{ fontSize: 7.5, color: C.textMid }}>{r.sex}</Text></View>
                <View style={{ flex: 1, padding: "4 5" }}><Text style={{ fontSize: 7.5, color: C.textMid }}>{r.imgs}</Text></View>
                <View style={{ flex: 1, padding: "3 5" }}>
                  <View style={{ backgroundColor: r.slc, borderRadius: 8, padding: "1 4" }}>
                    <Text style={{ fontSize: 6.5, color: r.sc }}>{r.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={{ padding: 6, backgroundColor: "#fafafa" }}>
        <Callout n={1} text='Barra de búsqueda: filtra por código externo en tiempo real.' />
        <Callout n={2} text='Filtros Sexo y Estado combinables entre sí.' />
        <Callout n={3} text='"Nuevo paciente" abre el formulario de creación.' />
        <Callout n={4} text='El código azul enlaza al expediente completo del paciente.' />
      </View>
    </View>
  );
}

function NewPatientDiagram() {
  return (
    <View style={styles.mockupContainer} wrap={false}>
      <MockupBar url="/patients/new" />
      <View style={[styles.mockupContent, { flexDirection: "row" }]}>
        <SidebarMockPdf active="/patients" />
        <View style={{ flex: 1, paddingLeft: 8 }}>
          <View style={styles.mockupCard}>
            <Text style={styles.mockupCardTitle}>Nuevo paciente</Text>
            <View style={{ marginBottom: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 }}>
                <Text style={styles.mockupLabel}>① Código externo</Text>
                <View style={{ backgroundColor: "#fee2e2", borderRadius: 2, padding: "1 3" }}>
                  <Text style={{ fontSize: 5.5, color: C.red, fontFamily: "Helvetica-Bold" }}>OBLIGATORIO</Text>
                </View>
              </View>
              <View style={styles.mockupFieldActive}><Text style={{ fontSize: 7.5 }}>HRT-2026-0042</Text></View>
            </View>
            <View style={{ marginBottom: 6 }}>
              <Text style={styles.mockupLabel}>② Año de nacimiento (opcional)</Text>
              <View style={styles.mockupField}><Text style={{ fontSize: 7.5 }}>1978</Text></View>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={styles.mockupLabel}>③ Sexo (opcional)</Text>
              <View style={[styles.mockupField, { flexDirection: "row", justifyContent: "space-between" }]}>
                <Text style={{ fontSize: 7.5 }}>Femenino</Text>
                <Text style={{ fontSize: 7.5, color: C.textMuted }}>▾</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <View style={[styles.mockupBtn, { flex: 1, alignItems: "center" }]}>
                <Text style={styles.mockupBtnText}>④ Guardar</Text>
              </View>
              <View style={[styles.mockupBtnOutline, { paddingHorizontal: 10 }]}>
                <Text style={styles.mockupBtnOutlineText}>Cancelar</Text>
              </View>
            </View>
          </View>
          <View style={[styles.warnBlock, { marginTop: 0 }]}>
            <Text style={styles.warnText}>El código externo no se puede modificar tras guardar.</Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 6, backgroundColor: "#fafafa" }}>
        <Callout n={1} text='Código externo: único campo obligatorio. Usa un ID anónimo de tu HCE.' />
        <Callout n={2} text='Año de nacimiento: entero entre 1900 y 2030.' />
        <Callout n={3} text='Sexo: Femenino / Masculino / Otro / Sin registrar.' />
        <Callout n={4} text='"Guardar" crea el expediente y redirige al detalle del paciente.' />
      </View>
    </View>
  );
}

function UploadDiagram() {
  return (
    <View style={styles.mockupContainer} wrap={false}>
      <MockupBar url="/patients/.../upload" />
      <View style={[styles.mockupContent, { flexDirection: "row" }]}>
        <SidebarMockPdf active="/patients" />
        <View style={{ flex: 1, paddingLeft: 8, gap: 5 }}>
          {/* Drop zone with file */}
          <View style={{ border: `2px solid ${C.primary}`, borderRadius: 5, backgroundColor: "#eff6ff", padding: 8 }}>
            <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
              <View style={{ width: 32, height: 32, backgroundColor: "#374151", borderRadius: 4 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.textDark }}>① cornea_od_2026-06-04.tif</Text>
                <Text style={{ fontSize: 7, color: C.textMuted }}>TIFF · 512 × 512 px · 4.2 MB</Text>
                <View style={{ marginTop: 4, height: 4, backgroundColor: "#d1fae5", borderRadius: 2 }}>
                  <View style={{ width: "100%", height: 4, backgroundColor: C.green, borderRadius: 2 }} />
                </View>
              </View>
            </View>
          </View>
          {/* Fields */}
          <View style={styles.mockupCard}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <Text style={styles.mockupLabel}>② Ojo:</Text>
              <View style={[styles.mockupBtn, { marginTop: 0 }]}><Text style={styles.mockupBtnText}>OD</Text></View>
              <View style={styles.mockupBtnOutline}><Text style={styles.mockupBtnOutlineText}>OS</Text></View>
            </View>
            <Text style={styles.mockupLabel}>③ Profundidad Z (μm) — opcional</Text>
            <View style={styles.mockupField}><Text style={{ fontSize: 7.5 }}>42.5</Text></View>
          </View>
          <View style={[styles.mockupBtn, { alignSelf: "stretch", alignItems: "center" }]}>
            <Text style={styles.mockupBtnText}>④ Subir imagen IVCM</Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 6, backgroundColor: "#fafafa" }}>
        <Callout n={1} text='Zona de carga: arrastra el archivo o haz clic. PNG, JPEG, TIFF, BMP — máx. 25 MB.' />
        <Callout n={2} text='OD = ojo derecho · OS = ojo izquierdo. Mejora la trazabilidad clínica.' />
        <Callout n={3} text='Profundidad Z de captura en microscopía confocal (opcional).' />
        <Callout n={4} text='La barra verde confirma que la imagen se subió correctamente.' />
      </View>
    </View>
  );
}

function AnalysisDiagram() {
  return (
    <View style={styles.mockupContainer} wrap={false}>
      <MockupBar url="/patients/.../images/..." />
      <View style={[styles.mockupContent, { flexDirection: "row" }]}>
        <SidebarMockPdf active="/patients" />
        <View style={{ flex: 1, paddingLeft: 8, gap: 5 }}>
          {/* Pipeline */}
          <View style={[styles.mockupCard, { flexDirection: "row", alignItems: "center", gap: 6 }]}>
            {["① Cargada", "② Preprocesada", "③ Predicha"].map((s, i) => (
              <View key={s} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                {i > 0 && <View style={{ width: 12, height: 1, backgroundColor: C.green }} />}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.green, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 6, color: C.white, fontFamily: "Helvetica-Bold" }}>✓</Text>
                  </View>
                  <Text style={{ fontSize: 7, color: "#166534", fontFamily: "Helvetica-Bold" }}>{s}</Text>
                </View>
              </View>
            ))}
          </View>
          {/* Execute button */}
          <View style={[styles.mockupCard, { alignItems: "center" }]}>
            <View style={[styles.mockupBtn, { backgroundColor: C.blue }]}>
              <Text style={styles.mockupBtnText}>④ ✦ Ejecutar análisis IA</Text>
            </View>
          </View>
          {/* Results row */}
          <View style={{ flexDirection: "row", gap: 5 }}>
            {/* Gauge */}
            <View style={[styles.mockupCard, { flex: 1, alignItems: "center" }]}>
              <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.textMuted, marginBottom: 4 }}>⑤ Probabilidad</Text>
              <Svg viewBox="0 0 80 50" style={{ width: 60, height: 38 }}>
                {/* Green arc */}
                <Path d="M 14 42 A 30 30 0 0 1 40 12" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
                {/* Red arc */}
                <Path d="M 40 12 A 30 30 0 0 1 66 42" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                {/* Needle */}
                <Line x1="40" y1="42" x2="55" y2="20" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                <Circle cx="40" cy="42" r="2.5" fill="#1e293b" />
                <text x="40" y="32" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ef4444">65%</text>
              </Svg>
              <Text style={{ fontSize: 7, color: C.red }}>Ojo seco</Text>
            </View>
            {/* Biomarkers */}
            <View style={[styles.mockupCard, { flex: 1 }]}>
              <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.textMuted, marginBottom: 4 }}>⑥ Biomarcadores</Text>
              {[
                { n: "CNFL", v: "18.2", u: "mm/mm²", ok: false },
                { n: "CNFD", v: "22.5", u: "/mm²", ok: false },
                { n: "CNBD", v: "6.1", u: "/mm²", ok: true },
              ].map((b) => (
                <View key={b.n} style={{ flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#f3f4f6", paddingBottom: 2, marginBottom: 2 }}>
                  <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: C.textDark }}>{b.n}</Text>
                  <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: b.ok ? C.green : C.red }}>{b.v}</Text>
                  <Text style={{ fontSize: 6, color: C.textMuted }}>{b.u}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      <View style={{ padding: 6, backgroundColor: "#fafafa" }}>
        <Callout n={1} text='Pipeline verde: la imagen pasó por los tres estados de procesamiento.' />
        <Callout n={4} text='"Ejecutar análisis IA" lanza ResNet-18. Puede tardar hasta 30 s en CPU.' />
        <Callout n={5} text='Gauge: zona verde = Normal (< 50%), zona roja = Ojo seco (≥ 50%).' />
        <Callout n={6} text='Biomarcadores en rojo = fuera del rango de referencia normal.' />
      </View>
    </View>
  );
}

function ReviewDiagram() {
  return (
    <View style={styles.mockupContainer} wrap={false}>
      <MockupBar url="/patients/.../images/..." />
      <View style={styles.mockupContent}>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {/* Pending */}
          <View style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 5, overflow: "hidden" }}>
            <View style={{ backgroundColor: C.amberLight, padding: 5, borderBottomWidth: 1, borderBottomColor: C.amber }}>
              <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#92400e" }}>① ⏳ Revisión pendiente</Text>
            </View>
            <View style={{ padding: 5, gap: 3 }}>
              <View style={[styles.mockupBtn, { alignSelf: "stretch", alignItems: "center", backgroundColor: C.green }]}>
                <Text style={styles.mockupBtnText}>② ✓ Aceptar</Text>
              </View>
              <View style={[styles.mockupBtnOutline, { alignSelf: "stretch", alignItems: "center", borderColor: C.red }]}>
                <Text style={[styles.mockupBtnOutlineText, { color: C.red }]}>③ ✕ Rechazar</Text>
              </View>
            </View>
          </View>
          {/* Accepted */}
          <View style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 5, overflow: "hidden" }}>
            <View style={{ backgroundColor: C.greenLight, padding: 5, borderBottomWidth: 1, borderBottomColor: C.green }}>
              <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#166534" }}>✓ Predicción aceptada</Text>
            </View>
            <View style={{ padding: 5 }}>
              <Text style={{ fontSize: 7, color: C.textMid, lineHeight: 1.4 }}>El médico ratificó el resultado. Registrado en el expediente clínico.</Text>
            </View>
          </View>
          {/* Rejected */}
          <View style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 5, overflow: "hidden" }}>
            <View style={{ backgroundColor: C.redLight, padding: 5, borderBottomWidth: 1, borderBottomColor: C.red }}>
              <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#991b1b" }}>✕ Predicción rechazada</Text>
            </View>
            <View style={{ padding: 5 }}>
              <Text style={{ fontSize: 7, color: C.textMid, lineHeight: 1.4 }}>El médico descartó el resultado. Registrado en el expediente clínico.</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{ padding: 6, backgroundColor: "#fafafa" }}>
        <Callout n={1} text='Estado inicial: ámbar. El médico debe revisar antes de cerrar el expediente.' />
        <Callout n={2} text='Aceptar (verde): el resultado es clínicamente coherente y queda registrado.' />
        <Callout n={3} text='Rechazar (rojo): el médico descarta el resultado. Acción IRREVERSIBLE.' />
      </View>
    </View>
  );
}

function PdfClusterBadge({ cluster }: { cluster: number }) {
  const colors = [C.blue, C.green, C.red];
  return (
    <View style={{ borderWidth: 1, borderColor: colors[cluster], borderRadius: 8, padding: "1 4" }}>
      <Text style={{ fontSize: 6.5, color: colors[cluster], fontFamily: "Helvetica-Bold" }}>
        Cluster {cluster}
      </Text>
    </View>
  );
}

function SubphenotypesDiagram() {
  return (
    <View style={styles.mockupContainer} wrap={false}>
      <MockupBar url="/subfenotipos-ivcm" />
      <View style={[styles.mockupContent, { flexDirection: "row" }]}>
        <SidebarMockPdf active="/subfenotipos-ivcm" />
        <View style={{ flex: 1, paddingLeft: 8, gap: 5 }}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <View style={[styles.mockupCard, { width: 128 }]}>
              <Text style={styles.mockupCardTitle}>① Nueva corrida</Text>
              <View style={{ flexDirection: "row", gap: 3, marginBottom: 4 }}>
                {["Clusters 3", "PCA 2", "Semilla 42"].map((item) => (
                  <View key={item} style={[styles.mockupField, { flex: 1, padding: "2 3" }]}>
                    <Text style={{ fontSize: 6.3, color: C.textMid }}>{item}</Text>
                  </View>
                ))}
              </View>
              <View style={[styles.mockupField, { marginBottom: 3 }]}>
                <Text style={{ fontSize: 6.5, color: C.textMid }}>Comparar con GMM ✓</Text>
              </View>
              <View style={[styles.mockupField, { marginBottom: 4 }]}>
                <Text style={{ fontSize: 6.5, color: C.textMid }}>Consensus clustering ✓</Text>
              </View>
              <View style={[styles.mockupBtn, { alignSelf: "stretch", alignItems: "center" }]}>
                <Text style={styles.mockupBtnText}>② Ejecutar exploración</Text>
              </View>
            </View>

            <View style={[styles.mockupCard, { flex: 1 }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={styles.mockupCardTitle}>③ Corridas</Text>
                <View style={{ backgroundColor: C.greenLight, borderRadius: 8, padding: "1 5" }}>
                  <Text style={{ fontSize: 6.5, color: C.green, fontFamily: "Helvetica-Bold" }}>Completada</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", backgroundColor: "#f8fafc", borderBottomWidth: 1, borderBottomColor: C.border, padding: "3 4" }}>
                <Text style={{ flex: 1, fontSize: 6.5, fontFamily: "Helvetica-Bold", color: C.textMuted }}>Corrida</Text>
                <Text style={{ width: 38, fontSize: 6.5, fontFamily: "Helvetica-Bold", color: C.textMuted }}>Imágenes</Text>
                <Text style={{ width: 34, fontSize: 6.5, fontFamily: "Helvetica-Bold", color: C.textMuted }}>Clusters</Text>
                <Text style={{ width: 28, fontSize: 6.5, fontFamily: "Helvetica-Bold", color: C.textMuted }}>Acción</Text>
              </View>
              <View style={{ flexDirection: "row", padding: "3 4" }}>
                <Text style={{ flex: 1, fontSize: 7, color: C.textMid }}>8f3a21</Text>
                <Text style={{ width: 38, fontSize: 7, color: C.textMid }}>12</Text>
                <Text style={{ width: 34, fontSize: 7, color: C.textMid }}>3</Text>
                <View style={[styles.mockupBtn, { width: 28, padding: "1 4", alignItems: "center" }]}>
                  <Text style={{ fontSize: 6.5, color: C.white, fontFamily: "Helvetica-Bold" }}>Ver</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.mockupCard, { borderColor: C.primary }]}>
            <Text style={styles.mockupCardTitle}>④ Detalle de resultados</Text>
            <View style={{ flexDirection: "row", gap: 4, marginBottom: 6 }}>
              {[
                ["Imágenes", "12"],
                ["Clusters", "3"],
                ["ARI GMM", "0.71"],
                ["ARI consenso", "0.68"],
              ].map(([label, value]) => (
                <View key={label} style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 3, padding: 4 }}>
                  <Text style={{ fontSize: 6, color: C.textMuted }}>{label}</Text>
                  <Text style={{ fontSize: 10, color: C.textDark, fontFamily: "Helvetica-Bold" }}>{value}</Text>
                </View>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 6 }}>
              <View style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 4, padding: 5 }}>
                <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: C.textMid, marginBottom: 3 }}>
                  ⑤ PCA por cluster
                </Text>
                <Svg viewBox="0 0 160 80" style={{ width: "100%", height: 72 }}>
                  <Line x1="18" y1="64" x2="150" y2="64" stroke="#cbd5e1" />
                  <Line x1="18" y1="8" x2="18" y2="64" stroke="#cbd5e1" />
                  {[
                    { x: 36, y: 48, color: C.blue },
                    { x: 48, y: 40, color: C.blue },
                    { x: 70, y: 26, color: C.green },
                    { x: 82, y: 30, color: C.green },
                    { x: 118, y: 46, color: C.red },
                    { x: 128, y: 36, color: C.red },
                  ].map((point, index) => (
                    <Circle key={index} cx={point.x} cy={point.y} r="4" fill={point.color} opacity="0.85" />
                  ))}
                </Svg>
              </View>

              <View style={{ width: 120, borderWidth: 1, borderColor: C.border, borderRadius: 4, padding: 5 }}>
                <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: C.textMid, marginBottom: 3 }}>
                  ⑥ Distribución
                </Text>
                {[0, 1, 2].map((cluster) => (
                  <View key={cluster} style={{ marginBottom: 4 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                      <PdfClusterBadge cluster={cluster} />
                      <Text style={{ fontSize: 6, color: C.textMuted }}>{[5, 4, 3][cluster]} img.</Text>
                    </View>
                    <View style={{ height: 4, backgroundColor: "#e5e7eb", borderRadius: 2 }}>
                      <View
                        style={{
                          height: 4,
                          width: `${[80, 65, 48][cluster]}%`,
                          borderRadius: 2,
                          backgroundColor: [C.blue, C.green, C.red][cluster],
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ marginTop: 6, borderWidth: 1, borderColor: C.border, borderRadius: 4, padding: 5 }}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: C.textMid, marginBottom: 3 }}>
                ⑦ Tabla de asignaciones
              </Text>
              <View style={{ flexDirection: "row", backgroundColor: "#f8fafc", padding: "2 3" }}>
                {["Paciente", "Imagen", "Cluster", "PC1", "Nitidez"].map((header) => (
                  <Text key={header} style={{ flex: 1, fontSize: 6, color: C.textMuted, fontFamily: "Helvetica-Bold" }}>
                    {header}
                  </Text>
                ))}
              </View>
              <View style={{ flexDirection: "row", padding: "2 3" }}>
                <Text style={{ flex: 1, fontSize: 6.5, color: C.textMid }}>HRT-2026</Text>
                <Text style={{ flex: 1, fontSize: 6.5, color: C.textMid }}>cornea_od.tif</Text>
                <View style={{ flex: 1 }}><PdfClusterBadge cluster={1} /></View>
                <Text style={{ flex: 1, fontSize: 6.5, color: C.textMid }}>0.42</Text>
                <Text style={{ flex: 1, fontSize: 6.5, color: C.textMid }}>128.3</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ padding: 6, backgroundColor: "#fafafa" }}>
        <Callout n={1} text="Configura clusters, PCA, semilla y métodos de comparación." />
        <Callout n={2} text="Ejecuta la exploración solo con al menos seis imágenes IVCM legibles." />
        <Callout n={3} text='El botón "Ver" abre el detalle de la corrida seleccionada.' />
        <Callout n={4} text="El detalle reúne métricas, PCA, distribución y asignaciones." />
        <Callout n={5} text="El PCA permite explorar agrupaciones visuales, no diagnósticos." />
        <Callout n={6} text="La distribución ayuda a detectar clusters dominantes o minoritarios." />
        <Callout n={7} text="La tabla permite revisar paciente, archivo, cluster y calidad de imagen." />
      </View>
    </View>
  );
}

/* Mapping from previewId → PDF diagram component */
const PDF_DIAGRAMS: Record<string, () => React.JSX.Element> = {
  login: LoginDiagram,
  patients_list: PatientListDiagram,
  new_patient: NewPatientDiagram,
  upload: UploadDiagram,
  analysis: AnalysisDiagram,
  review: ReviewDiagram,
  subphenotypes: SubphenotypesDiagram,
};

/* ── Main document ─────────────────────────────────────────── */
export function ManualPdfDocument() {
  return (
    <Document
      title={`Manual de usuario - ${APP_MANUAL_NAME}`}
      author={APP_MANUAL_NAME}
      subject="Manual de usuario del sistema Biotecare"
      creator={APP_MANUAL_NAME}
    >
      {/* PORTADA */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>Manual de usuario</Text>
        <Text style={styles.coverSubtitle}>{APP_MANUAL_NAME} · IVCM + IA clínica</Text>
        <View style={styles.coverDivider} />
        <Text style={styles.coverMeta}>Versión: {MANUAL_VERSION}</Text>
        <Text style={styles.coverMeta}>Fecha de actualización: {MANUAL_DATE}</Text>
        <Text style={{ ...styles.coverDescription, marginTop: 20 }}>
          Este manual describe el uso del sistema {APP_MANUAL_NAME}, una herramienta de soporte
          diagnóstico para la detección asistida por IA de ojo seco mediante imágenes de
          microscopía confocal corneal (IVCM). Está dirigido a profesionales sanitarios.
        </Text>
        <Text style={{ ...styles.coverDescription, marginTop: 10 }}>
          Cada capítulo incluye diagramas de interfaz anotados, pasos detallados y advertencias
          clínicas relevantes.
        </Text>
        <View style={styles.coverDisclaimer}>
          <Text style={styles.coverDisclaimerText}>
            ⚠  {APP_MANUAL_NAME} es un sistema de soporte diagnóstico de IA de alto riesgo
            (EU AI Act, Reglamento UE 2024/1689). No sustituye al criterio médico. La decisión
            clínica final es siempre responsabilidad del profesional sanitario.
          </Text>
        </View>
      </Page>

      {/* ÍNDICE */}
      <Page size="A4" style={styles.page}>
        <PageHeader />
        <Text style={styles.tocTitle}>Índice de contenidos</Text>
        {MANUAL_SECTIONS.map((section, i) => (
          <View key={section.id} style={styles.tocItem}>
            <Text style={styles.tocSectionTitle}>
              {i + 1}.  {section.title}
            </Text>
            <Text style={styles.tocSectionNum}>{section.questions.length} temas</Text>
          </View>
        ))}
        <PageFooter />
      </Page>

      {/* SECCIONES — flujo continuo, sin page por sección */}
      <Page size="A4" style={styles.page}>
        <PageHeader />
        {MANUAL_SECTIONS.map((section, sIdx) => (
          <View key={section.id} style={sIdx > 0 ? { marginTop: 18 } : undefined}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            {section.questions.map((q) => {
              const Diagram = q.previewId ? PDF_DIAGRAMS[q.previewId] : null;
              return (
                /* wrap=false only on text-only questions; diagrams can span pages */
                <View key={q.id} style={styles.questionBlock} wrap={!Diagram}>
                  <Text style={styles.questionText}>{q.question}</Text>
                  <Text style={styles.answerText}>{q.answer}</Text>

                  {q.steps && q.steps.length > 0 && (
                    <View style={styles.stepsContainer}>
                      {q.steps.map((step, si) => (
                        <View key={si} style={styles.stepRow}>
                          <Text style={styles.stepNum}>{si + 1}.</Text>
                          <Text style={styles.stepText}>{step}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {q.note && (
                    <View style={styles.noteBlock}>
                      <Text style={styles.noteLabel}>NOTA</Text>
                      <Text style={styles.noteText}>{q.note}</Text>
                    </View>
                  )}
                  {q.warning && (
                    <View style={styles.warnBlock}>
                      <Text style={styles.warnLabel}>ADVERTENCIA</Text>
                      <Text style={styles.warnText}>{q.warning}</Text>
                    </View>
                  )}

                  {Diagram && (
                    <View style={{ marginTop: 6 }}>
                      <Diagram />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
        <PageFooter />
      </Page>
    </Document>
  );
}
