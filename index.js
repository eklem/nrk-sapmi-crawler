import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'

let startingFromScratch = false

const fetchOptions = {
  'user-agent': 'nrk-sapmi-crawler/0.0.2 - https://github.com/eklem/nrk-sapmi-crawler'
}

// Get list of article IDs from NRK
async function getList (url, options) {
  const response = await fetch(url, options)
  // console.log(response)
  const data = await response.json()
  console.log('Response Code: ', response.status)
  console.log('Response Message: ', response.statusText)
  return data
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
async function calculateListAndWrite (data, parentId, fileName) {
  let IdsToWrite = []
  let crawledIds = []
  let writeCount = 0
  crawledIds = data[0].relations.map(obj => {
    const newObj = {}
    newObj.id = Number(obj.id)
    newObj.unixTime = new Date(obj.created).getTime()
    newObj.parentId = parentId
    newObj.crawled = false
    return newObj
  })

  // weave together if necessary
  if (!startingFromScratch) {
    console.log('start from scratch: ' + startingFromScratch)

    // Go through crawledIds and push objects to array
    IdsToWrite = data[1]
    crawledIds.forEach(crawledObj => {
      if (data[1].some(readObj => readObj.id === crawledObj.id)) {
        // console.log(crawledObj.id + ' already in readObj')
      } else {
        IdsToWrite.push(crawledObj)
        writeCount++
      }
    })
    // Sort on ID
    IdsToWrite.sort((secondItem, firstItem) => firstItem.id - secondItem.id)
  } else {
    IdsToWrite = crawledIds
    writeCount = IdsToWrite.length
  }

  console.log('documents to write: ' + writeCount)

  // write to file
  try {
    const promise = writeFile(fileName, JSON.stringify(IdsToWrite))
    await promise
  } catch (err) {
    console.error(err)
  }
}

export { getList, readIfExists, calculateListAndWrite, fetchOptions }
