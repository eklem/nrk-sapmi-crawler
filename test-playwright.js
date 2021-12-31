
import { chromium } from 'playwright'
import { crawlHeaders } from './index.js'
const crawlArray = [{ id: '1.15778840', unixTime: 1639919176000, languageId: '1.13572943', languageName: 'Åarjelsaemien', crawled: false }, { id: '1.15761886', unixTime: 1638894940000, languageId: '1.13572943', languageName: 'Åarjelsaemien', crawled: false }, { id: '1.15789637', unixTime: 1640782941000, languageId: '1.13572949', languageName: 'Davvisámegillii', crawled: false }]
const delay = 10000

async function crawl (crawlObject) {
  const url = 'https://nrk.no/' + crawlObject.id
  const browser = await chromium.launch({
    headless: true
  })
  const crawlContent = {}
  const page = await browser.newPage(crawlHeaders)
  await page.goto(url)
  crawlContent.url = await page.url()
  crawlContent.title = await page.textContent('h2.bulletin-title')
  crawlContent.body = await page.$$eval('div.bulletin-text p', (element) =>
    element.map((e) => e.innerText)
  )
  crawlContent.img = {}
  crawlContent.img.srcset = await page.$eval('div.text-body ~ figure > div.responsive-img img', img => img.srcset).catch(console.error)
  crawlContent.img.description = await page.$eval('div.text-body ~ figure > div.responsive-img img', img => img.alt).catch(console.error)
  crawlContent.img.credit = await page.$eval('div.text-body ~ figure > div.responsive-img img', img => img.title).catch(console.error)
  crawlContent.year = await page.textContent('span.bulletin-publish-year')
  crawlContent.unixTime = crawlObject.unixTime
  crawlContent.languageName = crawlObject.languageName
  crawlContent.languageId = crawlObject.languageId
  console.log(crawlContent)
  await browser.close()
}

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function start (crawlArray, delay) {
  for (let i = 0; i < crawlArray.length; i++) {
    await sleepNow(delay)
    crawl(crawlArray[i])
  }
}

start(crawlArray, delay)
