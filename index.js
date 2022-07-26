import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'
import { chromium } from 'playwright'

const crawlHeaders = {
  'user-agent': 'nrk-sapmi-crawler/0.0.4 - https://github.com/eklem/nrk-sapmi-crawler'
}

// To throw an HTTPResponseError if response != ok
class HTTPResponseError extends Error {
  constructor (response, ...args) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args)
    this.response = response
  }
}

// Get list of article IDs from NRK
async function fetchIds (url, options) {
  try {
    const response = await fetch(url, options)
    // console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log('Response Code: ', response.status)
      console.log('Response Message: ', response.statusText)
      return data
    } else {
      throw new HTTPResponseError(response)
    }
  } catch (err) {
    console.log('Error while fetching: ' + err)
  }
}

// Get content of articles from NRK based on IDs stored already
async function fetchContent (idObject, crawlHeaders) {
  const url = 'https://nrk.no/' + idObject.id
  const browser = await chromium.launch({
    headless: true
  })
  const crawlContent = {}
  const page = await browser.newPage(crawlHeaders)
  await page.goto(url)
  crawlContent.id = idObject.id
  crawlContent.url = await page.url()
  crawlContent.title = await page.textContent('h2.bulletin-title')
  crawlContent.body = await page.$$eval('.teaser-reference div.bulletin-text p', (element) =>
    element.map((e) => e.innerText)
  )
  // ## Skipping images for now, the selectors are not precise enough, so getting a lot of non-article images added ##
  // crawlContent.img = {}
  // crawlContent.img.srcset = await page.$eval('div.text-body ~ figure > div.responsive-img img', img => img.srcset).catch(console.error)
  // crawlContent.img.description = await page.$eval('div.text-body ~ figure > div.responsive-img img', img => img.alt).catch(console.error)
  // crawlContent.img.credit = await page.$eval('div.text-body ~ figure > div.responsive-img img', img => img.title).catch(console.error)
  // if (Object.keys(crawlContent.img).length === 0) {
  //   crawlContent.img = undefined
  //   console.log(crawlContent.img)
  // }
  crawlContent.year = await page.textContent('span.bulletin-publish-year')
  crawlContent.unixTime = idObject.unixTime
  crawlContent.languageName = idObject.languageName
  crawlContent.languageId = idObject.languageId
  await browser.close()
  return crawlContent
  // console.log('content array length: ' + content.length)
}

const waitFor = (someTime) => new Promise((resolve) => setTimeout(resolve, someTime))

// Read local file with already stored article IDs
// If it doesn't exist, do nothing here. It's created when written.
async function readIfExists (fileName) {
  try {
    const data = JSON.parse(await readFile(fileName))
    return data
  } catch (err) {
    console.error('File doesn\'t exist. Creating it Error: ' + err)
    // used in function calculateListAndWrite
    // startingFromScratch = true
    return []
  }
}

// calculate ID-array of objects to write
// write it
async function calculateIdListAndWrite (data, languageId, fileName, languageName) {
  let prepareIdsToWrite = []
  let crawledIds = []
  let writeCount = 0
  let shouldWrite = false
  crawledIds = data[0].relations.map(obj => {
    const newObj = {}
    newObj.id = obj.id
    newObj.unixTime = new Date(obj.created).getTime()
    newObj.languageId = languageId
    newObj.languageName = languageName
    newObj.crawled = false
    return newObj
  })

  // weave together new and existing IDs data
  // Go through crawledIds and push objects to array
  console.log('Documents already stored: ' + data[1].length)
  prepareIdsToWrite = data[1]
  crawledIds.forEach(crawledObj => {
    if (data[1].some(readObj => readObj.id === crawledObj.id)) {
      // console.log(crawledObj.id + ' already in readObj')
    } else {
      shouldWrite = true
      prepareIdsToWrite.push(crawledObj)
      writeCount++
    }
  })
  // Sort on ID
  prepareIdsToWrite = sortObjects(prepareIdsToWrite)
  console.log('Documents to add: ' + writeCount)

  // write to file
  if (shouldWrite) {
    writeJson(fileName, prepareIdsToWrite)
  }
}

async function writeJson (fileName, json) {
  try {
    const promise = writeFile(fileName, JSON.stringify(json, null, 2))
    await promise
  } catch (err) {
    console.error(err)
  }
}

async function crawlContentAndWrite (idFile, contentFile, appropriateTime) {
  let content = []
  const contentFetched = []
  const idArray = await readIfExists(idFile)
  const contentRead = await readIfExists(contentFile)
  // console.log(idArray)
  // console.log(contentRead[1])
  for (let i = 0; i < idArray.length; i++) {
    if (!idArray[i].crawled) {
      await waitFor(appropriateTime)
      const contentObject = await fetchContent(idArray[i], crawlHeaders)
      idArray[i].crawled = true
      // console.log(contentObject)
      contentFetched.push(contentObject)
      console.log('content array length: ' + contentFetched.length)
    }
  }
  // Joining newly fetched and existing content
  content = [...contentFetched, ...contentRead]

  // Removing duplicates & sorting
  content = getUniqueListBy(content, 'id')
  content = sortObjects(content)

  // Write content & IDs
  writeJson(contentFile, content)
  writeJson(idFile, idArray)
}

function getUniqueListBy (arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

function sortObjects (objects) {
  return objects.sort((secondItem, firstItem) => firstItem.id - secondItem.id)
}

export { fetchIds, fetchContent, crawlHeaders, readIfExists, calculateIdListAndWrite, writeJson, waitFor, crawlContentAndWrite }
