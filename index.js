import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'
const parentId = 1.13572943
const url = 'https://www.nrk.no/serum/api/content/json/' + parentId + '?v=2&limit=1000&context=items'
const fileName = './list.json'
let startFromScratch = false

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

/*
Array of object format:
[
  {
    "id": "1.15778840",
    "parent-id": "1.13572943",
    "crawled": false
  }
]
The array can be picked from data[0].relations
*/
async function calculateListAndWrite (data, startFromScratch) {
  // weave together if necessary
  if (startFromScratch) {
    console.log('start from scratch: ' + startFromScratch)
    // just create object from JSON fetch
  } else {
    // weave togheter
    console.log('start from scratch: ' + startFromScratch)
  }
  // write to file
}

// Bringing it all together, fetching URL and reading file
Promise.all([getList(url), readIfExists(fileName).catch(e => e)])
  .then((data) => {
    console.log(data[0].relations)
    calculateListAndWrite(data, startFromScratch)
  })
