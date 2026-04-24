import { useMemo, useState } from 'react'
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { EXAMS } from './HomePage.constants'
import { HomePageRoot } from './HomePage.style'

export function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [newCategory, setNewCategory] = useState('')
  const [customCategories, setCustomCategories] = useState<string[]>([])

  const categories = useMemo(() => {
    const sourceCategories = EXAMS.map((exam) => exam.category)
    return Array.from(new Set([...sourceCategories, ...customCategories]))
  }, [customCategories])

  const filteredExams = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return EXAMS.filter((exam) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        exam.title.toLowerCase().includes(normalizedSearch) ||
        exam.category.toLowerCase().includes(normalizedSearch) ||
        exam.meta.some((item) => item.toLowerCase().includes(normalizedSearch))

      const matchesStatus = statusFilter === 'All statuses' || exam.status === statusFilter
      const matchesCategory = categoryFilter === 'All categories' || exam.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [categoryFilter, searchTerm, statusFilter])

  const handleAddCategory = () => {
    const normalizedCategory = newCategory.trim()

    if (!normalizedCategory) {
      return
    }

    if (categories.some((category) => category.toLowerCase() === normalizedCategory.toLowerCase())) {
      setCategoryFilter(
        categories.find((category) => category.toLowerCase() === normalizedCategory.toLowerCase()) ??
          normalizedCategory,
      )
      setNewCategory('')
      return
    }

    setCustomCategories((current) => [...current, normalizedCategory])
    setCategoryFilter(normalizedCategory)
    setNewCategory('')
  }

  const getStatusClassName = (status: 'Active' | 'Draft' | 'Archived') =>
    `exam-card__status exam-card__status--${status.toLowerCase()}`

  return (
    <Layout>
      <HomePageRoot>
        <Box component="section" className="content__toolbar">
          <Box component="header" className="content__toolbar-header">
            <Typography component="h2" className="content__section-title">
              All Exams
            </Typography>
            <Button className="content__primary-button" variant="contained">
              + Add New Exam
            </Button>
          </Box>

          <Box className="content__toolbar-filters">
            <TextField
              className="content__toolbar-search"
              type="search"
              placeholder="Search..."
              aria-label="Search exams"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <Box className="content__toolbar-filter-group">
              <TextField
                select
                className="content__toolbar-select"
                aria-label="Exam status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <MenuItem value="All statuses">All statuses</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Archived">Archived</MenuItem>
              </TextField>

              <TextField
                select
                className="content__toolbar-select"
                aria-label="Exam category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <MenuItem value="All categories">All categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              <Box className="content__category-actions">
                <TextField
                  className="content__category-input"
                  placeholder="New category"
                  aria-label="New category"
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                />
                <Button
                  className="content__secondary-button"
                  variant="outlined"
                  onClick={handleAddCategory}
                >
                  Add category
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box component="section" className="content__section" aria-labelledby="all-exams-title">
          <Typography component="h2" id="all-exams-title" className="content__screen-reader-title">
            All exams
          </Typography>

          <Box className="content__results-summary">
            <Typography component="span">{filteredExams.length} exams found</Typography>
            <Typography component="span" className="content__results-meta">
              {categoryFilter === 'All categories' ? 'Across all categories' : categoryFilter}
            </Typography>
          </Box>

          {filteredExams.length > 0 ? (
            <Box className="content__grid">
              {filteredExams.map((exam) => (
                <Box key={`${exam.title}-${exam.gradient}`} component="article" className="exam-card">
                  <Box className="exam-card__visual" sx={{ background: exam.gradient }}>
                    <Box component="span" className="exam-card__orb exam-card__orb--large" />
                    <Box component="span" className="exam-card__orb exam-card__orb--small" />
                    <Box className="exam-card__monitor" aria-hidden="true" />
                    <Box className="exam-card__desk" aria-hidden="true" />
                  </Box>

                  <Box className="exam-card__body">
                    <Box component="header" className="exam-card__header">
                      <Box>
                        <Typography component="h3" className="exam-card__title">
                          {exam.title}
                        </Typography>
                        <Typography component="span" className="exam-card__category">
                          {exam.category}
                        </Typography>
                      </Box>

                      <Typography component="span" className={getStatusClassName(exam.status)}>
                        {exam.status}
                      </Typography>
                    </Box>

                    <Box component="ul" className="exam-card__meta">
                      {exam.meta.map((item) => (
                        <Box key={item} component="li" className="exam-card__meta-item">
                          {item}
                        </Box>
                      ))}
                    </Box>

                    <Typography component="p" className="exam-card__date">
                      {exam.date}
                    </Typography>

                    <Button className="exam-card__action" variant="outlined">
                      View More
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box className="content__empty-state">
              No exams matched this filter. Try another status, category, or search phrase.
            </Box>
          )}
        </Box>
      </HomePageRoot>
    </Layout>
  )
}
