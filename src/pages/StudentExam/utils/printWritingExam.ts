export type WritingPrintPart = {
  partNumber: number
  passageHtml?: string
  taskHtml?: string
  answer: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function printWritingExam(parts: WritingPrintPart[], examTitle?: string): void {
  if (parts.length === 0) return

  const sections = parts
    .map((part) => {
      const taskBlock = part.taskHtml?.trim()
        ? `<div class="task">${part.taskHtml}</div>`
        : '<p class="muted">No task content.</p>'
      const passageBlock = part.passageHtml?.trim()
        ? `<div class="passage"><h3>Passage / material</h3>${part.passageHtml}</div>`
        : ''
      const answerText = part.answer.trim() || '(No answer yet)'
      return `
        <section class="part">
          <h2>Writing — Part ${part.partNumber}</h2>
          ${passageBlock}
          <h3>Task</h3>
          ${taskBlock}
          <h3>Your answer</h3>
          <div class="answer">${escapeHtml(answerText).replace(/\n/g, '<br />')}</div>
        </section>
      `
    })
    .join('<hr />')

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(examTitle?.trim() || 'Writing — IELTS Mock Exam')}</title>
    <style>
      body { font-family: Georgia, 'Times New Roman', serif; margin: 24px; color: #111; line-height: 1.5; }
      h1 { font-size: 1.25rem; margin-bottom: 1.5rem; font-family: system-ui, sans-serif; }
      h2 { font-size: 1.1rem; margin: 0 0 12px; font-family: system-ui, sans-serif; }
      h3 { font-size: 0.95rem; margin: 16px 0 8px; font-family: system-ui, sans-serif; }
      .part { margin-bottom: 24px; page-break-inside: avoid; }
      .passage, .task { margin-bottom: 16px; font-size: 14px; }
      .answer {
        white-space: pre-wrap;
        border: 1px solid #ccc;
        padding: 12px 14px;
        min-height: 120px;
        font-size: 14px;
        background: #fafafa;
      }
      .muted { color: #666; font-style: italic; }
      hr { border: none; border-top: 1px solid #ddd; margin: 28px 0; }
      @media print { body { margin: 12mm; } }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(examTitle?.trim() || 'Writing — IELTS Mock Exam')}</h1>
    ${sections}
  </body>
</html>`

  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!printWindow) return

  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  printWindow.onload = () => {
    printWindow.print()
  }
}
