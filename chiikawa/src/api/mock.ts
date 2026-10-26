// 사람인 MCP 실제 응답(2026-10-21 조회)에서 가져온 샘플 데이터예요.
// 디자인 소분류 코드, 일부 지역·지하철 코드, 공고별 코드 매핑은 화면 확인용으로 채운 예시 값이에요.
import type { Company, Job, JobCategory, Location, StoreProduct, SubJobCategory, Subway } from "./saramin";

const jobUrl = (id: string) => `https://www.saramin.co.kr/zf_user/jobs/relay/view?rec_idx=${id}`;
const productUrl = (id: string) => `https://www.saramin.co.kr/zf_user/store/product?salePrdCd=${id}`;

export const JOB_CATEGORIES: JobCategory[] = [
  { jobCategoryName: "IT개발·데이터", jobCategoryCode: "2" },
  { jobCategoryName: "디자인", jobCategoryCode: "15" },
  { jobCategoryName: "마케팅·홍보·조사", jobCategoryCode: "14" },
  { jobCategoryName: "기획·전략", jobCategoryCode: "16" },
  { jobCategoryName: "영업·판매·무역", jobCategoryCode: "8" },
  { jobCategoryName: "회계·세무·재무", jobCategoryCode: "3" },
  { jobCategoryName: "인사·노무·HRD", jobCategoryCode: "5" },
  { jobCategoryName: "총무·법무·사무", jobCategoryCode: "4" },
  { jobCategoryName: "금융·보험", jobCategoryCode: "17" },
  { jobCategoryName: "연구·R&D", jobCategoryCode: "9" },
  { jobCategoryName: "의료", jobCategoryCode: "6" },
  { jobCategoryName: "교육", jobCategoryCode: "19" },
  { jobCategoryName: "상품기획·MD", jobCategoryCode: "12" },
  { jobCategoryName: "미디어·문화·스포츠", jobCategoryCode: "13" },
  { jobCategoryName: "구매·자재·물류", jobCategoryCode: "18" },
  { jobCategoryName: "생산", jobCategoryCode: "11" },
  { jobCategoryName: "건설·건축", jobCategoryCode: "22" },
  { jobCategoryName: "운전·운송·배송", jobCategoryCode: "7" },
  { jobCategoryName: "서비스", jobCategoryCode: "10" },
  { jobCategoryName: "고객상담·TM", jobCategoryCode: "21" },
  { jobCategoryName: "공공·복지", jobCategoryCode: "20" },
];

export const CATEGORY_EMOJI: Record<string, string> = {
  "2": "💻", "15": "🎨", "14": "📣", "16": "🧭", "8": "🤝", "3": "🧾", "5": "👥",
  "4": "🗂️", "17": "🏦", "9": "🔬", "6": "🩺", "19": "📚", "12": "🛍️", "13": "🎬",
  "18": "📦", "11": "🏭", "22": "🏗️", "7": "🚚", "10": "☕", "21": "🎧", "20": "🏛️",
};

export const SUB_JOB_CATEGORIES: Record<string, SubJobCategory[]> = {
  "2": [
    ["프론트엔드", "92"], ["백엔드/서버개발", "84"], ["웹개발", "87"], ["앱개발", "86"],
    ["데이터엔지니어", "83"], ["데이터분석가", "82"], ["AI(인공지능)", "181"], ["DevOps", "146"],
    ["게임개발", "80"], ["정보보안", "90"], ["QA/테스터", "99"], ["퍼블리셔", "91"],
    ["React", "277"], ["Java", "235"], ["Python", "272"], ["클라우드", "136"],
  ].map(([subJobCategoryName, subJobCategoryCode]) => ({ subJobCategoryName, subJobCategoryCode })),
  "15": [
    ["UI/UX디자인", "1501"], ["웹디자인", "1502"], ["그래픽디자인", "1503"], ["BX·브랜드디자인", "1504"],
    ["영상·모션디자인", "1505"], ["제품·산업디자인", "1506"],
  ].map(([subJobCategoryName, subJobCategoryCode]) => ({ subJobCategoryName, subJobCategoryCode })),
};

