import test from 'ava'
import { fetchIds, crawlHeaders, readIfExists, calculateListAndWrite } from '../index.js'

const southSami = {
  id: '1.13572943',
  languageName: 'Åarjelsaemien',
  url: 'https://www.nrk.no/serum/api/content/json/1.13572943?v=2&limit=1000&context=items',
  file: './test/lib/list.southSami.json'
}

test('1: Fetch JSON, read file and compare object in read array 2: Compare length of array read 3: Compare length of array crawled', t => {
  t.plan(3)
  return Promise.all([fetchIds(southSami.url, crawlHeaders), readIfExists(southSami.file).catch(e => e)])
    .then((data) => {
      calculateListAndWrite(data, southSami.id, southSami.file, southSami.languageName)
      return (data)
    })
    .then((data) => {
      const readObject = data[1].filter(obj => obj.id === '1.15778840')
      const expected = [{ id: '1.15778840', unixTime: 1639919176000, languageId: '1.13572943', languageName: 'Åarjelsaemien', crawled: false }]
      t.deepEqual(readObject, expected)
      t.assert(data[1].length >= 375)
      t.assert(data[0].relations.length >= 375)
    })
    .catch(function (err) {
      console.log('Error: ' + err)
    })
})
