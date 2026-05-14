// Mock Database cho WorkBridge JP-VN
// Dữ liệu mẫu để test validation và các tính năng

export interface MockUser {
  id: string;
  name: string;
  nameEn?: string;
  email: string;
  password: string;
  role: "admin" | "user";
  nationality: "japan" | "vietnam";
  gender: "male" | "female" | "other";
  department: string;
  departmentEn?: string;
  position?: string;
  positionEn?: string;
  language?: string;
  avatar?: string;
  isOnline?: boolean;
}

// Danh sách user mẫu trong database
export const mockUsers: MockUser[] = [
  // Admin users
  {
    id: "admin-1",
    name: "佐藤管理者",
    nameEn: "Sato Admin",
    email: "admin@company.com",
    password: "Admin123!",
    role: "admin",
    nationality: "japan",
    gender: "male",
    department: "管理部",
    departmentEn: "Administration",
    position: "部長",
    positionEn: "Director",
    language: "japanese",
  },
  {
    id: "admin-2",
    name: "Nguyễn Quản Trị",
    nameEn: "Nguyen Admin",
    email: "admin.vn@company.com",
    password: "AdminVN123!",
    role: "admin",
    nationality: "vietnam",
    gender: "female",
    department: "Phòng Quản lý",
    departmentEn: "Administration",
    position: "Trưởng phòng",
    positionEn: "Manager",
    language: "vietnamese",
  },

  // Regular users - Japanese
  {
    id: "user-jp-1",
    name: "田中健太",
    nameEn: "Tanaka Kenta",
    email: "tanaka.kenta@company.com",
    password: "Tanaka123!",
    role: "user",
    nationality: "japan",
    gender: "male",
    department: "営業部",
    departmentEn: "Sales Department",
    position: "課長",
    positionEn: "Section Manager",
    language: "japanese",
    isOnline: true,
  },
  {
    id: "user-jp-2",
    name: "山田花子",
    nameEn: "Yamada Hanako",
    email: "yamada.hanako@company.com",
    password: "Yamada123!",
    role: "user",
    nationality: "japan",
    gender: "female",
    department: "人事部",
    departmentEn: "HR Department",
    position: "主任",
    positionEn: "Chief",
    language: "japanese",
    isOnline: false,
  },
  {
    id: "user-jp-3",
    name: "鈴木一郎",
    nameEn: "Suzuki Ichiro",
    email: "suzuki.ichiro@company.com",
    password: "Suzuki123!",
    role: "user",
    nationality: "japan",
    gender: "male",
    department: "技術部",
    departmentEn: "Technical Department",
    position: "エンジニア",
    positionEn: "Engineer",
    language: "japanese",
    isOnline: true,
  },

  // Regular users - Vietnamese
  {
    id: "user-vn-1",
    name: "Nguyễn Văn An",
    nameEn: "Nguyen Van An",
    email: "nguyen.an@company.com",
    password: "NguyenAn123!",
    role: "user",
    nationality: "vietnam",
    gender: "male",
    department: "Phòng Kinh doanh",
    departmentEn: "Sales Department",
    position: "Nhân viên",
    positionEn: "Staff",
    language: "vietnamese",
    isOnline: true,
  },
  {
    id: "user-vn-2",
    name: "Trần Thị Bích",
    nameEn: "Tran Thi Bich",
    email: "tran.bich@company.com",
    password: "TranBich123!",
    role: "user",
    nationality: "vietnam",
    gender: "female",
    department: "Phòng Nhân sự",
    departmentEn: "HR Department",
    position: "Trưởng nhóm",
    positionEn: "Team Leader",
    language: "vietnamese",
    isOnline: true,
  },
  {
    id: "user-vn-3",
    name: "Lê Minh Châu",
    nameEn: "Le Minh Chau",
    email: "le.chau@company.com",
    password: "LeChau123!",
    role: "user",
    nationality: "vietnam",
    gender: "female",
    department: "Phòng Kỹ thuật",
    departmentEn: "Technical Department",
    position: "Kỹ sư",
    positionEn: "Engineer",
    language: "vietnamese",
    isOnline: false,
  },
  {
    id: "user-vn-4",
    name: "Phạm Đức Dũng",
    nameEn: "Pham Duc Dung",
    email: "pham.dung@company.com",
    password: "PhamDung123!",
    role: "user",
    nationality: "vietnam",
    gender: "male",
    department: "Phòng Marketing",
    departmentEn: "Marketing Department",
    position: "Chuyên viên",
    positionEn: "Specialist",
    language: "vietnamese",
    isOnline: true,
  },
  {
    id: "user-vn-5",
    name: "Hoàng Thị Mai",
    nameEn: "Hoang Thi Mai",
    email: "hoang.mai@company.com",
    password: "HoangMai123!",
    role: "user",
    nationality: "vietnam",
    gender: "female",
    department: "Phòng Kế toán",
    departmentEn: "Accounting Department",
    position: "Kế toán viên",
    positionEn: "Accountant",
    language: "vietnamese",
    isOnline: false,
  },
];

// Helper function để check email đã tồn tại
export function isEmailExists(email: string): boolean {
  return mockUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Helper function để lấy user theo email
export function getUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
}

// Helper function để validate password
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("パスワードは8文字以上である必要があります / Mật khẩu phải có ít nhất 8 ký tự");
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
