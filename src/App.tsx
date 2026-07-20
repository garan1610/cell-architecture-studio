import {
  BookOpen,
  Box,
  ChevronDown,
  EyeOff,
  Grid3X3,
  Library,
  RotateCcw,
  Settings,
  Sparkles,
  Star,
} from "lucide-react";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { CellScene } from "./components/CellScene";
import { cells, getCellById, type CellItem, type ModelKind, type ViewMode } from "./data/cells";

const initialCell = getCellById("animalCellModel");

function Header({ cell }: { cell: CellItem }) {
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-orb" aria-hidden="true">
          <Sparkles size={26} />
        </div>
        <div>
          <h1>Phòng khám phá cấu trúc tế bào</h1>
          <p>Khám phá sự sống ở cấp độ hiển vi</p>
        </div>
      </div>

      <nav className="top-nav" aria-label="Điều hướng chính">
        <a href="#gallery">
          <Grid3X3 size={24} />
          <span>Bộ sưu tập</span>
        </a>
        <a href="#library">
          <Library size={24} />
          <span>Thư viện</span>
        </a>
        <a href="#notebooks">
          <BookOpen size={24} />
          <span>Ghi chú</span>
        </a>
        <a href="#settings">
          <Settings size={24} />
          <span>Cài đặt</span>
        </a>
        <button className="avatar-button" type="button" aria-label="Menu người dùng">
          <span className="avatar-core" style={{ background: cell.accentSoft }}>
            <span style={{ background: cell.accent }} />
          </span>
          <ChevronDown size={20} />
        </button>
      </nav>
    </header>
  );
}

type SidebarProps = {
  selectedCell: CellItem;
  selectedGrade: GradeLevel;
  favorites: Set<string>;
  onSelectCell: (id: string) => void;
  onSelectedGradeChange: (grade: GradeLevel) => void;
  onToggleFavorite: (id: string) => void;
};

type GradeLevel = "Lớp 10" | "Lớp 11" | "Lớp 12";

type ModelGroup = {
  label: string;
  items: CellItem[];
};

const gradeModelKinds: Record<GradeLevel, ModelKind[]> = {
  "Lớp 10": [
    "bioMolecules",
    "prokaryoticCell",
    "eukaryoticCell",
    "membraneTransport",
    "virus",
    "mitosis",
  ],
  "Lớp 11": [
    "plant",
    "chloroplast",
    "mitochondria",
    "rootSystem",
    "plantVascular",
    "leafStomata",
    "digestiveSystem",
    "gasExchange",
    "cardiovascular",
    "immuneSystem",
    "urinarySystem",
    "nervousSystem",
    "senseOrgans",
    "plantStemGrowth",
    "plantReproduction",
    "humanReproduction",
  ],
  "Lớp 12": ["dna", "chromosome", "translation"],
};

function getGradeForCell(cell: CellItem): GradeLevel {
  return (
    (Object.keys(gradeModelKinds) as GradeLevel[]).find((grade) =>
      gradeModelKinds[grade].includes(cell.modelKind),
    ) ?? "Lá»›p 10"
  );
}

