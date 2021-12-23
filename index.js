import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'
const url = 'https://www.nrk.no/serum/api/content/json/1.13572943?v=2&limit=1000&context=items'
const file = './list.json'

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
  }
}

// Bringing it all together, fetching URL and reading file
Promise.all([getList(url), readIfExists(file).catch(e => e)])
  .then((data) => console.log('all good'))