export const LOCATIONS: Location[] = [
  { locationName: "서울_강남구", locationCode: "101010", details: "서울특별시 강남구 역삼동 삼성동 테헤란로" },
  { locationName: "서울_마포구", locationCode: "101150", details: "서울특별시 마포구 합정동 상암동" },
  { locationName: "서울_서초구", locationCode: "101160", details: "서울특별시 서초구 양재동 서초동" },
  { locationName: "서울_성동구", locationCode: "101170", details: "서울특별시 성동구 성수동" },
  { locationName: "서울_영등포구", locationCode: "101200", details: "서울특별시 영등포구 여의도동 국회의사당" },
  { locationName: "서울_용산구", locationCode: "101210", details: "서울특별시 용산구 한남동" },
  { locationName: "서울_금천구", locationCode: "101080", details: "서울특별시 금천구 가산동 가산디지털단지" },
  { locationName: "성남시_분당구", locationCode: "102190", details: "경기도 성남시 분당구 판교동 정자동" },
  { locationName: "용인시", locationCode: "102230", details: "경기도 용인시 수지구 기흥구" },
  { locationName: "충남_서천군", locationCode: "115090", details: "충청남도 서천군 판교면" },
];

export const SUBWAYS: Subway[] = [
  { subwayName: "강남역", subwayCode: "110101" },
  { subwayName: "강남역", subwayCode: "10215" },
  { subwayName: "판교역", subwayCode: "110105" },
  { subwayName: "판교역", subwayCode: "20301" },
  { subwayName: "합정역", subwayCode: "10239" },
  { subwayName: "여의도역", subwayCode: "10528" },
  { subwayName: "성수역", subwayCode: "10211" },
  { subwayName: "가산디지털단지역", subwayCode: "10140" },
];

// search_subway_info(maxTimeMinutes > 0) 응답 샘플: 판교역 20분 이내
export const COMMUTE: Record<string, Subway[]> = {
  판교: [
    ["판교역", "110105"], ["정자", "110106"], ["이매", "20302"], ["미금", "20102"], ["청계산입구", "110104"],
    ["서현", "20105"], ["양재시민의숲", "110103"], ["야탑", "20106"], ["양재", "110102"], ["수내", "20104"],
    ["강남", "110101"], ["신논현", "110116"], ["논현", "110114"], ["역삼", "10214"],
  ].map(([subwayName, subwayCode]) => ({ subwayName, subwayCode })),
};