function MiniCell({ cell }: { cell: CellItem }) {
  if (cell.renderImage?.url) {
    return (
      <span className="mini-cell has-preview" style={{ "--thumb": cell.accent } as CSSProperties}>
        <img src={cell.renderImage.url} alt="" aria-hidden="true" />
      </span>
    );
  }

  if (cell.modelAsset?.previewUrl) {
    return (
      <span className="mini-cell has-preview" style={{ "--thumb": cell.accent } as CSSProperties}>
        <img src={cell.modelAsset.previewUrl} alt="" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className={`mini-cell mini-cell-${cell.modelKind}`} style={{ "--thumb": cell.accent } as CSSProperties}>
      <span />
      <i />
      <b />
    </span>
  );
}

function Sidebar({
  selectedCell,
  selectedGrade,
  favorites,
  onSelectCell,
  onSelectedGradeChange,
  onToggleFavorite,
}: SidebarProps) {
  const gradeOptions = Object.keys(gradeModelKinds) as GradeLevel[];
  const modelGroups: ModelGroup[] = [
    {
      label: "Tế bào",
      items: cells.filter(
        (cell) =>
          ![
            "plant",
            "dna",
            "chromosome",
            "rootSystem",
            "plantVascular",
            "leafStomata",
            "chloroplast",
            "mitochondria",
            "translation",
            "digestiveSystem",
            "gasExchange",
            "cardiovascular",
            "immuneSystem",
            "urinarySystem",
            "nervousSystem",
            "senseOrgans",
            "plantStemGrowth",
            "plantReproduction",
            "humanReproduction",
            "bioMolecules",
            "prokaryoticCell",
            "eukaryoticCell",
            "membraneTransport",
            "virus",
            "mitosis",
          ].includes(cell.modelKind),
      ),
    },
    { label: "Các phân tử sinh học", items: cells.filter((cell) => cell.modelKind === "bioMolecules") },
    { label: "Tế bào nhân sơ", items: cells.filter((cell) => cell.modelKind === "prokaryoticCell") },
    { label: "Tế bào nhân thực", items: cells.filter((cell) => cell.modelKind === "eukaryoticCell") },
    { label: "Màng sinh chất và vận chuyển qua màng", items: cells.filter((cell) => cell.modelKind === "membraneTransport") },
    { label: "Virus", items: cells.filter((cell) => cell.modelKind === "virus") },
    { label: "Nguyên phân - NST và thoi phân bào", items: cells.filter((cell) => cell.modelKind === "mitosis") },
    { label: "Phân tử", items: cells.filter((cell) => cell.modelKind === "dna") },
    { label: "Nhiễm sắc thể", items: cells.filter((cell) => cell.modelKind === "chromosome") },
    { label: "Hệ rễ", items: cells.filter((cell) => cell.modelKind === "rootSystem") },
    { label: "Tế bào cây", items: cells.filter((cell) => cell.modelKind === "plant") },
    { label: "Hệ mô dẫn ở thực vật", items: cells.filter((cell) => cell.modelKind === "plantVascular") },
    { label: "Khí khổng và biểu bì lá", items: cells.filter((cell) => cell.modelKind === "leafStomata") },
    { label: "Lục lạp", items: cells.filter((cell) => cell.modelKind === "chloroplast") },
    { label: "Ti thể", items: cells.filter((cell) => cell.modelKind === "mitochondria") },
    { label: "Dịch mã", items: cells.filter((cell) => cell.modelKind === "translation") },
    { label: "Hệ tiêu hóa người", items: cells.filter((cell) => cell.modelKind === "digestiveSystem") },
    { label: "Cơ quan trao đổi khí", items: cells.filter((cell) => cell.modelKind === "gasExchange") },
    { label: "Tim và hệ mạch người", items: cells.filter((cell) => cell.modelKind === "cardiovascular") },
    { label: "Hệ miễn dịch người", items: cells.filter((cell) => cell.modelKind === "immuneSystem") },
    { label: "Thận và nephron", items: cells.filter((cell) => cell.modelKind === "urinarySystem") },
    { label: "Hệ thần kinh", items: cells.filter((cell) => cell.modelKind === "nervousSystem") },
    { label: "Cơ quan cảm giác", items: cells.filter((cell) => cell.modelKind === "senseOrgans") },
    { label: "Mô phân sinh và cấu tạo thân cây", items: cells.filter((cell) => cell.modelKind === "plantStemGrowth") },
    { label: "Hoa và cơ quan sinh sản thực vật", items: cells.filter((cell) => cell.modelKind === "plantReproduction") },
    { label: "Hệ sinh sản người", items: cells.filter((cell) => cell.modelKind === "humanReproduction") },
  ].filter((group) => group.items.length > 0);

  const gradeGroups = (Object.keys(gradeModelKinds) as GradeLevel[])
    .map((grade) => {
      const kinds = gradeModelKinds[grade];
      return {
        label: grade,
        groups: modelGroups
          .map((group) => ({
            ...group,
            items: group.items.filter((cell) => kinds.includes(cell.modelKind)),
          }))
          .filter((group) => group.items.length > 0),
      };
    })
    .filter((grade) => grade.groups.length > 0);
  const activeGradeGroup = gradeGroups.find((grade) => grade.label === selectedGrade) ?? gradeGroups[0];

  return (
    <aside className="left-rail">
      <section className="panel cell-type-panel">
        <div className="panel-heading">
          <span>
            <Box size={18} />
            Mô hình 3D
          </span>
          <label className="model-grade-select">
            <select
              value={selectedGrade}
              onChange={(event) => onSelectedGradeChange(event.target.value as GradeLevel)}
              aria-label="Chon lop"
            >
              {gradeOptions.map((grade, index) => (
                <option key={grade} value={grade}>
                  Lop {index + 10}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </label>
        </div>

        <div className="model-groups">
          {activeGradeGroup?.groups.map((group) => (
                <div className="model-group" key={`${activeGradeGroup.label}-${group.label}`}>
                  <h3>{group.label}</h3>
              <div className="cell-list">
                {group.items.map((cell) => {
                  const selected = selectedCell.id === cell.id;
                  return (
                    <button
                      className={`cell-row ${selected ? "is-active" : ""}`}
                      type="button"
                      key={cell.id}
                      onClick={() => onSelectCell(cell.id)}
                    >
                      <MiniCell cell={cell} />
                      <span className="cell-row-copy">
                        <strong>{cell.name}</strong>
                        <span>{cell.type}</span>
                      </span>
                      <span
                        className={`favorite-dot ${favorites.has(cell.id) ? "is-on" : ""}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleFavorite(cell.id);
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Yêu thích ${cell.name}`}
                      >
                        <Star size={18} fill="currentColor" />
                      </span>
                    </button>
                  );
                })}
                  </div>
                </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

type StageProps = {
  cell: CellItem;
  activePartId: string;
  viewMode: ViewMode;
  crossSection: boolean;
  autoRotate: boolean;
  hideAnnotations: boolean;
  resetKey: number;
  onCrossSectionChange: (value: boolean) => void;
  onAutoRotateChange: (value: boolean) => void;
  onHideAnnotationsChange: (value: boolean) => void;
  onSelectCell: (id: string) => void;
  onReset: () => void;
};

function Stage({
  cell,
  activePartId,
  viewMode,
  crossSection,
  autoRotate,
  hideAnnotations,
  resetKey,
  onCrossSectionChange,
  onAutoRotateChange,
  onHideAnnotationsChange,
  onSelectCell,
  onReset,
}: StageProps) {
  return (
    <main className="stage-column">
      <section className="stage-panel">
        <div className="stage-title">
          <div>
            <h2>{cell.name}</h2>
            <p>{cell.type}</p>
          </div>

          <div className="view-card">
            <span>Chế độ xem</span>
            <div className="mode-switcher mode-switcher-single">
              <button
                type="button"
                className={crossSection ? "is-active" : ""}
                onClick={() => onCrossSectionChange(!crossSection)}
              >
                Lát cắt
              </button>
            </div>
          </div>
        </div>

        <div className="canvas-wrap">
          <CellScene
            cell={cell}
            activePartId={activePartId}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            hideAnnotations={hideAnnotations}
            resetKey={resetKey}
            onSelectCell={onSelectCell}
          />
        </div>

        <div className="stage-toolbar">
          <button
            type="button"
            className={autoRotate ? "is-active" : ""}
            onClick={() => onAutoRotateChange(!autoRotate)}
          >
            <RotateCcw size={20} />
            Xoay
          </button>
          <button
            type="button"
            className={hideAnnotations ? "is-active" : ""}
            onClick={() => onHideAnnotationsChange(!hideAnnotations)}
          >
            <EyeOff size={20} />
            Ẩn chú thích
          </button>
          <button type="button" onClick={onReset}>
            <RotateCcw size={20} />
            Đặt lại góc nhìn
          </button>
        </div>

        <div className="camera-instructions" aria-label="Hướng dẫn điều khiển camera">
          <span>Chuột phải kéo: di chuyển</span>
          <span>Chuột trái kéo: xoay</span>
          <span>Cuộn chuột: thu phóng</span>
        </div>
      </section>
    </main>
  );
}

function Toast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }
  return <div className="toast">{message}</div>;
}

export default function App() {
  const [selectedCellId, setSelectedCellId] = useState(initialCell.id);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(() => getGradeForCell(initialCell));
  const [viewMode] = useState<ViewMode>("mesh");
  const [crossSection, setCrossSection] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [hideAnnotations, setHideAnnotations] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set([initialCell.id]));
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const selectedCell = useMemo(() => getCellById(selectedCellId), [selectedCellId]);
  const activePartId = selectedCell.defaultFocusId;

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectCell(id: string) {
    const nextCell = getCellById(id);
    setSelectedGrade(getGradeForCell(nextCell));
    setSelectedCellId((currentId) => {
      if (currentId === id) {
        return currentId;
      }

      setResetKey((key) => key + 1);
      return id;
    });
  }

  const shellStyle = {
    "--accent": selectedCell.accent,
    "--accent-soft": selectedCell.accentSoft,
    "--cell-color": selectedCell.color,
  } as CSSProperties;

  return (
    <div className="app-shell" style={shellStyle}>
      <Header cell={selectedCell} />

      <div className="app-grid">
        <Sidebar
          selectedCell={selectedCell}
          selectedGrade={selectedGrade}
          favorites={favorites}
          onSelectCell={selectCell}
          onSelectedGradeChange={setSelectedGrade}
          onToggleFavorite={toggleFavorite}
        />

        <div className="center-stack">
          <Stage
            cell={selectedCell}
            activePartId={activePartId}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            hideAnnotations={hideAnnotations}
            resetKey={resetKey}
            onCrossSectionChange={setCrossSection}
            onAutoRotateChange={setAutoRotate}
            onHideAnnotationsChange={setHideAnnotations}
            onSelectCell={selectCell}
            onReset={() => {
              setResetKey((key) => key + 1);
              showToast("Đã đặt lại góc nhìn.");
            }}
          />
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
