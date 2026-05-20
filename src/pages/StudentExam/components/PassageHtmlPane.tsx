import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'

type PassageHtmlPaneProps = {
  html?: string
  className?: string
}

/** Imperative HTML sync so user highlights are not wiped on parent re-renders. */
export function PassageHtmlPane({ html, className }: PassageHtmlPaneProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!html) {
      el.replaceChildren()
      delete el.dataset.passageHtmlKey
      return
    }
    if (el.dataset.passageHtmlKey === html) return
    el.innerHTML = html
    el.dataset.passageHtmlKey = html
  }, [html])

  return <Box ref={ref} className={className} />
}
