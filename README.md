# nrk-sapmi-crawler
Crawler for [NRK Sapmi news bulletins](https://www.nrk.no/sapmi/samegillii/) that will be the basis for [stopword-sami](https://github.com/eklem/stopword-sami) and an example search engine for content in Sami.

Will crawl news bulletins in [Northern Sami](https://www.nrk.no/sapmi/o__asat---davvisamegillii-1.13572949), [Lule Sami](https://www.nrk.no/sapmi/adasa---julevsabmaj-1.13572946) and [South Sami](https://www.nrk.no/sapmi/saernie---aarjelsaemien-1.13572943).

## Getting a list of article IDs to crawl
 ```javaScript
 import { getList, readIfExists, calculateListAndWrite, fetchOptions } from '../index.js'

const southSami = {
  id: '1.13572943',
  languageName: 'Åarjelsaemien',
  url: 'https://www.nrk.no/serum/api/content/json/1.13572943?v=2&limit=1000&context=items',
  file: './lib/list.southSami.json'
}

// Bringing it all together, fetching URL and reading file, and if new content -> merging arrays and writing
Promise.all([getList(southSami.url, fetchOptions), readIfExists(southSami.file).catch(e => e)])
  .then((data) => {
    calculateListAndWrite(data, southSami.id, southSami.file, southSami.languageName)
  })
  .catch(function (err) {
    console.log('Error: ' + err)
  })
 ```

 ## To change user-agent for the crawler
```javaScript
fetchOptions['user-agent'] = 'name of crawler/version - comment (i.e. contact-info)'
```