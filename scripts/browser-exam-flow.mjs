import { writeFileSync } from 'fs'
import { chromium } from 'playwright'

const LOG = '/Users/alisher-imac1/Desktop/Mock test/Ielts-mock-frontend/scripts/browser-flow-result.txt'
const lines = []
const log = (s) => lines.push(s)

const BASE = 'http://localhost:5173'
const EXAM_ID = '6a0723c4e4ac1d2228b48c'

async function tryLogin(page) {
  const candidates = [
    { email: 'elyor@gmail.com', password: 'Password123!' },
    { email: 'elyor@mail.com', password: 'Password123!' },
    { email: 'student@test.com', password: 'Password123!' },
    { email: 'student@gmail.com', password: '12345678' },
  ]

  for (const { email, password } of candidates) {
    await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle', timeout: 20000 })
    await page.fill('input[type="email"], input[name="email"]', email).catch(() => {})
    const emailInput = page.locator('input').filter({ has: page.locator('..') }).first()
    const inputs = page.locator('input')
    const count = await inputs.count()
    for (let i = 0; i < count; i++) {
      const type = await inputs.nth(i).getAttribute('type')
      if (type === 'email' || (await inputs.nth(i).getAttribute('name')) === 'email') {
        await inputs.nth(i).fill(email)
      }
    }
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: /sign in|login/i }).click()
    await page.waitForTimeout(3000)
    if (!page.url().includes('sign-in')) {
      log(`LOGIN OK: ${email}`)
      return true
    }
  }
  return false
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  await page.goto(`${BASE}/student/exam-player?examId=${EXAM_ID}`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  })
  log(`Initial URL: ${page.url()}`)

  if (page.url().includes('sign-in')) {
    log('Not authenticated — trying login...')
    const ok = await tryLogin(page)
    if (!ok) {
      log('FAIL: could not login with known test credentials')
      await browser.close()
      writeFileSync(LOG, lines.join('\n'))
      return
    }
    await page.goto(`${BASE}/student/exam-player?examId=${EXAM_ID}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    log(`After login URL: ${page.url()}`)
  }

  await page.waitForTimeout(2000)
  const loading = await page.locator('.student-exam-player__loading-text').count()
  if (loading) {
    await page
      .waitForSelector('.student-exam-player__loading-text', { state: 'detached', timeout: 20000 })
      .catch(() => log('WARN: loading timeout'))
  }

  const unavailable = await page.getByText(/no exam|ended|not assigned/i).count()
  if (unavailable) {
    log('FAIL: exam unavailable screen')
    await page.screenshot({ path: '/Users/alisher-imac1/Desktop/Mock test/Ielts-mock-frontend/scripts/flow-screenshot.png' })
    await browser.close()
    writeFileSync(LOG, lines.join('\n'))
    return
  }

  const header = (await page.locator('.student-exam-player__header-meta-sub').textContent())?.trim()
  log(`Header: ${header}`)

  const banner = (await page.locator('.student-exam-player__part-desc').textContent())?.trim()
  log(`Part banner: ${banner}`)

  const overlay = await page.locator('.student-exam-player__listening-overlay').count()
  if (overlay) {
    log('Listening overlay visible — clicking Play')
    await page.locator('.student-exam-player__listening-play').click()
    await page.waitForTimeout(2000)
  }

  const prose = await page.locator('.student-exam-player__prose--listening').innerText().catch(() => '')
  const blanks = await page.locator('.ielts-blank-input').count()
  log(`Listening prose chars: ${prose.length}, blank inputs: ${blanks}`)
  if (prose.length < 30) log('WARN: listening content still sparse')
  else log('OK: listening has content')

  const partTitles = await page.locator('.student-exam-player__part-title').count()
  const proseHasPart = /Part\s*1/i.test(prose)
  if (partTitles > 0 && proseHasPart) log('WARN: Part 1 may duplicate in banner + prose')

  // Navigate modules via footer complete if possible
  const completeBtn = page.locator('.student-exam-player__complete-btn').first()
  if (await completeBtn.count()) {
    log('Found complete-module button')
  }

  await page.screenshot({
    path: '/Users/alisher-imac1/Desktop/Mock test/Ielts-mock-frontend/scripts/flow-screenshot.png',
    fullPage: true,
  })
  log('Screenshot saved')

  log('DONE')
  await browser.close()
  writeFileSync(LOG, lines.join('\n'))
}

main().catch((e) => {
  writeFileSync(LOG, `ERROR: ${e.message}\n${e.stack}`)
  process.exit(1)
})
