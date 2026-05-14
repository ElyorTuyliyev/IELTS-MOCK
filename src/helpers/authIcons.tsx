import { c } from '../theme'

export function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.75l1.95 4.3 4.63.47-3.45 3.02.98 4.51L12 12.72 7.89 15.05l.98-4.51-3.45-3.02 4.63-.47L12 2.75z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M6.5 8.5l5.5 4 5.5-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.5 10V8.75a4.5 4.5 0 119 0V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="5.5"
        y="10"
        width="13"
        height="9.5"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 13.25v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.5 12.2c0-.57-.05-1.12-.16-1.64H12v3.11h4.77a4.09 4.09 0 01-1.78 2.69v2.23h2.88c1.68-1.55 2.63-3.83 2.63-6.39z"
        fill={c.brand.googleBlue}
      />
      <path
        d="M12 21c2.39 0 4.39-.8 5.85-2.18l-2.88-2.23c-.8.54-1.81.86-2.97.86-2.29 0-4.23-1.55-4.92-3.63H4.1v2.3A8.84 8.84 0 0012 21z"
        fill={c.brand.googleGreen}
      />
      <path
        d="M7.08 13.82A5.3 5.3 0 016.8 12c0-.63.1-1.23.28-1.82v-2.3H4.1A8.91 8.91 0 003 12c0 1.43.34 2.78 1.1 4.12l2.98-2.3z"
        fill={c.brand.googleYellow}
      />
      <path
        d="M12 6.55c1.3 0 2.46.45 3.38 1.33l2.54-2.54C16.38 3.91 14.38 3 12 3 8.53 3 5.54 4.98 4.1 7.88l2.98 2.3c.69-2.08 2.63-3.63 4.92-3.63z"
        fill={c.brand.googleRed}
      />
    </svg>
  )
}

export function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12a9 9 0 10-10.4 8.9v-6.29H8.3V12h2.3v-1.92c0-2.28 1.36-3.54 3.44-3.54.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.69-1.47 1.41V12h2.5l-.4 2.61h-2.1v6.29A9 9 0 0021 12z"
        fill={c.brand.facebook}
      />
    </svg>
  )
}

export function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 4h2l1.5 4-1.5 1a10 10 0 004 4l1-1.5 4 2v2a2 2 0 01-2 2A16 16 0 014 10a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}
