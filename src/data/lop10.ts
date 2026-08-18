import type { CellItem, LessonItem, ModelAnnotation } from "./cells";

type NativeModelInput = {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  scale: number;
  accent: string;
  accentSoft: string;
  color: string;
  defaultFocusId?: string;
  annotations: ModelAnnotation[];
  rotation?: [number, number, number];
  position?: [number, number, number];
  exposure?: number;
  animation?: boolean;
  materialColorOverrides?: Record<string, string>;
  materialOpacityOverrides?: Record<string, number>;
  /** Camera distance from model. Lower = zoomed in, higher = zoomed out. Default: 5.5 */
  cameraZoom?: number;
  autoFit?: boolean;
};


function nativeModel({
  id,
  name,
  type,
  description,
  url,
  scale,
  accent,
  accentSoft,
  color,
  defaultFocusId = "primary",
  annotations,
  rotation = [0, -0.34, 0],
  position,
  exposure = 1.06,
  animation,
  materialColorOverrides,
  materialOpacityOverrides,
  cameraZoom,
  autoFit,
}: NativeModelInput): CellItem {
  return {
    id,
    name,
    type,
    description,
    accent,
    accentSoft,
    color,
    defaultFocusId,
    annotations,
    modelAsset: {
      url,
      scale,
      rotation,
      position,
      exposure,
      animation,
      materialMode: "native",
      preserveNativeColor: true,
      materialColorOverrides,
      materialOpacityOverrides,
      cameraZoom,
      autoFit,
    },
  };
}

const editedContent = {
  carbon:
    "Carbon có 4 electron hoá trị nên có thể tạo 4 liên kết cộng hoá trị. Carbon có thể liên kết với carbon và với các nguyên tố như H, O, N, nhờ đó hình thành các bộ khung carbon đa dạng.",
  glucoseCarbon:
    "Vòng glucose dạng pyranose gồm 5 nguyên tử carbon và 1 nguyên tử O. Glucose minh hoạ khả năng hình thành bộ khung carbon dạng mạch thẳng.",
  water:
    "Phân tử nước có tính phân cực vì nguyên tử O có độ âm điện lớn hơn, hút cặp electron dùng chung lệch về phía O. Nhờ tính phân cực, các phân tử nước có thể hình thành liên kết hydrogen với nhau. Nước là dung môi phân cực, góp phần điều hoà nhiệt, tham gia phản ứng sinh hoá và bảo vệ cơ học.",
  monosaccharide:
    "Glucose là một đường đơn có công thức C₆H₁₂O₆ và là đơn phân cấu tạo nên nhiều phân tử đường. Trong tế bào, glucose là nguồn nguyên liệu trực tiếp cho hô hấp tế bào.",
  disaccharide:
    "Đường đôi gồm 2 đường đơn liên kết với nhau bằng liên kết glycoside. Ví dụ: maltose gồm 2 glucose; sucrose gồm glucose và fructose. Khi bị thuỷ phân, liên kết glycoside bị phá vỡ, tạo thành 2 đường đơn.",
  starch:
    "Tinh bột là đường đa gồm nhiều đơn phân glucose liên kết với nhau bằng liên kết glycoside. Mô hình này minh hoạ chuỗi amylose gồm 3 đơn phân với các liên kết α(1→4).",
  triglyceride:
    "Chất béo trung tính gồm 1 glycerol liên kết với 3 acid béo bằng các liên kết ester. Phân tử nhìn chung kị nước, không tan trong nước và có chức năng dự trữ năng lượng, cách nhiệt.",
  phospholipid:
    "Phospholipid có một đầu ưa nước và hai đuôi kị nước. Nhờ tính lưỡng tính, các phân tử phospholipid có thể tự sắp xếp thành lớp kép trong môi trường nước, tạo nên nền tảng cấu trúc của màng sinh chất.",
  phospholipidBilayer:
    "Trong môi trường nước, hai lớp phospholipid xếp đối diện nhau: các đầu ưa nước quay ra môi trường nước, còn các đuôi kị nước quay vào nhau. Cấu trúc này tạo nên hàng rào ngăn cách môi trường trong và ngoài tế bào.",
  aminoAcid:
    "Amino acid là đơn phân cấu tạo nên protein. Mỗi amino acid có một carbon trung tâm liên kết với nhóm amin, nhóm carboxyl, một nguyên tử H và gốc R. Các amino acid khác nhau chủ yếu ở gốc R. Các amino acid liên kết với nhau bằng liên kết peptide để tạo chuỗi polypeptide.",
  proteinStructure:
    "Protein được hình thành từ chuỗi polypeptide và gấp cuộn thành cấu trúc không gian đặc trưng. Cấu trúc bậc 2 gồm xoắn alpha và gấp nếp beta, được ổn định chủ yếu bởi liên kết hydrogen. Cấu trúc bậc 3 là hình dạng không gian của toàn bộ chuỗi và có vai trò quyết định chức năng của protein.",
  nucleotide:
    "Nucleotide gồm một base nitơ, một đường pentose và một nhóm phosphate. Nucleotide của DNA chứa deoxyribose và các base A, T, G, C; nucleotide của RNA chứa ribose và các base A, U, G, C. Các nucleotide liên kết với nhau tạo chuỗi polynucleotide.",
  dna: "DNA gồm hai mạch polynucleotide xoắn quanh một trục chung. Khung đường-phosphate nằm phía ngoài; các base nằm phía trong và bắt cặp bổ sung: A-T bằng 2 liên kết hydrogen, G-C bằng 3 liên kết hydrogen. DNA mang, bảo quản và truyền đạt thông tin di truyền.",
  rna: "RNA thường gồm một mạch polynucleotide, chứa đường ribose và base uracil thay cho thymine. mRNA mang thông tin dùng làm khuôn tổng hợp protein; tRNA vận chuyển amino acid; rRNA tham gia cấu tạo ribosome.",
  phospholipidBilayer2: `Màng sinh chất có cấu trúc khảm lỏng.
    • Lớp kép phospholipid tạo nên nền màng.
    • Đầu ưa nước hướng ra hai phía, đuôi kị nước quay vào nhau.
    • Cholesterol xen giữa các phospholipid.
    Cấu trúc này giúp màng vừa ổn định vừa linh động.`,
  membraneOverview: `Protein màng có vị trí và chức năng khác nhau.
    • Protein xuyên màng nằm trong lớp kép và có thể kéo dài qua toàn bộ màng.
    • Protein bám màng chỉ gắn ở một mặt màng.
    Các protein màng tham gia vận chuyển, tiếp nhận tín hiệu và liên kết cấu trúc.`,
  membraneCarbohydrate: `Các chuỗi đường trên màng có thể gắn với protein hoặc lipid.
    • Gắn với protein tạo protein gắn carbohydrate.
    • Gắn với lipid tạo lipid gắn carbohydrate.
    • Các chuỗi đường hướng về phía ngoài tế bào.
    Chúng tham gia nhận biết tế bào và tiếp nhận tín hiệu.`,
  simpleDiffusion: `Khuếch tán đơn giản là sự di chuyển trực tiếp qua lớp kép phospholipid.
    • O₂ và CO₂ đi từ nơi có nồng độ cao đến nơi có nồng độ thấp.
    • Quá trình không cần protein vận chuyển và không sử dụng ATP.
    Khi cân bằng, phân tử vẫn chuyển động qua lại nhưng không còn dòng thuần.`,
  facilitatedDiffusion: `Khuếch tán qua kênh protein là vận chuyển thụ động có sự tham gia của protein kênh.
    • Ion và phân tử phân cực đi qua lòng kênh.
    • Nước có thể đi qua aquaporin.
    • Quá trình không sử dụng ATP.
    Chất đi qua kênh, không xuyên trực tiếp qua lớp lipid.`,
  activeTransport: `Vận chuyển chủ động đưa chất ngược chiều chênh lệch nồng độ.
    • Protein bơm liên kết với chất cần vận chuyển.
    • ATP cung cấp năng lượng làm protein thay đổi hình dạng.
    • Chất được chuyển từ nơi có nồng độ thấp đến nơi có nồng độ cao.
    Quá trình cần protein vận chuyển đặc hiệu.`,
  exocytosis: `Xuất bào là hình thức vận chuyển chủ động đưa chất ra khỏi tế bào bằng túi vận chuyển.
    • Túi vận chuyển di chuyển đến màng sinh chất.
    • Màng túi nhập với màng sinh chất.
    • Chất bên trong túi được giải phóng ra ngoài tế bào.
    Quá trình này giúp tế bào tiết protein, enzyme, hormone hoặc thải một số chất ra môi trường ngoài.`,
  mitosisChromosome: `Nhiễm sắc thể kép gồm hai nhiễm sắc tử chị em gắn với nhau ở vùng tâm động.
    • Mỗi nhiễm sắc tử chứa một phân tử DNA.
    • Hai nhiễm sắc tử chị em mang thông tin di truyền giống nhau.
    Trong nguyên phân, thoi phân bào liên kết tại vùng tâm động để phân li các nhiễm sắc tử.`,
} as const;
// Lop 10
// Carbon và nước trong tế bào

