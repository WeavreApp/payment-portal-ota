export const SCHOOL_NAME = 'Ota Total Academy';
export const SCHOOL_SHORT = 'OTA';
export const SCHOOL_TAGLINE = 'Quality for the Serious Minded';
export const SCHOOL_WEBSITE = 'https://otatotalacademy.org';
export const SCHOOL_LOGO = '/WhatsApp_Image_2026-04-03_at_04.07.32.jpeg';

export const CLASS_LIST = [
  // Early Years
  'Toddler',
  'Pre-Schooler',
  'Nursery',
  'Pry 1A',
  'Pry 1B',
  'Pry 2A',
  'Pry 2B',
  'Pry 3A',
  'Pry 3B',
  'Pry 4A',
  'Pry 4B',
  'Pry 5A',
  'Pry 5B',
  
  // Junior Secondary
  'JSS1A',
  'JSS1B',
  'JSS1C',
  'JSS1D',
  'JSS2A',
  'JSS2B',
  'JSS2C',
  'JSS2D',
  'JSS3A',
  'JSS3B',
  'JSS3C',
  
  // Senior Secondary
  'SS1A1',
  'SS1A2',
  'SS1A3',
  'SS1A4',
  'SS1B/C',
  'SS2A1',
  'SS2A2',
  'SS2A3',
  'SS2A4',
  'SS2B/C',
  'SS3A1',
  'SS3A2',
  'SS3B/C',
];

export const PRIMARY_CLASSES = [
  'Toddler',
  'Pre-Schooler',
  'Nursery',
  'Pry 1A',
  'Pry 1B',
  'Pry 2A',
  'Pry 2B',
  'Pry 3A',
  'Pry 3B',
  'Pry 4A',
  'Pry 4B',
  'Pry 5A',
  'Pry 5B',
];

export const SECONDARY_CLASSES = [
  'JSS1A', 'JSS1B', 'JSS1C', 'JSS1D',
  'JSS2A', 'JSS2B', 'JSS2C', 'JSS2D',
  'JSS3A', 'JSS3B', 'JSS3C',
  'SS1A1', 'SS1A2', 'SS1A3', 'SS1A4', 'SS1B/C',
  'SS2A1', 'SS2A2', 'SS2A3', 'SS2A4', 'SS2B/C',
  'SS3A1', 'SS3A2', 'SS3B/C'
];

export const JUNIOR_SECONDARY = ['JSS1A', 'JSS1B', 'JSS1C', 'JSS1D', 'JSS2A', 'JSS2B', 'JSS2C', 'JSS2D', 'JSS3A', 'JSS3B', 'JSS3C'];
export const SENIOR_SECONDARY = ['SS1A1', 'SS1A2', 'SS1A3', 'SS1A4', 'SS1B/C', 'SS2A1', 'SS2A2', 'SS2A3', 'SS2A4', 'SS2B/C', 'SS3A1', 'SS3A2', 'SS3B/C'];

export type StudentLevel = 'primary' | 'junior_secondary' | 'senior_secondary' | 'all_secondary' | 'all_classes' | 'hostel' | 'all';

export function getStudentLevel(cls: string): StudentLevel {
  if (PRIMARY_CLASSES.includes(cls)) return 'primary';
  if (JUNIOR_SECONDARY.includes(cls)) return 'junior_secondary';
  if (SENIOR_SECONDARY.includes(cls)) return 'senior_secondary';
  return 'primary'; // fallback
}

export function getStudentLevelForFilter(cls: string): StudentLevel {
  if (PRIMARY_CLASSES.includes(cls)) return 'primary';
  if (JUNIOR_SECONDARY.includes(cls)) return 'junior_secondary';
  if (SENIOR_SECONDARY.includes(cls)) return 'senior_secondary';
  return 'primary'; // fallback
}

