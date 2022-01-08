import { readIfExists, crawlHeaders } from '../index.js'

const idFile = './lib/list.southSami.json'
const contentFile = './lib/content.southSami.json'
const crawlFromScratch = {content: false}

// A: Read idFile and contentFile
// B: If startFromScratch.ids === true, exit with clear error message (need to run ID-crawler first)
//    If false, read contentFile
// C: If content-file doesn't exist, skip checking for crawled-flag (true/false) ... need to set a flag
//    If exists, do nothing and continue
// D: Crawl content and push to contentArray
// E: Write contentArray to contentFile
// F: Change all objects in idArray to crawled: true and write to idFile
