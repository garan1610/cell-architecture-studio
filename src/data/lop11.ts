import type {
  CellItem,
  CellModelAsset,
  LessonItem,
  ModelAnnotation,
} from "./cells";

const lop11Palettes = {
  root: { accent: "#477a45", accentSoft: "#dcebd9", color: "#75aa70" },
  vascular: { accent: "#8b5a36", accentSoft: "#eee0d4", color: "#bd8359" },
  stomata: { accent: "#337a62", accentSoft: "#d8ebe4", color: "#63aa8d" },
  chloroplast: { accent: "#527a2b", accentSoft: "#e1ebd4", color: "#86ad55" },
  mitochondrion: { accent: "#a14f43", accentSoft: "#f1ddd9", color: "#cf7669" },
  digestion: { accent: "#9a6532", accentSoft: "#f0e2d2", color: "#c99059" },
  respiration: { accent: "#36768c", accentSoft: "#d9e9ee", color: "#68a6b9" },
  circulation: { accent: "#9a3f4d", accentSoft: "#f0d9de", color: "#ca6976" },
  immunity: { accent: "#7655a0", accentSoft: "#e7def0", color: "#a27bc4" },
  kidney: { accent: "#8a4d73", accentSoft: "#eedbe6", color: "#bd719b" },
  nervous: { accent: "#49699a", accentSoft: "#dce4ef", color: "#7698c4" },
} as const;

type Lop11PaletteKey = keyof typeof lop11Palettes;

type Lop11ModelInput = Pick<CellItem, "id" | "name" | "type"> &
  Required<Pick<CellItem, "description">> &
  Pick<CellItem, "modelLinks" | "renderImage"> &
  Pick<
    CellModelAsset,
    | "url"
    | "previewUrl"
    | "scale"
    | "rotation"
    | "position"
    | "exposure"
    | "animation"
    | "materialMode"
    | "preserveNativeColor"
    | "transparent"
    | "meshMaterialOverrides"
    | "materialColorOverrides"
    | "materialOpacityOverrides"
    | "cameraZoom"
    | "autoFit"
  > & {
    annotations: ModelAnnotation[];
    palette: Lop11PaletteKey;
    defaultFocusId?: CellItem["defaultFocusId"];
  };

function lop11Model({
  id,
  name,
  type,
  description,
  url,
  scale,
  annotations,
  palette,
  defaultFocusId,
  rotation = [0, -0.34, 0],
  position,
  previewUrl,
  exposure = 1.06,
  animation = false,
  materialMode = "native",
  preserveNativeColor = true,
  transparent,
  meshMaterialOverrides,
  materialColorOverrides,
  materialOpacityOverrides,
  cameraZoom,
  autoFit = false,
  modelLinks,
  renderImage,
}: Lop11ModelInput): CellItem {
  const colors = lop11Palettes[palette];

  return {
    id,
    name,
    type,
    description,
    ...colors,
    defaultFocusId: defaultFocusId ?? annotations[0]?.id ?? "primary",
    annotations,
    modelLinks,
    renderImage,
    modelAsset: {
      url,
      previewUrl,
      scale,
      rotation,
      position,
      annotations,
      exposure,
      animation,
      materialMode,
      preserveNativeColor,
      ...(transparent !== undefined ? { transparent } : {}),
      meshMaterialOverrides,
      materialColorOverrides,
      materialOpacityOverrides,
      cameraZoom,
      autoFit,
    },
  };
}

const lop11Text = {
  rootHair:
    "Tế bào lông hút là tế bào biểu bì rễ có phần lông kéo dài, thành mỏng và không bào lớn, giúp tăng diện tích tiếp xúc với dung dịch đất để hấp thụ nước và ion khoáng.",
  rootCrossSection:
    "Nước và ion khoáng đi từ biểu bì qua vỏ rễ, nội bì và đai Caspary trước khi vào trung trụ và được vận chuyển trong mạch gỗ.",
  xylem:
    "Mạch gỗ gồm quản bào và mạch ống có thành hóa gỗ, làm nhiệm vụ vận chuyển nước và ion khoáng chủ yếu từ rễ lên các cơ quan phía trên.",
  phloem:
    "Mạch rây gồm các tế bào ống rây nối tiếp nhau và tế bào kèm, vận chuyển sản phẩm quang hợp từ cơ quan nguồn đến cơ quan sử dụng hoặc dự trữ.",
  vascularBundle:
    "Trong bó mạch của thân, mạch gỗ thường nằm phía trong và mạch rây nằm phía ngoài; tầng sinh mạch có thể nằm giữa hai loại mô dẫn.",
  leafEpidermis:
    "Biểu bì bảo vệ bề mặt lá. Khí khổng gồm hai tế bào khí khổng bao quanh khe khí khổng, điều tiết trao đổi khí và thoát hơi nước.",
  guardCell:
    "Độ trương nước làm thay đổi hình dạng tế bào khí khổng. Sự khác nhau về độ dày của thành trong và thành ngoài giúp khe khí khổng đóng hoặc mở.",
  chloroplast:
    "Lục lạp được bao bọc bởi hai lớp màng. Hệ thống thylakoid xếp thành grana nằm trong chất nền lục lạp, là nơi diễn ra các giai đoạn của quang hợp.",
  mitochondrion:
    "Ti thể có màng ngoài, màng trong gấp nếp tạo mào ti thể và chất nền. Cấu trúc này tạo các khoang chuyên hóa cho hô hấp tế bào.",
  digestiveSystem:
    "Ống tiêu hóa ở người gồm miệng, thực quản, dạ dày, ruột non và ruột già; gan, túi mật và tụy cung cấp các dịch hỗ trợ tiêu hóa.",
  stomach:
    "Dạ dày có thành cơ khỏe và niêm mạc tiết dịch vị. Tại đây, thức ăn được co bóp, trộn với HCl và pepsin để tiêu hóa một phần protein.",
  smallIntestine:
    "Nếp gấp, lông ruột và vi nhung mao làm tăng mạnh diện tích hấp thụ của ruột non. Chất dinh dưỡng được chuyển vào mao mạch máu hoặc mạch bạch huyết.",
  humanLung:
    "Không khí đi qua khí quản, phế quản và tiểu phế quản đến phế nang. Màng phế nang - mao mạch mỏng là bề mặt trao đổi O₂ và CO₂.",
  birdLung:
    "Phổi chim kết hợp với hệ thống túi khí tạo dòng khí gần như một chiều qua các ống khí nhỏ, duy trì hiệu quả trao đổi khí cao.",
  externalHeart:
    "Tim người là cơ quan bơm máu, liên hệ với động mạch chủ, động mạch phổi, tĩnh mạch chủ và tĩnh mạch phổi; mạch vành cấp máu cho cơ tim.",
  cardiacConduction:
    "Hệ dẫn truyền tim gồm nút xoang nhĩ, nút nhĩ thất, bó His và mạng Purkinje, phối hợp hoạt động co của tâm nhĩ và tâm thất.",
  heartAndVessels:
    "Bốn buồng tim và các van tạo dòng máu một chiều. Động mạch, mao mạch và tĩnh mạch có cấu tạo phù hợp với áp lực và chức năng vận chuyển máu.",
  lymphNode:
    "Hạch bạch huyết lọc bạch huyết và là nơi tập trung tế bào miễn dịch. Bạch huyết đi vào qua mạch đến, qua vùng vỏ và tủy rồi ra khỏi hạch.",
  immuneCells:
    "Đại thực bào tham gia thực bào và trình diện kháng nguyên; tế bào lympho B và lympho T đảm nhiệm các vai trò khác nhau trong đáp ứng miễn dịch đặc hiệu.",
  kidney:
    "Hệ bài tiết nước tiểu gồm thận, niệu quản, bàng quang và niệu đạo. Trong thận, vùng vỏ, vùng tủy và bể thận liên hệ với hệ mạch và các nephron.",
  nephron:
    "Nephron là đơn vị cấu tạo và chức năng của thận, gồm cầu thận, bao Bowman, ống lượn gần, quai Henle, ống lượn xa và ống góp.",
  nervousSystem:
    "Hệ thần kinh gồm hệ thần kinh trung ương và hệ thần kinh ngoại biên, tiếp nhận thông tin, xử lí và điều khiển đáp ứng của cơ thể.",
  neuron:
    "Neuron gồm thân tế bào, sợi nhánh và sợi trục. Bao myelin và các eo Ranvier giúp xung thần kinh lan truyền nhanh theo kiểu nhảy cóc.",
  synapse:
    "Synapse hóa học gồm màng trước, khe synapse và màng sau. Chất trung gian hóa học được giải phóng từ túi synapse và gắn với thụ thể ở màng sau.",
} as const;

