import test from 'ava'
import { crawlContentAndWrite, readIfExists } from '../index.js'
const someTime = 2000

const southSami = {
  idFile: './test/lib/list.southSami.json',
  contentFile: './test/lib/content.southSami.json'
}

test('1: Read ID file, crawl data, check if correct. 2: Check if array lengt is correct', async t => {
  t.plan(2)
  await crawlContentAndWrite(southSami.idFile, southSami.contentFile, someTime)
  const readFile = await readIfExists(southSami.contentFile)
  const xpected = [
    {
      id: '1.15868650',
      url: 'https://www.nrk.no/sapmi/russlaante-eelki-ukrainan-vooste-daarodh-1.15868650',
      title: 'Russlaante eelki Ukrainan vööste dåarodh',
      body: [
        'Daan jïjjen Russlaante eelki Ukrainan vööste dåarodh.\n– Raeffie mijjen kontinentesne lea slahtjegamme, NATO:n generaaletjaelije Jens Stoltenberg pressekonferansesne jeahta.\nUkraina frïjjevoetem åtna sov laanten bijjelen jïjtje nænnoestidh. Russlaante Ukrainan frïjjevoetem låavta. Dah aaj dam frïjje jïh demokraateles Europam låevtieh, Stoltenberg jeahta.'
      ],
      year: '2022',
      unixTime: 1645731285000,
      languageName: 'Åarjelsaemien',
      languageId: '1.13572943'
    },
    {
      id: '1.15865556',
      url: 'https://www.nrk.no/sapmi/nyheter/raajvarimmie_ovlahkoej-vooste-1.15865556',
      title: 'Råajvarimmie ovlahkoej vööste',
      body: [
        'Daen biejjien fylhkenraerien åejvie Thomas Norvoll, departemeente jïh Bane Nor tjåanghkoem åtneme. Dah Nordlandsbanen bïjre soptestin, jïh guktie gellie sarvh ovlahkojne ruevtieraajrosne båvvalgieh. Dah sïemies sjïdteme dah tjuerieh haakenem båetijen giesien öörnedidh.'
      ],
      year: '2022',
      unixTime: 1645556121000,
      languageName: 'Åarjelsaemien',
      languageId: '1.13572943'
    }
  ]
  t.deepEqual(readFile, xpected)
  t.assert(readFile.length = 2)
})