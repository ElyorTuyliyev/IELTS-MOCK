import { useMemo, useState } from 'react'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined'
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined'
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined'
import { Box, Typography } from '@mui/material'

import { Layout } from '../../../components/layout'
import { SearchField } from '../../../components/common/SearchField'
import { Button } from '../../../components/common/Button'
import { useAppSelector } from '../../../store/hooks'
import { selectUserRole } from '../../../store'
import {
  getHelpCategoriesForRole,
  getHelpFaqsForRole,
  HELP_CONTACT,
  type HelpCategoryId,
} from '../helpContent'
import { HelpPageRoot } from './HelpPage.style'

const CATEGORY_ICONS: Record<HelpCategoryId, typeof HelpOutlineOutlinedIcon> = {
  'getting-started': RocketLaunchOutlinedIcon,
  exams: AssignmentOutlinedIcon,
  questions: QuizOutlinedIcon,
  students: GroupsOutlinedIcon,
  billing: CreditCardOutlinedIcon,
  certificates: WorkspacePremiumOutlinedIcon,
}

const CATEGORY_LABELS: Record<HelpCategoryId, string> = {
  'getting-started': 'Getting started',
  exams: 'Exams',
  questions: 'Questions',
  students: 'Students',
  billing: 'Billing',
  certificates: 'Certificates',
}

export function HelpPage() {
  const role = useAppSelector(selectUserRole)
  const categories = useMemo(() => getHelpCategoriesForRole(role), [role])
  const allFaqs = useMemo(() => getHelpFaqsForRole(role), [role])

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<HelpCategoryId | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase()
    return allFaqs.filter((faq) => {
      const matchesCategory = activeCategory === 'all' || faq.categoryId === activeCategory
      if (!matchesCategory) return false
      if (!query) return true
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      )
    })
  }, [activeCategory, allFaqs, search])

  const toggleFaq = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  return (
    <Layout>
      <HelpPageRoot>
        <Box className="help-page">
          <Box className="help-page__hero">
            <Box className="help-page__hero-top">
              <Box className="help-page__hero-icon" aria-hidden>
                <HelpOutlineOutlinedIcon />
              </Box>
              <Box>
                <Typography component="h1" className="help-page__title">
                  Help Center
                </Typography>
                <Typography className="help-page__subtitle">
                  Find answers about exams, students, billing, and more. Search or browse by
                  topic below.
                </Typography>
              </Box>
            </Box>
            <SearchField
              className="help-page__search"
              placeholder="Search help articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search help articles"
            />
          </Box>

          <Box>
            <Box className="help-page__section-head">
              <Typography component="h2" className="help-page__section-title">
                Browse by topic
              </Typography>
            </Box>
            <Box className="help-page__categories" sx={{ mt: 1.5 }}>
              <button
                type="button"
                className={`help-page__category-card${activeCategory === 'all' ? ' help-page__category-card--active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                <Box className="help-page__category-icon" aria-hidden>
                  <HelpOutlineOutlinedIcon />
                </Box>
                <Typography component="p" className="help-page__category-title">
                  All topics
                </Typography>
                <Typography component="p" className="help-page__category-desc">
                  View every article for your role
                </Typography>
              </button>
              {categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.id]
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`help-page__category-card${activeCategory === cat.id ? ' help-page__category-card--active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <Box className="help-page__category-icon" aria-hidden>
                      <Icon />
                    </Box>
                    <Typography component="p" className="help-page__category-title">
                      {cat.title}
                    </Typography>
                    <Typography component="p" className="help-page__category-desc">
                      {cat.description}
                    </Typography>
                  </button>
                )
              })}
            </Box>
          </Box>

          <Box>
            <Box className="help-page__section-head">
              <Typography component="h2" className="help-page__section-title">
                Frequently asked questions
              </Typography>
              <Typography className="help-page__section-meta">
                {filteredFaqs.length} article{filteredFaqs.length === 1 ? '' : 's'}
              </Typography>
            </Box>

            {filteredFaqs.length === 0 ? (
              <Box className="help-page__empty" sx={{ mt: 1.5 }}>
                <Typography className="help-page__empty-title">No results found</Typography>
                <Typography>
                  Try a different search term or select another topic.
                </Typography>
              </Box>
            ) : (
              <Box className="help-page__faq-list" sx={{ mt: 1.5 }}>
                {filteredFaqs.map((faq) => {
                  const isOpen = expandedId === faq.id
                  return (
                    <Box
                      key={faq.id}
                      className={`help-page__faq-item${isOpen ? ' help-page__faq-item--expanded' : ''}`}
                    >
                      <button
                        type="button"
                        className="help-page__faq-trigger"
                        onClick={() => toggleFaq(faq.id)}
                        aria-expanded={isOpen}
                      >
                        <Typography component="p" className="help-page__faq-question">
                          {faq.question}
                        </Typography>
                        <Box
                          className={`help-page__faq-chevron${isOpen ? ' help-page__faq-chevron--open' : ''}`}
                          aria-hidden
                        >
                          <ExpandMoreOutlinedIcon />
                        </Box>
                      </button>
                      <Box
                        className={`help-page__faq-answer-wrap${isOpen ? ' help-page__faq-answer-wrap--open' : ''}`}
                      >
                        <Typography component="p" className="help-page__faq-answer">
                          <Box component="span" className="help-page__faq-tag">
                            {CATEGORY_LABELS[faq.categoryId]}
                          </Box>
                          <br />
                          {faq.answer}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            )}
          </Box>

          <Box className="help-page__contact">
            <Box>
              <Typography className="help-page__contact-kicker">Still need help?</Typography>
              <Typography component="h2" className="help-page__contact-title">
                Contact support
              </Typography>
              <Typography className="help-page__contact-text">
                {HELP_CONTACT.responseTime} Include your center name and a short description of
                the issue.
              </Typography>
              <a className="help-page__contact-email" href={`mailto:${HELP_CONTACT.email}`}>
                <MailOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                {HELP_CONTACT.email}
              </a>
            </Box>
            <Button
              className="help-page__contact-action"
              component="a"
              href={`mailto:${HELP_CONTACT.email}?subject=IELTS Mock Support`}
            >
              Email support
            </Button>
          </Box>
        </Box>
      </HelpPageRoot>
    </Layout>
  )
}
