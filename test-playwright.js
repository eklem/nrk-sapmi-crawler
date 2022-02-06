
import { chromium } from 'playwright'
import { crawlHeaders, readIfExists, writeJson } from './index.js'
const someTime = 2000

const idFile = './test.list.json'
const contentFile = './test.content.json'
const content = []

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
  crawlContent.body = await page.$$eval('.teaser-reference div.bulletin-text p', (element) =>
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
  content.push(crawlContent)
  console.log(crawlContent)
  // console.log('content array length: ' + content.length)
  await browser.close()
}

const waitFor = (someTime) => new Promise((resolve) => setTimeout(resolve, someTime))

async function getIds (idFile) {
  return await readIfExists(idFile)
}

async function start (idFile, someTime) {
  const idArray = await getIds(idFile)
  console.log(idArray)
  for (let i = 0; i < idArray.length; i++) {
    console.log('contentn array length: ' + content.length)
    if (!idArray[i].crawled) {
      await waitFor(someTime)
      await crawl(idArray[i])
      idArray[i].crawled = true
      console.log(idArray[i])
    }
  }
  writeJson(contentFile, content)
  writeJson(idFile, idArray)
}

start(idFile, someTime)
