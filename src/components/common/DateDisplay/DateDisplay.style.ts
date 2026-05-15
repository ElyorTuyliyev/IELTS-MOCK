import styled from '@emotion/styled'

import theme, { c, tokens } from '@/theme'

export type DateDisplaySize = 'sm' | 'md'

type RootProps = {
  $size: DateDisplaySize
}

const sizeRoot: Record<DateDisplaySize, string> = {
  sm: `
    gap: 10px;
    padding: 8px 12px 8px 8px;
    border-radius: ${tokens.radii.sm}px;
  `,
  md: `
    gap: 14px;
    padding: 10px 16px 10px 10px;
    border-radius: ${tokens.radii.md}px;
  `,
}

const sizeBadge: Record<DateDisplaySize, string> = {
  sm: `
    min-width: 40px;
    min-height: 40px;
    border-radius: 12px;
    font-size: 1.05rem;
  `,
  md: `
    min-width: 52px;
    min-height: 52px;
    border-radius: 14px;
    font-size: 1.35rem;
  `,
}

export const Root = styled('div', {
  shouldForwardProp: (p) => p !== '$size',
})<RootProps>`
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  max-width: 100%;
  background: ${c.gradient.cardSoft};
  border: 1px solid ${c.primary.tintBorder};
  box-shadow: ${tokens.shadows.sm}, ${tokens.shadows.accent};
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: ${c.primary.tintBorderStrong};
    box-shadow: ${tokens.shadows.md}, 0 0 0 1px ${tokens.rgba.primary_08};
  }

  ${({ $size }) => sizeRoot[$size]}
`

export const DayBadge = styled('span', {
  shouldForwardProp: (p) => p !== '$size',
})<{ $size: DateDisplaySize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  color: ${c.text.inverse};
  background: ${c.gradient.primary};
  box-shadow: ${tokens.shadows.button};

  ${({ $size }) => sizeBadge[$size]}
`

export const MetaColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-align: left;
`

export const WeekdayRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing(0.75)};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${c.text.secondary};
`

export const MainLine = styled.span`
  font-size: ${14 / 16}rem;
  font-weight: 600;
  color: ${c.text.primary};
  line-height: 1.35;
  white-space: nowrap;
`

export const Fallback = styled.span`
  font-size: ${14 / 16}rem;
  font-weight: 600;
  color: ${c.text.disabled};
  letter-spacing: 0.04em;
`