// Tab 1
const carbonTabModels: CellItem[] = [
  {
    id: "lop10-carbon-tab1-methane",
    name: "CH₄ - Methan", // Không đổi thành Metan
    type: "Carbon tạo bốn liên kết C-H",
    description: editedContent.carbon,
    accent: "#237c91",
    accentSoft: "#dceff2",
    color: "#66b7c8",
    defaultFocusId: "carbon",
    annotations: [
      {
        id: "carbon-center",
        number: 1,
        label: "Nguyên tử C",
        position: [28, -140, -200],
      },
      {
        id: "hydrogen",
        number: 2,
        label: "Nguyên tử H",
        position: [163, -51, -389],
      },
      {
        id: "hydrogen",
        number: 2,
        label: "Nguyên tử H",
        position: [125, -45, 20],
      },
      {
        id: "c-h-bond",
        number: 3,
        label: "Liên kết C-H",
        position: [105, -95, -300],
      },
      {
        id: "bond-angle",
        number: 5,
        label: "Góc liên kết 109,5°",
        position: [110, -230, -70],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_CarbonVaNuoc_Tab1_methane_molecule.glb",
      scale: 0.007,
      rotation: [0, -0.38, 0],
      position: [0, 0, 0],
      exposure: 1.06,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "lop10-carbon-tab1-ethane",
    name: "C₂H₆ - Ethan", // Không đổi thành Etan
    type: "Carbon liên kết với carbon và nguyên tử H",
    description: editedContent.carbon,
    accent: "#8a5d1f",
    accentSoft: "#f0e3cd",
    color: "#d39a4a",
    defaultFocusId: "carbon-carbon",
    annotations: [
      {
        id: "carbon-left",
        number: 1,
        label: "Nguyên tử C",
        position: [0, 0.04, 0],
      },
      {
        id: "carbon-right",
        number: 1,
        label: "Nguyên tử C",
        position: [0.2, 0.02, -0.69],
      },
      {
        id: "hydrogen",
        number: 2,
        label: "Nguyên tử H",
        position: [-0.09, 0.66, 0.24],
      },
      {
        id: "c-h-bond",
        number: 3,
        label: "Liên kết C-H",
        position: [-0.04, 0.46, 0.17],
      },
      {
        id: "c-c-bond",
        number: 4,
        label: "Liên kết C-C",
        position: [0.079, -0.004, -0.342],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_CarbonVaNuoc_Tab1_ethane_molecular.glb",
      scale: 2,
      rotation: [0, -0.42, 0],
      position: [0, -0.1, 0],
      exposure: 1.06,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
];

const glucoseTabModels: CellItem[] = [
  {
    id: "lop10-carbon-tab2-glucose-molecule",
    name: "Glucose mạch vòng",
    type: "Phân tử glucose dạng mạch vòng",
    description: editedContent.glucoseCarbon,
    accent: "#6a7f2a",
    accentSoft: "#e7edcf",
    color: "#a9bf55",
    defaultFocusId: "glucose-ring",
    annotations: [
      {
        id: "carbon-skeleton",
        number: 1,
        label: "Khung carbon",
        position: [0, 0.25, 0],
      },
      {
        id: "oxygen",
        number: 2,
        label: "Nguyên tử O",
        position: [-1, 1, 0.34],
      },
      {
        id: "hydroxyl",
        number: 3,
        label: "Nhóm -OH",
        position: [-3.4, 0.37, 0.4],
      },
      {
        id: "carbon",
        number: 4,
        label: "C",
        position: [-1.104, -0.428, 0.284],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_CarbonVaNuoc_Tab2_glucose_molecule.glb",
      scale: 1,
      rotation: [0, -0.35, 0],
      exposure: 1.06,
      materialMode: "native",
      preserveNativeColor: true,
      cameraZoom: 10,
    },
  },
  {
    id: "lop10-carbon-tab2-glucose-mutarotation",
    name: "Glucose mạch thẳng",
    type: "Phân tử glucose dạng thẳng (mạch hở)",
    description: editedContent.glucoseCarbon,
    accent: "#9a6048",
    accentSoft: "#f0ddd6",
    color: "#c8866a",
    defaultFocusId: "glucose-transition",
    annotations: [
      {
        id: "carbon-center",
        number: 1,
        label: "Nguyên tử C",
        position: [-0.71, 2.15, -0.61],
      },
      {
        id: "h-center",
        number: 2,
        label: "Nguyên tử H",
        position: [-1.674, 2.068, 0.674],
      },
      {
        id: "0-center",
        number: 3,
        label: "Nguyên tử O",
        position: [-1.639, 3.1, 0.933],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_CarbonVaNuoc_Tab2_glucose_mutaoration.glb",
      scale: 0.5,
      rotation: [0, -0.3, 0],
      exposure: 1.05,
      materialMode: "native",
      preserveNativeColor: true,
      animation: false,
      cameraZoom: 9,
    },
  },
];

const waterTabModels: CellItem[] = [
  {
    id: "lop10-carbon-tab3-h2o-molecule",
    name: "Phân tử H₂O (Nước)",
    type: "Phân tử nước đơn",
    description: editedContent.water,
    accent: "#23739a",
    accentSoft: "#d9edf5",
    color: "#65aeda",
    defaultFocusId: "water-polarity",
    annotations: [
      {
        id: "oxygen",
        number: 1,
        label: "O mang điện tích âm một phần",
        position: [0, 0.35, 0],
      },
      {
        id: "hydrogen",
        number: 2,
        label: "H mang điện tích dương một phần",
        position: [0.31, 0.12, 0],
      },
      {
        id: "bond-O-H",
        number: 3,
        label: "Liên kết O–H",
        position: [0.17, 0.23, 0],
      },
      {
        id: "bond-angle",
        number: 4,
        label: "Góc 104,5°",
        position: [0, 0.12, 0],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_CarbonVaNuoc_Tab3_h2o_molecule.glb",
      scale: 3.05,
      rotation: [0, -0.25, 0],
      exposure: 1.06,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "lop10-carbon-tab3-hydrogen-bonding",
    name: "Liên kết hydrogen giữa các phân tử nước",
    type: "Liên kết hydrogen giữa các phân tử nước",
    description: editedContent.water,
    accent: "#5b62a8",
    accentSoft: "#e0e2f2",
    color: "#8d95d8",
    defaultFocusId: "hydrogen-bond",
    annotations: [
      {
        id: "hydrogen-bond",
        number: 5,
        label: "Liên kết hydrogen",
        position: [-0.12, 0.52, 0.02],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_CarbonVaNuoc_Tab3_Hydrogen_Bonding_between_Water_Molecules.glb",
      scale: 2.45,
      rotation: [0, -0.25, 0],
      exposure: 1.06,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "lop10-carbon-tab3-liquid-water-structure",
    name: "Cấu trúc nước lỏng",
    type: "Cấu trúc nước lỏng",
    description: editedContent.water,
    accent: "#28836c",
    accentSoft: "#d8eee8",
    color: "#61b7a0",
    defaultFocusId: "liquid-water",
    annotations: [
      {
        id: "hydrogen-bond",
        number: 5,
        label: "Liên kết hydrogen",
        position: [0.12, 0.35, 6],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_CarbonVaNuoc_Tab3_structure_of_liquid_water.glb",
      scale: 0.2,
      rotation: [0, -0.28, 0],
      exposure: 1.06,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
];

const carbohydrateMonosaccharideModels: CellItem[] = [
  {
    id: "lop10-carbohydrate-tab1-d-glucose",
    name: "D-glucose dạng mạch vòng",
    type: "Đường đơn dạng mạch vòng",
    description: editedContent.monosaccharide,
    accent: "#6b842e",
    accentSoft: "#e6edcf",
    color: "#a5bf55",
    defaultFocusId: "glucose-carbon",
    annotations: [
      {
        id: "carbon",
        number: 1,
        label: "Carbon",
        position: [-0.075, 0.05, 0.03],
      },
      {
        id: "oxygen-ring",
        number: 2,
        label: "O trong vòng",
        position: [-0.039, 0.091, -0.019],
      },
      {
        id: "hydroxyl",
        number: 3,
        label: "Nhóm -OH",
        position: [-0.115, 0.029, 0.035],
      },
      {
        id: "pyranose-ring",
        number: 4,
        label: "Vòng pyranose",
        position: [-0.06, 0.07, 0],
      },
      {
        id: "hydrogen",
        number: 5,
        label: "Hydrogen",
        position: [-0.054, 0.094, 0.025],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_Carbohydrate_Tab1_d-glucose.glb",
      scale: 15,
      rotation: [0, -0.34, 0],
      exposure: 1.06,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  glucoseTabModels[1],
];

const carbohydrateDisaccharideModels: CellItem[] = [
  {
    id: "lop10-carbohydrate-tab2-maltose",
    name: "Maltose",
    type: "Đường đôi gồm 2 glucose",
    description: editedContent.disaccharide,
    accent: "#7f6331",
    accentSoft: "#eee1c9",
    color: "#be9650",
    defaultFocusId: "glycoside-bond",
    annotations: [
      {
        id: "first-ring",
        number: 1,
        label: "Vòng đường thứ nhất (Glucose)",
        position: [-0.0, 0.054, -0.048],
      },
      {
        id: "second-ring",
        number: 2,
        label: "Vòng đường thứ hai (Glucose)",
        position: [0.02, 0.091, 0.035],
      },
      {
        id: "glycoside-bond",
        number: 3,
        label: "Liên kết glycoside",
        position: [0, 0.067, -0.005],
      },
      {
        id: "hydroxyl",
        number: 4,
        label: "Nhóm -OH tự do",
        position: [0.004, 0.088, 0.084],
      },
      {
        id: "oxygen",
        number: 5,
        label: "O",
        position: [-0.025, 0.084, 0.0435],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_Carbohydrate_Tab2_maltose.glb",
      scale: 30,
      rotation: [0, -0.32, 0],
      exposure: 1.06,
      materialMode: "native",
      preserveNativeColor: true,
      cameraZoom: 7,
    },
  },
  {
    id: "lop10-carbohydrate-tab2-sucrose",
    name: "Sucrose",
    type: "Đường đôi gồm glucose và fructose",
    description: editedContent.disaccharide,
    accent: "#8b4f7c",
    accentSoft: "#efd9ea",
    color: "#c176b2",
    defaultFocusId: "glycoside-bond",
    annotations: [
      {
        id: "first-ring",
        number: 1,
        label: "Vòng đường thứ nhất (Glucose)",
        position: [0.012, 0.074, 0.06],
      },
      {
        id: "second-ring",
        number: 2,
        label: "Vòng đường thứ hai (Fructose)",
        position: [0.015, 0.08, -0.065],
      },
      {
        id: "glycoside-bond",
        number: 3,
        label: "Liên kết glycoside",
        position: [0.046, 0.055, -0.005],
      },
      {
        id: "oxygen",
        number: 5,
        label: "O",
        position: [-0.055, 0.121, 0.059],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_Carbohydrate_Tab2_sucrose.glb",
      scale: 20,
      rotation: [0, -0.32, 0],
      exposure: 1.06,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  // {
  //   id: "lop10-carbohydrate-tab2-sucrose-molecule",
  //   name: "Phân tử sucrose",
  //   type: "Mô hình phân tử sucrose",
  //   description:
  //     "Mô hình sucrose molecule cho thấy rõ hai vòng đường và liên kết glycoside giữa chúng.",
  //   accent: "#356d8a",
  //   accentSoft: "#d9e8ef",
  //   color: "#67a9c7",
  //   defaultFocusId: "sucrose-rings",
  //   annotations: [
  //     {
  //       id: "first-ring",
  //       number: 1,
  //       label: "Vòng đường thứ nhất",
  //       description: "Một phần vòng đường của sucrose.",
  //       position: [-0.9, 0.4, 0.3],
  //     },
  //     {
  //       id: "second-ring",
  //       number: 2,
  //       label: "Vòng đường thứ hai",
  //       description: "Phần vòng đường còn lại của sucrose.",
  //       position: [0.9, -0.3, 0.25],
  //     },
  //     {
  //       id: "glycoside-bond",
  //       number: 3,
  //       label: "Liên kết glycoside",
  //       description: "Liên kết nối hai đường đơn của sucrose.",
  //       position: [0, 0.05, 0],
  //     },
  //   ],
  //   modelAsset: {
  //     url: "/new-models/Lop10_Carbohydrate_Tab2_sucrose_molecule.glb",
  //     scale: 0.28,
  //     rotation: [0, -0.35, 0],
  //     exposure: 1.06,
  //     materialMode: "native",
  //     preserveNativeColor: true,
  //   },
  // },
];

const carbohydratePolysaccharideModels: CellItem[] = [
  {
    id: "lop10-carbohydrate-tab3-starch",
    name: "Tinh bột",
    type: "Đường đa tinh bột",
    description: editedContent.starch,
    accent: "#2f7d4a",
    accentSoft: "#d9eddf",
    color: "#65b47d",
    defaultFocusId: "amylose-chain",
    annotations: [
      {
        id: "glucose-unit",
        number: 1,
        label: "Đơn phân glucose",
        position: [-40, 0.653, -59],
      },
      {
        id: "glycoside-link",
        number: 2,
        label: "Liên kết α(1→4) glycoside",
        position: [-20, 0, -58],
      },
    ],
    modelAsset: {
      url: "/new-models/Lop10_Carbohydrate_Tab3_starch_3d_model.pbr.glb",
      scale: 0.05,
      rotation: [0, -0.35, 0],
      position: [0, 0.15, 0],
      exposure: 1.05,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
];

const lipidModels = {
  // Tab 1
  triglyceride: [
    nativeModel({
      id: "lop10-lipid-tab1-triacylglycerol-tristearate",
      name: "Tristearin",
      type: "Chất béo trung tính",
      description: editedContent.triglyceride,
      url: "/new-models/Lop10_Lipid và phospholipid_Tab1_triacylglycerol_tristearate.glb",
      scale: 0.4,
      accent: "#8a6f2b",
      accentSoft: "#efe6c7",
      color: "#c4a54d",
      defaultFocusId: "ester-bond",
      annotations: [
        {
          id: "glycerol",
          number: 1,
          label: "Glycerol",
          position: [-1.474, 3.1, 0.1],
        },
        {
          id: "fatty-acid-tails-1",
          number: 2,
          label: "Đuôi acid béo",
          position: [-13, 2, 0],
        },
        {
          id: "fatty-acid-tails-2",
          number: 2,
          label: "Đuôi acid béo",
          position: [13, 5.8, 0],
        },
        {
          id: "fatty-acid-tails-3",
          number: 2,
          label: "Đuôi acid béo",
          position: [2.8, -7, 0.7],
        },
        {
          id: "ester-bond",
          number: 3,
          label: "Liên kết ester",
          position: [-5, 2.9, 0.01],
        },
        {
          id: "hydrophobic-tail",
          number: 5,
          label: "Vùng đuôi kị nước",
          position: [-17.606, 1.214, 2.45],
        },
      ],
      cameraZoom: 13,
    }),
  ],

  // Tab 2
  phospholipid: [
    nativeModel({
      id: "lop10-lipid-tab2-phospholipid",
      name: "Phân tử phospholipid",
      type: "Một phân tử phospholipid",
      description: editedContent.phospholipid,
      url: "/new-models/Lop10_Lipid và phospholipid_Tab2_phospholipid.glb",
      scale: 0.01,
      accent: "#347d8d",
      accentSoft: "#d8ecf0",
      color: "#64b1c0",
      defaultFocusId: "hydrophilic-head",
      materialColorOverrides: {
        "Scene_-_Root": "#4fb6c8",
      },
      annotations: [
        {
          id: "hydrophilic-head",
          number: 1,
          label: "Đầu ưa nước",
          position: [-8, 50, 11],
        },
        {
          id: "hydrophobic-tail-1",
          number: 2,
          label: "Đuôi kị nước",
          position: [-128, -10, 33],
        },
        {
          id: "ester-bond",
          number: 3,
          label: "Liên kết ester",
          position: [-59, -2, 20],
        },
        {
          id: "phosphate",
          number: 5,
          label: "Phospholipid",
          position: [-0.55, 0.35, 0.12],
          image: {
            url: "https://images.tuyensinh247.com/picture/images_question/1657528380-8kyd.jpg",
          },
        },
      ],
    }),
  ],

  // Tab 3
  bilayer: [
    nativeModel({
      id: "lop10-lipid-tab3-phospholipid-bilayer",
      name: "Lớp kép phospholipid",
      type: "Lớp kép phospholipid",
      description: editedContent.phospholipidBilayer,
      url: "/new-models/Lop10_Lipid và phospholipid_Tab3_lipid_bilayer.glb",
      scale: 5,
      accent: "#6a58a7",
      accentSoft: "#e4e0f2",
      color: "#9282d7",
      defaultFocusId: "bilayer",
      annotations: [
        {
          id: "upper-heads",
          number: 1,
          label: "Lớp đầu ưa nước phía trên",
          position: [0, 0.42, 0.034],
        },
        {
          id: "lower-heads",
          number: 2,
          label: "Lớp đầu ưa nước phía dưới",
          position: [-0.034, 0.03, 0.173],
        },
        {
          id: "hydrophobic-core",
          number: 3,
          label: "Vùng đuôi kị nước",
          position: [-0.093, 0.2, 0.08],
        },
      ],
    }),
  ],
};

const proteinModels = {
  // Tab 1
  aminoAcids: [
    nativeModel({
      id: "lop10-protein-tab1-glycine",
      name: "Glycine",
      type: "amino acid",
      description: editedContent.aminoAcid,
      url: "/new-models/Lop10_Protein_Tab1_glycine.glb",
      scale: 0.57,
      accent: "#7a5a9f",
      accentSoft: "#e6ddf0",
      color: "#a582ca",
      defaultFocusId: "alpha-carbon",
      annotations: [
        {
          id: "alpha-carbon",
          number: 1,
          label: "Carbon α",
          position: [35.4, 0.35, 2.5],
        },
        {
          id: "amino-group",
          number: 2,
          label: "Nhóm amin (-NH₂)",
          position: [35.57, -1.099, 2.5],
        },
        {
          id: "carboxyl-group",
          number: 3,
          label: "Nhóm carboxyl (-COOH)",
          position: [36.82, 1.115, 2.444],
        },
        {
          id: "r-group",
          number: 4,
          label: "Gốc R (-H)",
          position: [35, 0.57, 1.47],
        },
        {
          id: "hydrogen",
          number: 5,
          label: "H gắn với carbon α",
          position: [36.18, -1.537, 1.771],
        },
      ],
    }),
    nativeModel({
      id: "lop10-protein-tab1-alanine",
      name: "Alanine",
      type: "amino acid",
      description: editedContent.aminoAcid,
      url: "/new-models/Lop10_Protein_Tab1_alanine.glb",
      scale: 0.5,
      accent: "#8f4f55",
      accentSoft: "#efdadd",
      color: "#c7737a",
      defaultFocusId: "r-group",
      annotations: [
        {
          id: "alpha-carbon",
          number: 1,
          label: "Carbon α",
          position: [1.549, 21, 4.605],
        },
        {
          id: "amino-group",
          number: 2,
          label: "Nhóm amin (-NH₂)",
          position: [1.183, 19.5, 4.05],
        },
        {
          id: "carboxyl-group",
          number: 3,
          label: "Nhóm carboxyl (-COOH)",
          position: [2.531, 21.7, 3.44],
        },
        {
          id: "r-group",
          number: 4,
          label: "Gốc R (-CH₃)",
          position: [0.313, 21.8, 4.732],
        },
        {
          id: "hydrogen",
          number: 5,
          label: "H gắn với carbon α",
          position: [2.179, 21, 5.632],
        },
      ],
    }),
  ],
  // Tab 2
  structure: [
    nativeModel({
      id: "lop10-protein-tab2-human-hexokinase",
      name: "Protein hexokinase ở người",
      type: "Cấu trúc protein",
      description: editedContent.proteinStructure,
      url: "/new-models/Lop10_Protein_Tab2_human_hexokinase_protein.glb",
      scale: 0.025,
      accent: "#2f7785",
      accentSoft: "#d8ebef",
      color: "#64aebb",
      defaultFocusId: "protein-3d",
      materialColorOverrides: {
        "Scene_-_Root": "#58a7c2",
      },
      annotations: [
        {
          id: "amino-acid-segment",
          number: 1,
          label: "Enzyme hexokinase",
          position: [-43.9, 42.3, -147.887],
        },
        {
          id: "beta-sheet",
          number: 2,
          label: "Cấu trúc gấp nếp β",
          position: [-28.6, 58.9, -174.5],
        },
        {
          id: "alpha-helix",
          number: 3,
          label: "Cấu trúc xoắn α",
          position: [-21.9, 28.7, -129.5],
        },
      ],
    }),
  ],
};

const nucleicAcidModels = {
  // Tab 1
  nucleotide: [
    nativeModel({
      id: "lop10-nucleic-tab1-dna-base-pairing",
      name: "Nucleotide của DNA",
      type: "Bắt cặp base bổ sung",
      description: editedContent.nucleotide,
      url: "/new-models/Lop10_Nucleic acid_Tab1_dna_double_helix__base_pairing.glb",
      scale: 3,
      cameraZoom: 8,
      accent: "#715aa7",
      accentSoft: "#e4def1",
      color: "#9885d4",
      defaultFocusId: "base-pairs",
      annotations: [
        {
          id: "base-pairs_1",
          number: 1,
          label: "Nitrogenous base",
          position: [0, 0.7, 0.2],
        },
        {
          id: "base-pairs_2",
          number: 1,
          label: "Nitrogenous base",
          position: [0, 0.714, -0.11],
        },
        {
          id: "sugar-pentose",
          number: 2,
          label: "Đường deoxyribose",
          position: [0, 0.62, 0.32],
        },
        {
          id: "hydrogen-bond",
          number: 3,
          label: "Liên kết hydrogen",
          position: [0.001, 0.83, 0.041],
        },
        {
          id: "phosphate",
          number: 4,
          label: "Gốc Phosphate",
          position: [0.019, 0.386, 0.381],
        },
      ],
    }),
  ],
  // Tab 2
  dna: [
    nativeModel({
      id: "lop10-nucleic-tab2-dna-rna-animated",
      name: "DNA và RNA",
      type: "DNA xoắn kép",
      description: editedContent.dna,
      url: "/new-models/Lop10_Nucleic acid_Tab2_dna_rna_animated.glb",
      scale: 2,
      accent: "#2f7d6c",
      accentSoft: "#d8eee8",
      color: "#62b7a2",
      defaultFocusId: "double-helix",
      materialColorOverrides: {
        Soap_Bubble: "#0071ff",
      },
      materialOpacityOverrides: {
        Soap_Bubble: 0.72,
      },
      annotations: [
        {
          id: "DNA",
          number: 1,
          label: "DNA",
          position: [-0.427, 0.861, 0.188],
        },
        {
          id: "RNA",
          number: 2,
          label: "RNA",
          position: [-0.207, 0.887, 0.713],
        },
        {
          id: "RNA2",
          number: 2,
          label: "RNA",
          position: [-0.62, 0.818, -0.401],
        },
      ],
    }),
  ],
  // Tab 3
  rna: [
    nativeModel({
      id: "lop10-nucleic-tab3-trna",
      name: "tRNA",
      type: "RNA đơn mạch",
      description: editedContent.rna,
      url: "/new-models/Lop10_Nucleic acid_Tab3_transfer_rna_trna.glb",
      scale: 1.5,
      accent: "#8d6730",
      accentSoft: "#efe2ca",
      color: "#c79a55",
      defaultFocusId: "single-strand",
      annotations: [
        {
          id: "trna",
          number: 1,
          label: "tRNA",
          position: [52.767, 16.21, -11.39],
        },
        {
          id: "chain-trna",
          number: 2,
          label: "Chuỗi tRNA",
          position: [52.81, 15.76, -11.34],
        },
        {
          id: "the-acceptor-arm",
          number: 3,
          label: "Vị trí gắn kết với amino acid",
          position: [53.18, 16.98, -11.24],
        },
        {
          id: "anticodon-loop",
          number: 4,
          label: "Vòng đối mã",
          position: [52.404, 15.35, -12.51],
        },
        {
          id: "flexible-single-strand",
          number: 5,
          label: "Hai vòng RNA chụm lại với nhau",
          position: [53.05, 15.22, -10.7],
        },
      ],
    }),
  ],
};

const membraneModels = {
  //Tab 1
  bilayer: [
    nativeModel({
      id: "lop10-lipid-tab3-phospholipid-bilayer",
      name: "Lớp kép phospholipid",
      type: "Lớp kép phospholipid",
      description: editedContent.phospholipidBilayer2,
      url: "/new-models/Lop10_Lipid và phospholipid_Tab3_lipid_bilayer.glb",
      scale: 5,
      accent: "#6a58a7",
      accentSoft: "#e4e0f2",
      color: "#9282d7",
      defaultFocusId: "bilayer",
      annotations: [
        {
          id: "upper-heads",
          number: 1,
          label: "Lớp đầu ưa nước phía trên",
          position: [0, 0.42, 0.034],
        },
        {
          id: "lower-heads",
          number: 2,
          label: "Lớp đầu ưa nước phía dưới",
          position: [-0.034, 0.03, 0.173],
        },
        {
          id: "hydrophobic-core",
          number: 3,
          label: "Vùng đuôi kị nước",
          position: [-0.093, 0.2, 0.08],
        },
        {
          id: "amphipathic",
          number: 4,
          label: "Tính lưỡng tính",
          position: [-0.061, 0.297, 0.09],
        },
      ],
    }),
  ],
  // Tab 2
  overview: [
    nativeModel({
      id: "lop10-membrane-tab1-plasma-membrane",
      name: "Cấu trúc khảm lỏng màng sinh chất",
      type: "Lớp kép phospholipid và cholesterol",
      description: editedContent.membraneOverview,
      url: "/new-models/Lop10_Màng sinh chất tổng thể_Tab2_plasma_membrane.glb",
      scale: 0.1,
      accent: "#2f7d4a",
      accentSoft: "#d9eddf",
      color: "#62b87b",
      defaultFocusId: "membrane-overview",
      annotations: [
        {
          id: "channel-protein",
          number: 1,
          label: "Protein vận chuyển",
          position: [1.35, 2.94, 5.63],
        },
        {
          id: "cholesterol",
          number: 2,
          label: "Cholesterol",
          position: [22.06, 1.98, 6.84],
        },
        {
          id: "transmembrane-protein",
          number: 3,
          label: "Protein xuyên màng",
          position: [58.19, -0.81, 6.81],
        },
        {
          id: "globular-protein",
          number: 4,
          label: "Protein hình cầu",
          position: [52.7, 6.5, 2.43],
        },
        {
          id: "glycoprotein",
          number: 5,
          label: "Protein gắn carbohydrate (Glycoprotein)",
          position: [53.6, 4.69, -24.04],
        },
        {
          id: "alpha-helix-protein",
          number: 6,
          label: "Protein xoắn α",
          position: [40.54, 4.25, -14.2],
        },
        {
          id: "carbohydrate-chain",
          number: 7,
          label: "Chuỗi đường",
          position: [17.52, 5.8, -23.55],
        },
        {
          id: "glycolipid",
          number: 8,
          label: "Lipid gắn carbohydrate",
          position: [5.175, 5.291, -1.659],
        },
        {
          id: "peripheral-membrane-protein",
          number: 9,
          label: "Protein màng ngoại vi",
          position: [36.7, -5.3, 6.8],
        },
        {
          id: "phospholipid-bilayer",
          number: 10,
          label: "Lớp kép phospholipid",
          position: [31.7, -0.2, 6.9],
        },
      ],
    }),
  ],
  // Tab 3
  carbohydrates: [
    nativeModel({
      id: "lop10-membrane-tab3-membrane-carbohydrates",
      name: "Protein màng, glycoprotein và glycolipid",
      type: "Protein và lipid gắn carbohydrate",
      description: editedContent.membraneCarbohydrate,
      url: "/new-models/Lop10_Màng sinh chất tổng thể_Tab3_plasma_membrane.glb",
      scale: 5,
      accent: "#8d6730",
      accentSoft: "#efe2ca",
      color: "#c79a55",
      defaultFocusId: "glycoprotein",
      annotations: [
        {
          id: "phospholipid-bilayer",
          number: 1,
          label: "Lớp kép phospholipid",
          position: [-0.09, 0.166, 0.173],
        },
        {
          id: "glycoprotein",
          number: 2,
          label: "Protein gắn carbohydrate (Glycoprotein)",
          position: [-0.389, 0.262, 0.164],
        },
        {
          id: "peripheral-membrane-protein",
          number: 3,
          label: "Protein màng ngoại vi",
          position: [-0.401, 0.087, 0.185],
        },
        {
          id: "carrier-protein",
          number: 4,
          label: "Protein vận chuyển",
          position: [0.052, 0.177, 0.169],
        },
        {
          id: "channel-protein",
          number: 5,
          label: "Protein kênh",
          position: [0.499, 0.224, 0.042],
        },
        {
          id: "integral-membrane-protein",
          number: 6,
          label: "Protein xuyên màng",
          position: [0.249, 0.26, -0.03],
        },
        {
          id: "alpha-helix-protein",
          number: 7,
          label: "Chuỗi xoắn α",
          position: [-0.193, 0.177, 0.189],
        },
        {
          id: "carbohydrate",
          number: 8,
          label: "Carbohydrate",
          position: [-0.344, 0.371, 0.158],
        },
      ],
    }),
  ],
};

const membraneTransportModels = {
  // Tab 1
  simpleDiffusion: [
    nativeModel({
      id: "lop10-membrane-transport-tab1-simple-diffusion",
      name: "Khuếch tán đơn giản",
      type: "Vận chuyển thụ động",
      description: editedContent.simpleDiffusion,
      url: "/new-models/Lop10_Membrane Transport_Tab1_Passive Transport Simple Diffusion.glb",
      scale: 5,
      accent: "#2f7d6c",
      accentSoft: "#d8eee8",
      color: "#62b7a2",
      defaultFocusId: "simple-diffusion-molecule",
      annotations: [
        {
          id: "simple-diffusion-molecule",
          number: 1,
          label: "Phân tử tham gia khuếch tán đơn giản",
          position: [0.347, -0.199, -0.381],
        },
        {
          id: "plasma-membrane",
          number: 2,
          label: "Màng sinh chất",
          position: [0.328, 0.073, 0.121],
        },
      ],
    }),
  ],
  // Tab 2
  facilitatedDiffusion: [
    nativeModel({
      id: "lop10-membrane-transport-tab2-facilitated-diffusion-channel",
      name: "Khuếch tán được hỗ trợ",
      type: "Vận chuyển thụ động qua protein kênh",
      description: editedContent.facilitatedDiffusion,
      url: "/new-models/Lop10_Membrane Transport_Tab2_Passive Transport - Facilitated Diffusion Channe.glb",
      scale: 5,
      accent: "#356d9a",
      accentSoft: "#d9e8f2",
      color: "#68a4d4",
      defaultFocusId: "channel-protein-01",
      annotations: [
        {
          id: "channel-protein-01",
          number: 1,
          label: "Protein kênh 01",
          position: [-0.34, 0.305, 0.297],
        },
        {
          id: "channel-protein-02",
          number: 2,
          label: "Protein kênh 02",
          position: [0.225, 0.206, 0.354],
        },
        {
          id: "channel-protein-03",
          number: 3,
          label: "Protein kênh 03",
          position: [0.004, 0.319, 0.026],
        },
        {
          id: "facilitated-diffusion-molecule-01",
          number: 4,
          label: "Phân tử tham gia khuếch tán được hỗ trợ 01",
          position: [0.274, 0.16, 0.345],
        },
        {
          id: "plasma-membrane",
          number: 5,
          label: "Màng sinh chất",
          position: [-0.129, 0.257, 0.337],
        },
      ],
    }),
  ],

  // Tab 3
  activeTransport: [
    nativeModel({
      id: "lop10-membrane-transport-tab3-active-transport-uniport",
      name: "Vận chuyển chủ động qua protein vận chuyển",
      type: "Vận chuyển chủ động",
      description: editedContent.activeTransport,
      url: "/new-models/Lop10_Membrane Transport_Tab3_Active Transport - Uniport by Carrier Protein.glb",
      scale: 5,
      accent: "#8d6730",
      accentSoft: "#efe2ca",
      color: "#c79a55",
      defaultFocusId: "transported-molecule",
      annotations: [
        {
          id: "transported-molecule",
          number: 1,
          label: "Phân tử được vận chuyển",
          position: [-0.008, 0.169, 0.15],
        },
        {
          id: "plasma-membrane",
          number: 2,
          label: "Màng sinh chất",
          position: [-0.243, 0.267, 0.091],
        },
        {
          id: "carrier-protein",
          number: 3,
          label: "Protein vận chuyển",
          position: [-0.033, 0.25, 0.117],
        },
      ],
    }),
  ],
  // Tab 4
  exocytosis: [
    nativeModel({
      id: "lop10-membrane-transport-tab4-exocytosis",
      name: "Xuất bào",
      type: "Vận chuyển chủ động bằng túi",
      description: editedContent.exocytosis,
      url: "/new-models/Lop10_Membrane Transport_Tab4_Active Transport - Exocytosis.glb",
      scale: 5,
      accent: "#8f4f55",
      accentSoft: "#efdadd",
      color: "#c7737a",
      defaultFocusId: "exocytosis",
      annotations: [
        {
          id: "plasma-membrane",
          number: 1,
          label: "Màng sinh chất",
          position: [-0.234, 0.337, 0.065],
        },
        {
          id: "exocytosed-substance",
          number: 2,
          label: "Chất được xuất bào",
          position: [-0.0, 0.17, 0.006],
        },
      ],
    }),
  ],
};

const mitosisModels = {
  chromosomeStructure: [
    nativeModel({
      id: "lop10-mitosis-tab1-double-chromosome",
      name: "Cấu tạo nhiễm sắc thể",
      type: "Nhiễm sắc thể kép",
      description: editedContent.mitosisChromosome,
      url: "/new-models/Lop10_Mitosis_Tab1_genes_dna_chromosmes.glb",
      scale: 0.5,
      position: [4, 0, 1],
      accent: "#7c4f9f",
      accentSoft: "#e9ddf2",
      color: "#a278c8",
      defaultFocusId: "centromere",
      annotations: [
        {
          id: "double-chromosome",
          number: 1,
          label: "Nhiễm sắc thể kép",
          position: [8.284, 6.5, -1.442],
        },
        {
          id: "chromatid",
          number: 2,
          label: "Chromatid",
          position: [7.193, 6.575, -1.381],
        },
        {
          id: "dna",
          number: 3,
          label: "DNA",
          position: [4.628, 1.691, 1.203],
        },
        {
          id: "centromere",
          number: 4,
          label: "Tâm động",
          position: [8.233, 3.226, -1.042],
        },
        {
          id: "p-arm",
          number: "5a",
          label: "Cánh p",
          position: [9.692, 5.148, -1.538],
        },
        {
          id: "q-arm",
          number: "5b",
          label: "Cánh q",
          position: [9.692, 0.822, -1.404],
        },
        {
          id: "cell",
          number: "6",
          label: "Tế bào",
          position: [-0.042, 0.585, 0.491],
        },
      ],
    }),
  ],
};

export const lop10Modules: LessonItem[] = [
  {
    id: "lop10-carbon-va-nuoc-trong-te-bao",
    name: "Carbon và nước trong tế bào",
    overviewText:
      "Mô hình gồm 3 tab: Carbon tạo 4 liên kết, Glucose mạch thẳng và mạch vòng, Nước và liên kết hydrogen.",
    tabs: [
      {
        id: "carbon-tao-4-lien-ket",
        title: "Carbon tạo 4 liên kết",
        mainText: editedContent.carbon,
        sourceLinks: [
          "https://sketchfab.com/3d-models/methane-molecule-3d-models-for-education-de63badb5ae14aa189bfe9e733525de9",
          "https://sketchfab.com/3d-models/ethane-molecular-form-01003f579d3141d1a9bbde2a4da2cda6",
        ],
        models: carbonTabModels,
      },
      {
        id: "glucose-mach-thang-va-mach-vong",
        title: "Glucose mạch thẳng và mạch vòng",
        mainText: editedContent.glucoseCarbon,
        sourceLinks: [
          "https://sketchfab.com/3d-models/glucose-molecule-10659ca1502c4ade88abba6284bb50f2",
          "https://sketchfab.com/3d-models/glucose-mutarotation-240a13d47b0a47b5b506cda04efee770",
        ],
        models: glucoseTabModels,
      },
      {
        id: "nuoc-va-lien-ket-hydrogen",
        title: "Nước phân cực và liên kết hydrogen",
        mainText: editedContent.water,
        sourceLinks: [
          "https://sketchfab.com/3d-models/h2o-molecule-e181944932084b5dbb4d5b625a5e9b10",
        ],
        models: waterTabModels,
      },
    ],
  },
  {
    id: "lop10-carbohydrate",
    name: "Carbohydrate",
    overviewText:
      "Màn hình tổng thể gồm 3 tab: đường đơn glucose, đường đôi, đường đa tinh bột. Mỗi tab dùng đúng các mô hình đã có trong cột nguồn.",
    tabs: [
      {
        id: "monosaccharide-glucose",
        title: "Monosaccharide: glucose",
        mainText: editedContent.monosaccharide,
        sourceLinks: [
          "https://sketchfab.com/3d-models/glucose-molecule-10659ca1502c4ade88abba6284bb50f2",
          "https://sketchfab.com/3d-models/glucose-mutarotation-240a13d47b0a47b5b506cda04efee770",
          "https://sketchfab.com/3d-models/d-glucose-f044c0a2bb3f4d3ba1923c27ab4c5e8d",
        ],
        models: carbohydrateMonosaccharideModels,
      },
      {
        id: "disaccharide",
        title: "Disaccharide",
        mainText: editedContent.disaccharide,
        sourceLinks: [
          "https://sketchfab.com/3d-models/maltose-5d76df25af1449d4baececae85bc133d",
          "https://sketchfab.com/3d-models/sucrose-molecule-adc74f80cf52473cb42ec0e999de7f77",
          "https://sketchfab.com/3d-models/sucrose-41c1b007b3ed42abae34a70b3352047c",
        ],
        models: carbohydrateDisaccharideModels,
      },
      {
        id: "polysaccharide-tinh-bot",
        title: "Polysaccharide: tinh bột",
        mainText: editedContent.starch,
        sourceLinks: [
          "https://sketchfab.com/3d-models/starch-3d-model-81b1c7b59b2643ad82ceb4d128278bbf",
          "https://www.acs.org/education/resources/undergraduate/chemistryincontext/interactives/nutrition/3d-model-starch.html",
        ],
        models: carbohydratePolysaccharideModels,
      },
    ],
  },
  {
    id: "lop10-lipid-va-phospholipid",
    name: "Lipid và phospholipid",
    overviewText:
      "Màn hình tổng thể gồm 3 tab: chất béo trung tính, một phân tử phospholipid, lớp kép phospholipid. Ba tab đi theo trình tự từ cấu tạo lipid đơn lẻ đến cấu trúc lớp kép.",
    tabs: [
      {
        id: "triglyceride",
        title: "Triglyceride",
        mainText: editedContent.triglyceride,
        sourceLinks: [
          "https://sketchfab.com/3d-models/triglyceride-f4e158afb17143c89c80ead35f66b3ff",
        ],
        models: lipidModels.triglyceride,
      },
      {
        id: "mot-phan-tu-phospholipid",
        title: "Một phân tử phospholipid",
        mainText: editedContent.phospholipid,
        sourceLinks: [
          "https://sketchfab.com/3d-models/phospholipid-f7b83eec8c9b4f15a5791e2a17a954ac",
          "https://sketchfab.com/3d-models/a-lipid-bilayer-as-it-occurs-in-cell-membranes-b4dbe55f5df34af5a4d57cd713a107dd",
        ],
        models: lipidModels.phospholipid,
      },
      {
        id: "lop-kep-phospholipid",
        title: "Lớp kép phospholipid",
        mainText: editedContent.phospholipidBilayer,
        sourceLinks: [
          "https://sketchfab.com/3d-models/a-lipid-bilayer-as-it-occurs-in-cell-membranes-b4dbe55f5df34af5a4d57cd713a107dd",
        ],
        models: lipidModels.bilayer,
      },
    ],
  },
  {
    id: "lop10-protein",
    name: "Protein",
    overviewText:
      "Màn hình tổng thể gồm 3 tab: Amino acid, Các cấp cấu trúc protein, Enzyme và trung tâm hoạt động. Các tab đi từ đơn phân đến cấu trúc protein và chức năng xúc tác.",
    tabs: [
      {
        id: "amino-acid",
        title: "Amino acid",
        mainText: editedContent.aminoAcid,
        sourceLinks: [
          "https://sketchfab.com/3d-models/glycine-e7d8bd505d4e4ed183e458d95eb396c9",
          "https://sketchfab.com/3d-models/alanine-c0e244c6b2bc4e68864102015c98eea7",
        ],
        models: proteinModels.aminoAcids,
      },
      {
        id: "cac-cap-cau-truc-protein",
        title: "Các bậc cấu trúc của phân tử protein",
        mainText: editedContent.proteinStructure,
        sourceLinks: [
          "https://sketchfab.com/3d-models/human-hexokinase-protein-d963bcdebd7140908ddf8e7f94610dee",
        ],
        models: proteinModels.structure,
      },
    ],
  },
  {
    id: "lop10-nucleic-acid-dna-rna",
    name: "Nucleic acid - DNA và RNA",
    overviewText:
      "Màn hình tổng thể gồm 3 tab: Nucleotide, DNA xoắn kép, RNA đơn mạch. Các tab đi từ đơn phân đến DNA và RNA.",
    tabs: [
      {
        id: "nucleotide",
        title: "Nucleotide",
        mainText: editedContent.nucleotide,
        sourceLinks: [
          "https://sketchfab.com/3d-models/dna-nucleotide-4ff9b29e7952443ca050e15dff05256a",
          "https://sketchfab.com/3d-models/dna-double-helix-base-pairing-model-5b3bdf0a379648b8a8896b86f591ee07",
        ],
        models: nucleicAcidModels.nucleotide,
      },
      {
        id: "dna-xoan-kep",
        title: "DNA xoắn kép",
        mainText: editedContent.dna,
        sourceLinks: [
          "https://sketchfab.com/3d-models/dna-rna-animated-visualization-f0ef115f9e9646a28642a2d509b8d727",
        ],
        models: nucleicAcidModels.dna,
      },
      {
        id: "rna-don-mach",
        title: "RNA đơn mạch",
        mainText: editedContent.rna,
        sourceLinks: [
          "https://sketchfab.com/3d-models/molecular-structure-of-the-transfer-rna-trna-b2052daba15f49edab6aa3242efbb1cc",
        ],
        models: nucleicAcidModels.rna,
      },
    ],
  },
  {
    id: "lop10-mang-sinh-chat-tong-the",
    name: "Màng sinh chất",
    overviewText:
      "Mô hình màng sinh chất gồm 2 tab: cấu trúc khảm lỏng và protein màng kèm chuỗi đường trên màng.",
    tabs: [
      {
        id: "cau-truc-kham-long",
        title: "Lớp kép phospholipid và cholesterol",
        mainText: editedContent.phospholipidBilayer2,
        models: membraneModels.bilayer,
      },
      {
        id: "protein-mang",
        title: "Protein màng, glycoprotein và glycolipid",
        mainText: `${editedContent.membraneOverview}

${editedContent.membraneCarbohydrate}`,
        models: membraneModels.carbohydrates,
      },
    ],
  },
  // {
  //   id: "lop10-van-chuyen-qua-mang",
  //   name: "Vận chuyển qua màng",
  //   overviewText:
  //     "Mô hình vận chuyển qua màng gồm 4 tab: khuếch tán đơn giản, khuếch tán được hỗ trợ, vận chuyển chủ động qua protein vận chuyển và xuất bào.",
  //   tabs: [
  //     {
  //       id: "khuech-tan-don-gian",
  //       title: "Khuếch tán đơn giản",
  //       mainText: editedContent.simpleDiffusion,
  //       models: membraneTransportModels.simpleDiffusion,
  //     },
  //     {
  //       id: "khuech-tan-duoc-ho-tro",
  //       title: "Khuếch tán qua kênh protein",
  //       mainText: editedContent.facilitatedDiffusion,
  //       models: membraneTransportModels.facilitatedDiffusion,
  //     },
  //     {
  //       id: "van-chuyen-chu-dong",
  //       title: "Vận chuyển chủ động",
  //       mainText: editedContent.activeTransport,
  //       models: membraneTransportModels.activeTransport,
  //     },
  //     {
  //       id: "xuat-bao",
  //       title: "Nhập bào và xuất bào",
  //       mainText: editedContent.exocytosis,
  //       models: membraneTransportModels.exocytosis,
  //     },
  //   ],
  // },
  {
    id: "lop10-nguyen-phan-nst-thoi-phan-bao",
    name: "Nguyên phân - NST và thoi phân bào",
    overviewText:
      "Màn hình đầu gồm 1 tab: cấu tạo nhiễm sắc thể kép. Tab này dùng mô hình tĩnh để xoay, phóng to và quan sát các thành phần của nhiễm sắc thể kép.",
    tabs: [
      {
        id: "cau-tao-nhiem-sac-the-kep",
        title: "Cấu tạo nhiễm sắc thể kép",
        mainText: editedContent.mitosisChromosome,
        sourceLinks: [
          "https://sketchfab.com/3d-models/genes-dna-chromosmes-983805ece2cf473fb711debe77ba0ff9",
          "https://www.youtube.com/watch?v=wZozOrFluiw",
        ],
        models: mitosisModels.chromosomeStructure,
      },
    ],
  },
];
