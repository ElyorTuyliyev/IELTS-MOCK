export type CertificateStatus = 'issued' | 'pending' | 'draft'

export type CertificateRecord = {
  id: string
  studentName: string
  examName: string
  bandScore: string
  templateName: string
  status: CertificateStatus
  verificationCode: string
}

export const CERTIFICATE_TEMPLATES = [
  { id: 'tpl-1', name: 'IELTS Mock — Classic', usageCount: 42 },
  { id: 'tpl-2', name: 'IELTS Mock — Modern', usageCount: 28 },
  { id: 'tpl-3', name: 'Achievement — Band 7+', usageCount: 11 },
] as const

export const MOCK_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-1',
    studentName: 'Dilnoza Karimova',
    examName: 'Academic Mock Test #12',
    bandScore: '7.5',
    templateName: 'IELTS Mock — Classic',
    status: 'issued',
    verificationCode: 'IELTS-7K2M-9F4A',
  },
  {
    id: 'cert-2',
    studentName: 'Jasur Toshmatov',
    examName: 'General Training Mock #8',
    bandScore: '6.5',
    templateName: 'IELTS Mock — Modern',
    status: 'issued',
    verificationCode: 'IELTS-3P8N-2C1D',
  },
  {
    id: 'cert-3',
    studentName: 'Madina Rakhimova',
    examName: 'Academic Mock Test #11',
    bandScore: '8.0',
    templateName: 'Achievement — Band 7+',
    status: 'pending',
    verificationCode: 'IELTS-5W1Q-7H3B',
  },
  {
    id: 'cert-4',
    studentName: 'Bobur Nazarov',
    examName: 'Academic Mock Test #10',
    bandScore: '7.0',
    templateName: 'IELTS Mock — Classic',
    status: 'draft',
    verificationCode: 'IELTS-9R4T-1L6E',
  },
  {
    id: 'cert-5',
    studentName: 'Nilufar Saidova',
    examName: 'General Training Mock #7',
    bandScore: '6.0',
    templateName: 'IELTS Mock — Modern',
    status: 'issued',
    verificationCode: 'IELTS-2M6K-4V8P',
  },
]
