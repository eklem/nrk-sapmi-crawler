import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'
const parentId = 1.13572943
const url = 'https://www.nrk.no/serum/api/content/json/' + parentId + '?v=2&limit=1000&context=items'
const fileName = './lib/list.' + parentId + '.json'
let startFromScratch = false
const IdArray = []

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
    const file = JSON.parse(await readFile(fileName))
    return file
  } catch (err) {
    // If i.e. file doesn't exists
    console.error('File doesn\'t exist? Error: ' + err)
    // create file
    startFromScratch = true
  }
}

// calculate array of objects to write
// write it
async function calculateListAndWrite (data, startFromScratch, IdArray, parentId, fileName) {
  // weave together if necessary
  if (startFromScratch) {
    console.log('start from scratch: ' + startFromScratch)
    // just create object from JSON fetch
    /*
      let reformattedArray = kvArray.map(obj => {
        let rObj = {}
        rObj[obj.key] = obj.value
        return rObj
      })
    */
    IdArray = data[0].relations.map(obj => {
      const newObj = {}
      newObj.id = obj.id
      newObj.parentId = parentId
      newObj.crawled = false
      return newObj
    })
    console.log(IdArray)
  } else {
    // weave togheter
    console.log('start from scratch: ' + startFromScratch)
  }
  // write to file
  try {
    const promise = writeFile(fileName, JSON.stringify(IdArray))
    await promise
  } catch (err) {
    console.error(err)
  }
}

// Bringing it all together, fetching URL and reading file
Promise.all([getList(url), readIfExists(fileName).catch(e => e)])
  .then((data) => {
    // console.log(data[0].relations)
    console.log(data[0])
    calculateListAndWrite(data, startFromScratch, IdArray, parentId, fileName)
  })
  .catch(function (err) {
    // rejection
    console.log('Error: ' + err)
  })
