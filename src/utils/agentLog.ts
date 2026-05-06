type AgentLogPayload = {
  sessionId: string
  runId: string
  hypothesisId?: string
  location: string
  message: string
  data?: unknown
  timestamp?: number
}

/**
 * Dev-only debug logger used during local investigation.
 * Set `VITE_AGENT_LOG_URL` to enable. If unset, this is a no-op.
 */
export function agentLog(payload: AgentLogPayload): void {
  const url = (import.meta.env.VITE_AGENT_LOG_URL as string | undefined)?.trim()
  if (!import.meta.env.DEV) return
  if (!url) return

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': payload.sessionId,
    },
    body: JSON.stringify({
      ...payload,
      timestamp: payload.timestamp ?? Date.now(),
    }),
  }).catch(() => {})
}

