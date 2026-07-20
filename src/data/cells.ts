export type ModelKind =
  | "plant"
  | "dna"
  | "chromosome"
  | "rootSystem"
  | "plantVascular"
  | "leafStomata"
  | "chloroplast"
  | "mitochondria"
  | "translation"
  | "digestiveSystem"
  | "gasExchange"
  | "cardiovascular"
  | "immuneSystem"
  | "urinarySystem"
  | "nervousSystem"
  | "senseOrgans"
  | "plantStemGrowth"
  | "plantReproduction"
  | "humanReproduction"
  | "bioMolecules"
  | "prokaryoticCell"
  | "eukaryoticCell"
  | "membraneTransport"
  | "virus"
  | "mitosis";

export type ViewMode = "mesh" | "focus";

export type ModelAnnotation = {
  id: string;
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
  previewUrl: string;
  scale: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  annotations?: ModelAnnotation[];
  exposure?: number;
  materialMode?: "studio" | "native";
  preserveNativeColor?: boolean;
};

export type CellRenderImage = {
  url: string;
};

export type CellItem = {
  id: string;
  name: string;
  type: string;
  accent: string;
  accentSoft: string;
  color: string;
  modelKind: ModelKind;
  defaultFocusId: string;
  annotations?: ModelAnnotation[];
  modelLinks?: ModelLink[];
  modelAsset?: CellModelAsset;
  renderImage?: CellRenderImage;
};

type AnnotationSource = readonly [label: string, description: string];
type AnnotationBounds = {
  min: [number, number, number];
  max: [number, number, number];
};

function makeAnnotations(
  entries: readonly AnnotationSource[],
  bounds: AnnotationBounds,
): ModelAnnotation[] {
  const columns = Math.ceil(Math.sqrt(entries.length));
  const rows = Math.ceil(entries.length / columns);
  const zPattern = [0.18, 0.5, 0.82, 0.32, 0.68];
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return entries.map(([label, description], index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const xT = 0.14 + 0.72 * ((column + 0.5) / columns);
    const yT = 0.14 + 0.72 * ((row + 0.5) / rows);
    const zT = zPattern[index % zPattern.length];

    return {
      id: `annotation-${index + 1}`,
      label,
      description,
      position: [
        Number(lerp(bounds.min[0], bounds.max[0], xT).toFixed(4)),
        Number(lerp(bounds.max[1], bounds.min[1], yT).toFixed(4)),
        Number(lerp(bounds.min[2], bounds.max[2], zT).toFixed(4)),
      ],
    };
  });
}

