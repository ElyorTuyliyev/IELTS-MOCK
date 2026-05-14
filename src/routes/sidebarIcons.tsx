import type { SvgIconComponent } from '@mui/icons-material'
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined'
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'

export const SIDEBAR_ICON_KEYS = [
  'dashboard',
  'centers',
  'exams',
  'studentExam',
  'lms',
  'questions',
  'students',
  'resultsDatabase',
  'statistics',
  'certificates',
  'payments',
  'settings',
  'help',
] as const

export type SidebarIconKey = (typeof SIDEBAR_ICON_KEYS)[number]

export const SIDEBAR_ICONS: Record<SidebarIconKey, SvgIconComponent> = {
  dashboard: DashboardOutlinedIcon,
  centers: BusinessOutlinedIcon,
  exams: AssignmentOutlinedIcon,
  studentExam: SchoolOutlinedIcon,
  lms: LibraryBooksOutlinedIcon,
  questions: QuizOutlinedIcon,
  students: PeopleOutlinedIcon,
  resultsDatabase: StorageOutlinedIcon,
  statistics: AnalyticsOutlinedIcon,
  certificates: WorkspacePremiumOutlinedIcon,
  payments: PaymentOutlinedIcon,
  settings: SettingsOutlinedIcon,
  help: HelpOutlineOutlinedIcon,
}
