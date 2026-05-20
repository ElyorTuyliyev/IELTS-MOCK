import type { SvgIconComponent } from '@mui/icons-material'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'

export const SIDEBAR_ICON_KEYS = [
  'dashboard',
  'centers',
  'exams',
  'archive',
  'studentExam',
  'lms',
  'questions',
  'listening',
  'reading',
  'writing',
  'speaking',
  'students',
  'signupForms',
  'resultsDatabase',
  'statistics',
  'certificates',
  'payments',
  'examPlans',
  'settings',
  'help',
] as const

export type SidebarIconKey = (typeof SIDEBAR_ICON_KEYS)[number]

export const SIDEBAR_ICONS: Record<SidebarIconKey, SvgIconComponent> = {
  dashboard: DashboardOutlinedIcon,
  centers: BusinessOutlinedIcon,
  exams: AssignmentOutlinedIcon,
  archive: ArchiveOutlinedIcon,
  studentExam: SchoolOutlinedIcon,
  lms: LibraryBooksOutlinedIcon,
  questions: QuizOutlinedIcon,
  listening: HeadphonesOutlinedIcon,
  reading: MenuBookOutlinedIcon,
  writing: EditNoteOutlinedIcon,
  speaking: RecordVoiceOverOutlinedIcon,
  students: PeopleOutlinedIcon,
  signupForms: DescriptionOutlinedIcon,
  resultsDatabase: StorageOutlinedIcon,
  statistics: AnalyticsOutlinedIcon,
  certificates: WorkspacePremiumOutlinedIcon,
  payments: PaymentOutlinedIcon,
  examPlans: CardMembershipOutlinedIcon,
  settings: SettingsOutlinedIcon,
  help: HelpOutlineOutlinedIcon,
}