const lop10Annotations = {
  glucose: [
    {
      id: "monosaccharide",
      label: "Đường đơn",
      description:
        "Đường đơn như glucose là đơn phân cơ bản của carbohydrate, cung cấp năng lượng nhanh cho tế bào.",
      position: [-6.2, 1.6, -14.8],
    },
    {
      id: "disaccharide",
      label: "Đường đôi",
      description: "Đường đôi được tạo từ hai đường đơn liên kết với nhau.",
      position: [4.4, 1.2, -8.4],
    },
    {
      id: "glycosidic-bond",
      label: "Liên kết glycosidic",
      description:
        "Liên kết nối các đơn phân đường để tạo đường đôi hoặc đường đa.",
      position: [-0.8, -0.2, 2.2],
    },
    {
      id: "starch",
      label: "Tinh bột",
      description:
        "Polysaccharide dự trữ ở thực vật, được tạo từ nhiều đơn phân glucose.",
      position: [-5.6, -1.7, 11.6],
    },
    {
      id: "glycogen",
      label: "Glycogen",
      description: "Polysaccharide dự trữ ở động vật và nấm.",
      position: [4.6, -1.4, 15.8],
    },
    {
      id: "cellulose",
      label: "Cellulose",
      description:
        "Polysaccharide cấu trúc, là thành phần chính của thành tế bào thực vật.",
      position: [-1.1, 1.8, 20.2],
    },
    {
      id: "chitin",
      label: "Chitin",
      description:
        "Polysaccharide cấu trúc, có ở thành tế bào nấm và vỏ ngoài của côn trùng/giáp xác.",
      position: [2.6, -2.0, -17.0],
    },
  ],
  lipid: [
    {
      id: "triglyceride",
      label: "Triglyceride",
      description:
        "Gồm glycerol liên kết với 3 acid béo, có vai trò dự trữ năng lượng lâu dài.",
      position: [-96, 7.6, -13.2],
    },
    {
      id: "fatty-acid",
      label: "Acid béo",
      description: "Chuỗi hydrocarbon kị nước, làm lipid không tan trong nước.",
      position: [72, 6.4, 11.6],
    },
    {
      id: "glycerol",
      label: "Glycerol",
      description: "Khung liên kết với acid béo để tạo triglyceride.",
      position: [-42, -2.4, -14.4],
    },
    {
      id: "phospholipid",
      label: "Phospholipid",
      description:
        "Gồm đầu ưa nước và hai đuôi kị nước, là thành phần chính của màng sinh chất.",
      position: [28, -8.4, 12.4],
    },
    {
      id: "hydrophilic-head",
      label: "Đầu ưa nước",
      description: "Phần phosphate phân cực, quay ra môi trường nước.",
      position: [-72, -7.2, 5.8],
    },
    {
      id: "hydrophobic-tails",
      label: "Đuôi kị nước",
      description:
        "Hai đuôi acid béo không phân cực, quay vào trong lớp màng để tránh nước.",
      position: [4, 9.2, -15.6],
    },
    {
      id: "phospholipid-bilayer",
      label: "Lớp kép phospholipid",
      description: "Hai lớp phospholipid tạo nền cấu trúc của màng tế bào.",
      position: [68, -6.8, -8.8],
    },
    {
      id: "steroid",
      label: "Steroid nếu có",
      description:
        "Lipid có cấu trúc vòng; một số steroid tham gia cấu tạo màng hoặc điều hòa sinh lí.",
      position: [78, 2.2, -5.2],
    },
  ],
  protein: [
    {
      id: "amino-acid",
      label: "Amino acid",
      description:
        "Đơn phân cấu tạo protein, gồm nhóm -NH2, nhóm -COOH, H và gốc R.",
      position: [-28, 24, -34],
    },
    {
      id: "r-group",
      label: "Gốc R",
      description:
        "Phần khác nhau giữa các amino acid, quyết định đặc điểm riêng của từng amino acid.",
      position: [-12, 34, 28],
    },
    {
      id: "peptide-bond",
      label: "Liên kết peptide",
      description:
        "Liên kết nối các amino acid lại với nhau để tạo chuỗi polypeptide.",
      position: [8, 18, -40],
    },
    {
      id: "polypeptide-chain",
      label: "Chuỗi polypeptide",
      description:
        "Chuỗi gồm nhiều amino acid; trình tự amino acid tạo cấu trúc bậc 1 của protein.",
      position: [30, 4, 30],
    },
    {
      id: "alpha-helix",
      label: "Xoắn alpha",
      description:
        "Một dạng cấu trúc bậc 2 của protein, được giữ ổn định nhờ liên kết hydrogen.",
      position: [38, -24, -18],
    },
    {
      id: "beta-sheet",
      label: "Gấp nếp beta",
      description: "Một dạng cấu trúc bậc 2 khác của protein.",
      position: [-24, -32, 18],
    },
    {
      id: "three-dimensional-structure",
      label: "Cấu trúc 3D",
      description:
        "Cấu trúc không gian bậc 3 quyết định chức năng đặc hiệu của protein.",
      position: [0, -38, -34],
    },
    {
      id: "multiple-polypeptides",
      label: "Nhiều chuỗi polypeptide",
      description:
        "Khi nhiều chuỗi polypeptide kết hợp, protein có cấu trúc bậc 4.",
      position: [28, 28, 6],
    },
    {
      id: "protein-denaturation",
      label: "Biến tính protein",
      description:
        "Nhiệt độ hoặc pH không phù hợp có thể làm protein mất cấu trúc không gian và mất chức năng.",
      position: [-32, 2, -8],
    },
    {
      id: "enzyme",
      label: "Enzyme",
      description:
        "Enzyme là chất xúc tác sinh học, thường có bản chất protein, làm tăng tốc độ phản ứng và không bị tiêu hao sau phản ứng.",
      position: [10, -8, 40],
    },
    {
      id: "active-site",
      label: "Trung tâm hoạt động",
      description:
        "Vùng có hình dạng không gian phù hợp để gắn cơ chất; quyết định tính đặc hiệu của enzyme.",
      position: [42, 8, -2],
    },
    {
      id: "substrate",
      label: "Cơ chất",
      description:
        "Chất tham gia phản ứng và gắn tạm thời vào trung tâm hoạt động của enzyme.",
      position: [-4, 32, -8],
    },
    {
      id: "enzyme-substrate-complex",
      label: "Phức hệ enzyme - cơ chất",
      description:
        "Trạng thái tạm thời khi cơ chất gắn với enzyme trước khi tạo sản phẩm.",
      position: [-30, -18, -28],
    },
  ],
  dnaRna: [
    {
      id: "nucleotide",
      label: "Nucleotide",
      description:
        "Đơn phân cấu tạo nucleic acid, gồm phosphate, đường pentose và base nitrogen.",
      position: [6.05, -1.88, -8.65],
    },
    {
      id: "phosphate-group",
      label: "Nhóm phosphate",
      description: "Thành phần tham gia tạo khung mạch của nucleic acid.",
      position: [6.32, -0.48, -8.12],
    },
    {
      id: "pentose-sugar",
      label: "Đường pentose",
      description: "DNA có đường deoxyribose; RNA có đường ribose.",
      position: [6.18, -1.38, -8.78],
    },
    {
      id: "nitrogenous-base",
      label: "Base nitrogen",
      description: "DNA có A, T, G, C; RNA có A, U, G, C.",
      position: [6.48, -0.82, -8.22],
    },
    {
      id: "dna",
      label: "DNA",
      description:
        "Thường gồm hai mạch xoắn kép, có chức năng lưu giữ thông tin di truyền.",
      position: [6.72, -1.74, -8.48],
    },
    {
      id: "rna",
      label: "RNA",
      description:
        "Thường là một mạch, tham gia truyền đạt và thực hiện thông tin di truyền.",
      position: [7.42, -0.72, -8.2],
    },
    {
      id: "mrna",
      label: "mRNA",
      description: "Mang thông tin từ DNA đến ribosome để tổng hợp protein.",
      position: [7.18, -1.55, -8.36],
    },
    {
      id: "ribosome",
      label: "Ribosome",
      description: "Nơi tổng hợp protein dựa trên thông tin của mRNA.",
      position: [7.55, -1.05, -8.02],
    },
    {
      id: "protein-product",
      label: "Protein",
      description:
        "Sản phẩm được tạo ra theo thông tin di truyền: DNA -> mRNA -> protein.",
      position: [7.28, -1.92, -8.58],
    },
  ],
  prokaryoticCell: [
    {
      id: "cell-size",
      label: "Kích thước tế bào",
      description:
        "Tế bào nhân sơ thường có kích thước nhỏ, khoảng 1-10 micromet.",
      position: [-76, 58, 28],
    },
    {
      id: "capsule",
      label: "Vỏ nhầy",
      description:
        "Lớp ngoài cùng nếu có, giúp bảo vệ và hỗ trợ vi khuẩn bám dính. Không phải mọi vi khuẩn đều có vỏ nhầy.",
      position: [-64, 20, -42],
    },
    {
      id: "cell-wall",
      label: "Thành tế bào",
      description:
        "Thành tế bào vi khuẩn cấu tạo chủ yếu từ peptidoglycan, giúp duy trì hình dạng và bảo vệ tế bào.",
      position: [-36, -4, 32],
    },
    {
      id: "plasma-membrane",
      label: "Màng sinh chất",
      description:
        "Lớp kép phospholipid và protein, kiểm soát các chất đi vào và đi ra khỏi tế bào.",
      position: [-8, 68, -30],
    },
    {
      id: "cytoplasm",
      label: "Tế bào chất",
      description:
        "Môi trường bên trong tế bào, nơi diễn ra nhiều phản ứng sinh hóa.",
      position: [22, 24, 18],
    },
    {
      id: "ribosome-70s",
      label: "Ribosome 70S",
      description: "Nơi tổng hợp protein của tế bào nhân sơ.",
      position: [56, 50, -18],
    },
    {
      id: "nucleoid",
      label: "Vùng nhân",
      description:
        'Vùng chứa DNA vòng lớn, không có màng nhân bao bọc. Không gọi là "nhân tế bào".',
      position: [-18, 36, -4],
    },
    {
      id: "plasmid",
      label: "Plasmid",
      description:
        "Phân tử DNA vòng nhỏ, độc lập, có thể mang gene đặc biệt như gene kháng kháng sinh.",
      position: [28, 8, -34],
    },
    {
      id: "pili-fimbriae",
      label: "Pili/fimbriae",
      description:
        "Cấu trúc ngắn trên bề mặt, giúp bám dính hoặc trao đổi vật chất di truyền.",
      position: [70, 30, 4],
    },
    {
      id: "flagellum",
      label: "Lông roi",
      description:
        "Cấu trúc giúp một số vi khuẩn di chuyển. Không phải mọi vi khuẩn đều có lông roi.",
      position: [84, 6, -8],
    },
  ],
  animalCell: [
    {
      id: "plasma-membrane",
      label: "Màng sinh chất",
      description:
        "Bao bọc tế bào, kiểm soát trao đổi chất và tiếp nhận tín hiệu từ môi trường.",
      position: [-2.9, 0.74, 3.2],
    },
    {
      id: "cytoplasm",
      label: "Tế bào chất",
      description:
        "Phần nằm giữa màng sinh chất và nhân, chứa bào quan và là nơi diễn ra nhiều hoạt động sống.",
      position: [-2.0, -1.1, -2.4],
    },
    {
      id: "nucleus",
      label: "Nhân tế bào",
      description:
        "Chứa thông tin di truyền và điều khiển hoạt động của tế bào.",
      position: [-0.35, -0.05, 0.95],
    },
    {
      id: "nuclear-envelope",
      label: "Màng nhân",
      description:
        "Màng kép bao bọc nhân, có lỗ nhân kiểm soát trao đổi giữa nhân và tế bào chất.",
      position: [0.58, -0.18, 1.68],
    },
    {
      id: "nucleolus",
      label: "Hạch nhân",
      description:
        "Vùng trong nhân, tham gia tổng hợp rRNA và lắp ráp tiểu đơn vị ribosome.",
      position: [-0.55, 0.24, 0.35],
    },
    {
      id: "chromatin-dna",
      label: "Chất nhiễm sắc/DNA",
      description:
        "DNA kết hợp với protein, chứa thông tin di truyền của tế bào.",
      position: [0.88, 0.48, -0.88],
    },
    {
      id: "ribosome-80s",
      label: "Ribosome 80S",
      description:
        "Nơi tổng hợp protein trong tế bào chất của tế bào nhân thực.",
      position: [-1.85, -0.88, 1.88],
    },
    {
      id: "rough-er",
      label: "Lưới nội chất hạt",
      description:
        "Có ribosome bám trên màng, tham gia tổng hợp protein tiết ra ngoài hoặc protein màng.",
      position: [-1.25, -0.42, -1.8],
    },
    {
      id: "smooth-er",
      label: "Lưới nội chất trơn",
      description:
        "Không có ribosome, tham gia tổng hợp lipid, chuyển hóa đường và khử độc.",
      position: [0.2, -1.75, 2.65],
    },
    {
      id: "golgi-apparatus",
      label: "Bộ máy Golgi",
      description:
        "Chế biến, đóng gói và phân phối protein/lipid đến nơi cần thiết.",
      position: [1.55, -0.78, -1.65],
    },
    {
      id: "lysosome",
      label: "Lysosome",
      description:
        "Túi màng chứa enzyme thủy phân, tiêu hóa nội bào và tái chế bào quan hỏng.",
      position: [2.15, -1.52, 0.45],
    },
    {
      id: "mitochondrion",
      label: "Ti thể",
      description:
        "Bào quan hô hấp tế bào, tạo ATP cung cấp năng lượng cho hoạt động sống.",
      position: [-0.9, -2.25, -0.45],
    },
    {
      id: "centrosome",
      label: "Trung thể",
      description:
        "Gồm các trung tử, tham gia tổ chức thoi phân bào khi tế bào phân chia.",
      position: [1.7, 0.65, 2.7],
    },
    {
      id: "cytoskeleton",
      label: "Khung xương tế bào",
      description:
        "Mạng sợi protein giúp duy trì hình dạng tế bào và neo giữ bào quan.",
      position: [-2.45, 0.1, -0.35],
    },
    {
      id: "glycolysis",
      label: "Đường phân trong tế bào chất",
      description:
        "Đường phân diễn ra ở tế bào chất, biến glucose thành pyruvate và tạo một lượng nhỏ ATP; giai đoạn này không cần O2 trực tiếp.",
      position: [2.35, 0.25, -2.55],
    },
    {
      id: "mitochondrial-matrix",
      label: "Chất nền ti thể (matrix)",
      description:
        "Nơi diễn ra oxy hóa pyruvate và chu trình Krebs trong hô hấp hiếu khí.",
      position: [-1.7, -2.45, 0.9],
    },
    {
      id: "inner-membrane-cristae",
      label: "Màng trong ti thể và mào ti thể",
      description:
        "Nơi đặt chuỗi truyền electron và ATP synthase; mào ti thể làm tăng diện tích bề mặt để tạo nhiều ATP.",
      position: [1.25, -1.9, 1.85],
    },
  ],
  plantCell: [
    {
      id: "cell-wall",
      label: "Thành tế bào",
      description:
        "Cấu tạo chủ yếu từ cellulose, nằm ngoài màng sinh chất, giúp tế bào cứng chắc và được bảo vệ.",
      position: [-96, 20, -210],
    },
    {
      id: "plasma-membrane",
      label: "Màng sinh chất",
      description:
        "Nằm sát bên trong thành tế bào, kiểm soát chất đi vào và đi ra khỏi tế bào.",
      position: [138, -52, -188],
    },
    {
      id: "cytoplasm",
      label: "Tế bào chất",
      description: "Chứa bào quan và là nơi diễn ra nhiều phản ứng sinh hóa.",
      position: [0, -42, -40],
    },
    {
      id: "nucleus",
      label: "Nhân tế bào",
      description: "Chứa DNA và điều khiển hoạt động của tế bào.",
      position: [50, -8, 56],
    },
    {
      id: "central-vacuole",
      label: "Không bào trung tâm",
      description:
        "Túi lớn chứa dịch tế bào, giúp dự trữ nước/chất tan và duy trì sức trương của tế bào.",
      position: [42, -38, -140],
    },
    {
      id: "chloroplast",
      label: "Lục lạp",
      description:
        "Bào quan quang hợp, chứa hệ thylakoid/grana và chất nền stroma.",
      position: [-64, -14, 72],
    },
    {
      id: "mitochondrion",
      label: "Ti thể",
      description:
        "Bào quan hô hấp tế bào, tạo ATP; tế bào thực vật vẫn có ti thể.",
      position: [112, -44, 86],
    },
    {
      id: "ribosome-80s",
      label: "Ribosome 80S",
      description: "Nơi tổng hợp protein trong tế bào chất.",
      position: [-28, -62, 120],
    },
    {
      id: "endoplasmic-reticulum",
      label: "Lưới nội chất",
      description:
        "Hệ thống màng tham gia tổng hợp và vận chuyển protein/lipid.",
      position: [132, -22, -24],
    },
    {
      id: "golgi-apparatus",
      label: "Bộ máy Golgi",
      description: "Chế biến, đóng gói và phân phối sản phẩm của tế bào.",
      position: [-72, -46, -82],
    },
    {
      id: "plasmodesmata",
      label: "Cầu sinh chất nếu có",
      description:
        "Kênh nối giữa các tế bào thực vật, giúp trao đổi chất và thông tin giữa các tế bào kề nhau.",
      position: [166, -58, 142],
    },
    {
      id: "thylakoid-membrane",
      label: "Màng thylakoid",
      description:
        "Vị trí diễn ra pha sáng của quang hợp; tại đây hệ sắc tố hấp thụ ánh sáng để tạo ATP, NADPH và giải phóng O2 từ nước.",
      position: [-40, -18, 150],
    },
    {
      id: "photosynthetic-pigments",
      label: "Hệ sắc tố quang hợp",
      description:
        "Diệp lục và sắc tố phụ nằm trên màng thylakoid, có vai trò hấp thụ năng lượng ánh sáng.",
      position: [86, 10, 112],
    },
    {
      id: "stroma",
      label: "Stroma",
      description:
        "Chất nền của lục lạp, nơi diễn ra pha tối/chu trình Calvin để cố định CO2 tạo chất hữu cơ.",
      position: [-86, -36, 16],
    },
  ],
  plasmaMembrane: [
    {
      id: "phospholipid",
      label: "Phospholipid",
      description:
        "Phân tử chính tạo lớp kép màng, gồm đầu ưa nước và hai đuôi kị nước.",
      position: [-2, 6.6, -30],
    },
    {
      id: "hydrophilic-head",
      label: "Đầu ưa nước",
      description:
        "Quay ra ngoài, tiếp xúc với môi trường nước trong và ngoài tế bào.",
      position: [12, -6.5, -24],
    },
    {
      id: "hydrophobic-tails",
      label: "Đuôi kị nước",
      description: "Quay vào trong màng, tránh tiếp xúc với nước.",
      position: [24, 7.2, -18],
    },
    {
      id: "phospholipid-bilayer",
      label: "Lớp kép phospholipid",
      description:
        "Nền cấu trúc của màng sinh chất, tạo hàng rào thấm chọn lọc.",
      position: [36, -7.4, -12],
    },
    {
      id: "integral-protein",
      label: "Protein xuyên màng",
      description:
        "Protein đi xuyên qua lớp kép, có thể tạo kênh hoặc chất vận chuyển.",
      position: [50, 6.8, -6],
    },
    {
      id: "peripheral-protein",
      label: "Protein bám màng",
      description:
        "Gắn ở một phía của màng, tham gia hỗ trợ cấu trúc hoặc truyền tín hiệu.",
      position: [60, -5.4, 4],
    },
    {
      id: "protein-channel",
      label: "Kênh protein",
      description:
        "Cho một số ion hoặc phân tử phân cực đi qua màng theo tính chọn lọc.",
      position: [6, 1.2, 6],
    },
    {
      id: "receptor-protein",
      label: "Protein thụ thể",
      description:
        "Tiếp nhận tín hiệu từ môi trường ngoài và truyền thông tin vào trong tế bào.",
      position: [18, -1.8, -2],
    },
    {
      id: "glycoprotein-glycolipid",
      label: "Glycoprotein/glycolipid",
      description: "Tham gia nhận biết tế bào và giao tiếp giữa các tế bào.",
      position: [32, 1.8, -26],
    },
    {
      id: "cholesterol",
      label: "Cholesterol nếu có",
      description:
        "Giúp điều chỉnh độ linh hoạt của màng sinh chất ở tế bào động vật.",
      position: [46, -1.2, -20],
    },
    {
      id: "fluid-mosaic-model",
      label: "Mô hình khảm lỏng",
      description:
        "Màng không cứng cố định; phospholipid và protein có thể di chuyển trong mặt phẳng màng.",
      position: [58, 2.2, -14],
    },
  ],
  membraneTransport: [
    {
      id: "simple-diffusion",
      label: "Khuếch tán trực tiếp",
      description:
        "Chất nhỏ, không phân cực như O2, CO2 đi qua lớp lipid theo chiều gradient, không tốn ATP.",
      position: [-0.34, 0.16, -0.42],
    },
    {
      id: "channel-diffusion",
      label: "Khuếch tán qua kênh",
      description:
        "Ion hoặc phân tử phân cực đi qua kênh protein theo chiều gradient, không tốn ATP.",
      position: [-0.24, -0.14, -0.28],
    },
    {
      id: "osmosis",
      label: "Thẩm thấu",
      description:
        "Nước đi qua màng bán thấm từ nơi có nồng độ chất tan thấp đến nơi có nồng độ chất tan cao hơn.",
      position: [-0.1, 0.16, -0.12],
    },
    {
      id: "active-transport",
      label: "Vận chuyển chủ động",
      description:
        "Chất được vận chuyển ngược chiều gradient, cần protein bơm và tiêu tốn ATP.",
      position: [0.04, -0.14, 0.04],
    },
    {
      id: "sodium-potassium-pump",
      label: "Bơm Na+/K+ nếu có",
      description: "Bơm 3 Na+ ra ngoài và 2 K+ vào trong tế bào, tiêu tốn ATP.",
      position: [0.18, 0.16, 0.18],
    },
    {
      id: "endocytosis",
      label: "Nhập bào",
      description:
        "Màng sinh chất lõm vào, bao lấy vật chất và tạo túi đưa vào tế bào.",
      position: [0.32, -0.14, 0.34],
    },
    {
      id: "phagocytosis",
      label: "Thực bào",
      description:
        "Một dạng nhập bào, tế bào đưa vật rắn lớn như vi khuẩn vào bên trong.",
      position: [-0.32, -0.02, 0.42],
    },
    {
      id: "pinocytosis",
      label: "Ẩm bào",
      description:
        "Một dạng nhập bào, tế bào đưa giọt dịch nhỏ từ môi trường vào trong.",
      position: [0, 0.02, 0.5],
    },
    {
      id: "exocytosis",
      label: "Xuất bào",
      description:
        "Túi tiết hợp nhất với màng sinh chất để giải phóng chất ra ngoài tế bào.",
      position: [0.32, 0.02, 0.42],
    },
  ],
  virus: [
    {
      id: "nucleic-acid-core",
      label: "Lõi nucleic acid",
      description:
        "Vật chất di truyền của virus, có thể là DNA hoặc RNA tùy loại virus.",
      position: [-104, 92, 84],
    },
    {
      id: "capsid",
      label: "Capsid",
      description: "Vỏ protein bao quanh và bảo vệ lõi nucleic acid.",
      position: [-70, 32, -100],
    },
    {
      id: "capsomere",
      label: "Capsomere nếu có",
      description: "Đơn vị protein cấu tạo nên capsid.",
      position: [0, 118, 0],
    },
    {
      id: "envelope",
      label: "Vỏ ngoài nếu có",
      description:
        "Lớp màng lipid bao ngoài capsid ở một số virus; không phải virus nào cũng có vỏ ngoài.",
      position: [68, -88, 72],
    },
    {
      id: "glycoprotein-spike",
      label: "Gai glycoprotein",
      description:
        "Cấu trúc trên bề mặt giúp virus bám vào tế bào chủ phù hợp.",
      position: [104, 50, -62],
    },
    {
      id: "no-cellular-structure",
      label: "Không có cấu tạo tế bào",
      description:
        "Virus không có tế bào chất, không có bào quan và không có màng nhân.",
      position: [-36, -110, 0],
    },
    {
      id: "host-dependent",
      label: "Phụ thuộc tế bào chủ",
      description:
        "Virus không tự sinh sản độc lập, phải nhân lên bên trong tế bào chủ.",
      position: [42, 0, 112],
    },
  ],
  bacteriophage: [
    {
      id: "polyhedral-virus",
      label: "Virus đa diện",
      description: "Capsid có dạng hình khối đều, bao quanh nucleic acid.",
      position: [-0.28, 0.42, 0.3],
    },
    {
      id: "helical-virus",
      label: "Virus dạng xoắn",
      description: "Capsid sắp xếp xoắn quanh nucleic acid.",
      position: [0.28, 0.34, -0.28],
    },
    {
      id: "enveloped-virus",
      label: "Virus có vỏ ngoài",
      description:
        "Có lớp vỏ lipid và gai bề mặt, thường dễ bị phá hủy bởi xà phòng/chất tẩy phù hợp.",
      position: [-0.32, 0.02, 0.36],
    },
    {
      id: "bacteriophage",
      label: "Thực khuẩn thể",
      description: "Virus lây nhiễm vi khuẩn, thường có đầu, đuôi và sợi đuôi.",
      position: [0, -0.04, 0],
    },
    {
      id: "bacteriophage-head",
      label: "Đầu thực khuẩn thể",
      description: "Phần chứa nucleic acid của thực khuẩn thể.",
      position: [0.22, 0.28, 0.12],
    },
    {
      id: "tail-fibers",
      label: "Đuôi và sợi đuôi",
      description:
        "Giúp thực khuẩn thể bám vào vi khuẩn và đưa vật chất di truyền vào tế bào chủ.",
      position: [0.12, -0.42, -0.28],
    },
  ],
  influenza: [
    {
      id: "hiv-envelope",
      label: "Vỏ ngoài của HIV",
      description:
        "Lớp màng bao ngoài, có các gai glycoprotein giúp bám vào tế bào đích.",
      position: [-7.62, -128.96, 31.28],
    },
    {
      id: "hiv-capsid",
      label: "Capsid HIV",
      description:
        "Vỏ protein bên trong, bao bọc RNA và enzyme cần cho quá trình nhân lên.",
      position: [-7.18, -128.44, 31.72],
    },
    {
      id: "hiv-rna",
      label: "RNA của HIV",
      description: "Vật chất di truyền của HIV là RNA.",
      position: [-6.86, -128.28, 31.98],
    },
    {
      id: "reverse-transcriptase",
      label: "Enzyme phiên mã ngược",
      description:
        "Enzyme đặc trưng giúp HIV chuyển thông tin từ RNA thành DNA trong tế bào chủ.",
      position: [-6.42, -128.28, 31.92],
    },
    {
      id: "influenza-envelope",
      label: "Vỏ ngoài virus cúm",
      description:
        "Lớp màng bao ngoài có gai bề mặt, giúp virus cúm bám và xâm nhập tế bào đường hô hấp.",
      position: [-5.96, -128.86, 31.36],
    },
    {
      id: "influenza-surface-spikes",
      label: "Gai bề mặt virus cúm",
      description:
        "Cấu trúc giúp virus cúm bám vào tế bào và tham gia giải phóng virus mới.",
      position: [-7.38, -128.22, 31.86],
    },
    {
      id: "segmented-rna",
      label: "RNA phân đoạn của virus cúm",
      description:
        "Hệ gene RNA phân đoạn góp phần làm virus cúm dễ xuất hiện biến thể.",
      position: [-6.34, -128.72, 32.08],
    },
  ],
  mitosis: [
    {
      id: "duplicated-chromosome",
      label: "NST kép",
      description:
        "NST đã nhân đôi, gồm hai chromatid chị em dính nhau ở tâm động.",
      position: [-42, 58, 16],
    },
    {
      id: "sister-chromatids",
      label: "Chromatid chị em",
      description:
        "Hai bản sao giống nhau của một NST sau pha S; tách nhau ở kỳ sau nguyên phân.",
      position: [42, 40, -16],
    },
    {
      id: "centromere",
      label: "Tâm động",
      description:
        "Vị trí gắn hai chromatid chị em và là nơi thoi phân bào bám để kéo NST.",
      position: [0, 12, 0],
    },
    {
      id: "spindle",
      label: "Thoi phân bào",
      description:
        "Hệ vi ống hình thành trong nguyên phân, giúp sắp xếp và phân li NST.",
      position: [-30, -18, -14],
    },
    {
      id: "equatorial-plane",
      label: "Mặt phẳng xích đạo",
      description:
        "Vị trí NST kép xếp thành hàng ở kỳ giữa; đây là lúc NST co xoắn cực đại, dễ quan sát nhất.",
      position: [30, -4, 14],
    },
    {
      id: "cell-poles",
      label: "Cực tế bào",
      description:
        "Hai phía đối diện của tế bào, nơi chromatid chị em di chuyển về trong kỳ sau.",
      position: [42, -50, -4],
    },
    {
      id: "nuclear-envelope",
      label: "Màng nhân",
      description:
        "Màng nhân tiêu biến ở kỳ đầu và tái xuất hiện ở kỳ cuối để tạo hai nhân mới.",
      position: [-34, 24, 8],
    },
    {
      id: "cytokinesis",
      label: "Phân chia tế bào chất",
      description:
        "Tế bào chất phân chia sau khi nhân phân chia, tạo hai tế bào con.",
      position: [0, -58, 12],
    },
    {
      id: "two-diploid-daughter-cells",
      label: "Hai tế bào con 2n",
      description:
        "Sau nguyên phân, một tế bào mẹ 2n tạo hai tế bào con 2n giống nhau và giống tế bào mẹ.",
      position: [-50, -70, -18],
    },
  ],
} satisfies Record<string, ModelAnnotation[]>;

