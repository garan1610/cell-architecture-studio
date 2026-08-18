import { Canvas, useFrame } from "@react-three/fiber";
import {
  CameraControls,
  Center,
  ContactShadows,
  Environment,
  Html,
  Lightformer,
  RoundedBox,
  useAnimations,
  useGLTF,
  useProgress,
  type CameraControls as CameraControlsApi,
} from "@react-three/drei";
import { Copy, Link2 } from "lucide-react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  Color,
  CatmullRomCurve3,
  Box3,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  type Material,
  type MeshStandardMaterialParameters,
} from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { CellItem, CellModelAsset, ModelAnnotation, ModelLink, ViewMode } from "../data/cells";
import { formatChemicalText } from "../utils/chemicalText";

type CellSceneProps = {
  cell: CellItem;
  activePartId: string;
  viewMode: ViewMode;
  crossSection: boolean;
  autoRotate: boolean;
  animationPaused: boolean;
  hideAnnotations: boolean;
  debugPosition: boolean;
  resetKey: number;
  onSelectCell: (id: string) => void;
};

type MaterialProps = {
  id: string;
  activePartId: string;
  viewMode: ViewMode;
  color: string;
  opacity?: number;
  roughness?: number;
  metalness?: number;
};

function CellMaterial({
  id,
  activePartId,
  viewMode,
  color,
  opacity = 1,
  roughness = 0.66,
  metalness = 0.03,
}: MaterialProps) {
  const active = id === activePartId;
  const dimmed = viewMode === "focus" && !active;
  const material: MeshStandardMaterialParameters = {
    color,
    roughness,
    metalness,
    transparent: opacity < 1 || dimmed,
    opacity: dimmed ? Math.min(opacity, 0.18) : opacity,
    emissive: active ? color : "#000000",
    emissiveIntensity: active ? 0.34 : 0,
  };

  return <meshStandardMaterial {...material} />;
}

type TubeProps = {
  id: string;
  color: string;
  points: Array<[number, number, number]>;
  radius?: number;
  activePartId: string;
  viewMode: ViewMode;
};

function CurveTube({
  id,
  color,
  points,
  radius = 0.035,
  activePartId,
  viewMode,
}: TubeProps) {
  const geometry = useMemo(() => {
    const curve = new CatmullRomCurve3(
      points.map((point) => new Vector3(point[0], point[1], point[2])),
    );
    return new TubeGeometry(curve, 80, radius, 12, false);
  }, [points, radius]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <CellMaterial
        id={id}
        activePartId={activePartId}
        viewMode={viewMode}
        color={color}
        roughness={0.58}
      />
    </mesh>
  );
}

type CommonModelProps = {
  activePartId: string;
  viewMode: ViewMode;
  crossSection: boolean;
};

type DebugReadout = {
  cursor: [number, number, number] | null;
  camera: [number, number, number] | null;
};

const formatVector = (value: [number, number, number] | null) =>
  value ? value.map((coordinate) => coordinate.toFixed(3)).join(", ") : "--";

const formatCopyVector = (value: [number, number, number]) =>
  value.map((coordinate) => coordinate.toFixed(3)).join(", ");

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

function DebugCopyButton({
  label,
  value,
}: {
  label: string;
  value: [number, number, number] | null;
}) {
  return (
    <button
      type="button"
      className="debug-copy-button"
      disabled={!value}
      aria-label={`Copy ${label}`}
      title={value ? `Copy ${formatCopyVector(value)}` : "No coordinate to copy"}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        if (!value) {
          return;
        }
        void navigator.clipboard?.writeText(formatCopyVector(value));
      }}
    >
      <Copy size={12} />
    </button>
  );
}

