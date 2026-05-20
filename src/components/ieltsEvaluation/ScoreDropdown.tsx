import { Select } from '@/components/common/Select'
import { c } from '@/theme'
import { IELTS_BAND_SCORE_OPTIONS } from '@/config/ielts'

type ScoreDropdownProps = {
  value: number | null
  onChange: (value: number | null) => void
  id?: string
  error?: boolean
  disabled?: boolean
}

export function ScoreDropdown({
  value,
  onChange,
  id,
  error = false,
  disabled = false,
}: ScoreDropdownProps) {
  return (
    <Select
      id={id}
      size="sm"
      fullWidth
      value={value == null ? '' : String(value)}
      onChange={(event) => {
        const next = String(event.target.value)
        onChange(next === '' ? null : Number(next))
      }}
      options={IELTS_BAND_SCORE_OPTIONS}
      error={error}
      disabled={disabled}
      slotProps={{
        select: {
          displayEmpty: true,
          renderValue: (selected) => {
            if (selected === '' || selected == null) {
              return (
                <span style={{ color: c.text.secondary, fontWeight: 500 }}>
                  Select band…
                </span>
              )
            }
            return String(selected)
          },
        },
      }}
    />
  )
}