export function shouldShowItem(studentClass: string, itemLevel: StudentLevel): boolean {
  const studentLevel = getStudentLevelForFilter(studentClass);
  
  switch (itemLevel) {
    case 'primary':
      return studentLevel === 'primary';
    case 'junior_secondary':
      return studentLevel === 'junior_secondary';
    case 'senior_secondary':
      return studentLevel === 'senior_secondary';
    case 'all_secondary':
      return studentLevel === 'junior_secondary' || studentLevel === 'senior_secondary';
    case 'all_classes':
    case 'all':
      return true;
    case 'hostel':
      // Hostel items might have specific logic
      return true; // For now, show to all
    default:
      return false;
  }
}

export const PAYMENT_METHODS = ['Cash', 'Transfer', 'POS', 'Bank Transfer'] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type PaymentStatus = 'pending' | 'verified' | 'flagged' | 'rejected';

export type PaymentSource = 'admin' | 'parent';

export type PaymentType = 'tuition' | 'miscellaneous';

export interface BankAccount {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  accepts_tuition: boolean;
  accepts_misc: boolean;
  student_level: 'all' | 'primary' | 'secondary' | 'hostel';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MiscItem {
  id: string;
  name: string;
  price: number;
  student_level: 'primary' | 'junior_secondary' | 'senior_secondary' | 'all_secondary' | 'all_classes' | 'hostel' | 'all';
  description?: string;
  created_at?: string;
}

export interface Student {
  id: string;
  full_name: string;
  class: string;
  student_type: 'day' | 'boarding';
  total_fees: number;
  hostel_fee: number;
  neco_fee: number;
  total_paid: number;
  created_at: string;
  updated_at: string;
  student_status?: 'day' | 'boarder';
}

export interface Payment {
  id: string;
  txn_id: string;
  student_id: string;
  amount: number;
  method: string;
  payment_date: string;
  notes: string;
  proof_url: string | null;
  proof_hash: string | null;
  reference_number: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  source: PaymentSource;
  status: PaymentStatus;
  payment_type: PaymentType;
  bank_account_id: string | null;
  flag_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  students?: Student;
}

export interface AdminProfile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

export interface ClassFeeRate {
  id: string;
  class_name: string;
  display_name: string;
  day_student_fee: number;
  boarder_student_fee?: number;
  allows_boarding: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeeSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface FeeCalculation {
  id: string;
  student_id: string;
  base_tuition: number;
  hostel_fee: number;
  total_fees: number;
  calculation_date: string;
  created_at: string;
}

export const CLASS_FEE_RATES: {
  class: string;
  display: string;
  dayFee: number;
  boarderFee?: number;
  allowsBoarding: boolean;
}[] = [
  { class: 'Toddler', display: 'Toddler', dayFee: 58000, allowsBoarding: false },
  { class: 'Pre-Schooler', display: 'Pre-Schooler', dayFee: 63000, allowsBoarding: false },
  { class: 'Nursery', display: 'Nursery', dayFee: 68000, allowsBoarding: false },
  { class: 'Pry 1A', display: 'Pry 1A', dayFee: 68000, allowsBoarding: false },
  { class: 'Pry 1B', display: 'Pry 1B', dayFee: 68000, allowsBoarding: false },
  { class: 'Pry 2A', display: 'Pry 2A', dayFee: 73000, allowsBoarding: false },
  { class: 'Pry 2B', display: 'Pry 2B', dayFee: 73000, allowsBoarding: false },
  { class: 'Pry 3A', display: 'Pry 3A', dayFee: 79000, allowsBoarding: false },
  { class: 'Pry 3B', display: 'Pry 3B', dayFee: 79000, allowsBoarding: false },
  { class: 'Pry 4A', display: 'Pry 4A', dayFee: 90000, boarderFee: 340000, allowsBoarding: true },
  { class: 'Pry 4B', display: 'Pry 4B', dayFee: 90000, boarderFee: 340000, allowsBoarding: true },
  { class: 'Pry 5A', display: 'Pry 5A', dayFee: 135000, boarderFee: 385000, allowsBoarding: true },
  { class: 'Pry 5B', display: 'Pry 5B', dayFee: 135000, boarderFee: 385000, allowsBoarding: true },
  { class: 'JSS1A', display: 'JSS1A', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS1B', display: 'JSS1B', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS1C', display: 'JSS1C', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS1D', display: 'JSS1D', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS2A', display: 'JSS2A', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS2B', display: 'JSS2B', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS2C', display: 'JSS2C', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS2D', display: 'JSS2D', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS3A', display: 'JSS3A', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS3B', display: 'JSS3B', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'JSS3C', display: 'JSS3C', dayFee: 165000, boarderFee: 415000, allowsBoarding: true },
  { class: 'SS1A1', display: 'SS1A1', dayFee: 185000, boarderFee: 435000, allowsBoarding: true },
  { class: 'SS1A2', display: 'SS1A2', dayFee: 185000, boarderFee: 435000, allowsBoarding: true },
  { class: 'SS1A3', display: 'SS1A3', dayFee: 185000, boarderFee: 435000, allowsBoarding: true },
  { class: 'SS1A4', display: 'SS1A4', dayFee: 185000, boarderFee: 435000, allowsBoarding: true },
  { class: 'SS1B/C', display: 'SS1B/C', dayFee: 185000, boarderFee: 435000, allowsBoarding: true },
  { class: 'SS2A1', display: 'SS2A1', dayFee: 180000, boarderFee: 430000, allowsBoarding: true },
  { class: 'SS2A2', display: 'SS2A2', dayFee: 180000, boarderFee: 430000, allowsBoarding: true },
  { class: 'SS2A3', display: 'SS2A3', dayFee: 180000, boarderFee: 430000, allowsBoarding: true },
  { class: 'SS2A4', display: 'SS2A4', dayFee: 180000, boarderFee: 430000, allowsBoarding: true },
  { class: 'SS2B/C', display: 'SS2B/C', dayFee: 180000, boarderFee: 430000, allowsBoarding: true },
  { class: 'SS3A1', display: 'SS3A1', dayFee: 180000, boarderFee: 750000, allowsBoarding: true },
  { class: 'SS3A2', display: 'SS3A2', dayFee: 180000, boarderFee: 750000, allowsBoarding: true },
  { class: 'SS3B/C', display: 'SS3B/C', dayFee: 180000, boarderFee: 750000, allowsBoarding: true },
];

export function getFeeForClass(className: string, isBoarder: boolean = false): { baseFee: number; hostelFee?: number; total: number } {
  const rate = CLASS_FEE_RATES.find(r => r.class === className);
  if (!rate) {
    throw new Error(`No fee rate found for class: ${className}`);
  }
  
  const baseFee = rate.dayFee;
  const hostelFee = isBoarder && rate.boarderFee ? rate.boarderFee : 0;
  const total = baseFee + hostelFee;
  
  return { baseFee, hostelFee, total };
}

export function getClassDisplayName(className: string): string {
  const rate = CLASS_FEE_RATES.find(r => r.class === className);
  return rate?.display || className;
}

export function allowsBoarding(className: string, classFeeRates?: any[]): boolean {
  if (classFeeRates && classFeeRates.length > 0) {
    // Use database values if provided
    const rate = classFeeRates.find(r => r.class_name === className);
    return rate?.allows_boarding || false;
  }
  // Fallback to hardcoded values
  const rate = CLASS_FEE_RATES.find(r => r.class === className);
  return rate?.allowsBoarding || false;
}

// NECO fee settings
export const NECO_FEE = 40000; // ₦40,000 for NECO exam fee

export function calculateStudentFees(
  className: string, 
  isBoarder: boolean = false, 
  hostelFee: number = 250000,
  includeNECO: boolean = false
): { baseTuition: number; hostelFee: number; necoFee: number; totalFees: number } {
  const fees = getFeeForClass(className, isBoarder);
  
  // Calculate hostel fee only if student is boarder and class allows boarding
  const actualHostelFee = (isBoarder && allowsBoarding(className)) ? hostelFee : 0;
  
  // Add NECO fee only if specified and student is in SS3
  const isSS3 = className.includes('SS3');
  const necoFee = includeNECO && isSS3 ? NECO_FEE : 0;
  
  const totalFees = fees.baseFee + actualHostelFee + necoFee;
  
  return {
    baseTuition: fees.baseFee,
    hostelFee: actualHostelFee,
    necoFee,
    totalFees
  };
}