function DebugPositionProbe({
  onChange,
}: {
  onChange: (readout: DebugReadout) => void;
}) {
  const lastUpdate = useRef(0);

  function findAnnotationSpace(object: Object3D) {
    let current: Object3D | null = object;
    while (current) {
      if (current.userData?.annotationSpace) {
        return current.parent ?? current;
      }
      current = current.parent;
    }
    return null;
  }

  function findSceneAnnotationSpace(scene: Object3D) {
    let annotationSpace: Object3D | null = null;
    scene.traverse((object) => {
      if (!annotationSpace && object.userData?.annotationSpace) {
        annotationSpace = object.parent ?? object;
      }
    });
    return annotationSpace;
  }

  function isDebugHelper(object: Object3D) {
    let current: Object3D | null = object;
    while (current) {
      if (current.userData?.debugHelper) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  useFrame(({ camera, clock, pointer, raycaster, scene }) => {
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastUpdate.current < 0.08) {
      return;
    }
    lastUpdate.current = elapsed;

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster
      .intersectObjects(scene.children, true)
      .find((intersection) => !isDebugHelper(intersection.object));
    const annotationSpace = hit ? findAnnotationSpace(hit.object) : findSceneAnnotationSpace(scene);
    const cursorPoint = hit && annotationSpace ? annotationSpace.worldToLocal(hit.point.clone()) : null;
    const cameraPoint = annotationSpace ? annotationSpace.worldToLocal(camera.position.clone()) : null;

    onChange({
      cursor: cursorPoint ? [cursorPoint.x, cursorPoint.y, cursorPoint.z] : null,
      camera: cameraPoint ? [cameraPoint.x, cameraPoint.y, cameraPoint.z] : null,
    });
  });

  return (
    <group userData={{ debugHelper: true }}>
      <gridHelper args={[6, 12, "#64748b", "#cbd5e1"]} position={[0, -1.82, 0]} />
      <axesHelper args={[1.6]} />
    </group>
  );
}

function applyAssetVertexColors(mesh: Mesh, cell: CellItem) {
  const geometry = mesh.geometry;
  const position = geometry.getAttribute("position");
  if (!position) {
    return;
  }

  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) {
    return;
  }

  const sizeX = Math.max(box.max.x - box.min.x, 0.001);
  const sizeY = Math.max(box.max.y - box.min.y, 0.001);
  const sizeZ = Math.max(box.max.z - box.min.z, 0.001);
  const palette = [
    new Color(cell.color),
    new Color(cell.accent),
  ];
  const highlight = new Color("#fff4d8");
  const shadow = new Color("#3d4a72");
  const colors: number[] = [];

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const nx = (x - box.min.x) / sizeX;
    const ny = (y - box.min.y) / sizeY;
    const nz = (z - box.min.z) / sizeZ;
    const flow = Math.sin(nx * 11.6 + ny * 4.8) + Math.cos(ny * 9.4 + nz * 7.2);
    const paletteIndex = Math.abs(Math.floor((flow + nx * 3.2 + ny * 2.6) * palette.length)) % palette.length;
    const color = new Color(cell.color).lerp(palette[paletteIndex], 0.48);
    color.lerp(highlight, Math.max(0, nz - 0.24) * 0.22);
    color.lerp(shadow, Math.max(0, 0.32 - nz) * 0.12);
    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
}

function createAssetMaterial({
  original,
  cell,
  meshIndex,
  viewMode,
  crossSection,
}: {
  original: Mesh["material"];
  cell: CellItem;
  meshIndex: number;
  viewMode: ViewMode;
  crossSection: boolean;
}) {
  const source = Array.isArray(original) ? original[0] : original;
  const sourceMaterial = source as Partial<MeshStandardMaterial>;
  const material = new MeshStandardMaterial({
    color: "#ffffff",
    map: sourceMaterial.map ?? null,
    normalMap: sourceMaterial.normalMap ?? null,
    roughnessMap: sourceMaterial.roughnessMap ?? null,
    metalnessMap: sourceMaterial.metalnessMap ?? null,
    side: DoubleSide,
    vertexColors: true,
    transparent: crossSection || viewMode === "focus" || sourceMaterial.transparent,
    opacity: crossSection ? 0.92 : viewMode === "focus" ? 0.95 : sourceMaterial.opacity ?? 1,
    roughness: Math.min(0.82, sourceMaterial.roughness ?? 0.46),
    metalness: Math.min(0.12, sourceMaterial.metalness ?? 0.03),
    emissive: new Color(cell.accent).lerp(new Color("#ffffff"), 0.58),
    emissiveIntensity: viewMode === "focus" ? 0.045 : 0.016,
  });

  material.envMapIntensity = 0.75 * (cell.modelAsset?.exposure ?? 1);
  material.needsUpdate = true;
  return material;
}

