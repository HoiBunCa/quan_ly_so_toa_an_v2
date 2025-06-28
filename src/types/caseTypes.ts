export interface CaseType {
  id: string;
  name: string;
  code: string;
  attributes: CaseAttribute[];
}

export interface CaseAttribute {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'textarea';
  required: boolean;
  options?: string[]; // For dropdown type
  width?: number;
}

export interface CaseBook {
  id: string;
  caseTypeId: string;
  caseTypeName: string;
  year: number;
  createdDate: string;
  caseCount: number;
}

export interface Case {
  id: string;
  caseNumber: string;
  bookId: string;
  createdDate: string;
  lastModified: string;
  [key: string]: any; // Dynamic attributes based on case type
}