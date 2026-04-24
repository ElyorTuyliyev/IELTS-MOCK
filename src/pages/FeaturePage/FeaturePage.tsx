import { Box, Typography } from '@mui/material'

import { Layout } from '../../components/layout'
import { FeaturePageRoot } from './FeaturePage.style'

type FeaturePageProps = {
  eyebrow: string
  title: string
  description: string
}

const featureCards = [
  {
    title: 'Quick overview',
    text: 'This page is now connected to the sidebar route and can hold its own widgets, tables, and actions.',
  },
  {
    title: 'Page-specific content',
    text: 'You can now continue building each section separately instead of keeping the whole app on one screen.',
  },
  {
    title: 'Ready for expansion',
    text: 'If needed, this placeholder can be replaced with a dedicated page component without changing sidebar navigation.',
  },
]

export function FeaturePage({ eyebrow, title, description }: FeaturePageProps) {
  return (
    <Layout>
      <FeaturePageRoot>
        <Box className="feature-page">
          <Box className="feature-page__hero">
            <Typography component="p" className="feature-page__eyebrow">
              {eyebrow}
            </Typography>
            <Typography component="h1" className="feature-page__title">
              {title}
            </Typography>
            <Typography component="p" className="feature-page__description">
              {description}
            </Typography>
          </Box>

          <Box className="feature-page__grid">
            {featureCards.map((card) => (
              <Box key={card.title} className="feature-page__card">
                <Typography component="h2" className="feature-page__card-title">
                  {card.title}
                </Typography>
                <Typography component="p" className="feature-page__card-text">
                  {card.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </FeaturePageRoot>
    </Layout>
  )
}
