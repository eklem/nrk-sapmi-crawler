import fetch from 'node-fetch'
import * as fs from 'fs/promises'

async function getList (url) {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

getList('https://www.nrk.no/serum/api/content/json/1.13572943?v=2&limit=1000&context=items')
  .then((data) => console.log(data))

// Check if file exists function
// https://stackoverflow.com/questions/17699599/node-js-check-if-file-exists
