import { USER_ROLES, type UserRole } from '../../store/slices/authSlice'

export type HelpCategoryId =
  | 'getting-started'
  | 'exams'
  | 'questions'
  | 'students'
  | 'billing'
  | 'certificates'

export type HelpCategory = {
  id: HelpCategoryId
  title: string
  description: string
  roles?: UserRole[]
}

export type HelpFaq = {
  id: string
  categoryId: HelpCategoryId
  question: string
  answer: string
  roles?: UserRole[]
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    description: 'Sign in, roles, and your first steps in the platform.',
  },
  {
    id: 'exams',
    title: 'Exams',
    description: 'Create mock exams, assign questions, and manage schedules.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'questions',
    title: 'Question bank',
    description: 'Listening, Reading, Writing, and Speaking modules.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'students',
    title: 'Students',
    description: 'Enroll learners, signup forms, and exam access.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin, USER_ROLES.student],
  },
  {
    id: 'billing',
    title: 'Billing & plans',
    description: 'Exam credits, purchases, and payment approval.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'certificates',
    title: 'Certificates',
    description: 'Issue and manage student certificates.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
]

export const HELP_FAQS: HelpFaq[] = [
  {
    id: 'roles',
    categoryId: 'getting-started',
    question: 'What are the different user roles?',
    answer:
      'Super Admin manages centers, billing, and global settings. Center admins create exams, manage students, and purchase exam plans. Students access assigned mock exams from their dashboard and complete modules in the exam player.',
  },
  {
    id: 'first-login',
    categoryId: 'getting-started',
    question: 'How do I sign in for the first time?',
    answer:
      'Use the email and password provided by your center or administrator. If you forgot your password, contact your center admin — password reset is handled at the organization level.',
  },
  {
    id: 'create-exam',
    categoryId: 'exams',
    question: 'How do I create a new mock exam?',
    answer:
      'Go to Exams → All Exams and click Create exam. Set the title, schedule, and modules you need. After creation, open the exam details page to assign questions from your question bank and enroll students.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'archive-exam',
    categoryId: 'exams',
    question: 'What happens when I archive an exam?',
    answer:
      'Archived exams are moved out of the active list but remain accessible under Exams → Archive. Students can no longer start new attempts, but you can still review past results.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'assign-questions',
    categoryId: 'exams',
    question: 'How do I assign questions to an exam?',
    answer:
      'Open the exam from All Exams, then use the question assignment panel on the exam details page. Pick questions by module (Listening, Reading, Writing, Speaking) and save. Each module can have multiple question groups.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'add-question',
    categoryId: 'questions',
    question: 'How do I add a new question?',
    answer:
      'Navigate to Modules in the sidebar, choose the module (e.g. Listening), and click Add question. Use the rich text editor for passages, insert tables or images, and configure answer types before saving.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'question-types',
    categoryId: 'questions',
    question: 'Which question types are supported?',
    answer:
      'The platform supports multiple IELTS-style formats including multiple choice, fill-in-the-blank, matching, and drag-and-drop. The available types depend on the module you are editing.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'enroll-students',
    categoryId: 'students',
    question: 'How do I enroll students in an exam?',
    answer:
      'From the exam details page, use the enrolled students section to add learners individually or in bulk. Students must already exist in your center’s student list or have completed a signup form.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'signup-forms',
    categoryId: 'students',
    question: 'What are signup forms?',
    answer:
      'Signup forms let prospective students register interest before you approve them. Review submissions under Students → Signup Forms, then approve or reject each lead.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'student-exam',
    categoryId: 'students',
    question: 'How do I take an assigned exam?',
    answer:
      'Open Student Exam from the sidebar to see your assigned mocks. Click Start on an available exam — you will enter the exam player with a timer. Complete each module in order and submit when finished.',
    roles: [USER_ROLES.student],
  },
  {
    id: 'buy-plan',
    categoryId: 'billing',
    question: 'How does buying an exam plan work?',
    answer:
      'Center admins go to Buy exam plan, select a package, follow the payment instructions, and submit a purchase request. A Super Admin reviews and approves the payment, then credits are added to your center.',
    roles: [USER_ROLES.center],
  },
  {
    id: 'approve-payment',
    categoryId: 'billing',
    question: 'How do I approve a center payment?',
    answer:
      'Super Admins open Payments → Billing overview to see pending requests. Verify the payment details, then approve to release exam credits to the center’s account.',
    roles: [USER_ROLES.superAdmin],
  },
  {
    id: 'exam-credits',
    categoryId: 'billing',
    question: 'What are exam credits?',
    answer:
      'Each mock exam you publish consumes one exam credit from your center’s balance. Purchase plans to top up credits before creating new exams. Your remaining balance is shown on the Buy exam plan page.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'certificates-issue',
    categoryId: 'certificates',
    question: 'How do I issue a certificate?',
    answer:
      'Go to Certificates, find the student who completed an exam, and generate their certificate. You can preview and download PDF copies for records or distribution.',
    roles: [USER_ROLES.center, USER_ROLES.superAdmin],
  },
  {
    id: 'notifications',
    categoryId: 'getting-started',
    question: 'Where do I see platform updates?',
    answer:
      'Click the bell icon in the header or open Notifications from the menu. You will see exam enrollments, payment approvals, and other role-specific alerts in one place.',
  },
]

export const HELP_CONTACT = {
  email: 'support@ieltsmock.app',
  responseTime: 'We typically respond within 1 business day.',
}

function isVisibleForRole<T extends { roles?: UserRole[] }>(item: T, role: UserRole | null): boolean {
  if (!item.roles || item.roles.length === 0) return true
  if (!role) return false
  return item.roles.includes(role)
}

export function getHelpCategoriesForRole(role: UserRole | null): HelpCategory[] {
  return HELP_CATEGORIES.filter((cat) => isVisibleForRole(cat, role))
}

export function getHelpFaqsForRole(role: UserRole | null): HelpFaq[] {
  return HELP_FAQS.filter((faq) => isVisibleForRole(faq, role))
}