export const JOBS: Job[] = [
  {
    jobId: "55338015", title: "프론트엔드 개발자 [신입]", company: "(주)제네시스네스트",
    logo: "https://webpds.saramin.co.kr/pds/united_company/logo/70432_logo.jpg",
    deadline: "D-10", career: "신입", location: "경기 용인시", jobCategoryCode: "2", subJobCategoryCodes: ["92", "277"],
    locationCode: "102230", subwayCodes: [], companyType: "SMALLSIZE", url: jobUrl("55338015"),
  },
  {
    jobId: "55339290", title: "[국회의사당] 국민은행 시스템운영 React 프론트엔드 개발자", company: "(주)씨엔씨네트웍스",
    logo: "https://clogo.saramin.co.kr/company/logo/202006/22/qcbelg_e0t8-gypmo5_logo.png", badge: "야근강요 안함",
    deadline: "채용시 마감", career: "경력", location: "서울 영등포구", jobCategoryCode: "2", subJobCategoryCodes: ["92", "277"],
    locationCode: "101200", subwayCodes: ["10528"], companyType: "MIDSIZE", url: jobUrl("55339290"),
  },
  {
    jobId: "55264004", title: "AI 플랫폼 프론트엔드 개발자 채용", company: "(주)스쿼드엑스",
    logo: "https://clogo.saramin.co.kr/company/logo/202307/06/rxd0da_h3g5-icfkz_logo.png",
    deadline: "채용시 마감", career: "경력 무관", location: "서울 마포구", jobCategoryCode: "2", subJobCategoryCodes: ["92", "181"],
    locationCode: "101150", subwayCodes: ["10239"], companyType: "STARTUP", url: jobUrl("55264004"),
  },
  {
    jobId: "55338285", title: "스타 법무법인 프론트엔드 개발자 경력직 채용 (서울)", company: "스타법무법인",
    logo: "https://clogo.saramin.co.kr/company/logo/202604/15/tdj39w14_n3ck-1mi42ch_logo.jpg",
    deadline: "D-23", career: "경력", location: "서울 강남구", jobCategoryCode: "2", subJobCategoryCodes: ["92"],
    locationCode: "101010", subwayCodes: ["110101", "10215"], companyType: "SMALLSIZE", url: jobUrl("55338285"),
  },
  {
    jobId: "55340757", title: "[백엔드/프론트엔드 개발자] 경력직 채용", company: "(주)화이트스캔",
    logo: "https://clogo.saramin.co.kr/company/logo/201911/18/q1581b_9xwo-xprot9_logo.jpg", badge: "야근강요 안함",
    deadline: "D-5", career: "경력", location: "서울 용산구", jobCategoryCode: "2", subJobCategoryCodes: ["84", "92"],
    locationCode: "101210", subwayCodes: [], companyType: "STARTUP", url: jobUrl("55340757"),
  },
  {
    jobId: "55324451", title: "신입 개발자 모집 기회를 잡아(JAVA)요", company: "(주)이씨뱅크",
    logo: "https://clogo.saramin.co.kr/company/logo/201006/29/1277786198_logo.gif",
    deadline: "D-23", career: "신입", location: "서울 영등포구", jobCategoryCode: "2", subJobCategoryCodes: ["87", "235"],
    locationCode: "101200", subwayCodes: ["10528"], companyType: "SMALLSIZE", url: jobUrl("55324451"),
  },
  {
    jobId: "55234023", title: "신입공채-컨설턴트(집중채용)/사업/SW개발", company: "(주)파수에이아이",
    logo: "https://webpds.saramin.co.kr/pds/united_company/logo/25929_logo_3.gif",
    deadline: "D-4", career: "신입", location: "서울 마포구", jobCategoryCode: "2", subJobCategoryCodes: ["84", "87"],
    locationCode: "101150", subwayCodes: ["10239"], companyType: "MIDSIZE", url: jobUrl("55234023"),
  },
  {
    jobId: "55318049", title: "공공기관 정보 시스템(JAVA) 웹 개발자 채용(신입, 경력)", company: "주식회사오픈시스",
    logo: "https://clogo.saramin.co.kr/company/logo/202307/26/ryecvd_pwtx-w84nbi_logo.png",
    deadline: "D-25", career: "신입", location: "서울 성동구", jobCategoryCode: "2", subJobCategoryCodes: ["87", "235"],
    locationCode: "101170", subwayCodes: ["10211"], companyType: "SMALLSIZE", url: jobUrl("55318049"),
  },
  {
    jobId: "55303146", title: "자사 개발팀 웹 개발자 채용", company: "주식회사 코멧위즈",
    logo: "https://clogo.saramin.co.kr/company/logo/201906/10/psvc9i_bu15-ya72l9_logo.jpg",
    deadline: "D-24", career: "신입", location: "서울 금천구", jobCategoryCode: "2", subJobCategoryCodes: ["87"],
    locationCode: "101080", subwayCodes: ["10140"], companyType: "SMALLSIZE", url: jobUrl("55303146"),
  },
  {
    jobId: "55339243", title: "[토스] Visual Design Assistant (Product)", company: "(주)비바리퍼블리카",
    logo: "https://clogo.saramin.co.kr/company/logo/202209/05/rhptx6_fj87-v9hb3s_logo.png",
    deadline: "D-29", career: "경력 무관", location: "서울 강남구", jobCategoryCode: "15", subJobCategoryCodes: ["1501"],
    locationCode: "101010", subwayCodes: ["110101", "10215"], companyType: "TOP1000", url: jobUrl("55339243"),
  },
  {
    jobId: "55291348", title: "[토스플레이스] Technical Account Manager (결제/플랫폼)", company: "(주)비바리퍼블리카",
    logo: "https://clogo.saramin.co.kr/company/logo/202209/05/rhptx6_fj87-v9hb3s_logo.png",
    deadline: "D-23", career: "경력 무관", location: "서울 서초구", jobCategoryCode: "2", subJobCategoryCodes: ["84"],
    locationCode: "101160", subwayCodes: ["110102"], companyType: "TOP1000", url: jobUrl("55291348"),
  },
];