const lop11Annotations = {
  internalRootStructure: makeAnnotations(
    [
      [
        "Vùng lông hút",
        "Vùng rễ có nhiều lông hút làm tăng diện tích tiếp xúc với dung dịch đất.",
      ],
      [
        "Tế bào lông hút",
        "Tế bào biểu bì kéo dài thành lông hút, chuyên hóa cho hấp thụ nước và ion khoáng.",
      ],
      [
        "Thành tế bào",
        "Lớp ngoài bảo vệ tế bào, cho nước và chất tan đi qua trước khi tới màng sinh chất.",
      ],
      [
        "Màng sinh chất",
        "Màng thấm chọn lọc, kiểm soát nước và ion khoáng đi vào tế bào.",
      ],
      [
        "Không bào lớn",
        "Chứa dịch tế bào, góp phần tạo áp suất thẩm thấu giúp hút nước.",
      ],
      [
        "Tế bào chất",
        "Môi trường bên trong tế bào, nơi ion khoáng có thể được vận chuyển qua con đường tế bào chất.",
      ],
      [
        "Dung dịch đất",
        "Nguồn cung cấp nước và ion khoáng cho rễ; lông hút tiếp xúc trực tiếp với dung dịch này.",
      ],
    ],
    { min: [-0.0332, -0.0024, -0.033], max: [0.0341, 0.0154, 0.034] },
  ),
  rootCrossSection: makeAnnotations(
    [
      [
        "Biểu bì rễ",
        "Lớp ngoài cùng của rễ, nơi có tế bào lông hút hấp thụ nước và ion khoáng.",
      ],
      [
        "Vỏ rễ",
        "Vùng tế bào nằm giữa biểu bì và nội bì, là nơi nước và ion khoáng đi qua để vào trung trụ.",
      ],
      [
        "Nội bì",
        "Lớp tế bào bao quanh trung trụ, kiểm soát chất đi vào mạch dẫn.",
      ],
      [
        "Đai Caspary",
        "Dải không thấm nước ở nội bì, chặn con đường gian bào và buộc nước/ion khoáng đi qua màng sinh chất.",
      ],
      ["Trung trụ", "Vùng trung tâm của rễ, chứa mạch gỗ và mạch rây."],
      ["Mạch gỗ", "Mô dẫn vận chuyển nước và ion khoáng từ rễ lên thân, lá."],
      [
        "Mạch rây",
        "Mô dẫn vận chuyển chất hữu cơ từ cơ quan nguồn đến cơ quan sử dụng hoặc dự trữ.",
      ],
    ],
    { min: [-0.2145, -0.1891, -0.1047], max: [0.2475, 0.1417, 0.0456] },
  ),
  xylemEdited: makeAnnotations(
    [
      [
        "Mạch ống",
        "Các tế bào chết nối đầu với nhau tạo ống dẫn nước liên tục.",
      ],
      [
        "Quản bào",
        "Tế bào dẫn nước dạng dài, thành dày hóa gỗ, có vai trò dẫn truyền và nâng đỡ.",
      ],
      [
        "Thành hóa gỗ",
        "Thành tế bào chứa lignin, giúp mạch gỗ bền chắc và không bị xẹp khi dẫn nước.",
      ],
      [
        "Lỗ bên",
        "Vùng mỏng trên thành tế bào, cho nước đi ngang giữa các tế bào mạch gỗ.",
      ],
      [
        "Khoang rỗng",
        "Phần trong tế bào chết không còn chất sống, tạo đường dẫn nước và ion khoáng.",
      ],
      [
        "Chiều vận chuyển",
        "Mạch gỗ vận chuyển chủ yếu một chiều từ rễ lên thân và lá.",
      ],
    ],
    { min: [-2.3324, 0.9534, -1.0665], max: [-1.6106, 2.4751, -0.0502] },
  ),
  phloemEdited: makeAnnotations(
    [
      ["Ống rây", "Tế bào sống chuyên hóa để vận chuyển đường và chất hữu cơ."],
      [
        "Bản rây",
        "Vùng có nhiều lỗ ở đầu ống rây, cho dòng chất hữu cơ đi qua.",
      ],
      [
        "Tế bào kèm",
        "Tế bào sống nằm cạnh ống rây, hỗ trợ hoạt động và trao đổi chất của ống rây.",
      ],
      [
        "Dòng chất hữu cơ",
        "Mạch rây vận chuyển chủ yếu sucrose và các chất hữu cơ khác.",
      ],
      [
        "Cơ quan nguồn",
        "Nơi tạo hoặc giải phóng đường, thường là lá quang hợp.",
      ],
      [
        "Cơ quan chứa",
        "Nơi sử dụng hoặc dự trữ chất hữu cơ như rễ, quả, hạt, chồi non.",
      ],
    ],
    { min: [-1.2014, 0.0609, -0.4864], max: [0.2645, 2.5657, 0.7048] },
  ),
  leafAnatomy: makeAnnotations(
    [
      [
        "Biểu bì lá",
        "Lớp tế bào bao phủ bề mặt lá, bảo vệ lá và có thể chứa khí khổng.",
      ],
      [
        "Khí khổng",
        "Cấu trúc gồm hai tế bào khí khổng và khe khí khổng, giúp trao đổi khí và thoát hơi nước.",
      ],
      [
        "Tế bào khí khổng",
        "Hai tế bào hình hạt đậu điều chỉnh độ mở của khe khí khổng.",
      ],
      [
        "Khe khí khổng",
        "Khoảng mở giữa hai tế bào khí khổng, nơi hơi nước và khí CO2/O2 đi qua.",
      ],
      [
        "Lớp cutin nếu có",
        "Lớp sáp mỏng trên biểu bì, giúp giảm thoát hơi nước qua bề mặt lá.",
      ],
      [
        "Trao đổi khí",
        "CO2 đi vào lá cho quang hợp, O2 và hơi nước có thể đi ra ngoài qua khí khổng.",
      ],
    ],
    { min: [-0.4568, -0.5, -0.4797], max: [0.4568, 0.5, 0.4797] },
  ),
  plantStomata: makeAnnotations(
    [
      [
        "Thành trong dày",
        "Thành phía sát khe khí khổng dày hơn, giúp tế bào cong khi trương nước.",
      ],
      [
        "Thành ngoài mỏng",
        "Thành phía ngoài mỏng hơn, dễ giãn khi tế bào trương nước.",
      ],
      [
        "Lục lạp",
        "Tế bào khí khổng có thể có lục lạp, khác nhiều tế bào biểu bì thông thường.",
      ],
      [
        "Khe khí khổng",
        "Độ rộng của khe thay đổi theo trạng thái trương nước của tế bào khí khổng.",
      ],
      [
        "Nước trong tế bào",
        "Khi tế bào khí khổng trương nước, khe khí khổng mở rộng.",
      ],
      [
        "Hình hạt đậu",
        "Hình dạng đặc trưng giúp hai tế bào khí khổng phối hợp đóng mở khe khí khổng.",
      ],
    ],
    { min: [-0.2406, -0.2237, -0.5], max: [0.2406, 0.2237, 0.5] },
  ),
  chloroplast: makeAnnotations(
    [
      [
        "Màng ngoài",
        "Lớp màng bao ngoài của lục lạp, góp phần ngăn cách lục lạp với tế bào chất.",
      ],
      ["Màng trong", "Lớp màng phía trong, bao bọc chất nền stroma."],
      ["Stroma", "Chất nền của lục lạp, nơi diễn ra pha tối/chu trình Calvin."],
      [
        "Thylakoid",
        "Túi màng dẹt chứa hệ sắc tố quang hợp, là nơi diễn ra pha sáng.",
      ],
      [
        "Grana",
        "Chồng các thylakoid xếp lên nhau, giúp tăng diện tích màng hấp thụ ánh sáng.",
      ],
      [
        "DNA và ribosome riêng",
        "Lục lạp có DNA và ribosome riêng, liên quan nguồn gốc nội cộng sinh.",
      ],
    ],
    { min: [-1.1319, 0.0047, -0.548], max: [1.1317, 1.088, 0.5465] },
  ),
  digestiveSystem: makeAnnotations(
    [
      [
        "Miệng",
        "Nơi tiếp nhận, nghiền nhỏ thức ăn và bắt đầu tiêu hóa tinh bột nhờ amylase trong nước bọt.",
      ],
      ["Thực quản", "Ống dẫn thức ăn từ miệng xuống dạ dày nhờ nhu động."],
      [
        "Dạ dày",
        "Cơ quan dạng túi, co bóp trộn thức ăn và tiêu hóa protein bước đầu.",
      ],
      [
        "Ruột non",
        "Nơi tiêu hóa hoàn tất và hấp thụ phần lớn chất dinh dưỡng.",
      ],
      ["Ruột già", "Hấp thụ nước và tạo phân."],
      [
        "Gan",
        "Tạo mật hỗ trợ tiêu hóa lipid và xử lí nhiều chất hấp thụ từ ruột.",
      ],
      ["Tụy", "Tiết enzyme tiêu hóa vào ruột non."],
      ["Túi mật", "Dự trữ và cô đặc dịch mật trước khi đổ vào ruột non."],
    ],
    { min: [-10.8146, 3.6301, -15.261], max: [11.5299, 80.0363, 4.7637] },
  ),
  stomachOrgan: makeAnnotations(
    [
      ["Lớp cơ dạ dày", "Co bóp để nhào trộn thức ăn với dịch vị."],
      ["Niêm mạc dạ dày", "Lớp lót bên trong, tiết chất nhầy và dịch vị."],
      ["Dịch vị", "Chứa HCl và enzyme tiêu hóa protein bước đầu."],
      [
        "HCl",
        "Tạo môi trường acid, hỗ trợ hoạt hóa enzyme tiêu hóa protein và diệt bớt vi khuẩn.",
      ],
      ["Pepsin", "Enzyme tiêu hóa protein bước đầu trong dạ dày."],
      ["Tâm vị", "Vùng nối thực quản với dạ dày, nơi thức ăn đi vào."],
      [
        "Môn vị",
        "Vùng nối dạ dày với ruột non, điều tiết thức ăn xuống ruột non.",
      ],
    ],
    { min: [-0.8322, -1.0009, -0.4493], max: [0.8314, 0.9935, 0.4468] },
  ),
  intestine: makeAnnotations(
    [
      [
        "Nếp gấp ruột non",
        "Làm tăng diện tích bề mặt tiếp xúc với chất dinh dưỡng.",
      ],
      [
        "Lông ruột",
        "Cấu trúc nhô vào lòng ruột, giúp tăng mạnh diện tích hấp thụ.",
      ],
      [
        "Vi nhung mao",
        "Các vi cấu trúc trên tế bào biểu mô ruột, làm diện tích hấp thụ lớn hơn nữa.",
      ],
      ["Tế bào biểu mô ruột", "Lớp tế bào trực tiếp hấp thụ chất dinh dưỡng."],
      ["Mao mạch máu", "Nhận đường đơn và amino acid sau hấp thụ."],
      ["Mạch bạch huyết", "Nhận phần lớn sản phẩm tiêu hóa lipid sau hấp thụ."],
      [
        "Diện tích hấp thụ lớn",
        "Nếp gấp, lông ruột và vi nhung mao giúp ruột non hấp thụ hiệu quả.",
      ],
    ],
    { min: [-0.8922, -1.0002, -0.4298], max: [0.8695, 0.998, 0.4404] },
  ),
  lungs: makeAnnotations(
    [
      ["Khí quản", "Ống dẫn khí chính đưa không khí từ ngoài vào phổi."],
      ["Phế quản", "Nhánh dẫn khí từ khí quản vào mỗi phổi."],
      ["Tiểu phế quản", "Các nhánh nhỏ dẫn khí đến các chùm phế nang."],
      ["Phế nang", "Túi khí nhỏ có thành rất mỏng, là nơi trao đổi O2 và CO2."],
      [
        "Mao mạch phổi",
        "Mạng mao mạch bao quanh phế nang, nhận O2 và thải CO2.",
      ],
      [
        "Màng trao đổi khí",
        "Thành phế nang và mao mạch mỏng, áp sát nhau để khí khuếch tán nhanh.",
      ],
      [
        "O2 và CO2",
        "O2 khuếch tán từ phế nang vào máu, CO2 khuếch tán từ máu ra phế nang.",
      ],
    ],
    { min: [-1.0496, 1.2812, -0.1072], max: [-0.7772, 1.6101, 0.0651] },
  ),
  externalHeartStructure: makeAnnotations(
    [
      ["Tim", "Cơ quan co bóp tạo lực đẩy máu đi trong hệ tuần hoàn."],
      [
        "Động mạch chủ",
        "Mạch lớn đưa máu giàu O2 từ tâm thất trái đi nuôi cơ thể.",
      ],
      ["Động mạch phổi", "Đưa máu nghèo O2 từ tâm thất phải đến phổi."],
      ["Tĩnh mạch chủ", "Đưa máu nghèo O2 từ cơ thể về tâm nhĩ phải."],
      ["Tĩnh mạch phổi", "Đưa máu giàu O2 từ phổi về tâm nhĩ trái."],
      [
        "Mạch vành",
        "Mạch máu nuôi cơ tim, giúp tim có năng lượng để co bóp liên tục.",
      ],
    ],
    { min: [-0.5776, -0.793, -0.3971], max: [0.5055, 0.8086, 0.483] },
  ),
  cardiacConductionSystem: makeAnnotations(
    [
      [
        "Nút xoang nhĩ",
        "Vị trí phát nhịp tự động chính của tim, khởi đầu mỗi chu kỳ co tim.",
      ],
      [
        "Nút nhĩ thất",
        "Nhận xung từ nút xoang nhĩ và làm chậm xung trước khi truyền xuống thất.",
      ],
      ["Bó His", "Đường dẫn truyền xung từ nút nhĩ thất xuống hai tâm thất."],
      [
        "Mạng Purkinje",
        "Mạng dẫn truyền lan xung nhanh trong thành tâm thất, giúp thất co đồng bộ.",
      ],
      ["Cơ tim", "Mô cơ co bóp theo xung dẫn truyền để bơm máu."],
      [
        "Tính tự động của tim",
        "Tim có hệ dẫn truyền riêng, không cần não phát lệnh cho từng nhịp.",
      ],
    ],
    { min: [-0.0577, -0.0001, -0.0537], max: [0.0537, 0.1669, 0.0213] },
  ),
  circulatorySystem: makeAnnotations(
    [
      [
        "Động mạch",
        "Mạch đưa máu từ tim đi, thành dày và đàn hồi để chịu áp lực cao.",
      ],
      [
        "Mao mạch",
        "Mạch rất nhỏ, thành mỏng một lớp tế bào, là nơi trao đổi chất với mô.",
      ],
      [
        "Tĩnh mạch",
        "Mạch đưa máu về tim, thành mỏng hơn động mạch và thường có van.",
      ],
      [
        "Van tĩnh mạch",
        "Giúp máu chảy một chiều về tim, hạn chế máu chảy ngược.",
      ],
      [
        "Thành mạch",
        "Độ dày và độ đàn hồi của thành mạch phù hợp với chức năng từng loại mạch.",
      ],
      [
        "Huyết áp",
        "Thường cao nhất ở động mạch, thấp hơn ở mao mạch và tĩnh mạch.",
      ],
      [
        "Vận tốc máu",
        "Thay đổi theo loại mạch; chậm ở mao mạch để thuận lợi cho trao đổi chất.",
      ],
    ],
    { min: [-0.0631, -0.1406, -0.2465], max: [0.0365, 0.4963, 0.2342] },
  ),
  lymphNode: makeAnnotations(
    [
      [
        "Mạch bạch huyết vào",
        "Đưa dịch bạch huyết và tác nhân lạ vào hạch để được kiểm tra.",
      ],
      [
        "Mạch bạch huyết ra",
        "Đưa dịch bạch huyết ra khỏi hạch sau khi được lọc.",
      ],
      ["Vỏ hạch", "Vùng ngoài của hạch, chứa nhiều lympho bào."],
      [
        "Tủy hạch",
        "Vùng trong của hạch, có tế bào miễn dịch và xoang bạch huyết.",
      ],
      [
        "Lympho B",
        "Tế bào miễn dịch có thể biệt hóa thành tế bào tạo kháng thể.",
      ],
      [
        "Lympho T",
        "Tế bào miễn dịch tham gia điều hòa hoặc tiêu diệt tế bào nhiễm bệnh.",
      ],
      [
        "Đại thực bào",
        "Tế bào có khả năng bắt giữ, tiêu hóa và trình diện tác nhân lạ.",
      ],
    ],
    { min: [-12.4311, -11.133, -14.2731], max: [9.2865, 11.1334, 2.4043] },
  ),
  macrophage: makeAnnotations(
    [
      [
        "Đại thực bào",
        "Tế bào miễn dịch có khả năng thực bào tác nhân lạ và trình diện kháng nguyên.",
      ],
      [
        "Lympho B",
        "Tế bào tham gia miễn dịch đặc hiệu; có thể biệt hóa thành tế bào tiết kháng thể.",
      ],
      [
        "Lympho T hỗ trợ",
        "Tế bào điều phối đáp ứng miễn dịch thông qua tín hiệu hóa học.",
      ],
      [
        "Lympho T độc",
        "Tế bào có thể tiêu diệt tế bào nhiễm virus hoặc tế bào bất thường.",
      ],
      ["Kháng nguyên", "Phân tử lạ có thể kích hoạt đáp ứng miễn dịch."],
      [
        "Kháng thể",
        "Protein đặc hiệu do tế bào B biệt hóa tiết ra, giúp nhận diện tác nhân lạ.",
      ],
    ],
    { min: [-3.2202, -2.6017, -3.1726], max: [9.007, 3.963, 5.322] },
  ),
  kidney: makeAnnotations(
    [
      [
        "Vỏ thận",
        "Vùng ngoài của thận, chứa nhiều cầu thận và phần đầu của nephron.",
      ],
      ["Tủy thận", "Vùng trong của thận, chứa các ống thận và ống góp."],
      [
        "Bể thận",
        "Khoang nhận nước tiểu từ các ống góp trước khi xuống niệu quản.",
      ],
      ["Niệu quản", "Ống dẫn nước tiểu từ thận xuống bàng quang."],
      [
        "Động mạch thận",
        "Đưa máu đến thận để lọc và điều chỉnh thành phần dịch cơ thể.",
      ],
      ["Tĩnh mạch thận", "Đưa máu đã được thận xử lí trở về hệ tuần hoàn."],
      ["Nephron", "Đơn vị cấu trúc và chức năng cơ bản của thận."],
    ],
    { min: [-5.5632, -1.0642, -3.1772], max: [2.9055, 9.0324, 1.705] },
  ),
  nephron: makeAnnotations(
    [
      ["Cầu thận", "Mạng mao mạch nơi máu được lọc để tạo dịch lọc đầu."],
      ["Bao Bowman", "Bao bọc cầu thận và hứng dịch lọc đầu."],
      [
        "Ống lượn gần",
        "Đoạn ống thận tái hấp thu mạnh nước và nhiều chất cần thiết.",
      ],
      [
        "Quai Henle",
        "Đoạn ống hình chữ U, liên quan đến tái hấp thu nước và muối.",
      ],
      ["Ống lượn xa", "Đoạn ống tiếp tục điều chỉnh thành phần dịch lọc."],
      ["Ống góp", "Nhận dịch từ nhiều nephron và dẫn nước tiểu về bể thận."],
      [
        "Mao mạch quanh ống thận",
        "Mạng mao mạch nhận lại chất tái hấp thu và tham gia trao đổi với ống thận.",
      ],
    ],
    { min: [-0.0484, 0.0185, -0.0089], max: [0.0552, 0.2226, 0.0199] },
  ),
  neuronModel: makeAnnotations(
    [
      [
        "Thân neuron",
        "Phần chứa nhân và phần lớn bào quan, đảm nhiệm hoạt động sống của neuron.",
      ],
      ["Nhân", "Chứa thông tin di truyền và điều khiển hoạt động của neuron."],
      ["Sợi nhánh", "Nhận tín hiệu từ neuron khác hoặc từ thụ thể."],
      ["Sợi trục", "Dẫn truyền xung thần kinh từ thân neuron đến tế bào khác."],
      [
        "Bao myelin",
        "Lớp bao cách điện quanh sợi trục, giúp tăng tốc độ dẫn truyền.",
      ],
      [
        "Eo Ranvier",
        "Khoảng ngắt giữa các đoạn bao myelin, liên quan dẫn truyền nhảy cóc.",
      ],
      [
        "Cúc synapse",
        "Đầu tận cùng của sợi trục, truyền tín hiệu sang tế bào khác qua synapse.",
      ],
    ],
    { min: [-2.0184, -0.8799, -0.242], max: [2.1119, 0.7696, 2.2902] },
  ),
  synapse: makeAnnotations(
    [
      [
        "Màng trước synapse",
        "Màng ở đầu cúc synapse của neuron truyền tín hiệu.",
      ],
      ["Túi synapse", "Túi chứa chất trung gian hóa học trong cúc synapse."],
      [
        "Chất trung gian hóa học",
        "Phân tử truyền tín hiệu qua khe synapse từ neuron trước sang tế bào sau.",
      ],
      [
        "Khe synapse",
        "Khoảng hẹp giữa hai tế bào; hai neuron không dính liền trực tiếp.",
      ],
      [
        "Thụ thể màng sau",
        "Protein tiếp nhận chất trung gian hóa học ở tế bào sau synapse.",
      ],
      ["Màng sau synapse", "Màng của neuron hoặc tế bào nhận tín hiệu."],
      [
        "Chiều truyền synapse",
        "Tín hiệu thường truyền một chiều từ màng trước sang màng sau synapse.",
      ],
    ],
    { min: [-0.2239, -0.3514, -0.5], max: [0.2239, 0.3514, 0.5] },
  ),
  humanEye: makeAnnotations(
    [
      [
        "Giác mạc",
        "Lớp trong suốt phía trước mắt, giúp bảo vệ và khúc xạ ánh sáng.",
      ],
      [
        "Thủy dịch",
        "Dịch trong khoang trước mắt, nuôi dưỡng và duy trì áp lực trong mắt.",
      ],
      ["Đồng tử", "Lỗ ở giữa mống mắt, điều chỉnh lượng ánh sáng đi vào mắt."],
      [
        "Thể thủy tinh",
        "Thấu kính trong suốt, điều chỉnh tiêu cự để ảnh hội tụ trên võng mạc.",
      ],
      [
        "Dịch kính",
        "Khối dịch trong suốt giữ hình dạng nhãn cầu và cho ánh sáng đi qua.",
      ],
      [
        "Võng mạc",
        "Lớp chứa tế bào cảm thụ ánh sáng, biến ánh sáng thành tín hiệu thần kinh.",
      ],
      ["Dây thần kinh thị giác", "Dẫn truyền tín hiệu từ võng mạc về não."],
    ],
    { min: [-0.3316, -0.3164, -0.3164], max: [0.3771, 0.3164, 0.3164] },
  ),
  earAnatomy: makeAnnotations(
    [
      ["Tai ngoài", "Thu nhận sóng âm và dẫn vào ống tai."],
      ["Màng nhĩ", "Rung khi nhận sóng âm, truyền dao động vào tai giữa."],
      [
        "Chuỗi xương tai",
        "Khuếch đại và truyền dao động từ màng nhĩ vào tai trong.",
      ],
      [
        "Ốc tai",
        "Cơ quan thu nhận âm thanh, biến dao động thành tín hiệu thần kinh.",
      ],
      [
        "Ống bán khuyên",
        "Cấu trúc của hệ tiền đình, liên quan đến giữ thăng bằng.",
      ],
      [
        "Dây thần kinh thính giác",
        "Dẫn truyền tín hiệu âm thanh từ tai trong về não.",
      ],
      ["Vòi nhĩ nếu có", "Giúp cân bằng áp suất hai bên màng nhĩ."],
    ],
    { min: [-0.5161, -0.3411, -0.2192], max: [0.0946, 0.4284, 0.1605] },
  ),
  anatomySkin: makeAnnotations(
    [
      [
        "Thụ thể cơ học",
        "Nhận kích thích cơ học như áp lực, rung động hoặc kéo giãn.",
      ],
      [
        "Thụ thể hóa học",
        "Nhận kích thích là các phân tử hóa học, liên quan vị giác và khứu giác.",
      ],
      ["Thụ thể nhiệt", "Nhận thay đổi nhiệt độ nóng hoặc lạnh."],
      ["Thụ thể đau", "Nhận kích thích có nguy cơ gây tổn thương mô."],
      [
        "Thụ thể ánh sáng",
        "Tế bào cảm thụ ở võng mạc, nhận kích thích ánh sáng.",
      ],
      [
        "Tín hiệu thần kinh",
        "Thụ thể chuyển kích thích thành tín hiệu truyền về hệ thần kinh.",
      ],
    ],
    { min: [-1.1, -1.5923, -0.5069], max: [1.2763, 1.4077, 1.1739] },
  ),
  meristemRootEdited: makeAnnotations(
    [
      ["Mô phân sinh đỉnh chồi", "Tạo tế bào mới giúp thân và chồi dài ra."],
      ["Mô phân sinh đỉnh rễ", "Tạo tế bào mới giúp rễ dài ra."],
      [
        "Mô phân sinh bên",
        "Tạo tế bào mới giúp thân và rễ to ra ở cây có sinh trưởng thứ cấp.",
      ],
      [
        "Tầng sinh mạch",
        "Mô phân sinh bên tạo mạch gỗ thứ cấp và mạch rây thứ cấp.",
      ],
      [
        "Tầng sinh bần",
        "Mô phân sinh bên tạo bần, góp phần hình thành vỏ bảo vệ.",
      ],
      ["Sinh trưởng sơ cấp", "Sự dài ra của thân và rễ nhờ mô phân sinh đỉnh."],
      ["Sinh trưởng thứ cấp", "Sự to ra của thân và rễ nhờ mô phân sinh bên."],
    ],
    { min: [-1.6308, 0.1143, -1.1197], max: [-0.7044, 1.8575, -0.5028] },
  ),
  primaryGrowth: makeAnnotations(
    [
      [
        "Vùng phân chia",
        "Nơi tế bào mô phân sinh phân chia liên tục tạo tế bào mới.",
      ],
      ["Vùng kéo dài", "Nơi tế bào tăng kích thước, làm thân hoặc rễ dài ra."],
      ["Vùng phân hóa", "Nơi tế bào chuyên hóa thành các loại mô khác nhau."],
      ["Đỉnh rễ", "Vị trí sinh trưởng sơ cấp giúp rễ dài ra trong đất."],
      ["Đỉnh chồi", "Vị trí sinh trưởng sơ cấp giúp thân và cành dài ra."],
      ["Sinh trưởng chiều dài", "Kết quả chính của sinh trưởng sơ cấp ở cây."],
    ],
    { min: [-0.4999, 0, -0.5], max: [0.4999, 0.3063, 0.5] },
  ),
  secondaryGrowthCambium: makeAnnotations(
    [
      [
        "Tầng sinh mạch",
        "Mô phân sinh bên tạo mạch gỗ thứ cấp vào phía trong và mạch rây thứ cấp ra phía ngoài.",
      ],
      [
        "Mạch gỗ thứ cấp",
        "Mô dẫn nước và khoáng được tạo thêm về phía trong, góp phần làm thân to ra.",
      ],
      [
        "Mạch rây thứ cấp",
        "Mô dẫn chất hữu cơ được tạo thêm về phía ngoài tầng sinh mạch.",
      ],
      ["Tầng sinh bần", "Mô phân sinh bên tạo lớp bần bảo vệ bên ngoài thân."],
      ["Bần", "Lớp tế bào bảo vệ thay thế biểu bì ở thân già."],
      [
        "Sinh trưởng bề ngang",
        "Kết quả của sinh trưởng thứ cấp, làm thân và rễ to ra.",
      ],
    ],
    { min: [-0.4519, -0.4994, -0.5], max: [0.4519, 0.4994, 0.5] },
  ),
  treeGrowthRings: makeAnnotations(
    [
      [
        "Vòng năm",
        "Một vòng gỗ thường tương ứng với một năm sinh trưởng trong điều kiện có mùa rõ.",
      ],
      [
        "Gỗ sớm",
        "Phần gỗ tạo đầu mùa sinh trưởng, thường có tế bào lớn hơn và màu sáng hơn.",
      ],
      [
        "Gỗ muộn",
        "Phần gỗ tạo cuối mùa sinh trưởng, thường tế bào nhỏ hơn và màu sẫm hơn.",
      ],
      ["Tâm gỗ", "Phần gỗ già ở trung tâm thân, thường có vai trò nâng đỡ."],
      ["Dác gỗ", "Phần gỗ trẻ hơn ở phía ngoài, còn tham gia dẫn nước."],
      [
        "Tính tuổi cây",
        "Có thể ước tính tuổi cây bằng cách đếm số vòng năm trên mặt cắt thân gỗ.",
      ],
    ],
    { min: [-0.9926, -0.3097, -0.8661], max: [0.9914, 0.3123, 0.8748] },
  ),
  flowerAnatomy: makeAnnotations(
    [
      ["Đài hoa", "Bộ phận thường màu xanh, bảo vệ nụ hoa khi còn non."],
      [
        "Cánh hoa",
        "Bộ phận thường có màu sắc, có thể giúp thu hút sinh vật thụ phấn.",
      ],
      ["Nhị", "Cơ quan sinh sản đực của hoa, gồm chỉ nhị và bao phấn."],
      ["Chỉ nhị", "Phần cuống nâng đỡ bao phấn."],
      ["Bao phấn", "Nơi chứa và tạo hạt phấn."],
      [
        "Nhụy",
        "Cơ quan sinh sản cái của hoa, gồm đầu nhụy, vòi nhụy và bầu nhụy.",
      ],
      ["Đầu nhụy", "Nơi tiếp nhận hạt phấn trong quá trình thụ phấn."],
      [
        "Vòi nhụy",
        "Ống nối đầu nhụy với bầu nhụy, là đường ống phấn phát triển.",
      ],
      ["Bầu nhụy", "Phần chứa noãn, sau thụ tinh có thể phát triển thành quả."],
    ],
    { min: [-0.2503, -0.3713, -0.4997], max: [0.2402, 0.3606, 0.4999] },
  ),
  antherAndPollen: makeAnnotations(
    [
      ["Bao phấn", "Phần của nhị chứa các túi phấn và hạt phấn."],
      ["Túi phấn", "Khoang trong bao phấn, nơi chứa hạt phấn."],
      [
        "Hạt phấn",
        "Cấu trúc mang giao tử đực hoặc tế bào sinh sản đực ở thực vật có hoa.",
      ],
      ["Vỏ hạt phấn", "Lớp bảo vệ hạt phấn khi di chuyển đến đầu nhụy."],
      [
        "Ống phấn",
        "Ống phát triển từ hạt phấn sau khi nảy mầm trên đầu nhụy, đưa giao tử đực tới noãn.",
      ],
      ["Thụ phấn", "Quá trình hạt phấn được chuyển đến đầu nhụy."],
    ],
    { min: [-0.3784, -0.5, -0.4753], max: [0.3784, 0.5, 0.4753] },
  ),
  peachFruitSeed: makeAnnotations(
    [
      [
        "Bầu nhụy",
        "Phần dưới của nhụy chứa noãn; sau thụ tinh có thể phát triển thành quả.",
      ],
      [
        "Noãn",
        "Cấu trúc nằm trong bầu nhụy; sau thụ tinh phát triển thành hạt.",
      ],
      ["Vòi nhụy", "Đường ống phấn đi qua để đưa giao tử đực đến noãn."],
      ["Đầu nhụy", "Nơi hạt phấn bám và nảy mầm."],
      [
        "Túi phôi nếu có",
        "Cấu trúc bên trong noãn, nơi diễn ra thụ tinh ở thực vật có hoa.",
      ],
      [
        "Hạt sau thụ tinh",
        "Hạt được hình thành từ noãn sau thụ tinh, không phải là noãn trước thụ tinh.",
      ],
      [
        "Quả",
        "Được hình thành chủ yếu từ bầu nhụy sau thụ tinh, có vai trò bảo vệ và phát tán hạt.",
      ],
      ["Vỏ quả", "Lớp bao ngoài của quả, có thể giúp bảo vệ hạt."],
      ["Hạt", "Được hình thành từ noãn sau thụ tinh."],
      ["Vỏ hạt", "Lớp bảo vệ bên ngoài hạt."],
      ["Phôi", "Cơ thể non của cây mới trong hạt."],
      ["Chất dự trữ", "Nguồn dinh dưỡng nuôi phôi khi hạt nảy mầm."],
    ],
    { min: [-0.2852, -0.5, -0.4991], max: [0.2852, 0.5, 0.4991] },
  ),
  maleReproductiveSystem: makeAnnotations(
    [
      ["Tinh hoàn", "Nơi tạo tinh trùng và tiết hormone sinh dục nam."],
      [
        "Mào tinh",
        "Nơi tinh trùng tiếp tục hoàn thiện và được lưu giữ tạm thời.",
      ],
      ["Ống dẫn tinh", "Dẫn tinh trùng từ mào tinh về phía niệu đạo."],
      ["Túi tinh", "Tuyến phụ tiết dịch góp phần tạo tinh dịch."],
      [
        "Tuyến tiền liệt",
        "Tuyến phụ tiết dịch giúp tinh trùng hoạt động thuận lợi hơn.",
      ],
      [
        "Niệu đạo",
        "Ống dẫn tinh dịch ra ngoài cơ thể; ở nam cũng là đường dẫn nước tiểu.",
      ],
      [
        "Dương vật",
        "Cơ quan đưa tinh dịch vào đường sinh dục nữ trong giao phối.",
      ],
    ],
    { min: [-1.0659, -2.8541, -1.1522], max: [1.347, -0.1509, 2.8401] },
  ),
  uterus: makeAnnotations(
    [
      ["Buồng trứng", "Nơi tạo trứng và tiết hormone sinh dục nữ."],
      [
        "Ống dẫn trứng",
        "Đường dẫn trứng về tử cung; thường là nơi diễn ra thụ tinh.",
      ],
      ["Tử cung", "Nơi phôi làm tổ và phát triển trong thai kỳ."],
      [
        "Nội mạc tử cung",
        "Lớp lót bên trong tử cung, biến đổi theo chu kỳ và là nơi phôi làm tổ.",
      ],
      ["Cổ tử cung", "Phần hẹp nối tử cung với âm đạo."],
      [
        "Âm đạo",
        "Đường tiếp nhận tinh trùng và là đường sinh khi sinh thường.",
      ],
      [
        "Vị trí thụ tinh",
        "Thụ tinh thường diễn ra ở ống dẫn trứng, không phải trong tử cung.",
      ],
    ],
    { min: [-0.2345, -0.4946, -0.5], max: [0.2345, 0.4946, 0.5] },
  ),
  spermCellIllustration: makeAnnotations(
    [
      ["Đầu tinh trùng", "Chứa nhân mang thông tin di truyền của bố."],
      [
        "Thể cực đầu nếu có",
        "Chứa enzyme hỗ trợ tinh trùng xuyên qua lớp bao quanh trứng.",
      ],
      [
        "Cổ tinh trùng",
        "Vùng nối đầu và đuôi, chứa nhiều ti thể cung cấp năng lượng.",
      ],
      ["Đuôi tinh trùng", "Giúp tinh trùng di chuyển."],
      ["Trứng", "Giao tử cái có kích thước lớn, chứa nhiều tế bào chất."],
      [
        "Màng ngoài của trứng",
        "Lớp bao quanh giúp bảo vệ trứng và tham gia nhận biết tinh trùng.",
      ],
      [
        "Khác biệt giao tử",
        "Tinh trùng nhỏ, di động; trứng lớn, nhiều chất dự trữ hơn.",
      ],
    ],
    { min: [-0.9448, -0.9502, -0.2191], max: [0.9497, 0.9517, 0.2192] },
  ),
  embryoStages: makeAnnotations(
    [
      ["Tử cung", "Cơ quan nơi phôi làm tổ và phát triển trong thai kỳ."],
      ["Nội mạc tử cung", "Lớp lót giàu mạch máu, chuẩn bị cho phôi làm tổ."],
      [
        "Phôi sớm",
        "Giai đoạn phát triển ban đầu sau thụ tinh trước và trong quá trình làm tổ.",
      ],
      ["Vị trí làm tổ", "Phôi bám vào nội mạc tử cung để tiếp tục phát triển."],
      [
        "Mạch máu nội mạc",
        "Cung cấp chất dinh dưỡng và oxygen cho phôi ở giai đoạn phát triển tiếp theo.",
      ],
      [
        "Nguyên tắc thể hiện",
        "Dùng hình mô phạm sạch, tránh hình ảnh y khoa quá trực diện hoặc gây khó chịu.",
      ],
    ],
    { min: [-0.2683, -0.2617, -0.5], max: [0.2683, 0.2617, 0.5] },
  ),
} satisfies Record<string, ModelAnnotation[]>;

