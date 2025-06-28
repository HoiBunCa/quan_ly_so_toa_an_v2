import { CaseBook, Case } from '../types/caseTypes';

export const mockCaseBooks: CaseBook[] = [
  {
    id: 'civil-2024',
    caseTypeId: 'civil',
    caseTypeName: 'Civil Cases',
    year: 2024,
    createdDate: '2024-01-01',
    caseCount: 45
  },
  {
    id: 'criminal-2024',
    caseTypeId: 'criminal',
    caseTypeName: 'Criminal Cases',
    year: 2024,
    createdDate: '2024-01-01',
    caseCount: 78
  },
  {
    id: 'family-2024',
    caseTypeId: 'family',
    caseTypeName: 'Family Cases',
    year: 2024,
    createdDate: '2024-01-01',
    caseCount: 32
  },
  {
    id: 'civil-2025',
    caseTypeId: 'civil',
    caseTypeName: 'Civil Cases',
    year: 2025,
    createdDate: '2025-01-01',
    caseCount: 12
  }
];

export const mockCases: { [bookId: string]: Case[] } = {
  'civil-2024': [
    {
      id: 'case-1',
      caseNumber: 'CIV-2024-001',
      bookId: 'civil-2024',
      createdDate: '2024-01-15',
      lastModified: '2024-01-20',
      plaintiff: 'John Smith',
      defendant: 'ABC Corporation',
      caseType: 'Contract Dispute',
      filingDate: '2024-01-15',
      status: 'In Progress',
      judge: 'Judge Williams',
      nextHearing: '2024-02-15',
      amount: 50000,
      notes: 'Contract breach regarding software development services'
    },
    {
      id: 'case-2',
      caseNumber: 'CIV-2024-002',
      bookId: 'civil-2024',
      createdDate: '2024-01-20',
      lastModified: '2024-01-25',
      plaintiff: 'Jane Doe',
      defendant: 'XYZ Properties',
      caseType: 'Property Dispute',
      filingDate: '2024-01-20',
      status: 'Filed',
      judge: 'Judge Johnson',
      nextHearing: '2024-02-20',
      amount: 75000,
      notes: 'Boundary dispute over commercial property'
    }
  ],
  'criminal-2024': [
    {
      id: 'case-3',
      caseNumber: 'CRIM-2024-001',
      bookId: 'criminal-2024',
      createdDate: '2024-01-10',
      lastModified: '2024-01-15',
      defendant: 'Robert Johnson',
      charges: 'Theft in the first degree, Burglary',
      severity: 'Felony',
      arrestDate: '2024-01-05',
      filingDate: '2024-01-10',
      status: 'Pre-trial',
      prosecutor: 'DA Smith',
      defense: 'Public Defender Jones',
      judge: 'Judge Brown',
      nextHearing: '2024-02-10',
      notes: 'Multiple charges related to residential break-in'
    }
  ],
  'family-2024': [
    {
      id: 'case-4',
      caseNumber: 'FAM-2024-001',
      bookId: 'family-2024',
      createdDate: '2024-01-12',
      lastModified: '2024-01-18',
      petitioner: 'Sarah Wilson',
      respondent: 'Michael Wilson',
      caseType: 'Divorce',
      filingDate: '2024-01-12',
      status: 'Mediation',
      children: 2,
      mediator: 'Mediator Davis',
      judge: 'Judge Martinez',
      nextHearing: '2024-02-12',
      notes: 'Contested divorce with child custody issues'
    }
  ]
};