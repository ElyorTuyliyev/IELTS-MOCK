import { useMemo, useState } from 'react'
import { Box, IconButton, TextField, Typography } from '@mui/material'

const blankIds = Array.from({ length: 10 }, (_, idx) => String(idx + 1))

const lineInputStyle = {
  width: 46,
  '& .MuiInputBase-root': {
    height: 22,
    borderRadius: '2px',
    fontSize: 12,
    backgroundColor: '#fff',
  },
  '& .MuiInputBase-input': {
    padding: '2px 6px',
    textAlign: 'center',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#6f6f6f',
  },
}

function Blank({
  id,
  answers,
  onChange,
}: {
  id: string
  answers: Record<string, string>
  onChange: (id: string, value: string) => void
}) {
  return (
    <TextField
      value={answers[id] ?? ''}
      onChange={(event) => onChange(id, event.target.value)}
      size="small"
      sx={lineInputStyle}
      slotProps={{ input: { 'aria-label': `Question ${id} answer` } }}
    />
  )
}

export function StudentExamPlayerPage() {
  const [part] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const progressLabel = useMemo(() => `Part ${part} 0 of 10`, [part])

  const handleAnswerChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f7',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          height: 38,
          px: 2,
          borderBottom: '1px solid #d4d4d8',
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontWeight: 700, color: '#c8191e', fontSize: 20 }}>IELTS</Typography>
        <Typography sx={{ color: '#606060', fontSize: 11 }}>Test taker ID</Typography>
      </Box>

      <Box sx={{ p: '10px 14px', borderBottom: '1px solid #d7d7d7', bgcolor: '#f0f0f0' }}>
        <Typography sx={{ fontSize: 12, color: '#222' }}>Part {part}</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: '14px 16px 24px' }}>
        <Typography sx={{ fontSize: 12, mb: 0.5 }}>Listen and answer questions 1-10.</Typography>
        <Typography sx={{ fontSize: 12, mb: 2 }}>
          Complete the notes. Write <b>ONE WORD AND/OR A NUMBER</b> for each answer.
        </Typography>

        <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5 }}>
          Phone call about second-hand furniture
        </Typography>

        <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 1 }}>Items:</Typography>

        <Box sx={{ pl: 1.5, fontSize: 12, color: '#202020' }}>
          <Typography sx={{ fontSize: 12, mb: 0.8 }}>
            Dining table:&nbsp; <Blank id="1" answers={answers} onChange={handleAnswerChange} /> shape
          </Typography>
          <Typography sx={{ fontSize: 12, mb: 0.8 }}>- medium size</Typography>
          <Typography sx={{ fontSize: 12, mb: 0.8 }}>
            - <Blank id="2" answers={answers} onChange={handleAnswerChange} /> old
          </Typography>
          <Typography sx={{ fontSize: 12, mb: 1.2 }}>- price: £25.00</Typography>

          <Typography sx={{ fontSize: 12, mb: 0.8 }}>
            Dining chairs: - set of <Blank id="3" answers={answers} onChange={handleAnswerChange} /> chairs
          </Typography>
          <Typography sx={{ fontSize: 12, mb: 0.8 }}>
            - seats covered in <Blank id="4" answers={answers} onChange={handleAnswerChange} /> material
          </Typography>
          <Typography sx={{ fontSize: 12, mb: 0.8 }}>
            - in <Blank id="5" answers={answers} onChange={handleAnswerChange} /> condition
          </Typography>
          <Typography sx={{ fontSize: 12, mb: 1.2 }}>- price: £20.00</Typography>

          <Typography sx={{ fontSize: 12, mb: 0.8 }}>Desk:</Typography>
          <Typography sx={{ fontSize: 12, mb: 0.8 }}>- length: 1 metre 20</Typography>
          <Typography sx={{ fontSize: 12, mb: 0.8 }}>
            - 3 drawers; top drawer has a <Blank id="6" answers={answers} onChange={handleAnswerChange} />
          </Typography>
          <Typography sx={{ fontSize: 12, mb: 1.2 }}>
            - price £ <Blank id="7" answers={answers} onChange={handleAnswerChange} />
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 0.6 }}>Address:</Typography>
        <Typography sx={{ fontSize: 12, mb: 1.8 }}>
          <Blank id="8" answers={answers} onChange={handleAnswerChange} /> Old Lane, Silverthorpe
        </Typography>

        <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 0.6 }}>Directions:</Typography>
        <Typography sx={{ fontSize: 12, maxWidth: 920, lineHeight: 1.4 }}>
          Take the Havendi road out of Silverthorpe. Go past the secondary school, then turn{' '}
          <Blank id="9" answers={answers} onChange={handleAnswerChange} /> at the crossroads. House is down this
          road, opposite the <Blank id="10" answers={answers} onChange={handleAnswerChange} />.
        </Typography>
      </Box>

      <Box
        sx={{
          height: 38,
          borderTop: '1px solid #d7d7d7',
          bgcolor: '#fff',
          px: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ fontSize: 11 }}>Part 1</Typography>
          {blankIds.map((id) => (
            <Box
              key={id}
              sx={{
                width: 14,
                height: 14,
                border: '1px solid #787878',
                display: 'grid',
                placeItems: 'center',
                fontSize: 9,
                bgcolor: id === '8' ? '#dbe9ff' : '#fff',
              }}
            >
              {id}
            </Box>
          ))}
        </Box>

        <Typography sx={{ fontSize: 11, color: '#4d4d4d' }}>{progressLabel}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" sx={{ borderRadius: 0, border: '1px solid #595959' }}>
            <Typography sx={{ fontSize: 14, lineHeight: 1 }}>&larr;</Typography>
          </IconButton>
          <IconButton size="small" sx={{ borderRadius: 0, border: '1px solid #595959' }}>
            <Typography sx={{ fontSize: 14, lineHeight: 1 }}>&rarr;</Typography>
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