const lop12Annotations = {
  dna: makeAnnotations(
    [
      [
        "Xoắn kép",
        "DNA có dạng xoắn kép gồm hai mạch polynucleotide quấn quanh một trục chung.",
      ],
      [
        "Hai mạch polynucleotide",
        "Mỗi mạch DNA gồm nhiều nucleotide nối liên tiếp với nhau.",
      ],
      [
        "Khung đường - phosphate",
        "Nằm ở phía ngoài phân tử DNA, tạo xương sống của mỗi mạch.",
      ],
      [
        "Base nitrogen",
        "Nằm quay vào phía trong phân tử DNA, tham gia bắt cặp với base ở mạch đối diện.",
      ],
      [
        "Bậc thang base bổ sung",
        "Các cặp base ở giữa hai mạch giống các bậc thang: A bắt cặp T, G bắt cặp C.",
      ],
      [
        "Trục xoắn chung",
        "Hai mạch DNA quấn quanh cùng một trục, tạo cấu trúc ổn định cho phân tử.",
      ],
      [
        "Trình tự base",
        "Thứ tự các base A, T, G, C trên DNA là cơ sở lưu giữ thông tin di truyền.",
      ],
    ],
    {
      min: [-1937.7808, 757.5705, -309.4502],
      max: [1937.7794, 3042.4287, 309.4503],
    },
  ),
  nucleotide: makeAnnotations(
    [
      [
        "Nucleotide",
        "Đơn phân cấu tạo DNA, gồm nhóm phosphate, đường deoxyribose và base nitrogen.",
      ],
      [
        "Nhóm phosphate",
        "Thành phần tham gia tạo khung đường - phosphate của mạch DNA.",
      ],
      [
        "Đường deoxyribose",
        "Đường 5 carbon của DNA; khác với đường ribose của RNA.",
      ],
      [
        "Base nitrogen",
        "Thành phần khác nhau giữa các nucleotide; DNA có 4 loại base: A, T, G, C.",
      ],
      [
        "Vị trí gắn base",
        "Base nitrogen gắn với đường deoxyribose để tạo phần nhận diện của nucleotide.",
      ],
      [
        "Ba thành phần phối hợp",
        "Phosphate, đường deoxyribose và base nitrogen kết hợp tạo thành một nucleotide hoàn chỉnh.",
      ],
    ],
    { min: [-0.1718, -0.3419, -0.5], max: [0.1718, 0.3419, 0.5] },
  ),
  nucleotideLinkage: makeAnnotations(
    [
      [
        "Mạch polynucleotide",
        "Nhiều nucleotide nối liên tiếp tạo thành một mạch DNA.",
      ],
      [
        "Liên kết phosphodiester",
        "Liên kết cộng hóa trị nối đường của nucleotide này với phosphate của nucleotide kế tiếp.",
      ],
      ["Khung đường - phosphate", "Phần nối chính và bền vững của mạch DNA."],
      [
        "Base quay vào trong",
        "Base không phải phần nối chính của mạch, mà hướng vào trong để bắt cặp với mạch đối diện.",
      ],
      [
        "Chiều 5' -> 3'",
        "Mỗi mạch DNA có chiều xác định từ đầu 5' đến đầu 3'.",
      ],
      [
        "Trình tự nucleotide",
        "Thứ tự các base trên mạch DNA là cơ sở lưu giữ thông tin di truyền.",
      ],
    ],
    { min: [-0.0285, -0.9752, -0.7189], max: [0.0288, 0.9805, 0.7818] },
  ),
  ribosome: makeAnnotations(
    [
      [
        "Ribosome",
        "Bào quan không có màng bao bọc, là nơi diễn ra dịch mã và tổng hợp protein.",
      ],
      [
        "Tiểu phần nhỏ",
        "Bám vào mRNA và giúp ribosome đọc đúng các codon trên mRNA.",
      ],
      [
        "Tiểu phần lớn",
        "Chứa các vị trí gắn tRNA và tham gia hình thành liên kết peptide.",
      ],
      [
        "mRNA",
        "Mạch khuôn mang thông tin di truyền đi qua ribosome trong quá trình dịch mã.",
      ],
      [
        "Khe đọc mRNA",
        "Vùng ribosome giữ mRNA đúng vị trí để các codon được đọc lần lượt.",
      ],
      [
        "tRNA đang gắn ribosome",
        "tRNA đưa amino acid đến ribosome theo codon tương ứng trên mRNA.",
      ],
      [
        "Chuỗi polypeptide",
        "Chuỗi amino acid đang được tổng hợp theo trình tự codon trên mRNA.",
      ],
    ],
    { min: [-0.5436, -0.3368, -0.2348], max: [0.5436, 0.3413, 0.2379] },
  ),
  mrna: makeAnnotations(
    [
      [
        "mRNA",
        "RNA thông tin mang bản mã từ DNA ra tế bào chất để tham gia tổng hợp protein.",
      ],
      [
        "Codon",
        "Bộ ba nucleotide liên tiếp trên mRNA, mã hóa một amino acid hoặc tín hiệu kết thúc.",
      ],
      [
        "Codon mở đầu AUG",
        "Thường là tín hiệu bắt đầu dịch mã và mã hóa amino acid methionine.",
      ],
      [
        "Codon kết thúc",
        "UAA, UAG, UGA là các bộ ba kết thúc, không mã hóa amino acid.",
      ],
      ["Chiều đọc mRNA", "Ribosome đọc mRNA theo chiều 5' -> 3'."],
      ["Codon nằm trên mRNA", "Codon là bộ ba trên mRNA, không nằm trên tRNA."],
      [
        "Trình tự codon",
        "Thứ tự codon trên mRNA quyết định thứ tự amino acid trong chuỗi polypeptide.",
      ],
    ],
    { min: [1.0547, 0.4516, -0.1221], max: [2.1483, 2.2826, 1.4562] },
  ),
  trna: makeAnnotations(
    [
      [
        "tRNA",
        "RNA vận chuyển có nhiệm vụ đưa amino acid phù hợp đến ribosome.",
      ],
      [
        "Cấu trúc gấp của tRNA",
        "tRNA có cấu trúc gấp đặc trưng giúp nhận diện codon và gắn amino acid phù hợp.",
      ],
      [
        "Anticodon",
        "Bộ ba nucleotide trên tRNA bắt cặp bổ sung với codon trên mRNA.",
      ],
      [
        "Amino acid gắn với tRNA",
        "Amino acid được gắn vào tRNA trước khi tRNA đi vào ribosome.",
      ],
      [
        "Bắt cặp codon - anticodon",
        "Anticodon bắt cặp bổ sung với codon để đưa đúng amino acid vào chuỗi protein.",
      ],
      [
        "tRNA mang amino acid",
        "Mỗi tRNA mang amino acid phù hợp với bộ ba mã hóa tương ứng.",
      ],
      [
        "tRNA rỗng",
        "Sau khi chuyển amino acid vào chuỗi polypeptide, tRNA rời ribosome ở trạng thái không còn amino acid.",
      ],
    ],
    { min: [51.6322, 14.0887, -13.1771], max: [54.1134, 17.35, -9.883] },
  ),
  trnaBoundMrna: makeAnnotations(
    [
      [
        "Vị trí A",
        "Nơi nhận tRNA mới mang amino acid phù hợp với codon trên mRNA.",
      ],
      ["Vị trí P", "Nơi giữ tRNA đang mang chuỗi polypeptide kéo dài."],
      [
        "Vị trí E",
        "Nơi tRNA rỗng rời khỏi ribosome sau khi đã chuyển amino acid.",
      ],
      [
        "mRNA trong ribosome",
        "Các codon trên mRNA lần lượt đi qua các vị trí A, P, E khi ribosome dịch chuyển.",
      ],
      [
        "Liên kết peptide",
        "Liên kết được hình thành giữa amino acid mới và chuỗi polypeptide đang kéo dài.",
      ],
      [
        "Dịch chuyển ribosome",
        "Ribosome dịch từng codon trên mRNA; chuyển động chi tiết nên thể hiện bằng animation.",
      ],
      [
        "Chuỗi polypeptide",
        "Chuỗi amino acid kéo dài theo thứ tự codon trên mRNA.",
      ],
    ],
    { min: [408.266, 394.587, 400.795], max: [575.742, 478.064, 482.994] },
  ),
  chromosome: makeAnnotations(
    [
      [
        "Nhiễm sắc thể kì giữa",
        "NST kép co xoắn cực đại ở kì giữa nên quan sát rõ nhất dưới kính hiển vi.",
      ],
      [
        "Hai chromatid chị em",
        "Hai bản sao giống nhau của một NST sau khi DNA đã nhân đôi.",
      ],
      [
        "Tâm động",
        "Vùng gắn hai chromatid chị em và là nơi thoi phân bào bám vào.",
      ],
      [
        "Hai cánh NST",
        "Hai phần kéo dài từ tâm động đến đầu mút; không phải là hai chromatid chị em.",
      ],
      ["Đầu mút NST", "Phần tận cùng của nhiễm sắc thể, giúp bảo vệ đầu NST."],
      [
        "Vị trí phân li",
        "Hai chromatid chị em tách nhau tại tâm động khi bước vào kì sau phân bào.",
      ],
      [
        "Cấu trúc co xoắn",
        "Sự co xoắn giúp DNA rất dài được đóng gói gọn và phân li chính xác.",
      ],
    ],
    { min: [-5.4749, -1.0089, -2.3961], max: [10.7942, 13.3996, 0.5106] },
  ),
  typesOfChromosome: makeAnnotations(
    [
      [
        "Tâm động",
        "Vị trí tâm động quyết định hình dạng và chiều dài tương đối của hai cánh NST.",
      ],
      [
        "NST tâm giữa",
        "Tâm động nằm gần giữa, hai cánh NST tương đối bằng nhau.",
      ],
      [
        "NST tâm lệch",
        "Tâm động lệch khỏi giữa, tạo một cánh dài và một cánh ngắn.",
      ],
      [
        "NST tâm mút",
        "Tâm động nằm gần đầu mút, một cánh rất ngắn hoặc khó quan sát.",
      ],
      [
        "Hai cánh NST",
        "Cánh NST được xác định theo vị trí tâm động, không phải là hai chromatid chị em.",
      ],
      [
        "Ý nghĩa phân loại",
        "Phân loại theo tâm động giúp nhận diện hình thái các NST trong bộ nhiễm sắc thể.",
      ],
    ],
    { min: [-0.0286, -0.2094, -0.5], max: [0.0286, 0.2094, 0.5] },
  ),
  eukaryoticChromosome: makeAnnotations(
    [
      ["DNA xoắn kép", "Mức cấu trúc phân tử cơ bản mang thông tin di truyền."],
      [
        "Nucleosome",
        "DNA quấn quanh lõi histone, tạo đơn vị đóng gói cơ bản của nhiễm sắc thể.",
      ],
      [
        "Sợi cơ bản 10 nm",
        "Chuỗi nucleosome nối tiếp nhau tạo dạng chuỗi hạt.",
      ],
      [
        "Sợi co xoắn",
        "Sợi cơ bản tiếp tục cuộn xoắn tạo cấu trúc dày và gọn hơn.",
      ],
      [
        "Chromatid",
        "Mức đóng gói cao hơn, chứa một phân tử DNA được cuộn chặt với protein.",
      ],
      [
        "Nhiễm sắc thể kì giữa",
        "Mức đóng gói cực đại, thường gồm hai chromatid chị em.",
      ],
      [
        "Ý nghĩa đóng gói",
        "Đóng gói giúp DNA rất dài nằm gọn trong nhân và phân li chính xác khi phân bào.",
      ],
    ],
    { min: [-0.185, -0.5, -0.4771], max: [0.185, 0.5, 0.4771] },
  ),
  nucleosome: makeAnnotations(
    [
      [
        "Nucleosome",
        "Đơn vị cấu trúc cơ bản của nhiễm sắc thể ở sinh vật nhân thực.",
      ],
      [
        "Lõi histone",
        "Gồm 8 phân tử histone tạo lõi protein để DNA quấn quanh.",
      ],
      [
        "DNA quấn quanh histone",
        "DNA xoắn kép quấn quanh lõi histone để tạo nucleosome.",
      ],
      ["DNA nối", "Đoạn DNA nối giữa các nucleosome liền kề trên sợi cơ bản."],
      [
        "DNA + protein histone",
        "Nucleosome không phải DNA đơn thuần, mà là phức hợp DNA với protein histone.",
      ],
      [
        "Chức năng đóng gói",
        "Nucleosome giúp rút ngắn và tổ chức DNA trong nhân tế bào.",
      ],
      [
        "Liên hệ mức cao hơn",
        "Nhiều nucleosome nối tiếp tạo sợi cơ bản và tiếp tục đóng gói thành NST.",
      ],
    ],
    { min: [-0.302, -0.5, -0.4579], max: [0.302, 0.5, 0.4579] },
  ),
} satisfies Record<string, ModelAnnotation[]>;

