import { CaseType } from '../types/caseTypes';

export const caseTypes: CaseType[] = [
  {
    id: 'civil',
    name: 'Civil Cases',
    code: 'CIV',
    attributes: [
      { id: 'caseNumber', name: 'Case Number', type: 'text', required: true, width: 120 },
      { id: 'plaintiff', name: 'Plaintiff', type: 'text', required: true, width: 150 },
      { id: 'defendant', name: 'Defendant', type: 'text', required: true, width: 150 },
      { id: 'caseType', name: 'Case Type', type: 'dropdown', required: true, width: 130, 
        options: ['Contract Dispute', 'Property Dispute', 'Personal Injury', 'Debt Collection'] },
      { id: 'filingDate', name: 'Filing Date', type: 'date', required: true, width: 120 },
      { id: 'status', name: 'Status', type: 'dropdown', required: true, width: 120,
        options: ['Filed', 'In Progress', 'Settled', 'Dismissed', 'Judgment'] },
      { id: 'judge', name: 'Assigned Judge', type: 'text', required: false, width: 140 },
      { id: 'nextHearing', name: 'Next Hearing', type: 'date', required: false, width: 120 },
      { id: 'amount', name: 'Claim Amount', type: 'number', required: false, width: 120 },
      { id: 'notes', name: 'Notes', type: 'textarea', required: false, width: 200 }
    ]
  },
  {
    id: 'criminal',
    name: 'Criminal Cases',
    code: 'CRIM',
    attributes: [
      { id: 'caseNumber', name: 'Case Number', type: 'text', required: true, width: 120 },
      { id: 'defendant', name: 'Defendant', type: 'text', required: true, width: 150 },
      { id: 'charges', name: 'Charges', type: 'textarea', required: true, width: 200 },
      { id: 'severity', name: 'Severity', type: 'dropdown', required: true, width: 120,
        options: ['Misdemeanor', 'Felony', 'Infraction'] },
      { id: 'arrestDate', name: 'Arrest Date', type: 'date', required: false, width: 120 },
      { id: 'filingDate', name: 'Filing Date', type: 'date', required: true, width: 120 },
      { id: 'status', name: 'Status', type: 'dropdown', required: true, width: 120,
        options: ['Filed', 'Arraignment', 'Pre-trial', 'Trial', 'Sentencing', 'Closed'] },
      { id: 'prosecutor', name: 'Prosecutor', type: 'text', required: false, width: 140 },
      { id: 'defense', name: 'Defense Attorney', type: 'text', required: false, width: 140 },
      { id: 'judge', name: 'Assigned Judge', type: 'text', required: false, width: 140 },
      { id: 'nextHearing', name: 'Next Hearing', type: 'date', required: false, width: 120 },
      { id: 'notes', name: 'Notes', type: 'textarea', required: false, width: 200 }
    ]
  },
  {
    id: 'family',
    name: 'Family Cases',
    code: 'FAM',
    attributes: [
      { id: 'caseNumber', name: 'Case Number', type: 'text', required: true, width: 120 },
      { id: 'petitioner', name: 'Petitioner', type: 'text', required: true, width: 150 },
      { id: 'respondent', name: 'Respondent', type: 'text', required: true, width: 150 },
      { id: 'caseType', name: 'Case Type', type: 'dropdown', required: true, width: 130,
        options: ['Divorce', 'Child Custody', 'Child Support', 'Adoption', 'Domestic Violence'] },
      { id: 'filingDate', name: 'Filing Date', type: 'date', required: true, width: 120 },
      { id: 'status', name: 'Status', type: 'dropdown', required: true, width: 120,
        options: ['Filed', 'Mediation', 'Trial', 'Settled', 'Dismissed', 'Final Order'] },
      { id: 'children', name: 'Children Involved', type: 'number', required: false, width: 120 },
      { id: 'mediator', name: 'Mediator', type: 'text', required: false, width: 140 },
      { id: 'judge', name: 'Assigned Judge', type: 'text', required: false, width: 140 },
      { id: 'nextHearing', name: 'Next Hearing', type: 'date', required: false, width: 120 },
      { id: 'notes', name: 'Notes', type: 'textarea', required: false, width: 200 }
    ]
  },
  {
    id: 'traffic',
    name: 'Traffic Cases',
    code: 'TRAF',
    attributes: [
      { id: 'caseNumber', name: 'Case Number', type: 'text', required: true, width: 120 },
      { id: 'defendant', name: 'Defendant', type: 'text', required: true, width: 150 },
      { id: 'violation', name: 'Violation', type: 'dropdown', required: true, width: 150,
        options: ['Speeding', 'DUI', 'Reckless Driving', 'Running Red Light', 'Parking Violation'] },
      { id: 'ticketNumber', name: 'Ticket Number', type: 'text', required: true, width: 120 },
      { id: 'violationDate', name: 'Violation Date', type: 'date', required: true, width: 120 },
      { id: 'filingDate', name: 'Filing Date', type: 'date', required: true, width: 120 },
      { id: 'status', name: 'Status', type: 'dropdown', required: true, width: 120,
        options: ['Filed', 'Scheduled', 'Paid', 'Dismissed', 'Guilty', 'Not Guilty'] },
      { id: 'fineAmount', name: 'Fine Amount', type: 'number', required: false, width: 120 },
      { id: 'location', name: 'Violation Location', type: 'text', required: false, width: 180 },
      { id: 'officer', name: 'Issuing Officer', type: 'text', required: false, width: 140 },
      { id: 'courtDate', name: 'Court Date', type: 'date', required: false, width: 120 },
      { id: 'notes', name: 'Notes', type: 'textarea', required: false, width: 200 }
    ]
  }
];