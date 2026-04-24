import { Global, css } from '@emotion/react'
import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from './routes'

const globalStyles = css`
  :root {
    font-family:
      Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #111827;
    background: #eef2ff;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    background:
      radial-gradient(circle at top left, rgba(124, 58, 237, 0.14), transparent 28%),
      linear-gradient(180deg, #f8f9ff 0%, #eef2ff 100%);
  }

  button,
  input,
  select {
    font: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`

function App() {
  return (
    <BrowserRouter>
      <Global styles={globalStyles} />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