export const lop11Modules: LessonItem[] = [
  {
    id: "lop11-re-cay-va-hap-thu-nuoc-khoang",
    name: "Rễ cây và cơ chế hấp thụ nước, ion khoáng",
    overviewText:
      "Quan sát cấu tạo tế bào lông hút và lát cắt ngang của rễ để tìm hiểu con đường hấp thụ nước và ion khoáng ở thực vật.",
    tabs: [
      {
        id: "lop11-re-cay-te-bao-long-hut",
        title: "Tế bào lông hút",
        mainText: lop11Text.rootHair,
        models: [
          lop11Model({
            id: "lop11-re-cay-te-bao-long-hut-model",
            name: "Tế bào lông hút",
            type: "Cấu tạo miền lông hút của rễ",
            description: lop11Text.rootHair,
            url: "/new-models/Lop11_Rễ cây và cơ chế hấp thụ nước_Tab1_Tế bào lông hút.glb",
            scale: 3.2,
            annotations: [
              {
                id: "lop11-re-cay-te-bao-long-hut-model-1",
                number: 1,
                label: "Mạch gỗ",
                position: [0.003, 0.438, 0.039],
              },
              {
                id: "lop11-re-cay-te-bao-long-hut-model-2",
                number: 2,
                label: "Mạch rây",
                position: [0.097, 0.469, -0.069],
              },
              {
                id: "lop11-re-cay-te-bao-long-hut-model-3",
                number: 3,
                label: "Trụ bì",
                position: [-0.19, 0.453, 0.06],
              },
              {
                id: "lop11-re-cay-te-bao-long-hut-model-4",
                number: 4,
                label: "Tượng tầng",
                position: [-0.071, 0.442, -0.067],
              },
              {
                id: "lop11-re-cay-te-bao-long-hut-model-5",
                number: 5,
                label: "Mô mềm",
                position: [0.14, 0.449, 0.003],
              },
              {
                id: "lop11-re-cay-te-bao-long-hut-model-6",
                number: 6,
                label: "Vỏ rễ",
                position: [0.249, 0.443, -0.006],
              },
              {
                id: "lop11-re-cay-te-bao-long-hut-model-7",
                number: 7,
                label: "Lớp biểu bì",
                position: [0.328, 0.45, 0.032],
              },
              {
                id: "lop11-re-cay-te-bao-long-hut-model-8",
                number: 8,
                label: "Lông hút",
                position: [0.344, 0.186, 0.265],
              },
              {
                id: "lop11-re-cay-te-bao-long-hut-model-9",
                number: 9,
                label: "Vận chuyển",
                image: {
                  url: "https://cdn3.olm.vn/upload/img_teacher/0226/img_teacher_2023-02-26_63faf7b4401d2.jpg",
                },
                position: [0.192, 0.443, 0.176],
              },
            ],
            palette: "root",
          }),
        ],
      },
      {
        id: "lop11-re-cay-cat-ngang-re",
        title: "Lát cắt ngang của rễ",
        mainText: lop11Text.rootCrossSection,
        models: [
          lop11Model({
            id: "lop11-re-cay-cat-ngang-re-model",
            name: "Lát cắt ngang của rễ",
            type: "Cấu tạo giải phẫu của rễ",
            description: lop11Text.rootCrossSection,
            url: "/new-models/Lop11_Rễ cây và cơ chế hấp thụ nước_Tab2_Cắt ngang rễ.glb",
            scale: 17.06,
            annotations: [
              {
                id: "lop11-re-cay-cat-ngang-re-model-1",
                number: 1,
                label: "Mạch gỗ",
                position: [-0.01, 0.039, -0.016],
              },
              {
                id: "lop11-re-cay-cat-ngang-re-model-1-2",
                number: 1,
                label: "Mạch gỗ",
                position: [0.006, 0.009, 0.0],
              },
              {
                id: "lop11-re-cay-cat-ngang-re-model-2",
                number: 2,
                label: "Mạch rây",
                position: [-0.031, 0.039, 0.016],
              },
              {
                id: "lop11-re-cay-cat-ngang-re-model-2-2",
                number: 2,
                label: "Mạch rây",
                position: [0.025, -0.014, 0.0],
              },
              {
                id: "lop11-re-cay-cat-ngang-re-model-3",
                number: 3,
                label: "Vỏ rễ",
                position: [0.042, 0.024, -0.002],
              },
              {
                id: "lop11-re-cay-cat-ngang-re-model-4",
                number: 4,
                label: "Đai Caspary",
                position: [0.032, 0.008, -0.001],
              },
              {
                id: "lop11-re-cay-cat-ngang-re-model-5",
                number: 5,
                label: "Mô phân sinh đỉnh rễ",
                position: [-0.006, -0.098, 0.0],
              },
              {
                id: "lop11-re-cay-cat-ngang-re-model-6",
                number: 6,
                label: "Lông hút",
                position: [-0.067, -0.012, 0.039],
              },
            ],
            palette: "root",
          }),
        ],
      },
    ],
  },
  {
    id: "lop11-he-mo-dan-o-thuc-vat",
    name: "Hệ mô dẫn ở thực vật",
    overviewText:
      "So sánh cấu tạo, vị trí và chức năng vận chuyển của mạch gỗ và mạch rây trong cơ thể thực vật.",
    tabs: [
      {
        id: "lop11-he-mo-dan-vi-tri-mach-go-mach-ray",
        title: "Mạch gỗ và mạch rây trong thân",
        mainText: lop11Text.vascularBundle,
        models: [
          lop11Model({
            id: "lop11-he-mo-dan-mach-go-va-mach-ray-model",
            name: "Mạch gỗ và mạch rây",
            type: "Vị trí các mô dẫn trong thân",
            description: lop11Text.vascularBundle,
            url: "/new-models/Lop11_Hệ mô dẫn ở thực vật_Tab1_Mạch gỗ và mạch rây.glb",
            scale: 3.2,
            annotations: [
              {
                id: "lop11-he-mo-dan-mach-go-va-mach-ray-model-1",
                number: 1,
                label: "Mạch gỗ",
                position: [-0.290, 0.654, 0.020],
              },
              {
                id: "lop11-he-mo-dan-mach-go-va-mach-ray-model-2",
                number: 2,
                label: "Mạch rây",
                position: [0.002, 0.664, 0.026],
              },
              {
                id: "lop11-he-mo-dan-mach-go-va-mach-ray-model-3",
                number: 3,
                label: "Bản rây",
                position: [-0.002, 0.459, 0.108],
              },
              {
                id: "lop11-he-mo-dan-mach-go-va-mach-ray-model-7",
                number: 4,
                label: "Tế bào kèm",
                position: [0.088, 0.688, 0.108],
              },
              {
                id: "lop11-he-mo-dan-mach-go-va-mach-ray-model-5",
                number: 5,
                label: "Tế bào như mô",
                position: [0.315, 0.6, -0.036],
              },
              {
                id: "lop11-he-mo-dan-mach-go-va-mach-ray-model-6",
                number: 6,
                label: "Lục lạp",
                position: [0.257, 0.491, 0.084],
              },
            ],
            palette: "vascular",
          }),
        ],
      },
      {
        id: "lop11-he-mo-dan-mach-go",
        title: "Mạch gỗ",
        mainText: lop11Text.xylem,
        models: [
          lop11Model({
            id: "lop11-he-mo-dan-mach-go-model",
            name: "Mạch gỗ",
            type: "Mô dẫn nước và ion khoáng",
            description: lop11Text.xylem,
            url: "/new-models/Lop11_Hệ mô dẫn ở thực vật_Tab2_Mạch gỗ.glb",
            scale: 2.103,
            annotations: [
              {
                id: "lop11-he-mo-dan-mach-go-model-1",
                number: 1,
                label: "Quản bào",
                position: [-2.212, 2.406, -0.165],
              },
              {
                id: "lop11-he-mo-dan-mach-go-model-2",
                number: 2,
                label: "Mạch ống",
                position: [-1.932, 2.438, -0.161],
              },
              {
                id: "lop11-he-mo-dan-mach-go-model-3",
                number: 3,
                label: "Lỗ bên",
                position: [-2.11, 1.778, -0.169],
              },
              {
                id: "lop11-he-mo-dan-mach-go-model-5",
                number: 4,
                label: "Lỗ thủng",
                position: [-1.925, 1.737, -0.119],
              },
            ],
            palette: "vascular",
          }),
        ],
      },
      {
        id: "lop11-he-mo-dan-mach-ray",
        title: "Mạch rây",
        mainText: lop11Text.phloem,
        models: [
          lop11Model({
            id: "lop11-he-mo-dan-mach-ray-model",
            name: "Mạch rây",
            type: "Mô dẫn chất hữu cơ",
            description: lop11Text.phloem,
            url: "/new-models/Lop11_Hệ mô dẫn ở thực vật_Tab3_Mạch rây.glb",
            scale: 1.278,
            annotations: [
              {
                id: "lop11-he-mo-dan-mach-ray-model-1",
                number: 1,
                label: "Ống rây",
                position: [0.059, 2.488, 0.605],
              },
              {
                id: "lop11-he-mo-dan-mach-ray-model-2",
                number: 2,
                label: "Bản rây",
                position: [-0.965, 2.362, 0.633],
              },
              {
                id: "lop11-he-mo-dan-mach-ray-model-3",
                number: 3,
                label: "Tế bào kèm",
                position: [-1.169, 2.048, 0.397],
              },
            ],
            palette: "vascular",
          }),
        ],
      },
      
    ],
  },
  {
    id: "lop11-khi-khong-va-bieu-bi-la",
    name: "Khí khổng và biểu bì lá",
    overviewText:
      "Quan sát biểu bì lá và cấu tạo tế bào khí khổng để tìm hiểu cơ chế điều tiết trao đổi khí và thoát hơi nước.",
    tabs: [
      {
        id: "lop11-khi-khong-bieu-bi-la",
        title: "Biểu bì lá và khí khổng",
        mainText: lop11Text.leafEpidermis,
        models: [
          lop11Model({
            id: "lop11-khi-khong-bieu-bi-la-model",
            name: "Biểu bì lá và khí khổng",
            type: "Bề mặt biểu bì của lá",
            description: lop11Text.leafEpidermis,
            url: "/new-models/Lop11_Khí khổng và biểu bì lá_Tab1_Biểu bì lá và khí khổng.glb",
            scale: 3.796,
            annotations: [
              {
                id: "lop11-khi-khong-bieu-bi-la-model-1",
                number: 1,
                label: "Mạch gỗ",
                position: [-0.003, 0.425, 0.264],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-2",
                number: 2,
                label: "Mạch rây",
                position: [-0.001, 0.37, 0.265],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-3",
                number: 3,
                label: "Mô dày",
                position: [0.001, 0.3, 0.237],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-4",
                number: 4,
                label: "Bao bó mạch",
                position: [0.095, 0.413, 0.25],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-5",
                number: 5,
                label: "Lông biểu bì",
                position: [-0.141, 0.666, -0.031],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-6",
                number: 6,
                label: "Lớp cutin",
                position: [0.244, 0.707, 0.026],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-7",
                number: 7,
                label: "Biểu bì trên",
                position: [0.277, 0.586, 0.073],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-8",
                number: 8,
                label: "Mô giậu",
                position: [-0.325, 0.537, 0.151],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-9",
                number: 9,
                label: "Mô xốp",
                position: [0.327, 0.467, 0.183],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-10",
                number: 10,
                label: "Bó mạch",
                position: [-0.419, 0.469, 0.034],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-11",
                number: 11,
                label: "Tế bào khí khổng",
                position: [-0.254, 0.36, 0.006],
              },
              {
                id: "lop11-khi-khong-bieu-bi-la-model-12",
                number: 12,
                label: "Khí khổng",
                position: [-0.034, 0.252, -0.111],
              },
            ],
            palette: "stomata",
          }),
        ],
      },
      {
        id: "lop11-khi-khong-cau-tao-te-bao",
        title: "Cấu tạo tế bào khí khổng",
        mainText: lop11Text.guardCell,
        models: [
          lop11Model({
            id: "lop11-khi-khong-cau-tao-te-bao-model",
            name: "Tế bào khí khổng",
            type: "Cấu tạo thích nghi với đóng, mở khí khổng",
            description: lop11Text.guardCell,
            url: "/new-models/Lop11_Khí khổng và biểu bì lá_Tab2_Cấu tạo tế bào khí khổng.glb",
            scale: 3.2,
            annotations: [
              {
                id: "lop11-khi-khong-cau-tao-te-bao-model-1",
                number: 1,
                label: "Tế bào biểu bì",
                position: [-0.186, 0.373, -0.096],
              },
              {
                id: "lop11-khi-khong-cau-tao-te-bao-model-2",
                number: 2,
                label: "Thành trong dày",
                position: [-0.274, 0.234, -0.105],
              },
              {
                id: "lop11-khi-khong-cau-tao-te-bao-model-3",
                number: 3,
                label: "Tế bào khí khổng",
                position: [-0.244, 0.202, -0.041],
              },
              {
                id: "lop11-khi-khong-cau-tao-te-bao-model-4",
                number: 4,
                label: "Nhân",
                position: [-0.232, 0.241, -0.042],
              },
              {
                id: "lop11-khi-khong-cau-tao-te-bao-model-4-2",
                number: 4,
                label: "Nhân",
                position: [0.205, 0.182, 0.136],
              },
              {
                id: "lop11-khi-khong-cau-tao-te-bao-model-5",
                number: 5,
                label: "Lỗ khí",
                position: [-0.295, 0.211, -0.1],
              },
              {
                id: "lop11-khi-khong-cau-tao-te-bao-model-6",
                number: 6,
                label: "Lục lạp",
                position: [-0.263, 0.131, -0.006],
              },
            ],
            palette: "stomata",
          }),
        ],
      },
    ],
  },
  {
    id: "lop11-la-luc-lap-thylakoid",
    name: "Lục lạp và hệ thống thylakoid",
    overviewText:
      "Quan sát cấu tạo lục lạp và mối liên hệ giữa hệ thống thylakoid, grana và chất nền lục lạp trong quang hợp.",
    tabs: [
      {
        id: "lop11-luc-lap-cau-tao",
        title: "Cấu tạo lục lạp",
        mainText: lop11Text.chloroplast,
        models: [
          lop11Model({
            id: "lop11-luc-lap-cau-tao-model",
            name: "Lục lạp",
            type: "Bào quan thực hiện quang hợp",
            description: lop11Text.chloroplast,
            url: "/new-models/Lop11_Lá – lục lạp – thylakoid_Tab1_Cấu tạo lục lạp.glb",
            scale: 1.414,
            transparent: false,
            annotations: [
              {
                id: "lop11-luc-lap-cau-tao-model-1",
                number: 1,
                label: "Màng ngoài",
                position: [0.251, 1.07, 0.014],
              },
              {
                id: "lop11-luc-lap-cau-tao-model-2",
                number: 2,
                label: "Màng trong",
                position: [-1.028, 0.604, 0.049],
              },
              {
                id: "lop11-luc-lap-cau-tao-model-3",
                number: 3,
                label: "Khoang gian màng",
                position: [-1.04, 0.55, 0.141],
              },
              {
                id: "lop11-luc-lap-cau-tao-model-4",
                number: 4,
                label: "Thylakoid",
                position: [-0.301, 0.564, 0.038],
              },
              {
                id: "lop11-luc-lap-cau-tao-model-5",
                number: 5,
                label: "Hạt grana",
                position: [0.162, 0.648, 0.289],
              },
              {
                id: "lop11-luc-lap-cau-tao-model-6",
                number: 6,
                label: "Phiến gian grana",
                position: [-0.417, 0.524, 0.047],
              },
              {
                id: "lop11-luc-lap-cau-tao-model-7",
                number: 7,
                label: "Xoang thylakoid",
                position: [-0.09, 0.922, -0.226],
              },
              {
                id: "lop11-luc-lap-cau-tao-model-8",
                number: 8,
                label: "DNA",
                position: [-0.519, 0.51, -0.175],
              },
              {
                id: "lop11-luc-lap-cau-tao-model-9",
                number: 9,
                label: "Ribosome",
                position: [-0.24, 0.697, 0.133],
              },
              {
                id: "lop11-luc-lap-cau-tao-model-10",
                number: 10,
                label: "Stroma (chất nền lục lạp)",
                position: [-0.588, 0.284, -0.172],
              },
            ],
            palette: "chloroplast",
          }),
        ],
      },
    ],
  },
  {
    id: "lop11-ti-the-va-ho-hap-te-bao",
    name: "Ti thể và hô hấp tế bào",
    overviewText:
      "Quan sát các khoang của ti thể để xác định vị trí diễn ra chu trình Krebs và chuỗi truyền electron trong hô hấp tế bào.",
    tabs: [
      {
        id: "lop11-ti-the-cau-tao",
        title: "Cấu tạo ti thể",
        mainText: lop11Text.mitochondrion,
        models: [
          lop11Model({
            id: "lop11-ti-the-cau-tao-model",
            name: "Ti thể",
            type: "Bào quan thực hiện hô hấp tế bào",
            description: lop11Text.mitochondrion,
            url: "/new-models/Lop11_Ti thể và vị trí các giai đoạn hô hấp tế bào_Tab1_Cấu tạo ti thể.glb",
            scale: 0.01712,
            materialMode: "original",
            meshMaterialOverrides: {
              matrix_TT_checker_512x512_UV_GRID_0: {
                transparent: true,
                opacity: 0.78,
                depthWrite: false,
                renderOrder: 10,
              },
              shell_TT_checker_512x512_UV_GRID_0: {
                transparent: true,
                opacity: 0.48,
                depthWrite: false,
                renderOrder: 20,
              },
              cristae_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              dna_01_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              dna_02_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              dna_03_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              granule_0000_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              granule_0001_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              granule_0002_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              granule_0003_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              granule_0004_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              granule_0005_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
              granule_0006_TT_checker_512x512_UV_GRID_0: {
                transparent: false,
                opacity: 1,
                depthWrite: true,
                renderOrder: 0,
              },
            },
            annotations: [
              {
                id: "lop11-ti-the-cau-tao-model-1",
                number: 1,
                label: "Màng ngoài",
                position: [49.124, 30.018, -1.284],
              },
              {
                id: "lop11-ti-the-cau-tao-model-2",
                number: 2,
                label: "Màng trong",
                position: [46.097, 12.955, 18.182],
              },
              {
                id: "lop11-ti-the-cau-tao-model-3",
                number: 3,
                label: "Mào ti thể (cristae)",
                position: [6.66, 0.159, -14.266],
              },
              {
                id: "lop11-ti-the-cau-tao-model-4",
                number: 4,
                label: "Chất nền ti thể",
                position: [-9.805, -1.722, 4.22],
              },
              {
                id: "lop11-ti-the-cau-tao-model-5",
                number: 5,
                label: "DNA ti thể",
                position: [5.73, -1.722, 2.14],
              },
              {
                id: "lop11-ti-the-cau-tao-model-6",
                number: 6,
                label: "Ribosome",
                position: [-56.359, -1.722, 23.127],
              },
              {
                id: "lop11-ti-the-cau-tao-model-7",
                number: 7,
                label: "Hạt dự trữ",
                position: [-63.328, -1.722, 9.234],
              },
            ],
            palette: "mitochondrion",
          }),
        ],
      },
    ],
  },
  {
    id: "lop11-he-tieu-hoa-o-nguoi",
    name: "Hệ tiêu hóa ở người",
    overviewText:
      "Tìm hiểu cấu tạo của ống tiêu hóa và sự chuyên hóa của dạ dày, ruột non trong tiêu hóa và hấp thụ chất dinh dưỡng.",
    tabs: [
      {
        id: "lop11-he-tieu-hoa-ong-tieu-hoa",
        title: "Toàn bộ ống tiêu hóa",
        mainText: lop11Text.digestiveSystem,
        models: [
          lop11Model({
            id: "lop11-he-tieu-hoa-ong-tieu-hoa-model",
            name: "Hệ tiêu hóa ở người",
            type: "Các cơ quan của hệ tiêu hóa",
            description: lop11Text.digestiveSystem,
            url: "/new-models/Lop11_Hệ tiêu hóa người_Tab1_Toàn bộ ống tiêu hóa.glb",
            scale: 1.783,
            annotations: [
              {
                id: "lop11-he-tieu-hoa-ong-tieu-hoa-model-1",
                number: 1,
                label: "Miệng",
                position: [0.001, 1.602, 0.047],
              },
              {
                id: "lop11-he-tieu-hoa-ong-tieu-hoa-model-2",
                number: 2,
                label: "Tuyến nước bọt",
                position: [0.065, 1.623, -0.05],
              },
              {
                id: "lop11-he-tieu-hoa-ong-tieu-hoa-model-3",
                number: 3,
                label: "Thực quản",
                position: [0.0, 1.46, -0.064],
              },
              {
                id: "lop11-he-tieu-hoa-ong-tieu-hoa-model-4",
                number: 4,
                label: "Gan",
                position: [-0.004, 1.26, 0.043],
              },
              {
                id: "lop11-he-tieu-hoa-ong-tieu-hoa-model-5",
                number: 5,
                label: "Dạ dày",
                position: [0.101, 1.231, -0.011],
              },
              {
                id: "lop11-he-tieu-hoa-ong-tieu-hoa-model-6",
                number: 6,
                label: "Ruột già",
                position: [0.08, 1.129, -0.05],
              },
              {
                id: "lop11-he-tieu-hoa-ong-tieu-hoa-model-7",
                number: 7,
                label: "Ruột non",
                position: [-0.0, 1.078, 0.03],
              },
              {
                id: "lop11-he-tieu-hoa-ong-tieu-hoa-model-8",
                number: 8,
                label: "Trực tràng",
                position: [-0.004, 0.86, -0.089],
              },
            ],
            palette: "digestion",
          }),
        ],
      },
      {
        id: "lop11-he-tieu-hoa-da-day",
        title: "Dạ dày",
        mainText: lop11Text.stomach,
        models: [
          lop11Model({
            id: "lop11-he-tieu-hoa-da-day-model",
            name: "Dạ dày",
            type: "Cấu tạo và tiêu hóa ở dạ dày",
            description: lop11Text.stomach,
            url: "/new-models/Lop11_Hệ tiêu hóa người_Tab2_Dạ dày.glb",
            scale: 3.2,
            annotations: [
              {
                id: "lop11-he-tieu-hoa-da-day-model-1",
                number: 1,
                label: "Lớp cơ dọc",
                position: [0.213, 0.744, 0.214],
              },
              {
                id: "lop11-he-tieu-hoa-da-day-model-2",
                number: 2,
                label: "Lớp cơ vòng",
                position: [0.248, 0.639, 0.185],
              },
              {
                id: "lop11-he-tieu-hoa-da-day-model-3",
                number: 3,
                label: "Lớp cơ chéo",
                position: [0.216, 0.537, 0.129],
              },
              {
                id: "lop11-he-tieu-hoa-da-day-model-4",
                number: 4,
                label: "Nếp gấp niêm mạc",
                position: [0.029, 0.342, -0.049],
              },
              {
                id: "lop11-he-tieu-hoa-da-day-model-5",
                number: 5,
                label: "Cơ thắt môn vị",
                position: [-0.223, 0.36, 0.005],
              },
            ],
            palette: "digestion",
          }),
        ],
      },
      {
        id: "lop11-he-tieu-hoa-ruot-non",
        title: "Ruột non và lông ruột",
        mainText: lop11Text.smallIntestine,
        models: [
          lop11Model({
            id: "lop11-he-tieu-hoa-ruot-non-model",
            name: "Ruột non và lông ruột",
            type: "Bề mặt hấp thụ của ruột non",
            description: lop11Text.smallIntestine,
            url: "/new-models/Lop11_Hệ tiêu hóa người_Tab3_Ruột non và lông ruột.glb",
            scale: 3.2,
            annotations: [
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-1",
                number: 1,
                label: "Tiểu tĩnh mạch",
                position: [-0.218, 0.292, 0.205],
                image: {
                  url: "https://images.tuyensinh247.com/picture/images_question/1743234511-ag11.jpg",
                },
              },
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-2",
                number: 2,
                label: "Sợi thần kinh",
                position: [-0.172, 0.463, 0.206],
              },
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-3",
                number: 3,
                label: "Mạch bạch huyết",
                position: [-0.038, 0.12, 0.247],
              },
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-4",
                number: 4,
                label: "Mạch dưỡng chấp",
                position: [-0.113, 0.397, 0.205],
              },
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-5",
                number: 5,
                label: "Tiểu động mạch",
                position: [0.001, 0.186, 0.191],
              },
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-6",
                number: 6,
                label: "Niêm mạc",
                position: [-0.113, 0.927, 0.196],
              },
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-7",
                number: 7,
                label: "Vi nhung mao",
                position: [0.007, 0.539, 0.033],
              },
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-8",
                number: 8,
                label: "Lông ruột",
                position: [0.267, 0.431, 0.115],
              },
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-9",
                number: 9,
                label: "Tuyến ruột",
                position: [0.152, 0.286, 0.029],
              },
              {
                id: "lop11-he-tieu-hoa-ruot-non-model-10",
                number: 10,
                label: "Tế bào biểu mô",
                position: [-0.33, 0.418, 0.195],
              },
            ],
            palette: "digestion",
          }),
        ],
      },
    ],
  },
  {
    id: "lop11-co-quan-trao-doi-khi-o-dong-vat",
    name: "Cơ quan trao đổi khí ở động vật",
    overviewText:
      "So sánh cấu tạo và dòng khí qua phổi người với hệ thống phổi - túi khí của chim.",
    tabs: [
      {
        id: "lop11-trao-doi-khi-phoi-nguoi",
        title: "Hệ hô hấp con người",
        mainText: lop11Text.humanLung,
        models: [
          lop11Model({
            id: "lop11-trao-doi-khi-phoi-nguoi-model",
            name: "Hệ hô hấp con người",
            type: "Cơ quan trao đổi khí ở người",
            description: lop11Text.humanLung,
            url: "/new-models/Lop11_Cơ quan trao đổi khí ở động vật_Tab1_Phổi người và phế nang.glb",
            scale: 1.783,
            animation: true,
            annotations: [
              {
                id: "lop11-trao-doi-khi-phoi-nguoi-model-1",
                number: 1,
                label: "Khoang mũi",
                position: [-0.007, 1.64, 0.025],
              },
              {
                id: "lop11-trao-doi-khi-phoi-nguoi-model-2",
                number: 2,
                label: "Khoang miệng",
                position: [0.003, 1.596, 0.03],
              },
              {
                id: "lop11-trao-doi-khi-phoi-nguoi-model-3",
                number: 3,
                label: "Thanh quản",
                position: [0, 1.533, -0.01],
              },
              {
                id: "lop11-trao-doi-khi-phoi-nguoi-model-4",
                number: 4,
                label: "Khí quản",
                position: [0.002, 1.45, -0.048],
              },
              {
                id: "lop11-trao-doi-khi-phoi-nguoi-model-5",
                number: 5,
                label: "Phổi",
                position: [-0.097, 1.324, -0.032],
              },
              {
                id: "lop11-trao-doi-khi-phoi-nguoi-model-6",
                number: 6,
                label: "Cơ hoành",
                position: [0.111, 1.236, 0.01],
              },
            ],
            palette: "respiration",
          }),
          lop11Model({
            id: "lop11-trao-doi-khi-phoi-model",
            name: "Phổi",
            type: "Cơ quan trao đổi khí ở người",
            description: lop11Text.humanLung,
            url: "/new-models/Lop11_Cơ quan trao đổi khí ở động vật_Tab1_Phổi.glb",
            scale: 9,
            animation: true,
            annotations: [
              {
                id: "lop11-trao-doi-khi-phoi-model-1",
                number: 1,
                label: "Thanh quản",
                position: [-0.898, 1.563, 0.043],
              },
              {
                id: "lop11-trao-doi-khi-phoi-model-2",
                number: 2,
                label: "Khí quản",
                position: [-0.899, 1.499, -0.003],
              },
              {
                id: "lop11-trao-doi-khi-phoi-model-3",
                number: 3,
                label: "Phế quản chính",
                position: [-0.875, 1.446, -0.024],
              },
              {
                id: "lop11-trao-doi-khi-phoi-model-4",
                number: 4,
                label: "Phế quản thùy",
                position: [-0.842, 1.440, -0.028],
              },
              {
                id: "lop11-trao-doi-khi-phoi-model-5",
                number: 5,
                label: "Tiểu phế quản",
                position: [-0.788, 1.342, -0.009],
              },
              {
                id: "lop11-trao-doi-khi-phoi-model-6",
                number: 6,
                label: "Thùy trên phổi phải",
                position: [-0.986, 1.481, -0.007],
              },
              {
                id: "lop11-trao-doi-khi-phoi-model-7",
                number: 7,
                label: "Thùy giữa phổi phải",
                position: [-0.993, 1.348, 0.057],
              },
              {
                id: "lop11-trao-doi-khi-phoi-model-8",
                number: 8,
                label: "Thùy dưới phổi phải",
                position: [-1.046, 1.312, 0.002],
              },
            ],
            palette: "respiration",
          }),
        ],
      },
      {
        id: "lop11-trao-doi-khi-phoi-chim",
        title: "Phổi chim và túi khí",
        mainText: lop11Text.birdLung,
        models: [
          lop11Model({
            id: "lop11-trao-doi-khi-phoi-chim-model",
            name: "Phổi chim và túi khí",
            type: "Cơ quan trao đổi khí ở chim",
            description: lop11Text.birdLung,
            url: "/new-models/Lop11_Cơ quan trao đổi khí ở động vật_Tab2_Phổi chim và túi khí.glb",
            scale: 3.2,
            annotations: [
              {
                id: "lop11-trao-doi-khi-phoi-chim-model-1",
                number: 1,
                label: "Diều",
                position: [-0.114, 0.267, 0.129],
              },
              {
                id: "lop11-trao-doi-khi-phoi-chim-model-2",
                number: 2,
                label: "Hộp sọ",
                position: [-0.341, 0.522, 0.149],
              },
              {
                id: "lop11-trao-doi-khi-phoi-chim-model-3",
                number: 3,
                label: "Túi khí",
                position: [0.292, 0.181, 0.26],
              },
              {
                id: "lop11-trao-doi-khi-phoi-chim-model-4",
                number: 4,
                label: "Ruột",
                position: [0.414, 0.177, 0.04],
              },
              {
                id: "lop11-trao-doi-khi-phoi-chim-model-5",
                number: 5,
                label: "Dạ dày tuyến",
                position: [0.285, 0.238, 0.008],
              },
              {
                id: "lop11-trao-doi-khi-phoi-chim-model-6",
                number: 6,
                label: "Dạ dày cơ",
                position: [0.094, 0.232, 0.117],
              },
            ],
            palette: "respiration",
          }),
        ],
      },
    ],
  },
  {
    id: "lop11-tim-va-he-mach-o-nguoi",
    name: "Tim và hệ mạch ở người",
    overviewText:
      "Quan sát cấu tạo ngoài, hệ dẫn truyền, các buồng tim và các loại mạch máu để tìm hiểu hoạt động của hệ tuần hoàn.",
    tabs: [
      {
        id: "lop11-tim-cau-tao-ngoai",
        title: "Cấu tạo ngoài của tim",
        mainText: lop11Text.externalHeart,
        models: [
          lop11Model({
            id: "lop11-tim-cau-tao-ngoai-model",
            name: "Cấu tạo ngoài của tim",
            type: "Hình thái ngoài của tim người",
            description: lop11Text.externalHeart,
            url: "/new-models/Lop11_Tim và hệ mạch người_Tab1_Cấu tạo ngoài của tim.glb",
            scale: 1.998,
            annotations: [
              {
                id: "lop11-tim-cau-tao-ngoai-model-1",
                number: 1,
                label: "Động mạch phổi",
                position: [0.423, 0.384, 0.159],
              },
              {
                id: "lop11-tim-cau-tao-ngoai-model-2",
                number: 2,
                label: "Cung động mạch chủ",
                position: [0.132, 0.608, 0.057],
              },
              {
                id: "lop11-tim-cau-tao-ngoai-model-3",
                number: 3,
                label: "Tĩnh mạch chủ trên",
                position: [-0.273, 0.674, 0.215],
              },
              {
                id: "lop11-tim-cau-tao-ngoai-model-4",
                number: 4,
                label: "Tâm nhĩ trái",
                position: [0.299, 0.130, 0.250],
              },
              {
                id: "lop11-tim-cau-tao-ngoai-model-5",
                number: 5,
                label: "Tâm nhĩ phải",
                position: [-0.241, 0.126, 0.386],
              },
              {
                id: "lop11-tim-cau-tao-ngoai-model-6",
                number: 6,
                label: "Tâm thất phải",
                position: [-0.113, -0.286, 0.458],
              },
              {
                id: "lop11-tim-cau-tao-ngoai-model-7",
                number: 7,
                label: "Tâm thất trái",
                position: [0.322, -0.358, 0.259],
              },
            ],
            palette: "circulation",
          }),
        ],
      },
      {
        id: "lop11-tim-he-dan-truyen",
        title: "Hệ dẫn truyền tim",
        mainText: lop11Text.cardiacConduction,
        models: [
          lop11Model({
            id: "lop11-tim-he-dan-truyen-model",
            name: "Hệ dẫn truyền tim",
            type: "Hệ thống điều hòa nhịp co của tim",
            description: lop11Text.cardiacConduction,
            url: "/new-models/Lop11_Tim và hệ mạch người_Tab2_Hệ dẫn truyền tim.glb",
            scale: 19.17,
            annotations: [
              {
                id: "lop11-tim-he-dan-truyen-model-1",
                number: 1,
                label: "Tâm nhĩ phải",
                position: [-0.032, 0.076, -0.031],
              },
              {
                id: "lop11-tim-he-dan-truyen-model-2",
                number: 2,
                label: "Tâm thất phải",
                position: [0.003, 0.021, 0.006],
              },
              {
                id: "lop11-tim-he-dan-truyen-model-3",
                number: 3,
                label: "Tâm thất trái",
                position: [0.034, 0.036, -0.0],
              },
              {
                id: "lop11-tim-he-dan-truyen-model-4",
                number: 4,
                label: "Tâm nhĩ trái",
                position: [0.027, 0.086, -0.021],
              },
              {
                id: "lop11-tim-he-dan-truyen-model-5",
                number: 5,
                label: "Tĩnh mạch chủ trên",
                position: [-0.039, 0.126, 0.006],
              },
              {
                id: "lop11-tim-he-dan-truyen-model-6",
                number: 6,
                label: "Động mạch phổi",
                position: [0.038, 0.131, 0.004],
              },
            ],
            palette: "circulation",
          }),
        ],
      },
      {
        id: "lop11-tim-cac-buong-tim-va-he-mach",
        title: "Các buồng tim và hệ mạch",
        mainText: lop11Text.heartAndVessels,
        models: [
          lop11Model({
            id: "lop11-tim-cac-buong-tim-model",
            name: "Hệ tim mạch",
            type: "Hệ tuần hoàn của tim",
            description: lop11Text.heartAndVessels,
            url: "/new-models/Lop11_Tim và hệ mạch người_Tab3_01.glb",
            scale: 1.783,
            animation: true,
            annotations: [
              {
                id: "lop11-tim-cac-buong-tim-model-1",
                number: 1,
                label: "Tĩnh mạch chủ trên",
                position: [-0.021, 1.422, -0.045],
              },
              {
                id: "lop11-tim-cac-buong-tim-model-2",
                number: 2,
                label: "Tĩnh mạch chủ dưới",
                position: [-0.019, 1.265, -0.042],
              },
              {
                id: "lop11-tim-cac-buong-tim-model-3",
                number: 3,
                label: "Tim",
                position: [0.041, 1.353, 0.015],
              },
              {
                id: "lop11-tim-cac-buong-tim-model-4",
                number: 4,
                label: "Động mạch chủ",
                position: [0.034, 1.426, -0.080],
              },
              {
                id: "lop11-tim-cac-buong-tim-model-5",
                number: 5,
                label: "Tĩnh mạch đùi",
                position: [-0.045, 0.899, -0.001],
              },
              {
                id: "lop11-tim-cac-buong-tim-model-6",
                number: 6,
                label: "Động mạch đùi",
                position: [0.067, 0.839, -0.000],
              },
            ],
            palette: "circulation",
          }),
          lop11Model({
            id: "lop11-tim-he-mach-model",
            name: "Động mạch, mao mạch và tĩnh mạch",
            type: "Các loại mạch máu của hệ tuần hoàn",
            description: lop11Text.heartAndVessels,
            url: "/new-models/Lop11_Tim và hệ mạch người_Tab3_02.glb",
            scale: 3.2,
            annotations: [
              {
                id: "lop11-tim-he-mach-model-1",
                number: 1,
                label: "Tĩnh mạch",
                position: [0.445, 0.637, 0.010],
              },
              {
                id: "lop11-tim-he-mach-model-2",
                number: 2,
                label: "Động mạch",
                position: [-0.365, 0.675, 0.003],
              },
              {
                id: "lop11-tim-he-mach-model-3",
                number: 3,
                label: "Về tim",
                position: [0.421, 0.813, 0.015],
              },
              {
                id: "lop11-tim-he-mach-model-4",
                number: 4,
                label: "Từ tim",
                position: [-0.357, 0.827, -0.001],
              },
              {
                id: "lop11-tim-he-mach-model-5",
                number: 5,
                label: "Mao mạch",
                position: [0.044, 0.527, 0.121],
              },
            ],
            palette: "circulation",
          }),
        ],
      },
    ],
  },
  {
    id: "lop11-he-mien-dich-o-nguoi",
    name: "Hệ miễn dịch ở người",
    overviewText:
      "Tìm hiểu cấu tạo hạch bạch huyết và vai trò của một số loại tế bào trong đáp ứng miễn dịch ở người.",
    tabs: [
      {
        id: "lop11-he-mien-dich-hach-bach-huyet",
        title: "Hạch bạch huyết",
        mainText: lop11Text.lymphNode,
        models: [
          lop11Model({
            id: "lop11-he-mien-dich-hach-bach-huyet-model",
            name: "Hạch bạch huyết",
            type: "Cơ quan của hệ miễn dịch",
            description: lop11Text.lymphNode,
            url: "/new-models/Lop11_Hệ miễn dịch người_Tab1_Hạch bạch huyết.pbr.glb",
            scale: 0.1437,
            annotations: [
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-1",
                number: 1,
                label: "Vỏ xơ",
                position: [-0.121, 3.452, 1.881],
              },
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-2",
                number: 2,
                label: "Mạch bạch huyết đến",
                position: [-4.309, 3.088, 0.973],
              },
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-3",
                number: 3,
                label: "Nang",
                position: [-2.192, 2.320, 2.009],
              },
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-4",
                number: 4,
                label: "Vùng vỏ ngoài",
                position: [-1.639, 2.376, 1.978],
              },
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-5",
                number: 5,
                label: "Vùng vỏ trong",
                position: [0.082, 2.249, 1.958],
              },
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-6",
                number: 6,
                label: "Xoang",
                position: [-2.589, 0.469, 2.004],
              },
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-7",
                number: 7,
                label: "Vùng tủy",
                position: [-0.841, 0.307, 1.660],
              },
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-8",
                number: 8,
                label: "Mạch bạch huyết đi",
                position: [1.884, -0.026, 1.757],
              },
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-9",
                number: 9,
                label: "Tĩnh mạch",
                position: [0.647, -0.370, 2.112],
              },
              {
                id: "lop11-he-mien-dich-hach-bach-huyet-model-10",
                number: 10,
                label: "Động mạch",
                position: [1.058, -0.666, 2.110],
              },
            ],
            palette: "immunity",
          }),
        ],
      },
      {
        id: "lop11-he-mien-dich-te-bao",
        title: "Một số tế bào miễn dịch",
        mainText: lop11Text.immuneCells,
        models: [
          lop11Model({
            id: "lop11-he-mien-dich-te-bao-model",
            name: "Tế bào miễn dịch",
            type: "Các tế bào tham gia đáp ứng miễn dịch",
            description: lop11Text.immuneCells,
            url: "/new-models/Lop11_Hệ miễn dịch người_Tab2_Tế bào miễn dịch cơ bản.glb",
            scale: 0.2617,
            annotations: [
              {
                id: "lop11-he-mien-dich-te-bao-model-1",
                number: 1,
                label: "Đại thực bào",
                position: [1.473, 0.573, 1.155],
              },
              {
                id: "lop11-he-mien-dich-te-bao-model-2",
                number: 2,
                label: "Tế bào vi khuẩn",
                position: [8.187, 0.719, -1.066],
              },
              {
                id: "lop11-he-mien-dich-te-bao-model-3",
                number: 3,
                label: "Chân giả",
                position: [4.576, 0.871, -0.781],
              },
              {
                id: "lop11-he-mien-dich-te-bao-model-4",
                number: 4,
                label: "Vi khuẩn bị nuốt",
                position: [-1.735, -1.572, 4.635],
              },
            ],
            palette: "immunity",
          }),
        ],
      },
    ],
  },
  {
    id: "lop11-than-va-nephron",
    name: "Thận và nephron",
    overviewText:
      "Quan sát hệ bài tiết nước tiểu, cấu tạo thận và nephron để tìm hiểu quá trình hình thành nước tiểu.",
    tabs: [
      {
        id: "lop11-than-cau-tao",
        title: "Hệ bài tiết nước tiểu và cấu tạo thận",
        mainText: lop11Text.kidney,
        models: [
          lop11Model({
            id: "lop11-than-he-bai-tiet-model",
            name: "Hệ bài tiết nước tiểu",
            type: "Các cơ quan của hệ bài tiết nước tiểu",
            description: lop11Text.kidney,
            url: "/new-models/Lop11_Thận và nephron_Tab1_01.glb",
            scale: 0.202,
            annotations: [
              {
                id: "lop11-than-he-bai-tiet-model-1",
                number: 1,
                label: "Thận",
                position: [-3.785, 2.747, 0.936],
              },
              {
                id: "lop11-than-he-bai-tiet-model-2",
                number: 2,
                label: "Động mạch thận",
                position: [0.459, 2.558, -0.045],
              },
              {
                id: "lop11-than-he-bai-tiet-model-3",
                number: 3,
                label: "Tĩnh mạch thận",
                position: [-0.587, 1.171, 0.315],
              },
              {
                id: "lop11-than-he-bai-tiet-model-4",
                number: 4,
                label: "Niệu quản",
                position: [1.787, -3.189, 0.100],
              },
              {
                id: "lop11-than-he-bai-tiet-model-5",
                number: 5,
                label: "Bàng quang",
                position: [-0.203, -8.821, 1.178],
              },
              {
                id: "lop11-than-he-bai-tiet-model-6",
                number: 6,
                label: "Niệu đạo",
                position: [-0.321, -11.406, 0.151],
              },
            ],
            palette: "kidney",
          }),
          lop11Model({
            id: "lop11-than-cau-tao-model",
            name: "Cấu tạo thận",
            type: "Cấu tạo trong của thận",
            description: lop11Text.kidney,
            url: "/new-models/Lop11_Thận và nephron_Tab1_02.glb",
            scale: 0.3169,
            annotations: [
              {
                id: "lop11-than-cau-tao-model-1",
                number: 1,
                label: "Bao xơ",
                position: [-1.728, 9.007, -0.221],
              },
              {
                id: "lop11-than-cau-tao-model-2",
                number: 2,
                label: "Nephron",
                position: [-2.194, 7.679, 0.123],
              },
              {
                id: "lop11-than-cau-tao-model-3",
                number: 3,
                label: "Bể thận",
                position: [-1.031, 4.235, -0.163],
              },
              {
                id: "lop11-than-cau-tao-model-4",
                number: 4,
                label: "Niệu quản",
                position: [0.149, 1.586, -0.130],
              },
              {
                id: "lop11-than-cau-tao-model-5",
                number: 5,
                label: "Động mạch thận",
                position: [1.930, 3.866, 0.764],
              },
              {
                id: "lop11-than-cau-tao-model-6",
                number: 6,
                label: "Tĩnh mạch thận",
                position: [0.918, 3.249, 1.619],
              },
              {
                id: "lop11-than-cau-tao-model-7",
                number: 7,
                label: "Vỏ thận",
                position: [-4.232, 5.970, 0.030],
              },
              {
                id: "lop11-than-cau-tao-model-8",
                number: 8,
                label: "Đài thận",
                position: [-2.262, 4.601, -0.121],
              },
            ],
            palette: "kidney",
          }),
        ],
      },
      {
        id: "lop11-than-nephron",
        title: "Cấu tạo nephron",
        mainText: lop11Text.nephron,
        models: [
          lop11Model({
            id: "lop11-than-nephron-model",
            name: "Nephron",
            type: "Đơn vị cấu tạo và chức năng của thận",
            description: lop11Text.nephron,
            url: "/new-models/Lop11_Thận và nephron_Tab2_Nephron.glb",
            scale: 15.68,
            annotations: [
              {
                id: "lop11-than-nephron-model-1",
                number: 1,
                label: "Cầu thận (Túi Bowman)",
                position: [-0.022, 0.173, -0.001],
              },
              {
                id: "lop11-than-nephron-model-2",
                number: 2,
                label: "Máu chưa lọc đi vào",
                position: [-0.004, 0.184, 0.001],
              },
              {
                id: "lop11-than-nephron-model-3",
                number: 3,
                label: "Quai Henle",
                position: [-0.025, 0.062, 0.001],
              },
              {
                id: "lop11-than-nephron-model-4",
                number: 4,
                label: "Ống lượn gần",
                position: [-0.043, 0.195, 0.002],
              },
              {
                id: "lop11-than-nephron-model-5",
                number: 5,
                label: "Ống lượn xa",
                position: [0.018, 0.203, 0.003],
              },
              {
                id: "lop11-than-nephron-model-6",
                number: 6,
                label: "Ống góp",
                position: [0.032, 0.026, 0.003],
              },
              {
                id: "lop11-than-nephron-model-7",
                number: 7,
                label: "Mao mạch quanh ống thận",
                position: [-0.014, 0.137, 0.002],
              },
              {
                id: "lop11-than-nephron-model-8",
                number: 8,
                label: "Máu đã lọc đi ra",
                position: [-0.004, 0.171, 0.001],
              },
              {
                id: "lop11-than-nephron-model-9",
                number: 9,
                label: "Động mạch thận",
                position: [-0.004, 0.214, 0.001],
              },
              {
                id: "lop11-than-nephron-model-10",
                number: 10,
                label: "Tĩnh mạch thận",
                position: [-0.032, 0.212, 0.001],
              },
            ],
            palette: "kidney",
          }),
        ],
      },
    ],
  },
  {
    id: "lop11-he-than-kinh-neuron-synapse",
    name: "Hệ thần kinh, neuron và synapse",
    overviewText:
      "Quan sát tổ chức của hệ thần kinh, cấu tạo neuron và synapse để tìm hiểu cơ sở tiếp nhận, dẫn truyền và xử lí thông tin.",
    tabs: [
      {
        id: "lop11-he-than-kinh-tong-the",
        title: "Hệ thần kinh",
        mainText: lop11Text.nervousSystem,
        models: [
          lop11Model({
            id: "lop11-he-than-kinh-tong-the-model",
            name: "Hệ thần kinh ở người",
            type: "Tổ chức chung của hệ thần kinh",
            description: lop11Text.nervousSystem,
            url: "/new-models/Lop11_Hệ thần kinh_Tab1_Hệ thần kinh.glb",
            scale: 2.5,
            annotations: [
              {
                id: "lop11-he-than-kinh-tong-the-model-1",
                number: 1,
                label: "Não",
                position: [0.004, 1.739, -0.062],
              },
              {
                id: "lop11-he-than-kinh-tong-the-model-2",
                number: 2,
                label: "Tủy sống",
                position: [0, 1.554, -0.075],
              },
              {
                id: "lop11-he-than-kinh-tong-the-model-3",
                number: 3,
                label: "Dây thần kinh liên sườn",
                position: [-0.117, 1.321, 0.022],
              },
              {
                id: "lop11-he-than-kinh-tong-the-model-4",
                number: 4,
                label: "Dây thần kinh tọa",
                position: [-0.068, 0.890, -0.110],
              },
              {
                id: "lop11-he-than-kinh-tong-the-model-5",
                number: 5,
                label: "Dây thần kinh giữa",
                position: [0.242, 1.130, -0.102],
              },
              {
                id: "lop11-he-than-kinh-tong-the-model-6",
                number: 6,
                label: "Dây thần kinh đùi",
                position: [0.078, 0.939, -0.012],
              },
              {
                id: "lop11-he-than-kinh-tong-the-model-7",
                number: 7,
                label: "Dây thần kinh chày",
                position: [0.076, 0.397, -0.102],
              },
            ],
            palette: "nervous",
          }),
        ],
      },
      {
        id: "lop11-he-than-kinh-neuron",
        title: "Cấu tạo neuron",
        mainText: lop11Text.neuron,
        models: [
          lop11Model({
            id: "lop11-he-than-kinh-neuron-model",
            name: "Neuron",
            type: "Tế bào thần kinh",
            description: lop11Text.neuron,
            url: "/new-models/Lop11_Hệ thần kinh_Tab2_Cấu tạo neuron.pbr.glb",
            scale: 1.5,
            annotations: [
              {
                id: "lop11-he-than-kinh-neuron-model-1",
                number: 1,
                label: "Bao myelin",
                position: [0.056, -0.354, 0.997],
              },
              {
                id: "lop11-he-than-kinh-neuron-model-2",
                number: 2,
                label: "Nhân",
                position: [-0.992, 0.016, 1.632],
              },
              {
                id: "lop11-he-than-kinh-neuron-model-3",
                number: 3,
                label: "Sợi trục (axon)",
                position: [1.272, -0.230, 0.466],
              },
              {
                id: "lop11-he-than-kinh-neuron-model-4",
                number: 4,
                label: "Đầu tận cùng sợi",
                position: [1.586, -0.189, 0.347],
              },
              {
                id: "lop11-he-than-kinh-neuron-model-5",
                number: 5,
                label: "Bộ máy Golgi",
                position: [-1.000, 0.138, 1.489],
              },
              {
                id: "lop11-he-than-kinh-neuron-model-6",
                number: 6,
                label: "Sợi nhánh (dendrite)",
                position: [-1.573, 0.117, 1.756],
              },
              {
                id: "lop11-he-than-kinh-neuron-model-7",
                number: 7,
                label: "Màng tế bào",
                position: [-0.816, -0.050, 1.461],
              },
              {
                id: "lop11-he-than-kinh-neuron-model-8",
                number: 8,
                label: "Cúc synap",
                position: [1.713, -0.668, 0.380],
              },
              {
                id: "lop11-he-than-kinh-neuron-model-9",
                number: 9,
                label: "Eo Ranvier",
                position: [0.741, -0.301, 0.660],
              },
              {
                id: "lop11-he-than-kinh-neuron-model-10",
                number: 10,
                label: "Gò axon",
                position: [-0.796, -0.182, 1.200],
              },
            ],
            palette: "nervous",
          }),
        ],
      },
      {
        id: "lop11-he-than-kinh-synapse",
        title: "Synapse hóa học",
        mainText: lop11Text.synapse,
        models: [
          lop11Model({
            id: "lop11-he-than-kinh-synapse-model",
            name: "Synapse hóa học",
            type: "Điểm tiếp nối truyền tin giữa các tế bào",
            description: lop11Text.synapse,
            url: "/new-models/Lop11_Hệ thần kinh_Tab3_Synapse.glb",
            scale: 3.2,
            annotations: [
              {
                id: "lop11-he-than-kinh-synapse-model-1",
                number: 1,
                label: "Màng trước synapse",
                position: [0.068, -0.014, -0.148],
              },
              {
                id: "lop11-he-than-kinh-synapse-model-2",
                number: 2,
                label: "Chùy synapse",
                position: [0.177, 0.172, -0.167],
              },
              {
                id: "lop11-he-than-kinh-synapse-model-3",
                number: 3,
                label: "Chất truyền tin hóa học",
                position: [-0.023, 0.040, -0.014],
              },
              {
                id: "lop11-he-than-kinh-synapse-model-4",
                number: 4,
                label: "Khe synapse",
                position: [-0.072, 0.17, 0.062],
              },
              {
                id: "lop11-he-than-kinh-synapse-model-5",
                number: 5,
                label: "Màng sau synapse",
                position: [0.160, -0.018, 0.024],
              }
            ],
            palette: "nervous",
          }),
        ],
      },
    ],
  },
];
