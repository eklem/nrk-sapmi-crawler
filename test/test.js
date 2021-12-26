import { getList, readIfExists, calculateListAndWrite, fetchOptions } from '../index.js'

const southSami = {
  id: 1.13572943,
  url: 'https://www.nrk.no/serum/api/content/json/1.13572943?v=2&limit=1000&context=items',
  file: './test/lib/list.southSami.json'
}

// To change user-agent for the crawler
// fetchOptions['user-agent'] = 'name of crawler/version - comment (i.e. contact-info)'

// Bringing it all together, fetching URL and reading file
// ... then setting up array of crawledIds objects
// ... sorting
// ... writing
Promise.all([getList(southSami.url, fetchOptions), readIfExists(southSami.file).catch(e => e)])
  .then((data) => {
    calculateListAndWrite(data, southSami.id, southSami.file)
  })
  .catch(function (err) {
    console.log('Error: ' + err)
  })
