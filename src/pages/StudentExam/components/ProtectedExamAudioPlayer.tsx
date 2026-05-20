import { useCallback, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { Button } from '../../../components/common/Button'

type ProtectedExamAudioPlayerProps = {
  audioUrl?: string
  label?: string
}

export function ProtectedExamAudioPlayer({
  audioUrl,
  label = 'Play audio',
}: ProtectedExamAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlay = useCallback(async () => {
    if (!audioUrl || !audioRef.current) return
    try {
      audioRef.current.src = audioUrl
      await audioRef.current.play()
    } catch {
      // Ignore playback errors
    }
  }, [audioUrl])

  if (!audioUrl) return null

  return (
    <Box sx={{ mb: 2 }}>
      <audio
        ref={audioRef}
        preload="none"
        controlsList="nodownload noplaybackrate"
        onContextMenu={(event) => event.preventDefault()}
        style={{ display: 'none' }}
      />
      <Button variant="secondary" size="sm" onClick={() => void handlePlay()}>
        {label}
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        Playback only — download is not available.
      </Typography>
    </Box>
  )
}