function createNativeAssetMaterial({
  original,
  asset,
  crossSection,
}: {
  original: Mesh["material"];
  asset: CellModelAsset;
  crossSection: boolean;
}) {
  const cloneMaterial = (source: Material) => {
    const material = source.clone();
    material.side = DoubleSide;
    if (crossSection) {
      material.transparent = true;
      material.opacity = Math.min(material.opacity, 0.86);
    } else if (asset.transparent !== undefined) {
      material.transparent = asset.transparent;
      if (!asset.transparent) {
        material.opacity = 1;
        material.depthWrite = true;
      }
    }

    if (material instanceof MeshStandardMaterial) {
      const displayMap = material.map ?? null;
      const materialColorOverride = asset.materialColorOverrides?.[material.name];
      const materialOpacityOverride = asset.materialOpacityOverrides?.[material.name];
      if (displayMap) {
        displayMap.anisotropy = 8;
        displayMap.needsUpdate = true;
      }
      material.vertexColors = asset.preserveNativeColor ? material.vertexColors : false;
      material.emissive.set("#000000");
      material.emissiveMap = null;
      material.emissiveIntensity = 0;
      material.envMapIntensity = 0.95 * (asset.exposure ?? 1);
      if (materialColorOverride) {
        material.color.set(materialColorOverride);
      } else if (!asset.preserveNativeColor) {
        material.color.setRGB(1.04, 1.035, 1.02);
      }
      if (materialOpacityOverride !== undefined) {
        material.transparent = materialOpacityOverride < 1 || material.transparent;
        material.opacity = materialOpacityOverride;
      }
    }

    material.needsUpdate = true;
    return material;
  };

  return Array.isArray(original) ? original.map(cloneMaterial) : cloneMaterial(original);
}

function createOriginalAssetMaterial({
  original,
  materialOverride,
}: {
  original: Mesh["material"];
  materialOverride: NonNullable<CellModelAsset["meshMaterialOverrides"]>[string];
}) {
  const cloneMaterial = (source: Material) => {
    const material = source.clone();

    if (materialOverride.transparent !== undefined) {
      material.transparent = materialOverride.transparent;
    }
    if (materialOverride.opacity !== undefined) {
      material.opacity = materialOverride.opacity;
    }
    if (materialOverride.depthWrite !== undefined) {
      material.depthWrite = materialOverride.depthWrite;
    }
    if (material instanceof MeshStandardMaterial && materialOverride.transparent === false) {
      material.alphaTest = 0;
    }

    material.needsUpdate = true;
    return material;
  };

  return Array.isArray(original) ? original.map(cloneMaterial) : cloneMaterial(original);
}

function getMeshMaterialOverride(mesh: Mesh, asset: CellModelAsset) {
  return asset.meshMaterialOverrides?.[mesh.name];
}

