
import { chromium } from 'playwright'
// const crawlObject = { id: '1.15778840', unixTime: 1639919176000, languageId: '1.13572943', languageName: 'Åarjelsaemien', crawled: false }
const crawlObject = { id: '1.15761886', unixTime: 1638894940000, languageId: '1.13572943', languageName: 'Åarjelsaemien', crawled: false }
const aLittleTime = 1000
const urlStart = 'https://nrk.no/'

async function crawl (url) {
  const browser = await chromium.launch({
    headless: true // setting this to true will not run the UI
  })
  const crawlContent = {}

  const page = await browser.newPage()
  await page.goto(url)
  await page.waitForTimeout(aLittleTime) // wait for 5 seconds
  crawlContent.url = await page.url()
  crawlContent.title = await page.textContent('h2.bulletin-title')
  crawlContent.body = await page.$$eval('div.bulletin-text p', (element) =>
    element.map((e) => e.innerText)
  )
  crawlContent.img = {}
  crawlContent.img.srcset = await page.$eval('div.responsive-img img', img => img.srcset)
  crawlContent.img.text = await page.$eval('div.responsive-img img', img => img.alt)
  crawlContent.img.photocredit = await page.$eval('div.responsive-img img', img => img.title)
  crawlContent.year = await page.textContent('span.bulletin-publish-year')
  crawlContent.unixTime = crawlObject.unixTime
  crawlContent.languageName = crawlObject.languageName
  crawlContent.languageId = crawlObject.languageId
  console.log(crawlContent)
  await browser.close()
}

crawl(urlStart + crawlObject.id)
