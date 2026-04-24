import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'

import { Layout } from '../../components/layout'
import {
  COURSES,
  COURSE_SORT_OPTIONS,
  type CourseSortOption,
} from './CoursesPage.constants'
import { CoursesPageRoot } from './CoursesPage.style'

export function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<CourseSortOption>('Created Date')

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const visibleCourses = COURSES.filter((course) => {
      if (!normalizedSearch) {
        return true
      }

      return (
        course.title.toLowerCase().includes(normalizedSearch) ||
        course.author.toLowerCase().includes(normalizedSearch)
      )
    })

    return [...visibleCourses].sort((left, right) => {
      if (sortOption === 'Title A-Z') {
        return left.title.localeCompare(right.title)
      }

      if (sortOption === 'Title Z-A') {
        return right.title.localeCompare(left.title)
      }

      return right.createdAt.localeCompare(left.createdAt)
    })
  }, [searchTerm, sortOption])

  return (
    <Layout>
      <CoursesPageRoot>
        <Box className="courses-page">
          <Box className="courses-page__head">
            <Typography component="h1" className="courses-page__title">
              Courses
            </Typography>

            <Button className="courses-page__primary-button" variant="contained">
              + Add New Courses
            </Button>
          </Box>

          <Box className="courses-panel">
            <Box className="courses-panel__toolbar">
              <TextField
                className="courses-panel__search"
                type="search"
                placeholder="Search..."
                aria-label="Search courses"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box className="courses-panel__search-icon">⌕</Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box className="courses-panel__actions">
                <TextField
                  select
                  className="courses-panel__select"
                  aria-label="Sort courses"
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value as CourseSortOption)
                  }
                >
                  {COURSE_SORT_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <Button className="courses-panel__ghost-button" variant="outlined">
                  Add new category
                </Button>
              </Box>
            </Box>

            {filteredCourses.length > 0 ? (
              <Box className="courses-panel__grid">
                {filteredCourses.map((course) => (
                  <Box key={course.title} component="article" className="course-card">
                    <Box
                      className="course-card__visual"
                      sx={
                        {
                          '--course-from': course.accentFrom,
                          '--course-to': course.accentTo,
                        } as CSSProperties
                      }
                    >
                      <Box className="course-card__badge">{course.iconLabel}</Box>
                    </Box>

                    <Box className="course-card__body">
                      <Typography component="h2" className="course-card__title">
                        {course.title}
                      </Typography>

                      <Typography component="p" className="course-card__duration">
                        Course Duration about: {course.duration}
                      </Typography>

                      <Box className="course-card__meta">
                        <span className="course-card__meta-item">{course.author}</span>
                        <span className="course-card__meta-item">
                          Toatl {course.chapters} Chapters
                        </span>
                      </Box>

                      <Box className="course-card__date">
                        <Box component="span" className="course-card__date-icon" aria-hidden="true">
                          ▴
                        </Box>
                        <span>Created on {course.createdDate}</span>
                      </Box>

                      <Button className="course-card__action" variant="outlined">
                        View More
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box className="courses-panel__empty">
                No courses matched the current search.
              </Box>
            )}
          </Box>
        </Box>
      </CoursesPageRoot>
    </Layout>
  )
}