lop12Annotations.dna[0].image = {
  url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
  alt: "Minh họa cấu trúc DNA",
};

export const cells: CellItem[] = [
  {
    id: "plant",
    name: "Tế bào cây",
    type: "Tế bào nhân thực",
    accent: "#4f8a3f",
    accentSoft: "#e5f1d8",
    color: "#81b64b",
    modelKind: "plant",
    defaultFocusId: "nucleus",
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
    },
    modelAsset: {
      url: "/models/plant-cell-first001.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 3.26496,
      rotation: [0, -1.42, 0],
      exposure: 1.08,
      materialMode: "native",
    },
  },
  {
    id: "dna",
    name: "DNA",
    type: "Phân tử di truyền",
    accent: "#3c8f9f",
    accentSoft: "#dff2f3",
    color: "#67b8c7",
    modelKind: "dna",
    defaultFocusId: "helix",
    annotations: lop12Annotations.dna,
    modelLinks: [
      {
        id: "open-nucleotide",
        label: "Mở cấu tạo nucleotide",
        targetCellId: "nucleotide",
        position: [-1650, 2860, 0],
      },
      {
        id: "open-linkage",
        label: "Mở liên kết nucleotide",
        targetCellId: "nucleotideLinkage",
        position: [1650, 940, 0],
      },
    ],
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
    },
    modelAsset: {
      url: "/models/dna.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
      scale: 0.000825687,
      rotation: [0, -0.35, 0],
      position: [0, -0.5, 0],
      annotations: [
        {
          id: "sugar-phosphate-backbone",
          label: "Khung đường-phosphat",
          description:
            "Các đơn vị đường và phosphat lặp lại tạo thành hai nhánh ngoài của xoắn kép DNA.",
          position: [-1420, 560, 220],
        },
        {
          id: "base-pairs",
          label: "Cặp bazơ",
          description:
            "Các bazơ bổ sung bắt cặp với nhau qua xoắn kép để mã hóa thông tin di truyền.",
          position: [80, 0, 160],
        },
        {
          id: "major-groove",
          label: "Rãnh lớn",
          description:
            "Rãnh rộng hơn, nơi prôtêin có thể nhận diện mẫu cặp bazơ mà không cần mở xoắn kép.",
          position: [1180, -520, -120],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
    },
  },
  {
    id: "nucleotide",
    name: "Nuclêôtit",
    type: "Đơn vị cấu tạo DNA",
    accent: "#4e77b8",
    accentSoft: "#e2eaf8",
    color: "#7898d2",
    modelKind: "dna",
    defaultFocusId: "model",
    annotations: lop12Annotations.nucleotide,
    modelLinks: [
      {
        id: "open-dna",
        label: "Mở DNA tổng thể",
        targetCellId: "dna",
        position: [-0.12, 0.27, 0.18],
      },
      {
        id: "open-linkage",
        label: "Mở liên kết nucleotide",
        targetCellId: "nucleotideLinkage",
        position: [0.12, -0.26, -0.18],
      },
    ],
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
    },
    modelAsset: {
      url: "/models/nucleotide.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
      scale: 3.2,
      rotation: [0, -0.35, 0],
      position: [0, 0.05, 0],
      annotations: [
        {
          id: "phosphate",
          label: "Nhóm phosphat",
          description:
            "Nhóm mang điện liên kết các nuclêôtit liền kề trong mạch axit nucleic.",
          position: [-0.12, 0.24, 0.34],
        },
        {
          id: "sugar",
          label: "Đường",
          description:
            "Đường pentose gắn với bazơ và kết nối với các nhóm phosphat.",
          position: [0.08, -0.1, 0.08],
        },
        {
          id: "base",
          label: "Bazơ nitơ",
          description: "Phần mang thông tin của nuclêôtit.",
          position: [0.14, 0.2, -0.32],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
    },
  },
  {
    id: "nucleotideLinkage",
    name: "Liên kết",
    type: "Liên kết nuclêôtit DNA",
    accent: "#7c68b8",
    accentSoft: "#ebe6f8",
    color: "#9989d1",
    modelKind: "dna",
    defaultFocusId: "model",
    annotations: lop12Annotations.nucleotideLinkage,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
    },
    modelAsset: {
      url: "/models/dna_double_helix__base_pairing_model.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
      scale: 1.6362,
      rotation: [0, -0.35, 0],
      position: [0, 0.05, 0],
      annotations: [
        {
          id: "paired-bases",
          label: "Bazơ bắt cặp",
          description:
            "Các bazơ hướng vào trong và bắt cặp với bazơ bổ sung ở mạch đối diện.",
          position: [0.02, 0.22, 0.24],
        },
        {
          id: "hydrogen-bonds",
          label: "Liên kết hydro",
          description:
            "Các liên kết yếu giữ cặp bazơ với nhau nhưng vẫn cho phép hai mạch tách ra.",
          position: [0.02, 0.02, 0],
        },
        {
          id: "backbone",
          label: "Khung mạch",
          description: "Mạch cấu trúc nâng đỡ thang cặp bazơ.",
          position: [-0.02, -0.58, -0.46],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
    },
  },
  {
    id: "ribosome",
    name: "Ribôxôm",
    type: "Bộ máy tổng hợp prôtêin",
    accent: "#8c6a40",
    accentSoft: "#f1e6d6",
    color: "#c19a68",
    modelKind: "translation",
    defaultFocusId: "model",
    annotations: lop12Annotations.ribosome,
    modelLinks: [
      {
        id: "open-mrna",
        label: "Mở mRNA và codon",
        targetCellId: "mrna",
        position: [-0.42, -0.12, 0.1],
      },
      {
        id: "open-trna",
        label: "Mở tRNA",
        targetCellId: "trna",
        position: [0.42, 0.12, -0.08],
      },
      {
        id: "open-trna-mrna",
        label: "Mở tRNA + mRNA",
        targetCellId: "trnaBoundMrna",
        position: [0, 0.26, 0.14],
      },
    ],
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/enzyme-catalysis-active-site-teaching.png",
    },
    modelAsset: {
      url: "/models/ribosomas.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/enzyme-catalysis-active-site-teaching.png",
      scale: 4,
      rotation: [0.12, -0.38, 0],
      position: [0, 0.02, 0],
      annotations: [
        {
          id: "large-subunit",
          label: "Tiểu đơn vị lớn",
          description:
            "Xúc tác hình thành liên kết peptit khi chuỗi prôtêin kéo dài.",
          position: [-0.22, 0.18, 0.16],
        },
        {
          id: "small-subunit",
          label: "Tiểu đơn vị nhỏ",
          description:
            "Giúp đọc bộ ba mã trên mRNA và căn chỉnh tRNA trong quá trình dịch mã.",
          position: [0.22, -0.14, -0.08],
        },
        {
          id: "mrna-channel",
          label: "Kênh mRNA",
          description: "Đường đi nơi mRNA luồn qua ribôxôm.",
          position: [0.1, -0.02, 0.22],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
    },
  },

  {
    id: "chromosome",
    name: "Nhiễm sắc thể",
    type: "Cấu trúc DNA cô đặc",
    accent: "#8a5fb8",
    accentSoft: "#ece4f7",
    color: "#a178cf",
    modelKind: "chromosome",
    defaultFocusId: "model",
    annotations: lop12Annotations.chromosome,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
    },
    modelAsset: {
      url: "/models/chromosome.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
      scale: 0.196692,
      rotation: [0, -0.38, 0],
      position: [0, 0.02, 0],
      annotations: [
        {
          id: "sister-chromatid-a",
          label: "Nhiễm sắc tử chị em",
          description: "Một nửa bản sao của nhiễm sắc thể đã nhân đôi.",
          position: [-4.2, 2.6, 0.6],
        },
        {
          id: "centromere",
          label: "Tâm động",
          description:
            "Vùng thắt nơi hai nhiễm sắc tử chị em còn gắn với nhau.",
          position: [0, 0.1, 0.8],
        },
        {
          id: "sister-chromatid-b",
          label: "Nhiễm sắc tử chị em",
          description:
            "Nửa bản sao tương ứng sẽ tách ra trong quá trình phân bào.",
          position: [4.2, -2.6, 0.6],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "typesOfChromosome",
    name: "Các dạng nhiễm sắc thể",
    type: "Phân loại nhiễm sắc thể",
    accent: "#6d75b8",
    accentSoft: "#e5e8f7",
    color: "#8892d0",
    modelKind: "chromosome",
    defaultFocusId: "model",
    annotations: lop12Annotations.typesOfChromosome,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
    },
    modelAsset: {
      url: "/models/Types_of_chromosome.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
      scale: 3.2,
      rotation: [0, -0.36, 0],
      position: [0, 0.02, 0],
      annotations: [
        {
          id: "metacentric",
          label: "Tâm giữa",
          description:
            "Tâm động nằm gần giữa, tạo ra hai nhánh có độ dài tương tự.",
          position: [-0.02, 0.22, 0.28],
        },
        {
          id: "submetacentric",
          label: "Tâm lệch",
          description:
            "Tâm động lệch khỏi trung tâm, tạo một nhánh ngắn và một nhánh dài.",
          position: [0.02, 0.02, 0],
        },
        {
          id: "acrocentric",
          label: "Tâm đầu",
          description: "Tâm động nằm gần một đầu, để lại một nhánh rất ngắn.",
          position: [0.02, -0.18, -0.28],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "eukaryoticChromosome",
    name: "Nhiễm sắc thể nhân thực",
    type: "DNA nhân thực được đóng gói",
    accent: "#9a6a9f",
    accentSoft: "#f0e3f1",
    color: "#bc86bf",
    modelKind: "chromosome",
    defaultFocusId: "model",
    annotations: lop12Annotations.eukaryoticChromosome,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
    },
    modelAsset: {
      url: "/models/eukaryotic_chromosome.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
      scale: 3.2,
      rotation: [0, -0.4, 0],
      position: [0, 0.02, 0],
      annotations: [
        {
          id: "chromatin-fiber",
          label: "Sợi nhiễm sắc",
          description:
            "DNA và prôtêin được nén thành cấu trúc nhiễm sắc thể bậc cao.",
          position: [-0.1, 0.32, 0.26],
        },
        {
          id: "histone-packaging",
          label: "Đóng gói histon",
          description:
            "Cách đóng gói bằng prôtêin giúp các phân tử DNA dài nằm gọn trong nhân.",
          position: [0.08, 0, 0.08],
        },
        {
          id: "condensed-region",
          label: "Vùng cô đặc",
          description:
            "Vật chất nhiễm sắc thể được đóng gói chặt, dễ quan sát khi tế bào phân chia.",
          position: [0.1, -0.28, -0.22],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "nucleosome",
    name: "Nuclêôxôm",
    type: "Đơn vị đóng gói DNA",
    accent: "#3f8f9d",
    accentSoft: "#dff1f3",
    color: "#68b7c2",
    modelKind: "chromosome",
    defaultFocusId: "model",
    annotations: lop12Annotations.nucleosome,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
    },
    modelAsset: {
      url: "/models/Nucleosome.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
      scale: 3.2,
      rotation: [0, -0.42, 0],
      position: [0, 0.02, 0],
      annotations: [
        {
          id: "histone-core",
          label: "Lõi histon",
          description: "Lõi prôtêin để DNA quấn quanh và tạo thành nuclêôxôm.",
          position: [0, 0.08, 0.12],
        },
        {
          id: "wrapped-dna",
          label: "DNA quấn quanh",
          description:
            "DNA cuộn quanh prôtêin histon để bắt đầu quá trình nén nhiễm sắc thể.",
          position: [0.18, -0.12, 0.28],
        },
        {
          id: "linker-dna",
          label: "DNA nối",
          description: "Đoạn DNA nối nuclêôxôm này với nuclêôxôm kế tiếp.",
          position: [-0.22, -0.28, -0.22],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "rootCrossSection",
    name: "Lát cắt ngang rễ",
    type: "Giải phẫu rễ thực vật",
    accent: "#7c8f3f",
    accentSoft: "#edf1d8",
    color: "#a0b85d",
    modelKind: "rootSystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.rootCrossSection,
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
    },
    modelAsset: {
      url: "/models/root_cross_section.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 6.92617,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "internalRootStructure",
    name: "Cấu trúc bên trong rễ",
    type: "Tổ chức mô rễ",
    accent: "#4f8f62",
    accentSoft: "#dff1e4",
    color: "#6fb982",
    modelKind: "rootSystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.internalRootStructure,
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
    },
    modelAsset: {
      url: "/models/internal_root_structure.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 47.5032,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "xylemEdited",
    name: "Mạch gỗ",
    type: "Mô dẫn nước và khoáng",
    accent: "#3f7f96",
    accentSoft: "#dceef2",
    color: "#63aabd",
    modelKind: "plantVascular",
    defaultFocusId: "model",
    annotations: lop11Annotations.xylemEdited,
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
    },
    modelAsset: {
      url: "/models/xylem_edited.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 2.10291,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "phloemEdited",
    name: "Mạch rây",
    type: "Mô dẫn chất hữu cơ",
    accent: "#708f3c",
    accentSoft: "#e8f1d8",
    color: "#91b85a",
    modelKind: "plantVascular",
    defaultFocusId: "model",
    annotations: lop11Annotations.phloemEdited,
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
    },
    modelAsset: {
      url: "/models/phloem_edited.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 1.27751,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "leafAnatomy",
    name: "Biểu bì lá và khí khổng",
    type: "Giải phẫu lá",
    accent: "#4f8a3f",
    accentSoft: "#e5f1d8",
    color: "#7fb55a",
    modelKind: "leafStomata",
    defaultFocusId: "model",
    annotations: lop11Annotations.leafAnatomy,
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
    },
    modelAsset: {
      url: "/models/Leaf Anatomy.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 3.19998,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "plantStomata",
    name: "Cấu tạo tế bào khí khổng",
    type: "Khí khổng thực vật",
    accent: "#3f8f75",
    accentSoft: "#dff1eb",
    color: "#66b89a",
    modelKind: "leafStomata",
    defaultFocusId: "model",
    annotations: lop11Annotations.plantStomata,
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
    },
    modelAsset: {
      url: "/models/Plant Stomata.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 3.2,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "chloroplast",
    name: "Lục lạp",
    type: "Bào quan quang hợp",
    accent: "#4f8a3f",
    accentSoft: "#e5f1d8",
    color: "#77b94f",
    modelKind: "chloroplast",
    defaultFocusId: "model",
    annotations: lop11Annotations.chloroplast,
    renderImage: {
      url: "/cell-renders-transparent/plant.png",
    },
    modelAsset: {
      url: "/models/chloroplast.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 1.41366,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "mitochondria",
    name: "Cấu tạo ti thể",
    type: "Bào quan hô hấp tế bào",
    accent: "#bd514d",
    accentSoft: "#f5dfdc",
    color: "#cf6f64",
    modelKind: "mitochondria",
    defaultFocusId: "model",
    renderImage: {
      url: "/cell-renders-transparent/animal.png",
    },
    modelAsset: {
      url: "/models/mitochondria.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 0.2,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      annotations: [
        {
          id: "ribosome",
          label: "ribosome",
          description:
            "Ribôxôm trong ti thể tổng hợp một số prôtêin cần cho chuỗi hô hấp tế bào.",
          position: [3.1187, 2.8, -1],
        },
        {
          id: "DNA",
          label: "DNA",
          description:
            "DNA ti thể mang thông tin di truyền riêng để mã hóa một phần prôtêin và RNA của ti thể.",
          position: [3.1187, 2.5, -0.2],
        },
        {
          id: "Inner Membrane",
          label: "Màng trong",
          description:
            "Màng trong gấp nếp thành mào ti thể, nơi diễn ra chuỗi truyền electron và tạo ATP.",
          position: [3.9, 2.8, 4.3],
        },
        {
          id: "Outer Membrane",
          label: "Màng ngoài",
          description:
            "Màng ngoài bao bọc ti thể và kiểm soát trao đổi phân tử giữa ti thể với bào tương.",
          position: [6, 2.8, 4.9],
        },
        {
          id: "Matrix",
          label: "Chất nền",
          description:
            "Chất nền chứa enzyme, DNA và ribôxôm, là nơi diễn ra nhiều bước của hô hấp tế bào.",
          position: [4, 2.1, 2.8],
        },
        {
          id: "Granules",
          label: "Hạt dự trữ",
          description:
            "Các hạt dự trữ giúp ti thể cân bằng ion và tích lũy một số chất cần cho hoạt động chuyển hóa.",
          position: [0.5, 2.4, 1.8],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "mrna",
    name: "mRNA",
    type: "RNA thông tin",
    accent: "#2f8a75",
    accentSoft: "#dff1ec",
    color: "#63b7a4",
    modelKind: "translation",
    defaultFocusId: "model",
    annotations: lop12Annotations.mrna,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
    },
    modelAsset: {
      url: "/models/mrna.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
      scale: 1.74762,
      rotation: [0.08, -0.48, 0.08],
      position: [0, -0.04, 0],
      annotations: [
        {
          id: "codon",
          label: "Bộ ba mã",
          description:
            "Bộ ba bazơ RNA quy định một axit amin hoặc tín hiệu kết thúc.",
          position: [0.34, 0.42, 0.12],
        },
        {
          id: "phosphate-backbone",
          label: "Khung phosphat",
          description:
            "Khung tích điện lặp lại tạo nên cấu trúc của mạch mRNA.",
          position: [-0.3, -0.2, 0.16],
        },
        {
          id: "bases",
          label: "Bazơ RNA",
          description:
            "Các bazơ A, U, C và G mang thông điệp được sao chép từ DNA.",
          position: [0.12, -0.54, -0.18],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "trna",
    name: "tRNA",
    type: "Phức hợp RNA vận chuyển",
    accent: "#7c5cb5",
    accentSoft: "#ebe4f7",
    color: "#9a83cb",
    modelKind: "translation",
    defaultFocusId: "model",
    annotations: lop12Annotations.trna,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/crispr-cas9-gene-editing-teaching.png",
    },
    modelAsset: {
      url: "/models/tRNA.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/crispr-cas9-gene-editing-teaching.png",
      scale: 1.6,
      rotation: [0.1, -0.42, 0],
      position: [0, 0.02, 0],
      annotations: [
        {
          id: "anticodon-loop",
          label: "Vòng đối mã",
          description: "Bắt cặp với bộ ba mã tương ứng trên mRNA.",
          position: [0.08, -0.88, 0.72],
        },
        {
          id: "amino-acid-site",
          label: "Vị trí gắn axit amin",
          description: "Điểm gắn axit amin do tRNA mang theo.",
          position: [-0.46, 0.84, -0.58],
        },
        {
          id: "acceptor-stem",
          label: "Thân nhận",
          description: "Vùng thân kết thúc tại vị trí gắn axit amin.",
          position: [0.52, 0.44, 0.54],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "trnaBoundMrna",
    name: "tRNA + mRNA",
    type: "Phức hợp dịch mã",
    accent: "#b06b4e",
    accentSoft: "#f4e4dc",
    color: "#cf8a6f",
    modelKind: "translation",
    defaultFocusId: "model",
    annotations: lop12Annotations.trnaBoundMrna,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/crispr-cas9-gene-editing-teaching.png",
    },
    modelAsset: {
      url: "/models/interaction_trna-mrna.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/crispr-cas9-gene-editing-teaching.png",
      scale: 0.035,
      rotation: [0.08, -0.46, 0.04],
      position: [0, 0.02, 0],
      annotations: [
        {
          id: "trna",
          label: "tRNA",
          description: "Phân tử trung gian đưa axit amin đến ribôxôm.",
          position: [-38, 18, 14],
        },
        {
          id: "mrna",
          label: "Mạch mRNA",
          description: "Mạch khuôn được ribôxôm đọc theo từng bộ ba mã.",
          position: [36, -18, -8],
        },
        {
          id: "codon-anticodon",
          label: "Bắt cặp bộ ba mã-đối mã",
          description: "Tương tác bắt cặp giúp đặt đúng axit amin vào chuỗi.",
          position: [0, 0, 12],
        },
      ],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "digestiveSystem",
    name: "Hệ tiêu hóa",
    type: "Tổng quan các cơ quan tiêu hóa ở người",
    accent: "#b26a3c",
    accentSoft: "#f4e5da",
    color: "#cf8a5a",
    modelKind: "digestiveSystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.digestiveSystem,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/digestive_system.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 0.05,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "stomachOrgan",
    name: "Dạ dày",
    type: "Cơ quan nhào trộn và tiêu hóa thức ăn",
    accent: "#c06b57",
    accentSoft: "#f6e2dd",
    color: "#d88b79",
    modelKind: "digestiveSystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.stomachOrgan,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/stomach_-_organ.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 1.59932,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "intestine",
    name: "Ruột",
    type: "Ống tiêu hóa hấp thu chất dinh dưỡng và nước",
    accent: "#a97948",
    accentSoft: "#f1e6d9",
    color: "#c59a6f",
    modelKind: "digestiveSystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.intestine,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/intestine.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 1.2,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "lungs",
    name: "Phổi",
    type: "Cơ quan trao đổi khí giữa cơ thể và môi trường",
    accent: "#4f8ea6",
    accentSoft: "#dff0f4",
    color: "#72b1c4",
    modelKind: "gasExchange",
    defaultFocusId: "model",
    annotations: lop11Annotations.lungs,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/alveoli-gas-exchange-teaching.png",
    },
    modelAsset: {
      url: "/models/lungs.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/alveoli-gas-exchange-teaching.png",
      scale: 7,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "externalHeartStructure",
    name: "Cấu tạo ngoài của tim",
    type: "Hình thái bên ngoài của tim người",
    accent: "#bd514d",
    accentSoft: "#f5dfdc",
    color: "#d16d66",
    modelKind: "cardiovascular",
    defaultFocusId: "model",
    annotations: lop11Annotations.externalHeartStructure,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/External_Heart_Structure.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 1.2,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "cardiacConductionSystem",
    name: "Hệ dẫn truyền tim",
    type: "Các đường dẫn xung điện điều hòa nhịp tim",
    accent: "#9a5fb8",
    accentSoft: "#efe4f7",
    color: "#bd84cf",
    modelKind: "cardiovascular",
    defaultFocusId: "model",
    annotations: lop11Annotations.cardiacConductionSystem,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/human_heart_cross_section.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 15,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "circulatorySystem",
    name: "Hệ tuần hoàn",
    type: "Mạng lưới tim và mạch máu vận chuyển máu",
    accent: "#3f7aa8",
    accentSoft: "#dfeaf4",
    color: "#669cc4",
    modelKind: "cardiovascular",
    defaultFocusId: "model",
    annotations: lop11Annotations.circulatorySystem,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/circulatory_system_2.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 6,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "lymphNode",
    name: "Hạch bạch huyết",
    type: "Trạm lọc và hoạt hóa tế bào miễn dịch",
    accent: "#5f8f6a",
    accentSoft: "#e0f1e4",
    color: "#7fba8a",
    modelKind: "immuneSystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.lymphNode,
    renderImage: { url: "/cell-renders-transparent/white-blood.png" },
    modelAsset: {
      url: "/models/lymph_node.glb",
      previewUrl: "/cell-renders-transparent/white-blood.png",
      scale: 0.143714,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "macrophage",
    name: "Đại thực bào",
    type: "Tế bào miễn dịch thực bào mầm bệnh và mảnh vụn",
    accent: "#6d78a8",
    accentSoft: "#e6eaf7",
    color: "#98a1ce",
    modelKind: "immuneSystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.macrophage,
    renderImage: { url: "/cell-renders-transparent/white-blood.png" },
    modelAsset: {
      url: "/models/macrophage.glb",
      previewUrl: "/cell-renders-transparent/white-blood.png",
      scale: 0.211333,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "kidney",
    name: "Thận",
    type: "Cơ quan lọc máu và tạo nước tiểu",
    accent: "#8f5f82",
    accentSoft: "#f1e1ed",
    color: "#b77ca9",
    modelKind: "urinarySystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.kidney,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/nephron-glomerulus-filtration-teaching.png",
    },
    modelAsset: {
      url: "/models/kidney.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/nephron-glomerulus-filtration-teaching.png",
      scale: 0.316939,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "nephron",
    name: "Nephron",
    type: "Đơn vị chức năng lọc máu của thận",
    accent: "#4f8fa3",
    accentSoft: "#dff0f3",
    color: "#72b5c2",
    modelKind: "urinarySystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.nephron,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/nephron-glomerulus-filtration-teaching.png",
    },
    modelAsset: {
      url: "/models/nephron.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/nephron-glomerulus-filtration-teaching.png",
      scale: 15,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "neuronModel",
    name: "Nơron",
    type: "Tế bào thần kinh truyền tín hiệu điện hóa",
    accent: "#6578b5",
    accentSoft: "#e4e9f8",
    color: "#8c91d0",
    modelKind: "nervousSystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.neuronModel,
    renderImage: { url: "/cell-renders-transparent/neuron.png" },
    modelAsset: {
      url: "/models/neuron.glb",
      previewUrl: "/cell-renders-transparent/neuron.png",
      scale: 1,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "synapse",
    name: "Xinap",
    type: "Điểm liên lạc truyền tín hiệu giữa các nơron",
    accent: "#7c68b8",
    accentSoft: "#ebe6f8",
    color: "#9989d1",
    modelKind: "nervousSystem",
    defaultFocusId: "model",
    annotations: lop11Annotations.synapse,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/neuron-synapse-transmission-teaching.png",
    },
    modelAsset: {
      url: "/models/Synapse.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/neuron-synapse-transmission-teaching.png",
      scale: 3,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "humanEye",
    name: "Mắt người",
    type: "Cơ quan cảm nhận ánh sáng và hình ảnh",
    accent: "#3f8f9d",
    accentSoft: "#dff1f3",
    color: "#68b7c2",
    modelKind: "senseOrgans",
    defaultFocusId: "model",
    annotations: lop11Annotations.humanEye,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/human_eye.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 2,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "earAnatomy",
    name: "Tai",
    type: "Cơ quan cảm nhận âm thanh và thăng bằng",
    accent: "#4e77b8",
    accentSoft: "#e2eaf8",
    color: "#7898d2",
    modelKind: "senseOrgans",
    defaultFocusId: "model",
    annotations: lop11Annotations.earAnatomy,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/ear_anatomy.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 4,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "anatomySkin",
    name: "Da",
    type: "Cơ quan cảm giác và hàng rào bảo vệ cơ thể",
    accent: "#a56d7f",
    accentSoft: "#f4e2e7",
    color: "#d79baa",
    modelKind: "senseOrgans",
    defaultFocusId: "model",
    annotations: lop11Annotations.anatomySkin,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/anatomy_skin.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 1,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "meristemRootEdited",
    name: "Mô phân sinh rễ",
    type: "Vùng tế bào phân chia tạo tăng trưởng ở rễ",
    accent: "#4f8f62",
    accentSoft: "#dff1e4",
    color: "#6fb982",
    modelKind: "plantStemGrowth",
    defaultFocusId: "model",
    annotations: lop11Annotations.meristemRootEdited,
    renderImage: { url: "/cell-renders-transparent/plant.png" },
    modelAsset: {
      url: "/models/meristem_root_edited.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 1.8357,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "treeGrowthRings",
    name: "Vòng sinh trưởng thân cây",
    type: "Các lớp gỗ ghi lại quá trình tăng trưởng theo mùa",
    accent: "#8a6f3f",
    accentSoft: "#f0e8d8",
    color: "#b7965b",
    modelKind: "plantStemGrowth",
    defaultFocusId: "model",
    annotations: lop11Annotations.treeGrowthRings,
    renderImage: { url: "/cell-renders-transparent/plant.png" },
    modelAsset: {
      url: "/models/tree_growth_rings.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 1.6,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "primaryGrowth",
    name: "Sinh trưởng sơ cấp",
    type: "Quá trình kéo dài thân và rễ ở thực vật",
    accent: "#7c8f3f",
    accentSoft: "#edf1d8",
    color: "#a0b85d",
    modelKind: "plantStemGrowth",
    defaultFocusId: "model",
    annotations: lop11Annotations.primaryGrowth,
    renderImage: { url: "/cell-renders-transparent/plant.png" },
    modelAsset: {
      url: "/models/Primary+Growth.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 3.2,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "secondaryGrowthCambium",
    name: "Sinh trưởng thứ cấp và tầng sinh mạch",
    type: "Quá trình làm thân cây to ra nhờ tầng sinh mạch",
    accent: "#708f3c",
    accentSoft: "#e8f1d8",
    color: "#91b85a",
    modelKind: "plantStemGrowth",
    defaultFocusId: "model",
    annotations: lop11Annotations.secondaryGrowthCambium,
    renderImage: { url: "/cell-renders-transparent/plant.png" },
    modelAsset: {
      url: "/models/Secondary Growth and Cambium.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 1.6,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "flowerAnatomy",
    name: "Cấu tạo hoa",
    type: "Các bộ phận sinh sản của hoa",
    accent: "#b85f9a",
    accentSoft: "#f4e1ef",
    color: "#d486bd",
    modelKind: "plantReproduction",
    defaultFocusId: "model",
    annotations: lop11Annotations.flowerAnatomy,
    renderImage: { url: "/cell-renders-transparent/plant.png" },
    modelAsset: {
      url: "/models/flower_anatomy_3d_model.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 3.5,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "antherAndPollen",
    name: "Bao phấn và hạt phấn",
    type: "Cấu trúc tạo và mang giao tử đực ở thực vật",
    accent: "#b89a3f",
    accentSoft: "#f3eed8",
    color: "#d1b760",
    modelKind: "plantReproduction",
    defaultFocusId: "model",
    annotations: lop11Annotations.antherAndPollen,
    renderImage: { url: "/cell-renders-transparent/plant.png" },
    modelAsset: {
      url: "/models/Anther and Pollen.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 1.6,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "peachFruitSeed",
    name: "Quả và hạt đào",
    type: "Cấu trúc quả bảo vệ và phát tán hạt",
    accent: "#c06b57",
    accentSoft: "#f6e2dd",
    color: "#d88b79",
    modelKind: "plantReproduction",
    defaultFocusId: "model",
    annotations: lop11Annotations.peachFruitSeed,
    renderImage: { url: "/cell-renders-transparent/plant.png" },
    modelAsset: {
      url: "/models/peach.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 1.60002,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "maleReproductiveSystem",
    name: "Hệ sinh sản nam",
    type: "Các cơ quan tạo và vận chuyển tinh trùng",
    accent: "#4f77a8",
    accentSoft: "#e1eaf5",
    color: "#749dca",
    modelKind: "humanReproduction",
    defaultFocusId: "model",
    annotations: lop11Annotations.maleReproductiveSystem,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/male_reproductive_system.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 1,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "spermCellIllustration",
    name: "Tinh trùng",
    type: "Giao tử đực mang vật chất di truyền",
    accent: "#3c8f9f",
    accentSoft: "#dff2f3",
    color: "#67b8c7",
    modelKind: "humanReproduction",
    defaultFocusId: "model",
    annotations: lop11Annotations.spermCellIllustration,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/sperm_cell_illustration.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 1.6,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "uterus",
    name: "Tử cung",
    type: "Cơ quan nuôi dưỡng phôi và thai trong thai kỳ",
    accent: "#b85f83",
    accentSoft: "#f4e1e9",
    color: "#d486a4",
    modelKind: "humanReproduction",
    defaultFocusId: "model",
    annotations: lop11Annotations.uterus,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/uterus.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 2.5,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "embryoStages",
    name: "Các giai đoạn phôi",
    type: "Những bước phát triển sớm sau thụ tinh",
    accent: "#9a6a9f",
    accentSoft: "#f0e3f1",
    color: "#bc86bf",
    modelKind: "humanReproduction",
    defaultFocusId: "model",
    annotations: lop11Annotations.embryoStages,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/Embryo Stages.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 5,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "glucose3dModel",
    name: "Carbohydrate",
    type: "Phân tử đường cung cấp năng lượng cho tế bào",
    accent: "#b89a3f",
    accentSoft: "#f3eed8",
    color: "#d1b760",
    modelKind: "bioMolecules",
    defaultFocusId: "model",
    annotations: lop10Annotations.glucose,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/enzyme-catalysis-active-site-teaching.png",
    },
    modelAsset: {
      url: "/models/glucose_3d_model.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/enzyme-catalysis-active-site-teaching.png",
      scale: 0.2,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "lipids",
    name: "Lipit",
    type: "Nhóm phân tử kị nước tham gia dự trữ năng lượng và cấu tạo màng",
    accent: "#b26a3c",
    accentSoft: "#f4e5da",
    color: "#cf8a5a",
    modelKind: "bioMolecules",
    defaultFocusId: "model",
    annotations: lop10Annotations.lipid,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/enzyme-catalysis-active-site-teaching.png",
    },
    modelAsset: {
      url: "/models/lipids.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/enzyme-catalysis-active-site-teaching.png",
      scale: 0.04,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "protein",
    name: "Protein",
    type: "Đại phân tử đảm nhiệm cấu trúc, xúc tác và điều hòa hoạt động sống",
    accent: "#7c68b8",
    accentSoft: "#ebe6f8",
    color: "#9989d1",
    modelKind: "bioMolecules",
    defaultFocusId: "model",
    annotations: lop10Annotations.protein,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/enzyme-catalysis-active-site-teaching.png",
    },
    modelAsset: {
      url: "/models/protein.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/enzyme-catalysis-active-site-teaching.png",
      scale: 0.0517716,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "dnaRna",
    name: "DNA và RNA",
    type: "Axit nucleic lưu trữ và truyền đạt thông tin di truyền",
    accent: "#3c8f9f",
    accentSoft: "#dff2f3",
    color: "#67b8c7",
    modelKind: "bioMolecules",
    defaultFocusId: "model",
    annotations: lop10Annotations.dnaRna,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
    },
    modelAsset: {
      url: "/models/dna_rna.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/dna-replication-fork-teaching.png",
      scale: 2,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "bacteriaCellModel",
    name: "Tế bào vi khuẩn",
    type: "Tế bào nhân sơ không có nhân hoàn chỉnh",
    accent: "#48a77d",
    accentSoft: "#dbf1e7",
    color: "#65b8ae",
    modelKind: "prokaryoticCell",
    defaultFocusId: "model",
    annotations: lop10Annotations.prokaryoticCell,
    renderImage: { url: "/cell-renders-transparent/bacteria.png" },
    modelAsset: {
      url: "/models/BacteriaCell.glb",
      previewUrl: "/cell-renders-transparent/bacteria.png",
      scale: 0.03,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "animalCellModel",
    name: "Tế bào động vật",
    type: "Tế bào nhân thực có màng sinh chất và các bào quan",
    accent: "#9b74b7",
    accentSoft: "#efe5f6",
    color: "#9db6dc",
    modelKind: "eukaryoticCell",
    defaultFocusId: "model",
    annotations: lop10Annotations.animalCell,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/animal_cell.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 0.6,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "plantCellStructure",
    name: "Tế bào thực vật",
    type: "Tế bào nhân thực có thành tế bào, lục lạp và không bào",
    accent: "#4f8a3f",
    accentSoft: "#e5f1d8",
    color: "#81b64b",
    modelKind: "eukaryoticCell",
    defaultFocusId: "model",
    annotations: lop10Annotations.plantCell,
    renderImage: { url: "/cell-renders-transparent/plant.png" },
    modelAsset: {
      url: "/models/plant_cell_-_cell_structure.glb",
      previewUrl: "/cell-renders-transparent/plant.png",
      scale: 0.01,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "plasmaMembrane",
    name: "Màng sinh chất",
    type: "Lớp màng phospholipit kiểm soát trao đổi chất với môi trường",
    accent: "#4f8fa3",
    accentSoft: "#dff0f3",
    color: "#72b5c2",
    modelKind: "membraneTransport",
    defaultFocusId: "model",
    annotations: lop10Annotations.plasmaMembrane,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/plasma_membrane.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 0.08,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "passiveTransportSimpleDiffusion",
    name: "Khuếch tán đơn giản",
    type: "Vận chuyển thụ động qua màng theo chiều gradien nồng độ",
    accent: "#3f7aa8",
    accentSoft: "#dfeaf4",
    color: "#669cc4",
    modelKind: "membraneTransport",
    defaultFocusId: "model",
    annotations: lop10Annotations.membraneTransport,
    renderImage: { url: "/cell-renders-transparent/animal.png" },
    modelAsset: {
      url: "/models/Passive Transport Simple Diffusion.glb",
      previewUrl: "/cell-renders-transparent/animal.png",
      scale: 5,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "virus",
    name: "Virus",
    type: "Thực thể sinh học cần tế bào chủ để nhân lên",
    accent: "#8f5f82",
    accentSoft: "#f1e1ed",
    color: "#b77ca9",
    modelKind: "virus",
    defaultFocusId: "model",
    annotations: lop10Annotations.virus,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/antibody-antigen-binding-teaching.png",
    },
    modelAsset: {
      url: "/models/virus.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/antibody-antigen-binding-teaching.png",
      scale: 0.015,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "bacteriophage",
    name: "Thể thực khuẩn",
    type: "Virus lây nhiễm vi khuẩn và bơm vật chất di truyền vào tế bào chủ",
    accent: "#6d78a8",
    accentSoft: "#e6eaf7",
    color: "#98a1ce",
    modelKind: "virus",
    defaultFocusId: "model",
    annotations: lop10Annotations.bacteriophage,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/antibody-antigen-binding-teaching.png",
    },
    modelAsset: {
      url: "/models/Bacteriophage.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/antibody-antigen-binding-teaching.png",
      scale: 2.3,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "influenzaVirus",
    name: "Virus cúm",
    type: "Virus có vỏ ngoài gây bệnh cúm ở đường hô hấp",
    accent: "#bd514d",
    accentSoft: "#f5dfdc",
    color: "#d16d66",
    modelKind: "virus",
    defaultFocusId: "model",
    annotations: lop10Annotations.influenza,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/antibody-antigen-binding-teaching.png",
    },
    modelAsset: {
      url: "/models/influenza_virus.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/antibody-antigen-binding-teaching.png",
      scale: 2,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
  {
    id: "mitosis",
    name: "Nguyên phân",
    type: "Nhiễm sắc thể và thoi phân bào trong quá trình nguyên phân",
    accent: "#7c68b8",
    accentSoft: "#ebe6f8",
    color: "#9989d1",
    modelKind: "mitosis",
    defaultFocusId: "model",
    annotations: lop10Annotations.mitosis,
    renderImage: {
      url: "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/meiosis-crossing-over-teaching.png",
    },
    modelAsset: {
      url: "/models/mitosis.glb",
      previewUrl:
        "/texture-references/gpt-image-2-biology-more-teaching-2026-05-31/png/meiosis-crossing-over-teaching.png",
      scale: 1.6,
      rotation: [0, -0.35, 0],
      position: [0, 0.02, 0],
      exposure: 1.08,
      materialMode: "native",
      preserveNativeColor: true,
    },
  },
];

export function getCellById(id: string) {
  return cells.find((cell) => cell.id === id) ?? cells[0];
}
