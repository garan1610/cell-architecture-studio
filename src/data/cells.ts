import { lop10Modules } from "./lop10";
import { lop11Modules } from "./lop11";
import { lop12Modules } from "./lop12";

export type ViewMode = "mesh" | "focus";

export type ModelAnnotation = {
  id: string;
  number: number | string;
  label: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
  };
  position: [number, number, number];
};

export type ModelLink = {
  id: string;
  label: string;
  targetCellId: string;
  position: [number, number, number];
};

export type CellModelAsset = {
  url: string;
  previewUrl?: string;
  scale: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  annotations?: ModelAnnotation[];
  exposure?: number;
  animation?: boolean;
  materialMode?: "studio" | "native" | "original";
  preserveNativeColor?: boolean;
  transparent?: boolean;
  meshMaterialOverrides?: Record<
    string,
    {
      transparent?: boolean;
      opacity?: number;
      depthWrite?: boolean;
      renderOrder?: number;
    }
  >;
  materialColorOverrides?: Record<string, string>;
  materialOpacityOverrides?: Record<string, number>;
  /** Camera distance from model. Lower = zoomed in, higher = zoomed out. Default: 5.5 */
  cameraZoom?: number;
  autoFit?: boolean;
};

export type CellRenderImage = {
  url: string;
};

export type CellItem = {
  id: string;
  name: string;
  type: string;
  description?: string;
  accent: string;
  accentSoft: string;
  color: string;
  defaultFocusId: string;
  annotations?: ModelAnnotation[];
  modelLinks?: ModelLink[];
  modelAsset?: CellModelAsset;
  renderImage?: CellRenderImage;
};

export type LessonTab = {
  id: string;
  title: string;
  mainText: string;
  sourceLinks?: string[];
  models: CellItem[];
};

export type LessonItem = {
  id: string;
  name: string;
  overviewText: string;
  tabs: LessonTab[];
};

export type GradeKey = "lop10" | "lop11" | "lop12" | "khac";

function slugFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/\.glb$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function createKhacItems(): LessonItem[] {
  return publicModelFilesByCreationDate.map((fileName, index) => {
      const palette = khacPalette[index % khacPalette.length];
      return {
        id: `khac-item-${String(index + 1).padStart(2, "0")}-${slugFileName(fileName)}`,
        name: fileName,
        overviewText: fileName,
        tabs: [
          {
            id: `khac-tab-${String(index + 1).padStart(2, "0")}-${slugFileName(fileName)}`,
            title: fileName,
            mainText: fileName,
            models: [
              {
                id: `khac-${String(index + 1).padStart(2, "0")}-${slugFileName(fileName)}`,
                name: fileName,
                type: fileName,
                description: fileName,
                accent: palette.accent,
                accentSoft: palette.accentSoft,
                color: palette.color,
                defaultFocusId: "primary",
                modelAsset: {
                  url: `/models/${fileName}`,
                  scale: 1,
                  rotation: [0, -0.34, 0],
                  exposure: 1.06,
                  animation: true,
                  materialMode: "native",
                  preserveNativeColor: true,
                  autoFit: true,
                },
              },
            ],
          },
        ],
      };
    });
}

const publicModelFilesByCreationDate = [
  "plant-cell-first001.glb",
  "white-blood-cell-user.glb",
  "dna.glb",
  "nucleotide.glb",
  "thymine_molecule.glb",
  "dna_double_helix__base_pairing_model.glb",
  "ribosomas.glb",
  "mrna.glb",
  "tRNA.glb",
  "interaction_trna-mrna.glb",
  "chromosome.glb",
  "Types_of_chromosome.glb",
  "eukaryotic_chromosome.glb",
  "Nucleosome.glb",
  "internal_root_structure.glb",
  "root_cross_section.glb",
  "xylem.glb",
  "xylem_edited.glb",
  "phloem.glb",
  "phloem_edited.glb",
  "Plant Stomata.glb",
  "Leaf Anatomy.glb",
  "chloroplast.glb",
  "mitochondria.glb",
  "digestive_system.glb",
  "stomach_-_organ.glb",
  "intestine.glb",
  "lungs.glb",
  "External_Heart_Structure.glb",
  "circulatory_system.glb",
  "human_heart_cross_section.glb",
  "lymph_node.glb",
  "macrophage.glb",
  "kidney.glb",
  "nephron.glb",
  "neuron.glb",
  "Synapse.glb",
  "human_eye.glb",
  "anatomy_skin.glb",
  "meristem_root_edited.glb",
  "tree_growth_rings.glb",
  "Primary+Growth.glb",
  "Secondary Growth and Cambium.glb",
  "flower_anatomy_3d_model.glb",
  "Anther and Pollen.glb",
  "peach.glb",
  "male_reproductive_system.glb",
  "sperm_cell_illustration.glb",
  "uterus.glb",
  "Embryo Stages.glb",
  "glucose_3d_model.glb",
  "lipids.glb",
  "ear_anatomy.glb",
  "protein.glb",
  "dna_rna.glb",
  "animal_cell.glb",
  "plasma_membrane.glb",
  "BacteriaCell.glb",
  "Passive Transport Simple Diffusion.glb",
  "virus.glb",
  "Bacteriophage.glb",
  "influenza_virus.glb",
  "circulatory_system_2.glb",
  "plant_cell_-_cell_structure.glb",
  "mitosis.glb",
] as const;

const khacPalette = [
  { accent: "#2f7d6c", accentSoft: "#d8eee8", color: "#62b7a2" },
  { accent: "#356d9a", accentSoft: "#d9e8f2", color: "#68a4d4" },
  { accent: "#8d6730", accentSoft: "#efe2ca", color: "#c79a55" },
  { accent: "#8f4f55", accentSoft: "#efdadd", color: "#c7737a" },
  { accent: "#715aa7", accentSoft: "#e4e0f2", color: "#a278c8" },
  { accent: "#6a7f2a", accentSoft: "#e7edcf", color: "#a9bf55" },
] as const;

export const classItems: Record<
  GradeKey,
  { label: string; items: LessonItem[] }
> = {
  lop10: {
    label: "Lớp 10",
    items: lop10Modules,
  },
  lop11: {
    label: "Lớp 11",
    items: lop11Modules,
  },
  lop12: {
    label: "Lớp 12",
    items: lop12Modules,
  },
  khac: {
    label: "Khac",
    items: createKhacItems(),
  },
};

export const cells: CellItem[] = Object.values(classItems).flatMap((grade) =>
  grade.items.flatMap((item) => item.tabs.flatMap((tab) => tab.models)),
);

export function getFirstClassWithItems(): GradeKey {
  return (
    (Object.keys(classItems) as GradeKey[]).find(
      (grade) => classItems[grade].items.length > 0,
    ) ?? "lop10"
  );
}

export function getCellById(id: string) {
  return cells.find((cell) => cell.id === id) ?? cells[0];
}
