import { Link } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { ROUTES_PATH } from '../../routes'
import { CentersPageRoot } from './CentersPage.style'

const centerStats = [
  { label: 'Total centers', value: '12', meta: '3 yangi filial bu oy qo‘shildi' },
  { label: 'Active students', value: '2,480', meta: 'Barcha markazlar bo‘yicha' },
  { label: 'Teachers', value: '146', meta: 'IELTS va General English jamoasi' },
  { label: 'Average band', value: '6.8', meta: 'Oxirgi 30 kun natijasi' },
]

const centers = [
  {
    name: 'IELTS Study Chilonzor',
    location: 'Tashkent, Chilonzor 19-daha',
    status: 'Active',
    students: '420',
    teachers: '24',
    rooms: '14',
  },
  {
    name: 'IELTS Study Yunusobod',
    location: 'Tashkent, Yunusobod 4-mavze',
    status: 'Growing',
    students: '315',
    teachers: '18',
    rooms: '10',
  },
  {
    name: 'IELTS Study Samarqand',
    location: 'Samarqand, University boulevard',
    status: 'Top score',
    students: '290',
    teachers: '16',
    rooms: '8',
  },
]

const centerTasks = [
  {
    title: 'Teacher schedule review',
    meta: 'Chilonzor branch, 14 unresolved slot conflicts',
    value: 'Today',
  },
  {
    title: 'New classroom setup',
    meta: 'Yunusobod branch needs equipment approval',
    value: 'Pending',
  },
  {
    title: 'Monthly performance report',
    meta: 'Samarqand branch report closes at 18:00',
    value: '3 hrs left',
  },
]

export function CentersPage() {
  return (
    <Layout>
      <CentersPageRoot>
        <Box className="centers-page">
          <Box className="centers-page__header">
            <Box>
              <Typography component="h1" className="centers-page__title">
                Centers
              </Typography>
              <Typography component="p" className="centers-page__description">
                Barcha filiallar bo‘yicha student oqimi, o‘qituvchi bandligi va
                operatsion holatni bitta joydan kuzatish uchun tayyor dashboard.
              </Typography>
            </Box>

            <Button
              component={Link}
              to={ROUTES_PATH.addCenter}
              className="centers-page__cta"
              variant="contained"
            >
              + Add New Center
            </Button>
          </Box>

          <Box className="centers-page__stats">
            {centerStats.map((item) => (
              <Box key={item.label} className="centers-stat">
                <Typography component="span" className="centers-stat__label">
                  {item.label}
                </Typography>
                <Typography component="p" className="centers-stat__value">
                  {item.value}
                </Typography>
                <Typography component="p" className="centers-stat__meta">
                  {item.meta}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box className="centers-page__content">
            <Box className="centers-panel">
              <Box className="centers-panel__header">
                <Box>
                  <Typography component="h2" className="centers-panel__title">
                    Branch Overview
                  </Typography>
                  <Typography component="p" className="centers-panel__subtitle">
                    Asosiy ko‘rsatkichlari bilan faol markazlar ro‘yxati.
                  </Typography>
                </Box>
              </Box>

              <Box className="centers-panel__list">
                {centers.map((center) => (
                  <Box key={center.name} className="center-card">
                    <Box className="center-card__row">
                      <Box>
                        <Typography component="h3" className="center-card__name">
                          {center.name}
                        </Typography>
                        <Typography component="p" className="center-card__location">
                          {center.location}
                        </Typography>
                      </Box>

                      <Box className="center-card__pill">{center.status}</Box>
                    </Box>

                    <Box className="center-card__metrics">
                      <Box className="center-card__metric">
                        <Typography component="span" className="center-card__metric-label">
                          Students
                        </Typography>
                        <Typography component="span" className="center-card__metric-value">
                          {center.students}
                        </Typography>
                      </Box>

                      <Box className="center-card__metric">
                        <Typography component="span" className="center-card__metric-label">
                          Teachers
                        </Typography>
                        <Typography component="span" className="center-card__metric-value">
                          {center.teachers}
                        </Typography>
                      </Box>

                      <Box className="center-card__metric">
                        <Typography component="span" className="center-card__metric-label">
                          Rooms
                        </Typography>
                        <Typography component="span" className="center-card__metric-value">
                          {center.rooms}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box className="centers-sidepanel">
              <Box className="centers-sidepanel__header">
                <Box>
                  <Typography component="h2" className="centers-sidepanel__title">
                    Operations
                  </Typography>
                  <Typography component="p" className="centers-sidepanel__subtitle">
                    E’tibor talab qilayotgan ichki vazifalar.
                  </Typography>
                </Box>
              </Box>

              <Box className="centers-sidepanel__list">
                {centerTasks.map((task) => (
                  <Box key={task.title} className="centers-sidepanel__item">
                    <Box>
                      <Typography component="p" className="centers-sidepanel__item-label">
                        {task.title}
                      </Typography>
                      <Typography component="p" className="centers-sidepanel__item-meta">
                        {task.meta}
                      </Typography>
                    </Box>

                    <Typography component="span" className="centers-sidepanel__item-value">
                      {task.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </CentersPageRoot>
    </Layout>
  )
}