export const COMPANIES: Company[] = [
  {
    name: "(주)비바리퍼블리카",
    logo: "https://clogo.saramin.co.kr/company/logo/202209/05/rhptx6_fj87-v9hb3s_logo.png",
    hiring: true,
    url: "https://www.saramin.co.kr/zf_user/company-info/view?csn=1208801280",
    jobs: [
      { jobId: "55339243", title: "[토스] Visual Design Assistant (Product)", deadline: "D-29", career: "경력 무관", location: "서울 강남구", url: jobUrl("55339243") },
      { jobId: "55291348", title: "[토스플레이스] Technical Account Manager (결제/플랫폼)", deadline: "D-23", career: "경력 무관", location: "서울 서초구", url: jobUrl("55291348") },
      { jobId: "55291343", title: "[토스플레이스] Technical Account Manager (POS)", deadline: "채용시 마감", career: "경력 무관", location: "서울 서초구", url: jobUrl("55291343") },
    ],
  },
  {
    name: "(주)스쿼드엑스",
    logo: "https://clogo.saramin.co.kr/company/logo/202307/06/rxd0da_h3g5-icfkz_logo.png",
    hiring: true,
    url: "https://www.saramin.co.kr/zf_user/search?searchword=스쿼드엑스",
    jobs: [
      { jobId: "55264004", title: "AI 플랫폼 프론트엔드 개발자 채용", deadline: "채용시 마감", career: "경력 무관", location: "서울 마포구", url: jobUrl("55264004") },
    ],
  },
  {
    name: "(주)파수에이아이",
    logo: "https://webpds.saramin.co.kr/pds/united_company/logo/25929_logo_3.gif",
    hiring: true,
    url: "https://www.saramin.co.kr/zf_user/search?searchword=파수에이아이",
    jobs: [
      { jobId: "55234023", title: "신입공채-컨설턴트(집중채용)/사업/SW개발", deadline: "D-4", career: "신입", location: "서울 마포구", url: jobUrl("55234023") },
    ],
  },
];

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: "PM3708978cbe6041d28c", name: "[사람인 공식] 취업준비 필수 인적성 검사", rating: 4.1, reviews: 1368, tags: ["인적성", "검사", "적성"],
    image: "https://www.saraminimage.co.kr/store/product/202601/06/1767683123191_2a4508d2-56b6-4678-9e38-ef730bb74e53.png/sri/resize/394x254",
    url: productUrl("PM3708978cbe6041d28c"),
  },
  {
    id: "PM511ce054d79f49ab90", name: "인사담당자를 사로잡는 합격자소서 컨설팅", rating: 4.9, reviews: 553, tags: ["자소서", "첨삭", "컨설팅"],
    image: "https://www.saraminimage.co.kr/store/product/202602/24/1771899612281_f37b0b18-02e8-4150-9bfd-c983e3a3979c.jpg/sri/resize/394x254",
    url: productUrl("PM511ce054d79f49ab90"),
  },
  {
    id: "PM806eea09e03d44e0b3", name: "카이스트 출신의 면접 비밀노트", rating: 5.0, reviews: 505, tags: ["면접", "코칭"],
    image: "https://www.saraminimage.co.kr/store/product/202510/13/1760322227724_e8108b68-efa1-4ab0-9b18-d288cdcd1f16.png/sri/resize/394x254",
    url: productUrl("PM806eea09e03d44e0b3"),
  },
  {
    id: "PM7ab7e12fc59e42adbb", name: "카이스트 출신의 자소서 작성법", rating: 5.0, reviews: 505, tags: ["자소서", "작성"],
    image: "https://www.saraminimage.co.kr/store/product/202508/04/1754300211080_9eea10b3-9bf9-4670-9c6b-6068a291bc65.jpg/sri/resize/394x254",
    url: productUrl("PM7ab7e12fc59e42adbb"),
  },
  {
    id: "PMd05a07348581422ea9", name: "AI로 쓴 초안도 OK/ 무제한 수정/ 추가 비용 X", rating: 5.0, reviews: 323, tags: ["자소서", "첨삭", "AI"],
    image: "https://www.saraminimage.co.kr/store/product/202507/29/1753755724572_06123e7d-1ae6-4459-b1da-3cf9fe133527.jpg/sri/resize/394x254",
    url: productUrl("PMd05a07348581422ea9"),
  },
  {
    id: "PMaf865034d1df4e9481", name: "진로 고민, 취업 고민, 자기소개서, 면접까지! 1:1 맞춤 취업코칭", rating: 4.8, reviews: 22, tags: ["면접", "코칭", "자소서", "진로"],
    image: "https://www.saraminimage.co.kr/store/product/202507/22/1753132381678_b9b4139d-5f3d-4a19-b475-865f537908ac.jpeg/sri/resize/394x254",
    url: productUrl("PMaf865034d1df4e9481"),
  },
  {
    id: "PM7e98b9277a394596a4", name: "면접용 1분자기소개 5분만에 완성하는법 바로알려드립니다", rating: 2.0, reviews: 1, tags: ["면접", "자기소개"],
    image: "https://www.saraminimage.co.kr/store/product/202511/12/1762925083557_557a83b2-e63a-49ab-9789-d1370da772cd.jpg/sri/resize/394x254",
    url: productUrl("PM7e98b9277a394596a4"),
  },
];
