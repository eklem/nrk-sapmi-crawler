# nrk-sapmi-crawler
[![NPM version](http://img.shields.io/npm/v/nrk-sapmi-crawler.svg?style=flat)](https://npmjs.org/package/nrk-sapmi-crawler)
[![NPM downloads](http://img.shields.io/npm/dm/nrk-sapmi-crawler.svg?style=flat)](https://npmjs.org/package/nrk-sapmi-crawler) 
[![tests](https://github.com/eklem/nrk-sapmi-crawler/actions/workflows/tests.yml/badge.svg)](https://github.com/eklem/nrk-sapmi-crawler/actions/workflows/tests.yml)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

Crawler for [NRK Sapmi news bulletins](https://www.nrk.no/sapmi/samegillii/) that will be the basis for [stopword-sami](https://github.com/eklem/stopword-sami) and an example search engine for content in Sami.

Crawl news bulletins in [Northern Sami](https://www.nrk.no/sapmi/o__asat---davvisamegillii-1.13572949), [Lule Sami](https://www.nrk.no/sapmi/adasa---julevsabmaj-1.13572946) and [South Sami](https://www.nrk.no/sapmi/saernie---aarjelsaemien-1.13572943).

Code is not the cleanest one, but it works well enough, and hopefully will without too much maintenance for the next copule of years. If you just want the datasets, install [stopword-sami](https://github.com/eklem/stopword-sami) modul.

## Getting a list of article IDs to crawl
 ```javaScript
 import { getList, crawlHeader, readIfExists, calculateIdListAndWrite } from '../index.js'

const southSami = {
  id: '1.13572943',
  languageName: 'Åarjelsaemien',
  url: 'https://www.nrk.no/serum/api/content/json/1.13572943?v=2&limit=1000&context=items',
  file: './lib/list.southSami.json'
}

// Bringing it all together, fetching URL and reading file, and if new content -> merging arrays and writing
Promise.all([getList(southSami.url, crawlHeader), readIfExists(southSami.file).catch(e => e)])
  .then((data) => {
    calculateListAndWrite(data, southSami.id, southSami.file, southSami.languageName)
  })
  .catch(function (err) {
    console.log('Error: ' + err)
  })
 ```
 
 ## To change user-agent for the crawler
```javaScript
crawlHeader['user-agent'] = 'name of crawler/version - comment (i.e. contact-info)'
```

## Getting the content from a list of IDs
```javaScript
import { crawlContentAndWrite } from 'nrk-sapmi-crawler'
const appropriateTime = 2000

const southSami = {
  idFile: './datasets/list.southSami.json',
  contentFile: './datasets/content.southSami.json'
}


async function crawl () {
  await crawlContentAndWrite(southSami.idFile, southSami.contentFile, appropriateTime)
}

crawl()
```
