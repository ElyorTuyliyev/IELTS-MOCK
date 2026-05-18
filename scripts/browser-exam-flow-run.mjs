import { writeFileSync } from 'fs'
import { chromium } from 'playwright'

const LOG = '/Users/alisher-imac1/Desktop/Mock test/Ielts-mock-frontend/scripts/browser-flow-result.txt'
const lines = []
const log = (s) => lines.push(s)

const BASE = 'http://localhost:5173'
const EXAM_ID = '6a0723d0e4aca1d22286a46c'
const EMAIL = 'el@gmail.com'
const PASSWORD = 'Password123!'

async function login(page) {
  await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle', timeout: 20000 })
  const inputs = page.locator('input')
  const count = await inputs.count()
  for (let i = 0; i < count; i++) {
    const type = await inputs.nth(i).getAttribute('type')
    const name = await inputs.nth(i).getAttribute('name')
    if (type === 'email' || name === 'email') await inputs.nth(i).fill(EMAIL)
  }
  await page.locator('input[type="password"]').fill(PASSWORD)
  await page.getByRole('button', { name: /sign in|login/i }).click()
  await page.waitForTimeout(3000)
  return !page.url().includes('sign-in')
}

async function main() {
  log(`mongosh exam: 6a0723d0e4aca1d22286a46c Azam Mock test`)
  log(`enrollment inserted: 6a073bef5f7ab0dd38f587cc for user 6a0471003dc85c920ce26535`)
  log(`login: ${EMAIL}`)

  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  await page.goto(`${BASE}/student/exam-player?examId=${EXAM_ID}`, {
    waitUntil: 'networkidle',
    timeout: 30000,
  })
  log(`Initial URL: ${page.url()}`)

  if (page.url().includes('sign-in')) {
    const ok = await login(page)
    log(ok ? 'LOGIN OK' : 'LOGIN FAIL')
    if (!ok) {
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

  await page.waitForSelector('.student-exam-player__loading-text', { state: 'detached', timeout: 20000 }).catch(() => {})

  const bodySnippet = (await page.locator('body').innerText()).slice(0, 200).replace(/\s+/g, ' ')
  log(`body snippet: ${bodySnippet}`)

  const overlay = await page.locator('.student-exam-player__listening-overlay').count()
  if (overlay) {
    log('Listening overlay visible — clicking Play')
    await page.locator('.student-exam-player__listening-play').click()
    await page.waitForTimeout(1500)
  } else {
    log('No listening overlay')
  }

  log('Waiting 15s on exam player (headed)')
  await page.waitForTimeout(15000)

  const header = (await page.locator('.student-exam-player__header-meta-sub').textContent().catch(() => ''))?.trim()
  const banner = (await page.locator('.student-exam-player__part-desc').textContent().catch(() => ''))?.trim()
  log(`Header: ${header || 'n/a'}`)
  log(`Banner: ${banner || 'n/a'}`)

  const prose = await page.locator('.student-exam-player__prose--listening').innerText().catch(() => '')
  const blanks = await page.locator('.ielts-blank-input').count()
  log(`Listening prose chars: ${prose.length}, blank inputs: ${blanks}`)
  log(prose.length >= 30 ? 'OK: listening has content' : 'WARN: listening content sparse')

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
