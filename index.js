import fetch from 'node-fetch'
import { readFile, writeFile } from 'fs/promises'
const url = 'https://www.nrk.no/serum/api/content/json/1.13572943?v=2&limit=1000&context=items'
const file = './list.json'

async function getList (url) {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

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

Promise.all([getList(url), readIfExists(file).catch(e => e)])
  .then((data) => console.log(data[0]))
