import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'

let startingFromScratch = false

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

// Read local file with already stored article IDs
// If it doesn't exist, do nothing here. It's created when written.
async function readIfExists (fileName) {
  try {
    const data = JSON.parse(await readFile(fileName))
    return data
  } catch (err) {
    console.error('File doesn\'t exist? Error: ' + err)
    // used in function calculateListAndWrite
    startingFromScratch = true
  }
}

// calculate array of objects to write
// write it
async function calculateListAndWrite (data, languageId, fileName, languageName) {
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

  // weave together if necessary
  console.log('Starting from scratch: ' + startingFromScratch)
  if (!startingFromScratch) {
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
    prepareIdsToWrite.sort((secondItem, firstItem) => firstItem.id - secondItem.id)
  } else {
    prepareIdsToWrite = crawledIds
    writeCount = prepareIdsToWrite.length
  }

  console.log('Documents to add: ' + writeCount)

  // write to file
  if (shouldWrite) {
    writeJson(fileName, prepareIdsToWrite)
  }
}

async function writeJson (fileName, json) {
  try {
    const promise = writeFile(fileName, JSON.stringify(json))
    await promise
  } catch (err) {
    console.error(err)
  }
}

export { fetchIds, crawlHeaders, readIfExists, calculateListAndWrite, writeJson }
