import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'
const parentId = 1.13572943
const url = 'https://www.nrk.no/serum/api/content/json/' + parentId + '?v=2&limit=1000&context=items'
const fileName = './lib/list.' + parentId + '.json'
let startingFromScratch = false
const crawledIds = []
const IdsToWrite = []

// Get list of article IDs from NRK
async function getList (url) {
  const response = await fetch(url)
  // console.log(response)
  const data = await response.json()
  console.log('Response Code: ', response.status)
  console.log('Response Message: ', response.statusText)
  return data
}

// Read local file with already stored article IDs
// If it doesn't exist, it's created
async function readIfExists (fileName) {
  try {
    const data = JSON.parse(await readFile(fileName))
    return data
  } catch (err) {
    // If i.e. file doesn't exists
    console.error('File doesn\'t exist? Error: ' + err)
    // used in function calculateListAndWrite
    startingFromScratch = true
  }
}

// calculate array of objects to write
// write it
async function calculateListAndWrite (data, startingFromScratch, crawledIds, IdsToWrite, parentId, fileName) {
  crawledIds = data[0].relations.map(obj => {
    const newObj = {}
    newObj.id = Number(obj.id)
    newObj.unixTime = new Date(obj.created).getTime()
    newObj.parentId = parentId
    newObj.crawled = false
    return newObj
  })
  // console.log(crawledIds)

  // weave together if necessary
  if (!startingFromScratch) {
    console.log('start from scratch: ' + startingFromScratch)
    // console.log(data)
    // Go through crawledIds and push objects to array
    IdsToWrite = data[1]
    crawledIds.forEach(crawledObj => {
      if (data[1].some(readObj => readObj.id === crawledObj.id)) {
        console.log(crawledObj.id + ' already in readObj')
      } else {
        IdsToWrite.push(crawledObj)
      }
    })
    // Sort on ID
    IdsToWrite.sort((secondItem, firstItem) => firstItem.id - secondItem.id)
  } else {
    IdsToWrite = crawledIds
  }
  // write to file
  try {
    const promise = writeFile(fileName, JSON.stringify(IdsToWrite))
    await promise
  } catch (err) {
    console.error(err)
  }
}

// if object not included in array -> true/false
// Do something like this: cases.hitFound = itemArr.some(word => queryArr.includes(word))
// ... or check this one: https://www.tutorialrepublic.com/faq/how-to-check-if-an-array-includes-an-object-in-javascript.php
function notIncludedInArray () {
  // if
}

// Bringing it all together, fetching URL and reading file
Promise.all([getList(url), readIfExists(fileName).catch(e => e)])
  .then((data) => {
    // console.log(data[0].relations)
    // console.log(data[0])
    calculateListAndWrite(data, startingFromScratch, crawledIds, IdsToWrite, parentId, fileName)
  })
  .catch(function (err) {
    // rejection
    console.log('Error: ' + err)
  })
