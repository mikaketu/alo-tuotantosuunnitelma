# Tuotantosuunnitelma

*A production plan for your event, in your browser. Answer a deck of cards (event type, date, headcount, programme, catering, tickets, what the venue has) and get a task list with deadlines, grouped by phase and category, that you can assign, tick off and take with you as a file. Finnish and English. No server, no account, no tracking: the plan lives in your browser's localStorage and nowhere else.*

*Built by [Alō Helsinki](https://alohelsinki.fi) for its own venue and published venue-neutral under the MIT licence. The rules and the copy are data files; the code is a small React app.*

---

Tuotantosuunnitelma on selaimessa toimiva työkalu, joka tekee tapahtumastasi tehtävälistan. Vastaat korttipakan kysymyksiin (tapahtuman tyyppi, päivä, yleisömäärä, ohjelma, tarjoilu, liput ja se, mitä tilassa on), ja saat tehtävät määräaikoineen vaiheittain ja kategorioittain ryhmiteltyinä. Voit merkitä, kuka hoitaa minkäkin, kuitata tehtävät tehdyiksi ja tallentaa suunnitelman tiedostona. Suomeksi ja englanniksi.

Ei palvelinta, ei tiliä, ei seurantaa. Suunnitelma tallentuu vain tämän selaimen localStorageen. Tiedosto (JSON) on ainoa tapa siirtää se toiseen selaimeen.

## Näin se toimii

1. **Kansi:** tapahtuman tyyppi, päivä, yleisömäärä ja se, onko tapahtuma julkinen vai yksityinen.
2. **Pakka:** yksi kysymys kortilla. Pyyhkäisy vasemmalle tai oikealle vastaa kysymykseen, ylöspäin tarkoittaa *tila hoitaa*, ja "myöhemmin" siirtää kortin pakan loppuun. Tilakortti kysyy, onko tila jo mielessä. Jos on, tilan varustelusta kysytään omilla korteillaan.
3. **Suunnitelma:** säännöt laukeavat vastausten perusteella. Tehtävät ryhmitellään vaiheisiin (nyt · puolivälissä · 3 viikkoa ennen · tapahtumaviikko · jälkeen) ja kategorioihin. Lakisääteiset määräajat lasketaan kiinteinä päivinä, muut suhteessa jäljellä olevaan aikaan.
4. **Vastuunjako:** käyt kategoriat läpi yksi kerrallaan ja päätät, mikä on sinun, mikä tilan ja mikä jää myöhemmäksi.
5. **Yhteenveto:** vastuunjako, tilalle merkityt tehtävät, CSV-vienti ja tallennus tiedostona.

Sivu `saannot.html` ("Näin suunnitelma syntyy") näyttää koko sääntötaulukon, kortit, palvelut, lakipykälät, yhdeksän testiajoa ja käyttöliittymän tekstit sekä simulaattorin, jolla voi kokeilla eri vastauksia.

## Säännöt ovat dataa

`src/rules.json` sisältää koko sääntötaulukon: tapahtumatyypit ja niiden oletuspalvelut, kortit ja niiden ehdot, rivit (laukaisin → tehtävä → kategoria → määräaika), lakipykälät sekä `venueHandles`-taulukon, joka kertoo, miksi vastaukseksi "tila hoitaa" muunnetaan. Moottori (`src/engine/`) ei tunne yksittäisiä rivejä, vaan ainoastaan laskee niiden tuloksen.

Yhdeksän testiajoa (`src/engine/__fixtures__/runs.json`) lukitsevat lopputuloksen: jokaiselle ajolle on määritelty tarkasti, mitkä rivit laukeavat, mitkä jäävät odottamaan ja mitkä vaimennetaan. Kun muutat sääntöä, aja

```sh
npm run fixtures:check    # näyttää, mikä muuttuisi
npm run fixtures:write    # kirjoittaa uudet odotukset, kun muutos on tarkoituksellinen
```

ja tarkista, että ero on juuri se, jota halusit. Sääntötaulukon selitys on tiedostossa [`docs/saantotaulukko-referenssi.md`](docs/saantotaulukko-referenssi.md) ja testiajojen työmuistiinpanot tiedostossa [`docs/yhdeksan-ajoa.md`](docs/yhdeksan-ajoa.md).

## Tekstit ovat dataa

Kaikki käyttöliittymän tekstit ovat tiedostoissa `src/copy/fi.json` ja `src/copy/en.json`, jotka generoidaan yhdestä taulukosta ([`docs/copy-master.md`](docs/copy-master.md)). Muokkaa taulukkoa, älä JSON-tiedostoja:

```sh
npm run copy:generate     # kirjoittaa fi.json- ja en.json-tiedostot
npm run copy:check        # tarkistaa, että JSON vastaa taulukkoa (CI ajaa tämän testeissä)
```

Lint-testi (`src/copy/copyLint.test.js`) varmistaa, että jokaisella kortilla, rivillä, pykälällä ja käyttöliittymän avaimella on teksti, että teksteissä ei ole huutomerkkejä eikä tuotenimiä ja että koodissa ei ole verkkokutsuja.

## Kehitys

```sh
npm ci
npm run dev          # Vite, http://localhost:5173 (index.html ja saannot.html)
npm test             # vitest: moottori, säännöt, ajot, tekstit, näkymät
npm run build        # dist/, staattinen, base './'
npm run preview      # dist/ portissa 4173
npm run test:e2e     # Playwright dist/-hakemistoa vasten (ensin: npm run test:e2e:install)
```

`dist/` on täysin staattinen ja toimii minkä tahansa polun alla, esimerkiksi GitHub Pagesissa tai alikansiossa. `file://`-osoitteesta se ei toimi, koska sivu käyttää ES-moduuleja. Sivu ei tee verkkopyyntöjä omien tiedostojensa ulkopuolelle, ja e2e-testi valvoo tätä.

## Rakenne

```
index.html, saannot.html     kaksi sivua
src/rules.json               sääntötaulukko
src/engine/                  facts → cards → tasks → render; fixturet ja niiden testit
src/copy/                    fi.json, en.json (generoidut), ts.js, lint-testit
src/screens/                 kansi, pakka, kortti, paljastus, suunnitelma, vastuunjako, yhteenveto, lopetus, tietosuoja
src/saannot/                 sääntösivun välilehdet
src/store.js                 suunnitelma localStoragessa, kumoaminen, tiedosto
docs/                        tekstien master-taulukko, sääntöreferenssi, yhdeksän ajoa
scripts/                     copy-master.mjs, rederive-fixtures.mjs
```

## Tietosuoja

Työkalu ei lähetä mitään minnekään. Suunnitelma tallentuu selaimen localStorageen avaimella `tuotantosuunnitelma:plan`, ja "Aloita alusta" poistaa sen. Tallennettu tiedosto on luettavaa JSONia, jonka voi avata takaisin työkaluun. Sivulla ei ole evästeitä, analytiikkaa eikä kolmansien osapuolten resursseja, ja fontit ovat mukana repossa.

## Lisenssi

MIT, © 2026 Alō Helsinki Oy. Fontit Merriweather ja Zalando Sans on julkaistu SIL Open Font License -lisenssillä (`public/fonts/`).

Työkalu tehtiin Alō Helsingin omaa tilaa varten ja julkaistiin tilariippumattomana: "tila hoitaa" tarkoittaa mitä tahansa tilaa, joka käyttäjällä on mielessä. Rivit, määräajat ja palvelusuositukset perustuvat yhden tapahtumatilan käytäntöihin, eivätkä ne ole oikeudellista neuvontaa. Lakipykälien linkit vievät Finlexiin.