function NativeStudioEnvironment() {
  return (
    <Environment resolution={256}>
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#fffdf8"
        position={[0, 5, -4]}
        rotation-x={Math.PI / 2}
        scale={[8, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.8}
        color="#dcecff"
        position={[-5, 1, 2]}
        rotation-y={Math.PI / 2}
        scale={[5, 5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.4}
        color="#ffe9cf"
        position={[5, -1, 1]}
        rotation-y={-Math.PI / 2}
        scale={[4, 4, 1]}
      />
    </Environment>
  );
}

function ModelAnnotationDot({
  annotation,
  open,
  onToggle,
}: {
  annotation: ModelAnnotation;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`model-annotation-ui${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="model-annotation-dot"
        aria-label={`${open ? "Ẩn" : "Hiện"} ${formatChemicalText(annotation.label)}`}
        aria-expanded={open}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
      >
        {annotation.number}
      </button>
      {open && (
        <div className="model-annotation-card">
          <strong>{formatChemicalText(annotation.label)}</strong>
          {annotation.description && <p>{formatChemicalText(annotation.description)}</p>}
          {annotation.image && (
            <img
              src={annotation.image.url}
              alt={annotation.image.alt ?? ""}
              loading="lazy"
            />
          )}
        </div>
      )}
    </div>
  );
}

function ModelLinkDot({
  link,
  onSelectCell,
}: {
  link: ModelLink;
  onSelectCell: (id: string) => void;
}) {
  return (
    <div className="model-annotation-ui model-link-ui">
      <button
        type="button"
        className="model-annotation-dot model-link-dot"
        aria-label={link.label}
        title={link.label}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onSelectCell(link.targetCellId);
        }}
      >
        <Link2 size={4} strokeWidth={3} aria-hidden="true" />
      </button>
    </div>
  );
}

const CLOSED_ANNOTATION_Z_INDEX_RANGE: [number, number] = [16777271, 0];
const OPEN_ANNOTATION_Z_INDEX_RANGE: [number, number] = [30000000, 30000000];

function AssetCellModel({
  cell,
  asset,
  viewMode,
  crossSection,
  animationPaused,
  hideAnnotations,
  onSelectCell,
}: CommonModelProps & {
  cell: CellItem;
  asset: CellModelAsset;
  animationPaused: boolean;
  hideAnnotations: boolean;
  onSelectCell: (id: string) => void;
}) {
  const { scene, animations } = useGLTF(asset.url);
  const modelGroup = useRef<Group>(null);
  const { actions } = useAnimations(animations, modelGroup);
  const animationEnabled = asset.animation ?? true;
  const [openAnnotationKey, setOpenAnnotationKey] = useState<string | null>(null);
  const annotations = cell.annotations ?? asset.annotations;
  const modelLinks = cell.modelLinks;
  const clonedScene = useMemo(() => {
    const clone = cloneSkeleton(scene);
    clone.userData.annotationSpace = true;
    let meshIndex = 0;

    clone.traverse((node) => {
      const mesh = node as Mesh;
      if (!mesh.isMesh) {
        return;
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (asset.materialMode === "native") {
        mesh.material = createNativeAssetMaterial({
          original: mesh.material,
          asset,
          crossSection,
        });
      } else if (asset.materialMode === "original") {
        const materialOverride = getMeshMaterialOverride(mesh, asset);
        if (materialOverride) {
          if (materialOverride.renderOrder !== undefined) {
            mesh.renderOrder = materialOverride.renderOrder;
          }
          mesh.material = createOriginalAssetMaterial({
            original: mesh.material,
            materialOverride,
          });
        }
      } else {
        mesh.geometry.computeVertexNormals();
        applyAssetVertexColors(mesh, cell);
        mesh.material = createAssetMaterial({
          original: mesh.material,
          cell,
          meshIndex,
          viewMode,
          crossSection,
        });
      }
      meshIndex += 1;
    });

    if (asset.autoFit) {
      clone.updateMatrixWorld(true);
      const bounds = new Box3().setFromObject(clone);
      const size = bounds.getSize(new Vector3());
      const center = bounds.getCenter(new Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const normalizedScale = maxDimension > 0 ? 3.2 / maxDimension : 1;

      clone.scale.setScalar(normalizedScale);
      clone.position.set(
        -center.x * normalizedScale,
        -center.y * normalizedScale,
        -center.z * normalizedScale,
      );
    }

    return clone;
  }, [asset, cell, scene, viewMode, crossSection]);

  useEffect(() => {
    const activeActions = Object.values(actions).filter((action) => action !== null);
    if (!animationEnabled) {
      activeActions.forEach((action) => {
        action.stop().reset();
        action.enabled = false;
      });
      return () => undefined;
    }

    activeActions.forEach((action) => {
      action.enabled = true;
      action.reset().fadeIn(0.2).play();
    });

    return () => {
      activeActions.forEach((action) => action.fadeOut(0.15).stop());
    };
  }, [actions, animationEnabled]);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (action) {
        action.paused = animationEnabled ? animationPaused : true;
        action.enabled = animationEnabled;
      }
    });
  }, [actions, animationEnabled, animationPaused]);

  return (
    <group
      ref={modelGroup}
      position={asset.position ?? [0, 0, 0]}
      rotation={asset.rotation ?? [0, 0, 0]}
      scale={[asset.scale, asset.scale, asset.scale]}
    >
      <Center>
        <primitive object={clonedScene} />
        {!asset.autoFit && !hideAnnotations && annotations?.map((annotation, index) => {
          const annotationKey = `${annotation.id}-${index}`;
          const isOpen = openAnnotationKey === annotationKey;
          return (
            <Html
              key={annotationKey}
              position={annotation.position}
              center
              className="model-annotation"
              zIndexRange={isOpen ? OPEN_ANNOTATION_Z_INDEX_RANGE : CLOSED_ANNOTATION_Z_INDEX_RANGE}
            >
              <ModelAnnotationDot
                annotation={annotation}
                open={isOpen}
                onToggle={() =>
                  setOpenAnnotationKey((currentKey) => (currentKey === annotationKey ? null : annotationKey))
                }
              />
            </Html>
          );
        })}
        {!asset.autoFit && !hideAnnotations && modelLinks?.map((link) => (
          <Html
            key={link.id}
            position={link.position}
            center
            className="model-annotation"
          >
            <ModelLinkDot link={link} onSelectCell={onSelectCell} />
          </Html>
        ))}
      </Center>
    </group>
  );
}

function Dots({
  id,
  color,
  activePartId,
  viewMode,
  count,
  spread,
}: CommonModelProps & {
  id: string;
  color: string;
  count: number;
  spread: [number, number, number];
}) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const a = index * 1.71;
        const b = index * 2.37;
        return [
          Math.sin(a) * spread[0],
          Math.cos(b) * spread[1],
          Math.sin(a + b) * spread[2],
        ] as [number, number, number];
      }),
    [count, spread],
  );

  return (
    <>
      {dots.map((position, index) => (
        <mesh key={`${id}-${index}`} position={position} castShadow>
          <sphereGeometry args={[0.055 + (index % 3) * 0.018, 18, 18]} />
          <CellMaterial
            id={id}
            activePartId={activePartId}
            viewMode={viewMode}
            color={color}
            opacity={0.92}
          />
        </mesh>
      ))}
    </>
  );
}

function Nucleus({
  id = "nucleus",
  position,
  scale,
  activePartId,
  viewMode,
  color = "#7047a8",
}: CommonModelProps & {
  id?: string;
  position: [number, number, number];
  scale: [number, number, number];
  color?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 48, 48]} />
        <CellMaterial
          id={id}
          activePartId={activePartId}
          viewMode={viewMode}
          color={color}
          opacity={0.92}
          roughness={0.44}
        />
      </mesh>
      <mesh position={[0.2, 0.16, 0.38]} castShadow>
        <sphereGeometry args={[0.23, 28, 28]} />
        <CellMaterial
          id={id}
          activePartId={activePartId}
          viewMode={viewMode}
          color="#b56ad8"
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

function Mitochondrion({
  id = "mitochondrion",
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  activePartId,
  viewMode,
}: CommonModelProps & {
  id?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.16, 0.46, 10, 24]} />
        <CellMaterial
          id={id}
          activePartId={activePartId}
          viewMode={viewMode}
          color="#cf7042"
        />
      </mesh>
      {[0, 1, 2].map((item) => (
        <mesh key={item} position={[0, -0.18 + item * 0.18, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.012, 8, 18]} />
          <CellMaterial
            id={id}
            activePartId={activePartId}
            viewMode={viewMode}
            color="#f0b074"
          />
        </mesh>
      ))}
    </group>
  );
}


function CellModel({
  cell,
  activePartId,
  viewMode,
  crossSection,
  autoRotate,
  animationPaused,
  hideAnnotations,
  onSelectCell,
}: Omit<CellSceneProps, "debugPosition" | "resetKey">) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current && autoRotate) {
      group.current.rotation.y += delta * 0.1;
    }
  });

  const common = { activePartId, viewMode, crossSection };

  return (
    <group ref={group} position={[0, 0, 0]}>
      {cell.modelAsset ? (
        <AssetCellModel
          key={cell.modelAsset.url}
          cell={cell}
          asset={cell.modelAsset}
          animationPaused={animationPaused}
          hideAnnotations={hideAnnotations}
          onSelectCell={onSelectCell}
          {...common}
        />
      ) : (
        null
      )}
    </group>
  );
}

function ModelLoadingOverlay({ cell }: { cell: CellItem }) {
  const { progress } = useProgress();
  const displayProgress = Math.max(8, Math.min(100, Math.round(progress)));

  return (
    <Html center className="model-loader">
      <div>
        <span>Đang tải mẫu 3D</span>
        <strong>{formatChemicalText(cell.name)}</strong>
        <i>
          <b style={{ width: `${displayProgress}%` }} />
        </i>
        <em>{displayProgress}%</em>
      </div>
    </Html>
  );
}

function ResettableCameraControls({ resetToken, cameraZoom = 5.5 }: { resetToken: string; cameraZoom?: number }) {
  const controls = useRef<CameraControlsApi>(null);

  useEffect(() => {
    void controls.current?.setLookAt(0, 0, cameraZoom, 0, 0, 0, false);
  }, [resetToken, cameraZoom]);

  return (
    <CameraControls
      ref={controls}
      makeDefault
      draggingSmoothTime={0.08}
      minDistance={0}
      maxDistance={Infinity}
      minZoom={0}
      maxZoom={Infinity}
      dollySpeed={0.72} // Zoom sensitivity
      truckSpeed={1.25}
      azimuthRotateSpeed={0.9}
      polarRotateSpeed={0.9}
    />
  );
}

export function CellScene({
  cell,
  activePartId,
  viewMode,
  crossSection,
  autoRotate,
  animationPaused,
  hideAnnotations,
  debugPosition,
  resetKey,
  onSelectCell,
}: CellSceneProps) {
  const nativeMaterial = cell.modelAsset?.materialMode === "native";
  const nativeColorFilter = nativeMaterial && cell.modelAsset?.preserveNativeColor === true;
  const modelKey = cell.modelAsset?.url ?? cell.id;
  const canvasKey = `${modelKey}-${resetKey}`;
  const [debugReadout, setDebugReadout] = useState<DebugReadout>({
    cursor: null,
    camera: null,
  });
  const latestCursorCoordinate = useRef<DebugReadout["cursor"]>(null);

  useEffect(() => {
    latestCursorCoordinate.current = debugReadout.cursor;
  }, [debugReadout.cursor]);

  useEffect(() => {
    if (!debugPosition) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key.toLowerCase() !== "c" ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditableTarget(event.target)
      ) {
        return;
      }

      const cursorCoordinate = latestCursorCoordinate.current;
      if (!cursorCoordinate) {
        return;
      }

      event.preventDefault();
      void navigator.clipboard?.writeText(formatCopyVector(cursorCoordinate));
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [debugPosition]);

  return (
    <div className="cell-canvas-shell">
      {debugPosition && (
        <div className="debug-readout" aria-live="polite">
          <span>Cursor Annotation XYZ</span>
          <strong>{formatVector(debugReadout.cursor)}</strong>
          <DebugCopyButton label="cursor annotation coordinate" value={debugReadout.cursor} />
          <span>Camera Annotation XYZ</span>
          <strong>{formatVector(debugReadout.camera)}</strong>
          <DebugCopyButton label="camera annotation coordinate" value={debugReadout.camera} />
        </div>
      )}
      <Canvas
        key={canvasKey}
        className={`cell-canvas${nativeColorFilter ? " is-native-color-asset" : ""}`}
        dpr={[1, 2]}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          outputColorSpace: SRGBColorSpace,
          toneMapping: ACESFilmicToneMapping,
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = nativeMaterial ? 1.35 : 1;
        }}
        camera={{ position: [0, 0, cell.modelAsset?.cameraZoom ?? 5.5], fov: 38 }}
      >
        {!nativeMaterial && <color attach="background" args={["#fbf7ee"]} />}
        {nativeMaterial && <NativeStudioEnvironment />}
        <ambientLight intensity={nativeMaterial ? 0.32 : 1.28} />
        <hemisphereLight
          args={[
            nativeMaterial ? "#f5f8ff" : "#fff8ea",
            nativeMaterial ? "#574f48" : "#e3ded2",
            nativeMaterial ? 0.48 : 1.18,
          ]}
        />
        <directionalLight
          position={[4.2, 5.2, 5.8]}
          intensity={nativeMaterial ? 2.1 : 2.75}
          castShadow
        />
        {nativeMaterial && (
          <directionalLight
            position={[-4.4, 2.2, 3.6]}
            intensity={0.42}
            color="#dcecff"
          />
        )}
        <spotLight
          position={[-3.6, 3.2, 4.6]}
          angle={0.42}
          penumbra={0.74}
          intensity={nativeMaterial ? 0.32 : 1.45}
          color={nativeMaterial ? "#ffe9cf" : cell.accentSoft}
        />
        <pointLight
          position={[2.8, -1.2, 3.2]}
          intensity={nativeMaterial ? 0.18 : 0.6}
          color={nativeMaterial ? "#ffffff" : cell.accent}
        />
        <Suspense key={modelKey} fallback={<ModelLoadingOverlay cell={cell} />}>
          <CellModel
            key={modelKey}
            cell={cell}
            activePartId={activePartId}
            viewMode={viewMode}
            crossSection={crossSection}
            autoRotate={autoRotate}
            animationPaused={animationPaused}
            hideAnnotations={hideAnnotations}
            onSelectCell={onSelectCell}
          />
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={nativeMaterial ? 0.18 : 0.26}
            scale={nativeMaterial ? 7.8 : 7.2}
            blur={nativeMaterial ? 3.2 : 2.4}
            far={4.2}
          />
          <ResettableCameraControls resetToken={canvasKey} cameraZoom={cell.modelAsset?.cameraZoom} />
        </Suspense>
        {debugPosition && <DebugPositionProbe onChange={setDebugReadout} />}
      </Canvas>
    </div>
  );
}
