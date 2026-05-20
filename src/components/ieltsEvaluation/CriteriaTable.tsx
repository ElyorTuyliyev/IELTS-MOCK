import { useMemo, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, useMediaQuery, useTheme } from '@mui/material'

import { IELTS_DESCRIPTOR_BANDS } from '@/config/ielts'
import type { IeltsModuleDescriptorConfig } from '@/types/ieltsEvaluation'

type CriteriaTableProps = {
  config: IeltsModuleDescriptorConfig
  expanded: boolean
}

export function CriteriaTable({ config, expanded }: CriteriaTableProps) {
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
  const [openCategory, setOpenCategory] = useState<string | null>(
    config.categories[0]?.key ?? null,
  )

  const rows = useMemo(
    () =>
      IELTS_DESCRIPTOR_BANDS.map((band) => ({
        band,
        cells: config.categories.map((category) => ({
          key: category.key,
          label: category.label,
          text: config.descriptors[category.key]?.[band] ?? '—',
        })),
      })),
    [config],
  )

  return (
    <Box
      className={`ielts-eval__criteria-panel ${
        expanded ? 'ielts-eval__criteria-panel--expanded' : 'ielts-eval__criteria-panel--collapsed'
      }`}
      aria-hidden={!expanded}
    >
      {expanded &&
        (isMobile ? (
          <div className="ielts-eval__criteria-accordion">
            {config.categories.map((category) => {
              const isOpen = openCategory === category.key
              return (
                <div key={category.key} className="ielts-eval__criteria-accordion-item">
                  <button
                    type="button"
                    className="ielts-eval__criteria-accordion-summary"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenCategory(isOpen ? null : category.key)
                    }
                  >
                    <span>{category.label}</span>
                    <ExpandMoreIcon
                      sx={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                      fontSize="small"
                    />
                  </button>
                  {isOpen ? (
                    <div className="ielts-eval__criteria-accordion-body">
                      {IELTS_DESCRIPTOR_BANDS.map((band) => (
                        <Box key={band} sx={{ mb: 1.5 }}>
                          <strong>Band {band}</strong>
                          <Box sx={{ mt: 0.5 }}>
                            {config.descriptors[category.key]?.[band] ?? '—'}
                          </Box>
                        </Box>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="ielts-eval__criteria-table-wrap">
            <table className="ielts-eval__criteria-table">
              <thead>
                <tr>
                  <th>Band</th>
                  {config.categories.map((category) => (
                    <th key={category.key}>{category.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.band}>
                    <td>Band {row.band}</td>
                    {row.cells.map((cell) => (
                      <td key={cell.key}>{cell.text}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </Box>
  )
}
