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

export type StudentLevel = 'primary' | 'secondary';

export function getStudentLevel(cls: string): StudentLevel {
  return PRIMARY_CLASSES.includes(cls) ? 'primary' : 'secondary';
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
  student_level: 'secondary' | 'primary' | 'hostel';
  display_order: number;
}

export interface MiscItem {
  id: string;
  name: string;
  price: number;
  student_level: 'secondary' | 'primary';
}

export interface Student {
  id: string;
  full_name: string;
  class: string;
  student_type: 'day' | 'boarding';
  total_fees: number;
  hostel_fee: number;
  total_paid: number;
  created_at: string;
  updated_at: string;
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
