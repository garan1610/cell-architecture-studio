import {
  Box,
  Bug,
  ChevronDown,
  EyeOff,
  Library,
  MousePointer2,
  MoveVertical,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Undo2,
} from "lucide-react";
import { useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { CellScene } from "./components/CellScene";
import {
  classItems,
  getFirstClassWithItems,
  type CellItem,
  type GradeKey,
  type LessonItem,
  type LessonTab,
  type ViewMode,
} from "./data/cells";
import { formatChemicalText } from "./utils/chemicalText";

function Header() {
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-orb" aria-hidden="true">
          <Sparkles size={24} />
        </div>
        <div>
          <h1>Phòng khám phá mô hình 3D</h1>
          <p>Sinh học phổ thông</p>
        </div>
      </div>
    </header>
  );
}

function MiniModel({ model }: { model: CellItem }) {
  const previewUrl = model.renderImage?.url ?? model.modelAsset?.previewUrl;

  if (previewUrl) {
    return (
      <span className="mini-cell has-preview" style={{ "--thumb": model.accent } as CSSProperties}>
        <img src={previewUrl} alt="" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className="mini-cell" style={{ "--thumb": model.accent } as CSSProperties}>
      <span />
      <i />
      <b />
    </span>
  );
}

type RightSidebarProps = {
  selectedGrade: GradeKey;
  selectedItem: LessonItem;
  onGradeChange: (grade: GradeKey) => void;
  onItemChange: (itemId: string) => void;
};

function RightSidebar({
  selectedGrade,
  selectedItem,
  onGradeChange,
  onItemChange,
}: RightSidebarProps) {
  const gradeEntries = Object.entries(classItems) as Array<[GradeKey, (typeof classItems)[GradeKey]]>;
  const activeClass = classItems[selectedGrade];

  return (
    <aside className="right-rail">
      <section className="panel model-picker">
        <div className="panel-heading">
          <span>
            <Box size={18} />
            Tên mô hình
          </span>
          <label className="model-grade-select">
            <select
              value={selectedGrade}
              onChange={(event) => onGradeChange(event.target.value as GradeKey)}
              aria-label="Chọn lớp"
            >
              {gradeEntries.map(([gradeKey, grade]) => (
                <option key={gradeKey} value={gradeKey} disabled={grade.items.length === 0}>
                  {grade.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </label>
        </div>

        <div className="model-list">
          {activeClass.items.length === 0 && (
            <p className="empty-note">Chưa có mô hình demo cho lớp này.</p>
          )}

          {activeClass.items.map((item) => (
            <button
              className={`model-row ${selectedItem.id === item.id ? "is-active" : ""}`}
              type="button"
              key={item.id}
              onClick={() => onItemChange(item.id)}
            >
              <MiniModel model={item.tabs[0].models[0]} />
              <span>
                <strong>{formatChemicalText(item.name)}</strong>
              </span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

type ModelViewportProps = {
  model: CellItem;
  viewMode: ViewMode;
  autoRotate: boolean;
  animationPaused: boolean;
  hideAnnotations: boolean;
  debugPosition: boolean;
  resetKey: number;
  allowDetailOpen: boolean;
  onOpenDetail: (modelId: string) => void;
};

function ModelViewport({
  model,
  viewMode,
  autoRotate,
  animationPaused,
  hideAnnotations,
  debugPosition,
  resetKey,
  allowDetailOpen,
  onOpenDetail,
}: ModelViewportProps) {
  const pointerState = useRef({
    dragged: false,
    startX: 0,
    startY: 0,
  });

  return (
    <article className="model-viewport">
      <div className="model-viewport-title">
        <h3>{formatChemicalText(model.name)}</h3>
      </div>
      <button
        className={`canvas-hit-area${allowDetailOpen ? "" : " is-static"}`}
        type="button"
        onPointerDown={(event) => {
          pointerState.current = {
            dragged: false,
            startX: event.clientX,
            startY: event.clientY,
          };
        }}
        onPointerMove={(event) => {
          const deltaX = event.clientX - pointerState.current.startX;
          const deltaY = event.clientY - pointerState.current.startY;
          if (Math.hypot(deltaX, deltaY) > 6) {
            pointerState.current.dragged = true;
          }
        }}
        onClick={(event) => {
          if (pointerState.current.dragged) {
            event.preventDefault();
            pointerState.current.dragged = false;
            return;
          }

          if (allowDetailOpen) {
            onOpenDetail(model.id);
          }
        }}
        aria-label={`Xem chi tiết ${formatChemicalText(model.name)}`}
      >
        <CellScene
          cell={model}
          activePartId={model.defaultFocusId}
          viewMode={viewMode}
          crossSection={false}
          autoRotate={autoRotate}
          animationPaused={animationPaused}
          hideAnnotations={hideAnnotations}
          debugPosition={debugPosition}
          resetKey={resetKey}
          onSelectCell={() => undefined}
        />
      </button>
    </article>
  );
}

type StageProps = {
  item: LessonItem;
  tab: LessonTab;
  detailModel: CellItem | null;
  viewMode: ViewMode;
  autoRotate: boolean;
  animationPaused: boolean;
  hideAnnotations: boolean;
  debugPosition: boolean;
  renderHeight: number | null;
  resetKey: number;
  onAutoRotateChange: (value: boolean) => void;
  onAnimationPausedChange: (value: boolean) => void;
  onHideAnnotationsChange: (value: boolean) => void;
  onDebugPositionChange: (value: boolean) => void;
  onRenderHeightChange: (value: number) => void;
  onOpenDetail: (modelId: string) => void;
  onCloseDetail: () => void;
  onReset: () => void;
};

function Stage({
  item,
  tab,
  detailModel,
  viewMode,
  autoRotate,
  animationPaused,
  hideAnnotations,
  debugPosition,
  renderHeight,
  resetKey,
  onAutoRotateChange,
  onAnimationPausedChange,
  onHideAnnotationsChange,
  onDebugPositionChange,
  onRenderHeightChange,
  onOpenDetail,
  onCloseDetail,
  onReset,
}: StageProps) {
  const visibleModels = detailModel ? [detailModel] : tab.models;
  const allowDetailOpen = !detailModel && tab.models.length > 1;
  const gridClass = `model-grid model-count-${Math.min(visibleModels.length, 3)}`;
  const resizeState = useRef({
    startY: 0,
    startHeight: renderHeight ?? 342,
  });

  function startRenderResize(event: PointerEvent<HTMLButtonElement>) {
    const currentGridHeight =
      event.currentTarget.previousElementSibling instanceof HTMLElement
        ? event.currentTarget.previousElementSibling.getBoundingClientRect().height
        : (renderHeight ?? 342);

    resizeState.current = {
      startY: event.clientY,
      startHeight: currentGridHeight,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function resizeRender(event: PointerEvent<HTMLButtonElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const deltaY = event.clientY - resizeState.current.startY;
    const nextHeight = Math.max(180, Math.min(1100, resizeState.current.startHeight + deltaY));
    onRenderHeightChange(Math.round(nextHeight));
  }

  return (
    <section className={`stage-panel${renderHeight === null ? "" : " is-manual-height"}`}>
      <div className="stage-title">
        <div>
          <h2>{formatChemicalText(item.name)}</h2>
          <p>{formatChemicalText(detailModel ? detailModel.type : tab.title)}</p>
        </div>

        {detailModel && (
          <button className="return-button" type="button" onClick={onCloseDetail}>
            <Undo2 size={18} />
            Trở lại
          </button>
        )}
      </div>

      <div
        className={gridClass}
        style={
          renderHeight === null
            ? undefined
            : ({ "--render-height": `${renderHeight}px` } as CSSProperties)
        }
      >
        {visibleModels.length > 0 ? (
          visibleModels.map((model) => (
            <ModelViewport
              key={model.id}
              model={model}
              viewMode={viewMode}
              autoRotate={autoRotate}
              animationPaused={animationPaused}
              hideAnnotations={hideAnnotations}
              debugPosition={debugPosition}
              resetKey={resetKey}
              allowDetailOpen={allowDetailOpen}
              onOpenDetail={onOpenDetail}
            />
          ))
        ) : (
          <div className="empty-stage">
            <Library size={36} />
            <strong>Tab đang chờ mô hình 3D</strong>
            <span>Dữ liệu chữ đã được đặt sẵn để bổ sung asset ở bước sau.</span>
          </div>
        )}
      </div>

      <button
        type="button"
        className="render-resize-handle"
        aria-label="Thay đổi chiều cao khung render"
        title="Kéo để thay đổi chiều cao khung render"
        onPointerDown={startRenderResize}
        onPointerMove={resizeRender}
      >
        <MoveVertical size={17} aria-hidden="true" />
      </button>

      <div className="stage-utility-row">
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
            className={animationPaused ? "is-active" : ""}
            onClick={() => onAnimationPausedChange(!animationPaused)}
          >
            {animationPaused ? <Play size={20} /> : <Pause size={20} />}
            {animationPaused ? "Tiếp tục" : "Tạm dừng"}
          </button>
          <button
            type="button"
            className={hideAnnotations ? "is-active" : ""}
            onClick={() => onHideAnnotationsChange(!hideAnnotations)}
          >
            <EyeOff size={20} />
            Ẩn chú thích
          </button>
          <button
            type="button"
            className={debugPosition ? "is-active" : ""}
            onClick={() => onDebugPositionChange(!debugPosition)}
          >
            <Bug size={20} />
            Debug vị trí
          </button>
          <button type="button" onClick={onReset}>
            <RotateCcw size={20} />
            Đặt lại góc nhìn
          </button>
        </div>

        <div className="camera-instructions" aria-label="Hướng dẫn điều khiển camera">
          <span>
            <MousePointer2 size={17} />
            Chuột trái kéo: xoay
          </span>
          <span>Chuột phải kéo: di chuyển</span>
          <span>Cuộn chuột: thu phóng</span>
        </div>
      </div>
    </section>
  );
}

type InfoPanelProps = {
  tab: LessonTab;
  detailModel: CellItem | null;
};

function InfoPanel({ tab, detailModel }: InfoPanelProps) {
  const infoModel = detailModel ?? (tab.models.length === 1 ? tab.models[0] : null);
  const annotations = infoModel?.annotations;

  return (
    <section className="info-panel" aria-live="polite">
      <div>
        <p>{formatChemicalText(infoModel?.description ?? tab.mainText)}</p>
        {infoModel && annotations && annotations.length > 0 && (
          <div className="info-annotations" aria-label="Danh sách chú thích">
            {annotations.map((annotation, index) => (
              <span className="info-annotation-item" key={`${annotation.id}-${index}`}>
                <strong>{annotation.number ?? ""}.</strong>
                {formatChemicalText(annotation.label)}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type TabStripProps = {
  tabs: LessonTab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
};

function TabStrip({ tabs, activeTabId, onTabChange }: TabStripProps) {
  return (
    <nav className="tab-strip" aria-label="Danh sách tab mô hình">
      {tabs.map((tab, index) => (
        <button
          type="button"
          className={activeTabId === tab.id ? "is-active" : ""}
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          <span>Tab {index + 1}</span>
          <strong>{formatChemicalText(tab.title)}</strong>
        </button>
      ))}
    </nav>
  );
}

function Toast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return <div className="toast">{message}</div>;
}

export default function App() {
  const initialGrade = getFirstClassWithItems();
  const [selectedGrade, setSelectedGrade] = useState<GradeKey>(initialGrade);
  const [selectedItemId, setSelectedItemId] = useState(classItems[initialGrade].items[0].id);
  const [selectedTabId, setSelectedTabId] = useState(classItems[initialGrade].items[0].tabs[0].id);
  const [detailModelId, setDetailModelId] = useState<string | null>(null);
  const [viewMode] = useState<ViewMode>("mesh");
  const [autoRotate, setAutoRotate] = useState(false);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [hideAnnotations, setHideAnnotations] = useState(false);
  const [debugPosition, setDebugPosition] = useState(false);
  const [renderHeight, setRenderHeight] = useState<number | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const selectedItem = useMemo(() => {
    const activeClass = classItems[selectedGrade];
    return activeClass.items.find((item) => item.id === selectedItemId) ?? activeClass.items[0];
  }, [selectedGrade, selectedItemId]);

  const activeTab = useMemo(
    () => selectedItem.tabs.find((tab) => tab.id === selectedTabId) ?? selectedItem.tabs[0],
    [selectedItem, selectedTabId],
  );

  const detailModel = useMemo(
    () => activeTab.models.find((model) => model.id === detailModelId) ?? null,
    [activeTab, detailModelId],
  );

  const accentModel = detailModel ?? activeTab.models[0] ?? selectedItem.tabs[0].models[0];
  const shellStyle = {
    "--accent": accentModel.accent,
    "--accent-soft": accentModel.accentSoft,
    "--cell-color": accentModel.color,
  } as CSSProperties;

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) {
      window.clearTimeout(toastTimer.current);
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }

  function changeGrade(grade: GradeKey) {
    const nextClass = classItems[grade];
    if (nextClass.items.length === 0) {
      return;
    }
    setSelectedGrade(grade);
    setSelectedItemId(nextClass.items[0].id);
    setSelectedTabId(nextClass.items[0].tabs[0].id);
    setDetailModelId(null);
    setResetKey((key) => key + 1);
  }

  function changeItem(itemId: string) {
    const item = classItems[selectedGrade].items.find((candidate) => candidate.id === itemId);
    if (!item) {
      return;
    }
    setSelectedItemId(item.id);
    setSelectedTabId(item.tabs[0].id);
    setDetailModelId(null);
    setResetKey((key) => key + 1);
  }

  function changeTab(tabId: string) {
    setSelectedTabId(tabId);
    setDetailModelId(null);
    setResetKey((key) => key + 1);
  }

  return (
    <div className="app-shell" style={shellStyle}>
      <Header />

      <div className="app-grid">
        <RightSidebar
          selectedGrade={selectedGrade}
          selectedItem={selectedItem}
          onGradeChange={changeGrade}
          onItemChange={changeItem}
        />

        <main className="center-stack">
          <Stage
            item={selectedItem}
            tab={activeTab}
            detailModel={detailModel}
            viewMode={viewMode}
            autoRotate={autoRotate}
            animationPaused={animationPaused}
            hideAnnotations={hideAnnotations}
            debugPosition={debugPosition}
            renderHeight={renderHeight}
            resetKey={resetKey}
            onAutoRotateChange={setAutoRotate}
            onAnimationPausedChange={setAnimationPaused}
            onHideAnnotationsChange={setHideAnnotations}
            onDebugPositionChange={setDebugPosition}
            onRenderHeightChange={setRenderHeight}
            onOpenDetail={(modelId) => {
              if (detailModelId === modelId) {
                return;
              }

              setDetailModelId(modelId);
              setResetKey((key) => key + 1);
            }}
            onCloseDetail={() => {
              setDetailModelId(null);
              setResetKey((key) => key + 1);
            }}
            onReset={() => {
              setResetKey((key) => key + 1);
              showToast("Đã đặt lại góc nhìn.");
            }}
          />

          <InfoPanel tab={activeTab} detailModel={detailModel} />

          <TabStrip tabs={selectedItem.tabs} activeTabId={activeTab.id} onTabChange={changeTab} />
        </main>
      </div>

      <Toast message={toast} />
    </div>
  );
}
